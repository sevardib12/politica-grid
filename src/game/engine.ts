import { POLITICIANS_BY_ID } from '../data/politicians.ts'
import type { Politician } from '../data/types.ts'
import { cellFits, generateBoard, type Board, type Difficulty } from '../utils/gridGenerator.ts'

// Motor de Política Grid: Búsqueda libre. Todas las casillas están abiertas; el jugador toca una,
// busca un político y gasta un intento por cada respuesta, buena o mala.

export type Mode = 'libre'
export type TimerSeconds = 0 | 90 | 60 | 40

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

export type EndReason = 'victoria' | 'tiempo' | 'intentos'

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
  /** Respuestas incorrectas (solo informativo: el límite es `attemptsLeft`). */
  errors: number
  attemptsLeft: number
  /** Casilla con el buscador abierto. */
  selectedCell: number | null
  feedback: Feedback | null
  startedAt: number
  turnStartedAt: number
  endedAt: number | null
}

export type Action =
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
  return {
    config,
    board: generateBoard(config.difficulty, config.seed),
    cells: Array(9).fill(null),
    status: 'playing',
    endReason: null,
    errors: 0,
    attemptsLeft: MAX_ATTEMPTS,
    selectedCell: null,
    feedback: null,
    startedAt: now,
    turnStartedAt: now,
    endedAt: null,
  }
}

function finish(state: GameState, status: 'won' | 'lost', reason: EndReason, now: number): GameState {
  return { ...state, status, endReason: reason, selectedCell: null, endedAt: now }
}

function place(state: GameState, cell: number, id: string, now: number): GameState {
  const cells = state.cells.slice()
  cells[cell] = id
  const next: GameState = {
    ...state,
    cells,
    selectedCell: null,
    feedback: { kind: 'ok', text: byId(id).nombre, cell },
    turnStartedAt: now,
  }
  if (cells.every((c) => c !== null)) return finish(next, 'won', 'victoria', now)
  return next
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

    case 'SELECT_CELL': {
      if (action.cell !== null && state.cells[action.cell] !== null) return state
      return { ...state, selectedCell: action.cell, feedback: null }
    }

    case 'GUESS': {
      if (state.selectedCell === null) return state
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
    case 'intentos':
      return `Gastaste los ${MAX_ATTEMPTS} intentos.`
    default:
      return ''
  }
}
