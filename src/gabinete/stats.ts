import { shiftDay } from '../game/stats.ts'
import type { EstadoGabinete, Temporizador } from './engine.ts'

// Estadísticas de «Arma el Gabinete» en localStorage. Toda lectura y escritura va en try/catch: si el
// almacenamiento está bloqueado, el juego sigue funcionando sin guardar nada.

const KEY = 'politica-gabinete:v1'

export interface ResultadoDiario {
  ganada: boolean
  /** Milisegundos hasta llenar el gabinete (ganada) o hasta terminar la partida. */
  ms: number
  /** Sillas llenas al terminar. */
  llenas: number
}

export interface StatsGabinete {
  /** Primer intento de cada reto diario (clave AAAA-MM-DD). */
  diario: Record<string, ResultadoDiario>
  /** Mejor tiempo de un reto diario ganado. */
  mejorDiarioMs: number | null
  libre: {
    jugadas: number
    ganadas: number
    /** Mejor tiempo ganado en cada temporizador de la partida libre. */
    mejorMs: Partial<Record<Temporizador, number>>
  }
}

export function statsVacias(): StatsGabinete {
  return { diario: {}, mejorDiarioMs: null, libre: { jugadas: 0, ganadas: 0, mejorMs: {} } }
}

export function cargarStats(): StatsGabinete {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return statsVacias()
    const data = JSON.parse(raw) as Partial<StatsGabinete>
    return {
      diario: data.diario ?? {},
      mejorDiarioMs: typeof data.mejorDiarioMs === 'number' ? data.mejorDiarioMs : null,
      libre: {
        jugadas: data.libre?.jugadas ?? 0,
        ganadas: data.libre?.ganadas ?? 0,
        mejorMs: data.libre?.mejorMs ?? {},
      },
    }
  } catch {
    return statsVacias()
  }
}

export function guardarStats(stats: StatsGabinete): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats))
  } catch {
    /* sin almacenamiento: el juego sigue */
  }
}

/** Borra todo lo guardado de «Arma el Gabinete» y devuelve las estadísticas vacías. */
export function borrarStats(): StatsGabinete {
  const vacias = statsVacias()
  guardarStats(vacias)
  return vacias
}

/** Días seguidos con el reto diario ganado, contando hasta hoy (o desde ayer si hoy aún no se juega). */
export function rachaDiaria(diario: Record<string, { ganada: boolean }>, hoy: string): number {
  let cursor = diario[hoy]?.ganada ? hoy : shiftDay(hoy, -1)
  let n = 0
  while (diario[cursor]?.ganada) {
    n++
    cursor = shiftDay(cursor, -1)
  }
  return n
}

/** Registra una partida terminada. El reto diario solo cuenta el primer intento de cada día. */
export function registrarPartida(stats: StatsGabinete, estado: EstadoGabinete): StatsGabinete {
  const ganada = estado.estado === 'ganada'
  const ms = (estado.fin ?? estado.inicio) - estado.inicio
  const llenas = estado.sillas.filter((s) => s !== null).length
  if (estado.config.daily && estado.config.dateKey) {
    const dia = estado.config.dateKey
    if (stats.diario[dia]) return stats
    const diario = { ...stats.diario, [dia]: { ganada, ms, llenas } }
    const mejorDiarioMs = ganada ? Math.min(stats.mejorDiarioMs ?? Infinity, ms) : stats.mejorDiarioMs
    return { ...stats, diario, mejorDiarioMs: Number.isFinite(mejorDiarioMs as number) ? mejorDiarioMs : null }
  }
  const t = estado.config.temporizador
  const mejor = ganada ? Math.min(stats.libre.mejorMs[t] ?? Infinity, ms) : undefined
  return {
    ...stats,
    libre: {
      jugadas: stats.libre.jugadas + 1,
      ganadas: stats.libre.ganadas + (ganada ? 1 : 0),
      mejorMs: mejor !== undefined && Number.isFinite(mejor) ? { ...stats.libre.mejorMs, [t]: mejor } : stats.libre.mejorMs,
    },
  }
}
