// Simulaciones de partidas contra el motor del juego (sin interfaz).
// Uso: node scripts/simulate.ts

import { POLITICIANS } from '../src/data/politicians.ts'
import {
  MAX_ATTEMPTS,
  initGame,
  reducer,
  type GameConfig,
} from '../src/game/engine.ts'
import { DIFFICULTIES, cellFits } from '../src/utils/gridGenerator.ts'

let failures = 0
const check = (cond: boolean, msg: string) => {
  if (!cond) {
    failures++
    console.error(`✗ ${msg}`)
  }
}

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

if (failures > 0) {
  console.error(`\n${failures} problema(s) en las simulaciones`)
  process.exit(1)
}
console.log('\n✓ Motor de juego verificado (Búsqueda libre)')
