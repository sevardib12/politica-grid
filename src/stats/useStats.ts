import { createContext, useContext } from 'react'
import type { EstadoGabinete } from '../gabinete/engine.ts'
import type { StatsGabinete } from '../gabinete/stats.ts'
import type { GameState } from '../game/engine.ts'
import type { Stats } from '../game/stats.ts'
import type { Top10State } from '../top10/engine.ts'
import type { Top10Stats } from '../top10/stats.ts'

/**
 * Las estadísticas de los tres juegos, compartidas por todas las pantallas: el menú muestra la racha y
 * si el reto de hoy ya se jugó, la barra abre el modal de estadísticas y cada juego registra sus partidas.
 * Cada juego sigue guardando en su propia clave de localStorage.
 */
export interface StatsApi {
  grid: Stats
  top10: Top10Stats
  gabinete: StatsGabinete
  recordGrid: (state: GameState) => void
  recordTop10: (state: Top10State) => void
  recordGabinete: (estado: EstadoGabinete) => void
  resetGrid: () => void
  resetTop10: () => void
  resetGabinete: () => void
}

export const StatsContext = createContext<StatsApi | null>(null)

export function useStats(): StatsApi {
  const api = useContext(StatsContext)
  if (!api) throw new Error('useStats: falta <StatsProvider> más arriba en el árbol')
  return api
}
