// Simulaciones de partidas contra el motor del juego (sin interfaz).
// Uso: node scripts/simulate.ts [partidas por dificultad]

import { POLITICIANS, POLITICIANS_BY_ID } from '../src/data/politicians.ts'
import {
  MAX_ATTEMPTS,
  freeCells,
  initGame,
  reducer,
  type GameConfig,
  type GameState,
} from '../src/game/engine.ts'
import { DIFFICULTIES, canComplete, cellFits, type Difficulty } from '../src/utils/gridGenerator.ts'
import { createRng, pick, shuffle } from '../src/utils/rng.ts'

let failures = 0
const check = (cond: boolean, msg: string) => {
  if (!cond) {
    failures++
    console.error(`✗ ${msg}`)
  }
}

const N = Number(process.argv[2] ?? 80)
let t = 1_000_000 // reloj simulado

// ── Búsqueda libre ────────────────────────────────────────────────────────
for (const difficulty of DIFFICULTIES) {
  const config: GameConfig = { mode: 'libre', timer: 0, difficulty, seed: `libre-${difficulty}`, daily: false }

  // Jugando la solución guardada se gana en 9 intentos.
  let s = initGame(config, t)
  for (let cell = 0; cell < 9; cell++) {
    s = reducer(s, { type: 'SELECT_CELL', cell, now: ++t })
    s = reducer(s, { type: 'GUESS', politicianId: s.board.solution[cell], now: ++t })
  }
  check(s.status === 'won' && s.endReason === 'victoria', `libre/${difficulty}: la solución guardada no gana`)
  check(s.attemptsLeft === 0 && s.errors === 0, `libre/${difficulty}: intentos/errores incorrectos al ganar`)

  // Un político repetido no gasta intento; uno equivocado sí.
  s = initGame(config, t)
  s = reducer(s, { type: 'SELECT_CELL', cell: 0, now: ++t })
  s = reducer(s, { type: 'GUESS', politicianId: s.board.solution[0], now: ++t })
  s = reducer(s, { type: 'SELECT_CELL', cell: 1, now: ++t })
  const before = s.attemptsLeft
  s = reducer(s, { type: 'GUESS', politicianId: s.board.solution[0], now: ++t })
  check(s.attemptsLeft === before, `libre/${difficulty}: repetir político no debe gastar intento`)

  // Nueve fallos terminan por intentos.
  s = initGame(config, t)
  for (let i = 0; i < MAX_ATTEMPTS && s.status === 'playing'; i++) {
    s = reducer(s, { type: 'SELECT_CELL', cell: 0, now: ++t })
    const wrong = POLITICIANS.find((p) => !cellFits(s.board, 0, p) && !s.cells.includes(p.id))
    s = reducer(s, { type: 'GUESS', politicianId: (wrong ?? POLITICIANS[0]).id, now: ++t })
  }
  check(s.status === 'lost' && s.endReason === 'intentos', `libre/${difficulty}: 9 fallos no terminan por intentos`)

  // Tiempo agotado.
  s = reducer(initGame(config, t), { type: 'TIMEOUT', now: ++t })
  check(s.status === 'lost' && s.endReason === 'tiempo', `libre/${difficulty}: TIMEOUT no termina la partida`)
}

// ── Ruleta con un jugador "prudente" (sólo coloca donde sigue habiendo solución) ──
interface Outcome {
  won: number
  lost: Record<string, number>
  autoPlaced: number
  steps: number
  dealt: number
}

function safeBot(difficulty: Difficulty, seed: string): { state: GameState; autoPlaced: number; dealt: number } {
  const config: GameConfig = { mode: 'ruleta', timer: 0, difficulty, seed, daily: false }
  const rng = createRng(`bot|${seed}`)
  let s = initGame(config, t)
  let autoPlaced = 0
  let dealt = 0
  for (let step = 0; step < 2000 && s.status === 'playing'; step++) {
    check(s.current !== null, `${difficulty}/${seed}: sin carta en juego`)
    if (s.current === null) break
    const card = POLITICIANS_BY_ID.get(s.current)!
    const free = freeCells(s.cells)
    const fits = free.filter((c) => cellFits(s.board, c, card))
    dealt++
    check(fits.length > 0, `${difficulty}/${seed}: carta repartida que no encaja en ninguna casilla libre`)
    check(s.cells.every((c) => c !== card.id), `${difficulty}/${seed}: carta repartida ya ubicada`)

    if (s.autoCell !== null) {
      check(fits.length === 1 && fits[0] === s.autoCell, `${difficulty}/${seed}: autoCell incorrecta`)
      autoPlaced++
      s = reducer(s, { type: 'AUTO_PLACE', now: ++t })
      continue
    }
    check(fits.length >= 2, `${difficulty}/${seed}: con 1 sola casilla debió ser automática`)

    const placed = new Set([...s.cells.filter((c): c is string => c !== null), card.id])
    const available = POLITICIANS.filter((p) => !placed.has(p.id))
    const safe = fits.filter((cell) =>
      canComplete(
        s.board,
        free.filter((c) => c !== cell),
        available,
      ),
    )
    if (safe.length > 0) {
      s = reducer(s, { type: 'PLACE', cell: pick(safe, rng), now: ++t })
    } else if (s.skipsLeft > 0) {
      s = reducer(s, { type: 'SKIP', now: ++t })
    } else {
      s = reducer(s, { type: 'PLACE', cell: pick(fits, rng), now: ++t })
    }
  }
  check(s.status !== 'playing', `${difficulty}/${seed}: la partida no termina (posible bucle)`)
  return { state: s, autoPlaced, dealt }
}

function randomBot(difficulty: Difficulty, seed: string): GameState {
  const config: GameConfig = { mode: 'ruleta', timer: 0, difficulty, seed, daily: false }
  const rng = createRng(`rnd|${seed}`)
  let s = initGame(config, t)
  for (let step = 0; step < 2000 && s.status === 'playing'; step++) {
    if (s.autoCell !== null) {
      s = reducer(s, { type: 'AUTO_PLACE', now: ++t })
      continue
    }
    const cell = pick(shuffle(freeCells(s.cells), rng), rng) // casilla libre cualquiera (puede fallar)
    s = rng() < 0.15 && s.skipsLeft > 0 ? reducer(s, { type: 'SKIP', now: ++t }) : reducer(s, { type: 'PLACE', cell, now: ++t })
  }
  check(s.status !== 'playing', `${difficulty}/${seed}: el jugador aleatorio no termina`)
  return s
}

for (const difficulty of DIFFICULTIES) {
  const out: Outcome = { won: 0, lost: {}, autoPlaced: 0, steps: 0, dealt: 0 }
  const rnd: Record<string, number> = {}
  for (let i = 0; i < N; i++) {
    const { state, autoPlaced, dealt } = safeBot(difficulty, `sim-${i}`)
    if (state.status === 'won') out.won++
    else out.lost[state.endReason ?? '?'] = (out.lost[state.endReason ?? '?'] ?? 0) + 1
    out.autoPlaced += autoPlaced
    out.dealt += dealt

    const r = randomBot(difficulty, `rnd-${i}`)
    const key = r.status === 'won' ? 'victoria' : (r.endReason ?? '?')
    rnd[key] = (rnd[key] ?? 0) + 1
  }
  console.log(
    `${difficulty.padEnd(6)} jugador prudente: ${out.won}/${N} victorias ${JSON.stringify(out.lost)} · ` +
      `cartas/partida: ${(out.dealt / N).toFixed(1)} · automáticas: ${(out.autoPlaced / N).toFixed(1)} · aleatorio: ${JSON.stringify(rnd)}`,
  )
}

if (failures > 0) {
  console.error(`\n${failures} problema(s) en las simulaciones`)
  process.exit(1)
}
console.log('\n✓ Motor de juego verificado (Ruleta y Búsqueda libre)')
