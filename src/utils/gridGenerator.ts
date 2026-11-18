import { POLITICIANS, POLITICOS_TABLERO } from '../data/politicians.ts'
import type { Partido, Politician } from '../data/types.ts'
import { CRITERIA, areRedundant, criterionOrThrow, type Criterion } from './criteria.ts'
import { findAssignment } from './matching.ts'
import { createRng, pick, shuffle, type Rng } from './rng.ts'

export type Difficulty = 'easy' | 'normal' | 'hard' | 'legend'

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'normal', 'hard', 'legend']

export interface Board {
  /** Semilla con la que se generó (el reto diario usa la fecha). */
  seed: string
  difficulty: Difficulty
  /** Ids de criterio de las 3 filas y las 3 columnas. */
  rows: [string, string, string]
  cols: [string, string, string]
  /** Cuántos políticos válidos tiene cada casilla (fila-mayor, 9 valores). */
  counts: number[]
  /** Una solución completa: 9 políticos DISTINTOS, uno por casilla. */
  solution: string[]
}

// ── Contexto precalculado ─────────────────────────────────────────────────

interface Context {
  criteria: readonly Criterion[]
  /** matches[i] = índices de políticos que cumplen el criterio i. */
  matches: number[][]
  /** pair[i * n + j] = cuántos políticos cumplen i y j a la vez. */
  pair: Uint16Array
  /** compat[i * n + j] = 1 si i y j se pueden cruzar sin redundancia. */
  compat: Uint8Array
}

let cachedContext: Context | null = null

function getContext(): Context {
  if (cachedContext) return cachedContext
  const criteria = CRITERIA
  const n = criteria.length
  // Solo los políticos de tablero: las fichas regionales no calibran la dificultad.
  const m = POLITICOS_TABLERO.length
  const matches = criteria.map((c) => {
    const idx: number[] = []
    for (let k = 0; k < m; k++) if (c.test(POLITICOS_TABLERO[k])) idx.push(k)
    return idx
  })
  const words = Math.ceil(m / 32)
  const bits = matches.map((idx) => {
    const w = new Uint32Array(words)
    for (const k of idx) w[k >>> 5] |= 1 << (k & 31)
    return w
  })
  const popcount = (x: number) => {
    x -= (x >>> 1) & 0x55555555
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
    return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24
  }
  const pair = new Uint16Array(n * n)
  const compat = new Uint8Array(n * n)
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let count = 0
      for (let w = 0; w < words; w++) count += popcount(bits[i][w] & bits[j][w])
      pair[i * n + j] = count
      pair[j * n + i] = count
      const ok = i !== j && !areRedundant(criteria[i], criteria[j]) ? 1 : 0
      compat[i * n + j] = ok
      compat[j * n + i] = ok
    }
  }
  cachedContext = { criteria, matches, pair, compat }
  return cachedContext
}

// ── Configuración de dificultad ───────────────────────────────────────────

interface Tier {
  /** Tamaño mínimo (en la base de datos) de cada criterio candidato. */
  minSize: number
  /** Condición que debe cumplir cada casilla. */
  cellOk: (count: number) => boolean
  /** Condición global sobre el tablero completo. */
  accept: (counts: number[], chosen: Criterion[]) => boolean
  minCategories: number
  attempts: number
}

const countWhere = (counts: number[], f: (c: number) => boolean) => counts.filter(f).length

const TIERS: Record<Difficulty, Tier[]> = {
  // Cada casilla tiene al menos 7 políticos válidos.
  easy: [
    { minSize: 9, cellOk: (c) => c >= 7 && c <= 30, accept: () => true, minCategories: 3, attempts: 30000 },
    { minSize: 9, cellOk: (c) => c >= 7, accept: () => true, minCategories: 2, attempts: 30000 },
  ],
  // Cada casilla tiene entre 4 y 8.
  normal: [
    { minSize: 4, cellOk: (c) => c >= 4 && c <= 8, accept: () => true, minCategories: 3, attempts: 30000 },
    { minSize: 4, cellOk: (c) => c >= 4 && c <= 8, accept: () => true, minCategories: 2, attempts: 30000 },
  ],
  // Criterios de nicho; varias casillas con sólo 2 o 3 opciones.
  hard: [
    {
      minSize: 2,
      cellOk: (c) => c >= 2 && c <= 10,
      accept: (counts, chosen) =>
        countWhere(counts, (c) => c <= 3) >= 3 && chosen.some((c) => c.specific),
      minCategories: 3,
      attempts: 60000,
    },
    {
      minSize: 2,
      cellOk: (c) => c >= 2 && c <= 10,
      accept: (counts) => countWhere(counts, (c) => c <= 3) >= 3,
      minCategories: 2,
      attempts: 60000,
    },
  ],
  // Cruces extremos: 1 o 2 respuestas en toda la base de datos.
  legend: [
    {
      minSize: 1,
      cellOk: (c) => c >= 1 && c <= 2,
      accept: () => true,
      minCategories: 2,
      attempts: 120000,
    },
    {
      minSize: 1,
      cellOk: (c) => c >= 1 && c <= 3,
      accept: (counts) => countWhere(counts, (c) => c <= 2) >= 6,
      minCategories: 2,
      attempts: 120000,
    },
  ],
}

// ── Generación ────────────────────────────────────────────────────────────

function chooseCompatible(cands: number[], count: number, ctx: Context, rng: Rng): number[] | null {
  const n = ctx.criteria.length
  const picked: number[] = []
  for (const c of shuffle(cands, rng)) {
    if (picked.every((p) => ctx.compat[p * n + c])) picked.push(c)
    if (picked.length === count) return picked
  }
  return null
}

/**
 * Variedad dentro de un eje: tres partidos en una fila es el clásico del
 * género, pero tres décadas (o tres regiones) no aportan nada interesante.
 */
function axisVariety(ctx: Context, ids: number[]): boolean {
  const seen = new Map<string, number>()
  for (const i of ids) {
    const cat = ctx.criteria[i].categoria
    seen.set(cat, (seen.get(cat) ?? 0) + 1)
  }
  for (const [cat, count] of seen) {
    const limit = cat === 'partido' ? 3 : cat === 'decada' ? 1 : 2
    if (count > limit) return false
  }
  return true
}

function tryBuild(
  ctx: Context,
  tier: Tier,
  pool: number[],
  rng: Rng,
): { rows: number[]; cols: number[]; counts: number[] } | null {
  const n = ctx.criteria.length
  const r1 = pick(pool, rng)

  const colCandidates = pool.filter(
    (c) => ctx.compat[r1 * n + c] && tier.cellOk(ctx.pair[r1 * n + c]),
  )
  if (colCandidates.length < 3) return null
  const cols = chooseCompatible(colCandidates, 3, ctx, rng)
  if (!cols) return null

  const rowCandidates = pool.filter(
    (r) =>
      r !== r1 &&
      ctx.compat[r1 * n + r] &&
      cols.every((c) => ctx.compat[r * n + c] && tier.cellOk(ctx.pair[r * n + c])),
  )
  if (rowCandidates.length < 2) return null
  const others = chooseCompatible(rowCandidates, 2, ctx, rng)
  if (!others) return null
  const rows = [r1, ...others]

  if (!axisVariety(ctx, rows) || !axisVariety(ctx, cols)) return null
  const decadas = [...rows, ...cols].filter((i) => ctx.criteria[i].categoria === 'decada').length
  if (decadas > 2) return null

  const counts: number[] = []
  for (const r of rows) for (const c of cols) counts.push(ctx.pair[r * n + c])
  return { rows, cols, counts }
}

function cellCandidates(ctx: Context, row: number, col: number): number[] {
  const inCol = new Set(ctx.matches[col])
  return ctx.matches[row].filter((k) => inCol.has(k))
}

/**
 * Genera un tablero 3×3 que SIEMPRE tiene solución: antes de devolverlo se
 * comprueba, con un emparejamiento bipartito, que existen 9 políticos
 * distintos que llenan las 9 casillas a la vez.
 */
export function generateBoard(difficulty: Difficulty, seed: string): Board {
  const ctx = getContext()
  const n = ctx.criteria.length
  const rng = createRng(`${seed}|${difficulty}`)

  for (const tier of TIERS[difficulty]) {
    const pool: number[] = []
    for (let i = 0; i < n; i++) if (ctx.matches[i].length >= tier.minSize) pool.push(i)

    for (let attempt = 0; attempt < tier.attempts; attempt++) {
      const built = tryBuild(ctx, tier, pool, rng)
      if (!built) continue
      const chosen = [...built.rows, ...built.cols].map((i) => ctx.criteria[i])
      if (new Set(chosen.map((c) => c.categoria)).size < tier.minCategories) continue
      if (!tier.accept(built.counts, chosen)) continue

      // Orden aleatorio de candidatos → soluciones distintas según la semilla.
      const lists: number[][] = []
      for (const r of built.rows) for (const c of built.cols) lists.push(shuffle(cellCandidates(ctx, r, c), rng))
      const assignment = findAssignment(lists)
      if (!assignment) continue

      return {
        seed,
        difficulty,
        rows: built.rows.map((i) => ctx.criteria[i].id) as [string, string, string],
        cols: built.cols.map((i) => ctx.criteria[i].id) as [string, string, string],
        counts: built.counts,
        solution: assignment.map((k) => POLITICOS_TABLERO[k].id),
      }
    }
  }
  throw new Error(`No se pudo generar un tablero ${difficulty} para la semilla ${seed}`)
}

// ── Consultas sobre un tablero ────────────────────────────────────────────

export function boardCriteria(board: Board): { rows: Criterion[]; cols: Criterion[] } {
  return {
    rows: board.rows.map(criterionOrThrow),
    cols: board.cols.map(criterionOrThrow),
  }
}

/**
 * Partidos que se muestran junto a un político acertado en una casilla: los de
 * los criterios de partido del cruce (los que justifican la respuesta) o, si
 * el cruce no es por partido, su partido principal (el primero de su lista).
 */
export function cellParties(board: Board, cell: number, politician: Politician): Partido[] {
  const crossing = [board.rows[Math.floor(cell / 3)], board.cols[cell % 3]]
    .map((id) => criterionOrThrow(id).partido)
    .filter((p): p is Partido => p !== undefined)
  if (crossing.length > 0) return [...new Set(crossing)]
  return politician.partidos.length > 0 ? [politician.partidos[0]] : []
}

/** Todos los políticos de la base de datos (incluidos los regionales) que cumplen la casilla (fila, col). */
export function validForCell(board: Board, row: number, col: number): Politician[] {
  const rowC = criterionOrThrow(board.rows[row])
  const colC = criterionOrThrow(board.cols[col])
  return POLITICIANS.filter((p) => rowC.test(p) && colC.test(p))
}

export function cellFits(board: Board, cell: number, politician: Politician): boolean {
  const row = Math.floor(cell / 3)
  const col = cell % 3
  return criterionOrThrow(board.rows[row]).test(politician) && criterionOrThrow(board.cols[col]).test(politician)
}

/** Razones por las que un político cumple los dos criterios de una casilla. */
export function explainCell(board: Board, cell: number, politician: Politician): { row: string[]; col: string[] } {
  const row = Math.floor(cell / 3)
  const col = cell % 3
  return {
    row: criterionOrThrow(board.rows[row]).explain(politician),
    col: criterionOrThrow(board.cols[col]).explain(politician),
  }
}

/**
 * ¿Pueden llenarse todas las casillas libres con políticos distintos de los
 * disponibles? Se usa en la Ruleta para detectar callejones sin salida.
 */
export function canComplete(board: Board, freeCells: number[], available: Politician[]): boolean {
  if (freeCells.length === 0) return true
  const lists = freeCells.map((cell) => {
    const out: number[] = []
    available.forEach((p, idx) => {
      if (cellFits(board, cell, p)) out.push(idx)
    })
    return out
  })
  return findAssignment(lists) !== null
}
