import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { initGame, reducer, type GameConfig, type GameState } from './engine.ts'

const AUTO_PLACE_MS = 1100
const FEEDBACK_MS = 2600

export interface UseGame {
  state: GameState
  /** Segundos que quedan en el turno (null si no hay temporizador o está en pausa). */
  timeLeft: number | null
  /** Milisegundos transcurridos desde el inicio (congelado al terminar). */
  elapsedMs: number
  place: (cell: number) => void
  skip: () => void
  selectCell: (cell: number | null) => void
  guess: (politicianId: string) => void
}

export function useGame(config: GameConfig, onFinish?: (state: GameState) => void): UseGame {
  const [state, dispatch] = useReducer(reducer, config, (c) => initGame(c, Date.now()))
  const [now, setNow] = useState(() => Date.now())
  const finishedRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const playing = state.status === 'playing'
  const timed = playing && state.config.timer > 0 && state.autoCell === null

  // Reloj: sólo corre mientras hay una partida en curso.
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [playing])

  const timeLeft = useMemo(() => {
    if (!timed) return null
    return Math.max(0, state.config.timer - (now - state.turnStartedAt) / 1000)
  }, [timed, now, state.config.timer, state.turnStartedAt])

  useEffect(() => {
    if (timed && timeLeft !== null && timeLeft <= 0) dispatch({ type: 'TIMEOUT', now: Date.now() })
  }, [timed, timeLeft])

  // Ubicación automática con una animación breve.
  useEffect(() => {
    if (state.autoCell === null || !playing) return
    const id = window.setTimeout(() => dispatch({ type: 'AUTO_PLACE', now: Date.now() }), AUTO_PLACE_MS)
    return () => window.clearTimeout(id)
  }, [state.autoCell, state.current, playing])

  // Los mensajes se desvanecen solos.
  useEffect(() => {
    if (!state.feedback) return
    const id = window.setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), FEEDBACK_MS)
    return () => window.clearTimeout(id)
  }, [state.feedback])

  // Aviso único al terminar la partida.
  useEffect(() => {
    if (state.status !== 'playing' && !finishedRef.current) {
      finishedRef.current = true
      onFinishRef.current?.(state)
    }
  }, [state])

  const place = useCallback((cell: number) => dispatch({ type: 'PLACE', cell, now: Date.now() }), [])
  const skip = useCallback(() => dispatch({ type: 'SKIP', now: Date.now() }), [])
  const selectCell = useCallback(
    (cell: number | null) => dispatch({ type: 'SELECT_CELL', cell, now: Date.now() }),
    [],
  )
  const guess = useCallback(
    (politicianId: string) => dispatch({ type: 'GUESS', politicianId, now: Date.now() }),
    [],
  )

  const elapsedMs = (state.endedAt ?? now) - state.startedAt

  return { state, timeLeft, elapsedMs, place, skip, selectCell, guess }
}
