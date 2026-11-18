// Validación de la base de datos y del generador de tableros.
// Uso: npm run validate   (Node ≥ 22 ejecuta TypeScript directamente)

import { POLITICIANS, POLITICOS_TABLERO } from '../src/data/politicians.ts'
import { CRITERIA } from '../src/utils/criteria.ts'
import {
  DIFFICULTIES,
  boardCriteria,
  generateBoard,
  validForCell,
  type Difficulty,
} from '../src/utils/gridGenerator.ts'
import { findAssignment } from '../src/utils/matching.ts'

let failures = 0
const fail = (msg: string) => {
  failures++
  console.error(`✗ ${msg}`)
}

// ── Base de datos ─────────────────────────────────────────────────────────
const regionales = POLITICIANS.length - POLITICOS_TABLERO.length
console.log(`Políticos: ${POLITICIANS.length} (${POLITICOS_TABLERO.length} de tablero + ${regionales} regionales) · Criterios con respuestas: ${CRITERIA.length}`)
if (POLITICIANS.length < 100) fail('La base de datos debe tener al menos 100 políticos')

for (const p of POLITICIANS) {
  if (p.congreso.presidente_senado && !p.congreso.senador) fail(`${p.id}: presidente del Senado sin ser senador`)
  if (p.congreso.presidente_camara && !p.congreso.representante_camara)
    fail(`${p.id}: presidente de la Cámara sin ser representante`)
  if (p.congreso.departamentos_camara.length > 0 && !p.congreso.representante_camara)
    fail(`${p.id}: tiene circunscripción de Cámara sin ser representante`)
  if (p.congreso.representante_camara && p.congreso.departamentos_camara.length === 0 && false)
    fail(`${p.id}: representante sin circunscripción`)
  if (p.presidencial.presidente && !p.presidencial.candidato_primera_vuelta)
    fail(`${p.id}: presidente que no figura como candidato`)
  if (p.presidencial.segunda_vuelta && !p.presidencial.candidato_primera_vuelta)
    fail(`${p.id}: segunda vuelta sin candidatura`)
  if (p.decadas_activo.length === 0) fail(`${p.id}: sin décadas activas`)
  // Nota: puede haber ministros sin gobierno registrado (gabinetes anteriores a 1978).
}

const tamanos = CRITERIA.map((c) => ({ c, n: POLITICOS_TABLERO.filter(c.test).length })).sort((a, b) => b.n - a.n)
console.log('\nCriterios más amplios:')
for (const { c, n } of tamanos.slice(0, 8)) console.log(`  ${String(n).padStart(3)}  ${c.id}`)
console.log('Criterios más estrechos (n ≤ 2):')
console.log('  ' + tamanos.filter((x) => x.n <= 2).map((x) => `${x.c.id}(${x.n})`).join(' · '))

// ── Tableros ──────────────────────────────────────────────────────────────
const RANGOS: Record<Difficulty, (counts: number[]) => string | null> = {
  easy: (cs) => (cs.every((c) => c >= 7) ? null : 'casilla con menos de 7'),
  normal: (cs) => (cs.every((c) => c >= 4 && c <= 8) ? null : 'casilla fuera de 4–8'),
  hard: (cs) =>
    cs.every((c) => c >= 2) && cs.filter((c) => c <= 3).length >= 3 ? null : 'sin casillas de 2–3 opciones',
  legend: (cs) => (cs.every((c) => c >= 1 && c <= 3) ? null : 'casilla fuera de 1–3'),
}

const N = Number(process.argv[2] ?? 60)
for (const difficulty of DIFFICULTIES) {
  const t0 = performance.now()
  let ok = 0
  const strictLegend = { n: 0 }
  let regionalesEnSolucionario = 0
  const maxima: number[] = []
  const seenBoards = new Set<string>()
  for (let i = 0; i < N; i++) {
    let board
    try {
      board = generateBoard(difficulty, `validacion-${i}`)
    } catch (e) {
      fail(`${difficulty}: ${(e as Error).message}`)
      continue
    }
    seenBoards.add(board.rows.join('|') + '#' + board.cols.join('|'))

    // 1) Los conteos declarados coinciden con los reales del grupo de tablero (las fichas
    //    regionales valen como respuesta pero no cuentan para la dificultad).
    const lists: number[][] = []
    const real: number[] = []
    let extraRegionales = 0
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        const all = validForCell(board, r, c)
        const valid = all.filter((p) => !p.perfil_regional)
        extraRegionales += all.length - valid.length
        real.push(valid.length)
        lists.push(valid.map((p) => POLITICOS_TABLERO.indexOf(p)))
      }
    regionalesEnSolucionario += extraRegionales
    if (real.join() !== board.counts.join()) fail(`${difficulty}/${i}: conteos inconsistentes`)

    // 2) Dificultad respetada.
    const problema = RANGOS[difficulty](real)
    if (problema) fail(`${difficulty}/${i}: ${problema} → [${real.join(',')}]`)
    if (difficulty === 'legend' && real.every((c) => c <= 2)) strictLegend.n++

    // 3) Existe un emparejamiento perfecto y la solución guardada es válida.
    if (!findAssignment(lists)) fail(`${difficulty}/${i}: sin solución`)
    if (new Set(board.solution).size !== 9) fail(`${difficulty}/${i}: solución con repetidos`)
    board.solution.forEach((id, cell) => {
      const valid = validForCell(board, Math.floor(cell / 3), cell % 3)
      if (!valid.some((p) => p.id === id)) fail(`${difficulty}/${i}: solución inválida en casilla ${cell}`)
    })
    maxima.push(Math.max(...real))
    ok++
    if (process.argv.includes('--samples') && i < 2) {
      const b = boardCriteria(board)
      console.log(`  [${difficulty}#${i}] filas: ${b.rows.map((c) => c.label).join(' | ')}`)
      console.log(`           columnas: ${b.cols.map((c) => c.label).join(' | ')}`)
      console.log(`           casillas: ${real.join(' ')}`)
    }
  }
  const ms = (performance.now() - t0) / N
  console.log(
    `\n${difficulty.padEnd(6)} ${ok}/${N} tableros · ${ms.toFixed(1)} ms/tablero · distintos: ${seenBoards.size}` +
      (difficulty === 'legend' ? ` · todas las casillas ≤2: ${strictLegend.n}` : '') +
      ` · máx. por casilla (media): ${(maxima.reduce((a, b) => a + b, 0) / Math.max(1, maxima.length)).toFixed(1)}` +
      ` · respuestas regionales extra por tablero: ${(regionalesEnSolucionario / Math.max(1, ok)).toFixed(1)}`,
  )
}

if (failures > 0) {
  console.error(`\n${failures} problema(s) encontrados`)
  process.exit(1)
}
console.log('\n✓ Base de datos y generador validados')
