import { POLITICIANS, POLITICIANS_BY_ID } from '../data/politicians.ts'
import type { Politician } from '../data/types.ts'
import {
  canComplete,
  cellFits,
  generateBoard,
  type Board,
  type Difficulty,
} from '../utils/gridGenerator.ts'
import { createRng, shuffle } from '../utils/rng.ts'

export type Mode = 'ruleta' | 'libre'
export type TimerSeconds = 0 | 90 | 60 | 40

export const MAX_ERRORS = 3
export const MAX_SKIPS = 3
export const MAX_ATTEMPTS = 9

export interface GameConfig {
  mode: Mode
  /** Segundos por turno (0 = sin tiempo). */
  timer: TimerSeconds
  difficulty: Difficulty
  seed: string
  /** Reto diario: el tablero es el mismo para todos ese día. */
  daily: boolean
}

export type EndReason = 'victoria' | 'tiempo' | 'errores' | 'intentos' | 'sin_opciones'

export type Feedback =
  | { kind: 'ok'; text: string; cell: number }
  | { kind: 'error'; text: string; cell?: number }
  | { kind: 'info'; text: string }

export interface GameState {
  config: GameConfig
  board: Board
  /** Id del político ubicado en cada casilla (fila-mayor). */
  cells: (string | null)[]
  status: 'playing' | 'won' | 'lost'
  endReason: EndReason | null
  errors: number
  skipsLeft: number
  attemptsLeft: number
  /** Ruleta: político que se está mostrando. */
  current: string | null
  /** Ruleta: casilla en la que se ubicará solo (única opción libre). */
  autoCell: number | null
  /** Ruleta: próximos políticos del mazo. */
  queue: string[]
  /** Búsqueda libre: casilla con el buscador abierto. */
  selectedCell: number | null
  feedback: Feedback | null
  /** Contador que alimenta el generador pseudoaleatorio (mantiene puro el reducer). */
  draws: number
  startedAt: number
  turnStartedAt: number
  endedAt: number | null
}

export type Action =
  | { type: 'PLACE'; cell: number; now: number }
  | { type: 'AUTO_PLACE'; now: number }
  | { type: 'SKIP'; now: number }
  | { type: 'SELECT_CELL'; cell: number | null; now: number }
  | { type: 'GUESS'; politicianId: string; now: number }
  | { type: 'TIMEOUT'; now: number }
  | { type: 'CLEAR_FEEDBACK' }

const byId = (id: string): Politician => {
  const p = POLITICIANS_BY_ID.get(id)
  if (!p) throw new Error(`Político desconocido: ${id}`)
  return p
}

export const freeCells = (cells: (string | null)[]): number[] =>
  cells.flatMap((c, i) => (c === null ? [i] : []))

export function initGame(config: GameConfig, now: number): GameState {
  const board = generateBoard(config.difficulty, config.seed)
  const base: GameState = {
    config,
    board,
    cells: Array(9).fill(null),
    status: 'playing',
    endReason: null,
    errors: 0,
    skipsLeft: MAX_SKIPS,
    attemptsLeft: MAX_ATTEMPTS,
    current: null,
    autoCell: null,
    queue: [],
    selectedCell: null,
    feedback: null,
    draws: 0,
    startedAt: now,
    turnStartedAt: now,
    endedAt: null,
  }
  if (config.mode === 'libre') return base
  const rng = createRng(`${config.seed}|mazo`)
  const deck = shuffle(
    POLITICIANS.map((p) => p.id),
    rng,
  )
  return drawNext({ ...base, queue: deck }, now)
}

function finish(state: GameState, status: 'won' | 'lost', reason: EndReason, now: number): GameState {
  return {
    ...state,
    status,
    endReason: reason,
    current: null,
    autoCell: null,
    selectedCell: null,
    endedAt: now,
  }
}

/** Políticos que aún pueden servir: no ubicados y que encajan en alguna casilla libre. */
function dealable(state: GameState, id: string): boolean {
  if (state.cells.includes(id)) return false
  const p = byId(id)
  return freeCells(state.cells).some((cell) => cellFits(state.board, cell, p))
}

/**
 * Saca el siguiente político de la Ruleta. Garantiza que encaje en al menos
 * una casilla libre. Si ya no es posible completar el tablero, termina la
 * partida en lugar de repartir cartas inútiles.
 */
export function drawNext(state: GameState, now: number, avoid?: string): GameState {
  const free = freeCells(state.cells)
  if (free.length === 0) return finish(state, 'won', 'victoria', now)

  const placed = new Set(state.cells)
  const available = POLITICIANS.filter((p) => !placed.has(p.id))
  if (!canComplete(state.board, free, available)) {
    return finish(
      { ...state, feedback: { kind: 'info', text: 'Ya no hay forma de completar el tablero.' } },
      'lost',
      'sin_opciones',
      now,
    )
  }

  let queue = state.queue.slice()
  let draws = state.draws
  let next: string | undefined
  while (queue.length > 0) {
    const id = queue.shift() as string
    if (id !== avoid && dealable(state, id)) {
      next = id
      break
    }
  }
  if (next === undefined) {
    // Mazo agotado: se vuelve a barajar con lo que todavía sirve.
    draws += 1
    const rng = createRng(`${state.config.seed}|rebarajar|${draws}`)
    const pool = shuffle(
      POLITICIANS.filter((p) => dealable(state, p.id)).map((p) => p.id),
      rng,
    )
    const withoutAvoid = pool.filter((id) => id !== avoid)
    queue = withoutAvoid.length > 0 ? withoutAvoid : pool
    next = queue.shift()
  }
  if (next === undefined) return finish(state, 'lost', 'sin_opciones', now)

  const politician = byId(next)
  const fits = free.filter((cell) => cellFits(state.board, cell, politician))
  return {
    ...state,
    queue,
    draws,
    current: next,
    autoCell: fits.length === 1 ? fits[0] : null,
    turnStartedAt: now,
  }
}

/** Devuelve una carta al mazo en una posición aleatoria (no inmediata). */
function requeue(state: GameState, id: string): { queue: string[]; draws: number } {
  const draws = state.draws + 1
  const rng = createRng(`${state.config.seed}|reencolar|${draws}`)
  const queue = state.queue.slice()
  const min = Math.min(3, queue.length)
  const position = min + Math.floor(rng() * (queue.length - min + 1))
  queue.splice(position, 0, id)
  return { queue, draws }
}

function place(state: GameState, cell: number, id: string, now: number): GameState {
  const cells = state.cells.slice()
  cells[cell] = id
  const next: GameState = {
    ...state,
    cells,
    current: null,
    autoCell: null,
    selectedCell: null,
    feedback: { kind: 'ok', text: byId(id).nombre, cell },
    turnStartedAt: now,
  }
  if (cells.every((c) => c !== null)) return finish(next, 'won', 'victoria', now)
  return state.config.mode === 'ruleta' ? drawNext(next, now) : next
}

export function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'CLEAR_FEEDBACK') return state.feedback ? { ...state, feedback: null } : state
  if (state.status !== 'playing') return state

  switch (action.type) {
    case 'TIMEOUT':
      return finish(
        { ...state, feedback: { kind: 'info', text: '¡Se acabó el tiempo!' } },
        'lost',
        'tiempo',
        action.now,
      )

    case 'AUTO_PLACE': {
      if (state.config.mode !== 'ruleta' || state.current === null || state.autoCell === null) return state
      return place(state, state.autoCell, state.current, action.now)
    }

    case 'PLACE': {
      if (state.config.mode !== 'ruleta' || state.current === null || state.autoCell !== null) return state
      if (state.cells[action.cell] !== null) return state
      const politician = byId(state.current)
      if (cellFits(state.board, action.cell, politician)) {
        return place(state, action.cell, state.current, action.now)
      }
      const errors = state.errors + 1
      const wrong: GameState = {
        ...state,
        errors,
        feedback: {
          kind: 'error',
          text: `${politician.nombre} no cumple el cruce de esa casilla.`,
          cell: action.cell,
        },
      }
      if (errors >= MAX_ERRORS) return finish(wrong, 'lost', 'errores', action.now)
      const { queue, draws } = requeue(wrong, state.current)
      return drawNext({ ...wrong, queue, draws }, action.now, state.current)
    }

    case 'SKIP': {
      if (state.config.mode !== 'ruleta' || state.current === null || state.autoCell !== null) return state
      if (state.skipsLeft <= 0) return state
      const { queue, draws } = requeue(state, state.current)
      return drawNext(
        {
          ...state,
          skipsLeft: state.skipsLeft - 1,
          queue,
          draws,
          feedback: { kind: 'info', text: 'Político saltado: volverá a salir más adelante.' },
        },
        action.now,
        state.current,
      )
    }

    case 'SELECT_CELL': {
      if (state.config.mode !== 'libre') return state
      if (action.cell !== null && state.cells[action.cell] !== null) return state
      return { ...state, selectedCell: action.cell, feedback: null }
    }

    case 'GUESS': {
      if (state.config.mode !== 'libre' || state.selectedCell === null) return state
      if (state.cells.includes(action.politicianId)) {
        return { ...state, feedback: { kind: 'info', text: 'Ese político ya está en el tablero.' } }
      }
      const politician = byId(action.politicianId)
      const cell = state.selectedCell
      const attemptsLeft = state.attemptsLeft - 1
      if (cellFits(state.board, cell, politician)) {
        const placed = place({ ...state, attemptsLeft }, cell, politician.id, action.now)
        if (placed.status === 'playing' && attemptsLeft === 0) return finish(placed, 'lost', 'intentos', action.now)
        return placed
      }
      const wrong: GameState = {
        ...state,
        attemptsLeft,
        errors: state.errors + 1,
        selectedCell: null,
        turnStartedAt: action.now,
        feedback: {
          kind: 'error',
          text: `${politician.nombre} no cumple el cruce de esa casilla.`,
          cell,
        },
      }
      if (attemptsLeft === 0) return finish(wrong, 'lost', 'intentos', action.now)
      return wrong
    }
  }
}

export function describeEnd(reason: EndReason | null): string {
  switch (reason) {
    case 'victoria':
      return '¡Tablero completo!'
    case 'tiempo':
      return 'Se acabó el tiempo.'
    case 'errores':
      return `Llegaste al límite de ${MAX_ERRORS} errores.`
    case 'intentos':
      return `Gastaste los ${MAX_ATTEMPTS} intentos.`
    case 'sin_opciones':
      return 'Ya no quedaban políticos que completaran el tablero.'
    default:
      return ''
  }
}
