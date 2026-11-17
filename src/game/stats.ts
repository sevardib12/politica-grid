import type { Difficulty } from '../utils/gridGenerator.ts'
import type { GameConfig, GameState, Mode } from './engine.ts'

// Estadísticas del jugador en localStorage. Toda lectura/escritura va dentro
// de try/catch: el almacenamiento puede estar bloqueado (modo privado, etc.)
// y el juego debe funcionar igual sin él.

const KEY = 'politica-grid:v1'

export interface DailyResult {
  won: boolean
  filled: number
  mode: Mode
  difficulty: Difficulty
  ms: number
}

export interface Stats {
  played: number
  won: number
  filledTotal: number
  byDifficulty: Record<Difficulty, { played: number; won: number }>
  /** Mejor tiempo total (ms) en partidas ganadas: clave `modo|dificultad|temporizador`. */
  bestTimes: Record<string, number>
  /** Primer intento de cada reto diario (clave AAAA-MM-DD). */
  daily: Record<string, DailyResult>
  maxStreak: number
}

export function emptyStats(): Stats {
  return {
    played: 0,
    won: 0,
    filledTotal: 0,
    byDifficulty: {
      easy: { played: 0, won: 0 },
      normal: { played: 0, won: 0 },
      hard: { played: 0, won: 0 },
      legend: { played: 0, won: 0 },
    },
    bestTimes: {},
    daily: {},
    maxStreak: 0,
  }
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyStats()
    const parsed = JSON.parse(raw) as Partial<Stats>
    const base = emptyStats()
    return {
      ...base,
      ...parsed,
      byDifficulty: { ...base.byDifficulty, ...(parsed.byDifficulty ?? {}) },
      bestTimes: parsed.bestTimes ?? {},
      daily: parsed.daily ?? {},
    }
  } catch {
    return emptyStats()
  }
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    /* sin almacenamiento: se ignora */
  }
}

export function resetStats(): Stats {
  const fresh = emptyStats()
  saveStats(fresh)
  return fresh
}

// ── Fechas y racha diaria ─────────────────────────────────────────────────

export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d + delta))
}

/** Días consecutivos con el reto diario ganado, contando hasta hoy (o ayer). */
export function currentStreak(daily: Record<string, { won: boolean }>, today: string = dateKey()): number {
  let cursor = daily[today]?.won ? today : shiftDay(today, -1)
  let streak = 0
  while (daily[cursor]?.won) {
    streak++
    cursor = shiftDay(cursor, -1)
  }
  return streak
}

export function longestStreak(daily: Record<string, { won: boolean }>): number {
  const days = Object.keys(daily)
    .filter((k) => daily[k].won)
    .sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const day of days) {
    run = prev !== null && shiftDay(prev, 1) === day ? run + 1 : 1
    best = Math.max(best, run)
    prev = day
  }
  return best
}

/** Dificultad del reto diario según el día de la semana (domingo = 0). */
const DIFICULTAD_POR_DIA: Difficulty[] = ['legend', 'easy', 'normal', 'normal', 'hard', 'normal', 'hard']

export function dailyDifficulty(key: string = dateKey()): Difficulty {
  const [y, m, d] = key.split('-').map(Number)
  return DIFICULTAD_POR_DIA[new Date(y, m - 1, d).getDay()]
}

export function dailyConfig(base: Pick<GameConfig, 'mode' | 'timer'>, key: string = dateKey()): GameConfig {
  return { ...base, difficulty: dailyDifficulty(key), seed: `diario-${key}`, daily: true }
}

// ── Registro de partidas ──────────────────────────────────────────────────

export function bestTimeKey(config: Pick<GameConfig, 'mode' | 'difficulty' | 'timer'>): string {
  return `${config.mode}|${config.difficulty}|${config.timer}`
}

export function recordGame(stats: Stats, state: GameState): Stats {
  const { config } = state
  const won = state.status === 'won'
  const filled = state.cells.filter((c) => c !== null).length
  const ms = (state.endedAt ?? Date.now()) - state.startedAt

  const next: Stats = {
    ...stats,
    played: stats.played + 1,
    won: stats.won + (won ? 1 : 0),
    filledTotal: stats.filledTotal + filled,
    byDifficulty: {
      ...stats.byDifficulty,
      [config.difficulty]: {
        played: stats.byDifficulty[config.difficulty].played + 1,
        won: stats.byDifficulty[config.difficulty].won + (won ? 1 : 0),
      },
    },
    bestTimes: { ...stats.bestTimes },
    daily: { ...stats.daily },
  }

  if (won) {
    const key = bestTimeKey(config)
    const previous = next.bestTimes[key]
    if (previous === undefined || ms < previous) next.bestTimes[key] = ms
  }

  if (config.daily) {
    const today = config.seed.replace('diario-', '')
    // Sólo cuenta el primer intento del día.
    if (!next.daily[today]) {
      next.daily[today] = { won, filled, mode: config.mode, difficulty: config.difficulty, ms }
    }
  }
  next.maxStreak = Math.max(stats.maxStreak, longestStreak(next.daily))

  saveStats(next)
  return next
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
