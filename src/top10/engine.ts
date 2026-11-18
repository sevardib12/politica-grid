import { TOP10_BY_ID, type Top10Challenge } from '../data/top10Lists.ts'
import { judge } from './match.ts'

// Motor puro de Política Top 10: un reducer sin reloj propio (el tiempo entra por `now`).

export const MAX_LIVES = 3
/** Duración del modo Contrarreloj, en segundos. */
export const TIMED_SECONDS = 120

export type Top10Mode = 'normal' | 'contrarreloj'
export type Top10Status = 'playing' | 'won' | 'lost' | 'timeout' | 'gaveup'

export const MODE_LABEL: Record<Top10Mode, string> = {
  normal: 'Normal',
  contrarreloj: 'Contrarreloj 2 min',
}

export interface Top10Config {
  challengeId: string
  mode: Top10Mode
  /** Reto diario: `dateKey` es su fecha (AAAA-MM-DD). */
  daily: boolean
  dateKey: string | null
  /** 2 = duelo por turnos en el mismo dispositivo (sin reto diario ni contrarreloj). Ausente = 1. */
  players?: Top10Players
}

export type Top10Players = 1 | 2

/** Estado propio del duelo: los dos jugadores se turnan y cada uno tiene sus vidas. */
export interface Duel {
  /** Jugador con el turno (0 = Jugador 1, 1 = Jugador 2). */
  turn: 0 | 1
  /** Filas acertadas por cada jugador. */
  scores: [number, number]
  /** Vidas de cada jugador. */
  lives: [number, number]
  /** Quién acertó cada fila; null si todavía nadie. */
  foundBy: (0 | 1 | null)[]
}

export interface Feedback {
  kind: 'ok' | 'error' | 'info'
  text: string
  /** Contador para que un mensaje repetido se vuelva a animar. */
  seq: number
}

export interface Top10State {
  config: Top10Config
  challenge: Top10Challenge
  /** `found[i]`: la fila i (posición i + 1) está acertada. */
  found: boolean[]
  /** Índices de las filas en el orden en que se acertaron. */
  foundOrder: number[]
  lives: number
  /** Lo que se escribió y falló, en orden. */
  misses: string[]
  status: Top10Status
  startedAt: number
  endedAt: number | null
  feedback: Feedback | null
  seq: number
  /** Solo en duelo; en partidas de un jugador es null. */
  duel: Duel | null
}

export type Top10Action =
  | { type: 'GUESS'; text: string; now: number }
  | { type: 'GIVE_UP'; now: number }
  | { type: 'TIMEOUT'; now: number }
  | { type: 'CLEAR_FEEDBACK' }

export function initTop10(config: Top10Config, now: number): Top10State {
  const challenge = TOP10_BY_ID.get(config.challengeId)
  if (!challenge) throw new Error(`Reto Top 10 desconocido: ${config.challengeId}`)
  return {
    config,
    challenge,
    found: challenge.items.map(() => false),
    foundOrder: [],
    lives: MAX_LIVES,
    misses: [],
    status: 'playing',
    startedAt: now,
    endedAt: null,
    feedback: null,
    seq: 0,
    duel:
      config.players === 2
        ? { turn: 0, scores: [0, 0], lives: [MAX_LIVES, MAX_LIVES], foundBy: challenge.items.map(() => null) }
        : null,
  }
}

/** Ganador del duelo según las filas acertadas; `null` si no hay duelo. */
export function duelWinner(state: Pick<Top10State, 'duel'>): 0 | 1 | 'empate' | null {
  if (!state.duel) return null
  const [a, b] = state.duel.scores
  return a === b ? 'empate' : a > b ? 0 : 1
}

/**
 * Turno de duelo: acertar suma la fila al que la dijo y pasa el turno; un nombre que no está
 * cuesta una vida a quien lo escribió y también pasa el turno. Los intentos vagos, ambiguos o
 * repetidos no pasan el turno ni cuestan vida.
 */
function guessDuel(state: Top10State, text: string, now: number): Top10State {
  const duel = state.duel as Duel
  const me = duel.turn
  const other: 0 | 1 = me === 0 ? 1 : 0
  const who = `Jugador ${me + 1}`
  const verdict = judge(state.challenge, state.found, text)
  const nombre = (i: number) => state.challenge.items[i].nombre

  if (verdict.kind === 'match') {
    const found = state.found.slice()
    found[verdict.index] = true
    const scores: [number, number] = [duel.scores[0], duel.scores[1]]
    scores[me] += 1
    const foundBy = duel.foundBy.slice()
    foundBy[verdict.index] = me
    const won = found.every(Boolean)
    const turn = duel.lives[other] > 0 ? other : me
    return {
      ...state,
      found,
      foundOrder: [...state.foundOrder, verdict.index],
      duel: { ...duel, turn, scores, foundBy },
      status: won ? 'won' : 'playing',
      endedAt: won ? now : null,
      feedback: say(state, 'ok', `${who}: ¡Bien! ${nombre(verdict.index)}`),
      seq: state.seq + 1,
    }
  }
  if (verdict.kind === 'repeat') {
    return { ...state, feedback: say(state, 'info', `Ya está: ${nombre(verdict.index)}. Sigue ${who}.`), seq: state.seq + 1 }
  }
  if (verdict.kind === 'ambiguous') {
    return { ...state, feedback: say(state, 'info', `${who}: hay más de una persona con ese nombre. Escribe el nombre completo; no pierdes vida.`), seq: state.seq + 1 }
  }
  if (verdict.kind === 'vague') {
    return { ...state, feedback: say(state, 'info', `${who}: escribe el apellido o el nombre completo; no pierdes vida.`), seq: state.seq + 1 }
  }

  const lives: [number, number] = [duel.lives[0], duel.lives[1]]
  lives[me] -= 1
  const bothOut = lives[0] <= 0 && lives[1] <= 0
  const turn = lives[other] > 0 ? other : me
  return {
    ...state,
    misses: [...state.misses, text],
    duel: { ...duel, lives, turn },
    status: bothOut ? 'lost' : 'playing',
    endedAt: bothOut ? now : null,
    feedback: say(state, 'error', `${who}: «${text}» no está en esta lista.`),
    seq: state.seq + 1,
  }
}

export function foundCount(state: Pick<Top10State, 'found'>): number {
  return state.found.filter(Boolean).length
}

function say(state: Top10State, kind: Feedback['kind'], text: string): Feedback {
  return { kind, text, seq: state.seq + 1 }
}

export function reducer(state: Top10State, action: Top10Action): Top10State {
  if (action.type === 'CLEAR_FEEDBACK') return state.feedback ? { ...state, feedback: null } : state
  if (state.status !== 'playing') return state

  switch (action.type) {
    case 'GIVE_UP':
      return { ...state, status: 'gaveup', endedAt: action.now, feedback: null }

    case 'TIMEOUT':
      return { ...state, status: 'timeout', endedAt: action.now, feedback: null }

    case 'GUESS': {
      const text = action.text.trim()
      if (text === '') return state
      if (state.duel) return guessDuel(state, text, action.now)
      const verdict = judge(state.challenge, state.found, text)

      if (verdict.kind === 'match') {
        const found = state.found.slice()
        found[verdict.index] = true
        const won = found.every(Boolean)
        return {
          ...state,
          found,
          foundOrder: [...state.foundOrder, verdict.index],
          status: won ? 'won' : 'playing',
          endedAt: won ? action.now : null,
          feedback: say(state, 'ok', `¡Bien! ${state.challenge.items[verdict.index].nombre}`),
          seq: state.seq + 1,
        }
      }
      if (verdict.kind === 'repeat') {
        return { ...state, feedback: say(state, 'info', `Ya tienes a ${state.challenge.items[verdict.index].nombre}.`), seq: state.seq + 1 }
      }
      if (verdict.kind === 'ambiguous') {
        return { ...state, feedback: say(state, 'info', 'Hay más de una persona con ese nombre. Escribe el nombre completo o el segundo apellido; no pierdes vida.'), seq: state.seq + 1 }
      }
      if (verdict.kind === 'vague') {
        return { ...state, feedback: say(state, 'info', 'Escribe el apellido o el nombre completo; no pierdes vida.'), seq: state.seq + 1 }
      }

      const lives = state.lives - 1
      const lost = lives <= 0
      return {
        ...state,
        lives,
        misses: [...state.misses, text],
        status: lost ? 'lost' : 'playing',
        endedAt: lost ? action.now : null,
        feedback: say(state, 'error', `«${text}» no está en esta lista.`),
        seq: state.seq + 1,
      }
    }
  }
}

export function describeEnd(state: Top10State): string {
  const n = state.challenge.size
  const got = foundCount(state)
  if (state.duel) {
    if (state.status === 'playing') return ''
    const [a, b] = state.duel.scores
    const cierre =
      state.status === 'won' ? '¡Lista completa!' : state.status === 'lost' ? 'Los dos se quedaron sin vidas.' : 'Se rindieron.'
    const w = duelWinner(state)
    return w === 'empate' ? `${cierre} Empate ${a}–${b}.` : `${cierre} Gana el Jugador ${(w as number) + 1}, ${a}–${b}.`
  }
  switch (state.status) {
    case 'won':
      return `¡Lista completa! Acertaste las ${n} filas.`
    case 'lost':
      return `Te quedaste sin vidas con ${got} de ${n} filas.`
    case 'timeout':
      return `Se acabó el tiempo con ${got} de ${n} filas.`
    case 'gaveup':
      return `Te rendiste con ${got} de ${n} filas.`
    default:
      return ''
  }
}
