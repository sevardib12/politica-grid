import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { borrarStats, cargarStats, guardarStats, registrarPartida, type StatsGabinete } from '../gabinete/stats.ts'
import type { EstadoGabinete } from '../gabinete/engine.ts'
import type { GameState } from '../game/engine.ts'
import { loadStats, recordGame, resetStats, type Stats } from '../game/stats.ts'
import type { Top10State } from '../top10/engine.ts'
import { loadTop10Stats, recordTop10Game, resetTop10Stats, type Top10Stats } from '../top10/stats.ts'
import { StatsContext, type StatsApi } from './useStats.ts'

/** Carga las estadísticas de los tres juegos una vez y las comparte. Cada `record*` es estable (no cambia entre renders). */
export function StatsProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<Stats>(() => loadStats())
  const [top10, setTop10] = useState<Top10Stats>(() => loadTop10Stats())
  const [gabinete, setGabinete] = useState<StatsGabinete>(() => cargarStats())
  // La última versión de cada una, para que registrar dos partidas seguidas no use un valor viejo.
  const gridRef = useRef(grid)
  const top10Ref = useRef(top10)
  const gabineteRef = useRef(gabinete)

  const recordGrid = useCallback((state: GameState) => {
    const next = recordGame(gridRef.current, state)
    gridRef.current = next
    setGrid(next)
  }, [])

  const recordTop10 = useCallback((state: Top10State) => {
    const next = recordTop10Game(top10Ref.current, state)
    top10Ref.current = next
    setTop10(next)
  }, [])

  const recordGabinete = useCallback((estado: EstadoGabinete) => {
    const next = registrarPartida(gabineteRef.current, estado)
    gabineteRef.current = next
    guardarStats(next)
    setGabinete(next)
  }, [])

  const resetGrid = useCallback(() => {
    const fresh = resetStats()
    gridRef.current = fresh
    setGrid(fresh)
  }, [])

  const resetTop10 = useCallback(() => {
    const fresh = resetTop10Stats()
    top10Ref.current = fresh
    setTop10(fresh)
  }, [])

  const resetGabinete = useCallback(() => {
    const fresh = borrarStats()
    gabineteRef.current = fresh
    setGabinete(fresh)
  }, [])

  const api = useMemo<StatsApi>(
    () => ({ grid, top10, gabinete, recordGrid, recordTop10, recordGabinete, resetGrid, resetTop10, resetGabinete }),
    [grid, top10, gabinete, recordGrid, recordTop10, recordGabinete, resetGrid, resetTop10, resetGabinete],
  )

  return <StatsContext.Provider value={api}>{children}</StatsContext.Provider>
}
