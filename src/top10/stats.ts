import { currentStreak, longestStreak } from '../game/stats.ts'
import { foundCount, type Top10Mode, type Top10State, type Top10Status } from './engine.ts'

// Estadísticas de Política Top 10 en localStorage (clave propia, separada de Política Grid).
// Todo va dentro de try/catch: el almacenamiento puede estar bloqueado y el juego debe funcionar igual.

const KEY = 'politica-top10:v1'

export interface Top10DailyResult {
  challengeId: string
  /** Ganó = acertó todas las filas. */
  won: boolean
  found: number
  size: number
  status: Top10Status
  livesLeft: number
  mode: Top10Mode
}

export interface Top10Stats {
  played: number
  won: number
  itemsFound: number
  itemsTotal: number
  /** Primer intento de cada reto diario (clave AAAA-MM-DD). */
  daily: Record<string, Top10DailyResult>
  maxStreak: number
}

export function emptyTop10Stats(): Top10Stats {
  return { played: 0, won: 0, itemsFound: 0, itemsTotal: 0, daily: {}, maxStreak: 0 }
}

export function loadTop10Stats(): Top10Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyTop10Stats()
    const parsed = JSON.parse(raw) as Partial<Top10Stats>
    return { ...emptyTop10Stats(), ...parsed, daily: parsed.daily ?? {} }
  } catch {
    return emptyTop10Stats()
  }
}

function save(stats: Top10Stats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    /* sin almacenamiento: se ignora */
  }
}

export function resetTop10Stats(): Top10Stats {
  const fresh = emptyTop10Stats()
  save(fresh)
  return fresh
}

export function top10Streak(stats: Top10Stats): number {
  return currentStreak(stats.daily)
}

export function recordTop10Game(stats: Top10Stats, state: Top10State): Top10Stats {
  const { config, challenge } = state
  const found = foundCount(state)
  const won = state.status === 'won'
  const next: Top10Stats = {
    ...stats,
    played: stats.played + 1,
    won: stats.won + (won ? 1 : 0),
    itemsFound: stats.itemsFound + found,
    itemsTotal: stats.itemsTotal + challenge.size,
    daily: { ...stats.daily },
  }
  if (config.daily && config.dateKey && !next.daily[config.dateKey]) {
    next.daily[config.dateKey] = {
      challengeId: challenge.id,
      won,
      found,
      size: challenge.size,
      status: state.status,
      livesLeft: state.lives,
      mode: config.mode,
    }
  }
  next.maxStreak = Math.max(stats.maxStreak, longestStreak(next.daily))
  save(next)
  return next
}
