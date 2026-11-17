import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { initTop10, reducer, TIMED_SECONDS, type Top10Config, type Top10State } from './engine.ts'

const FEEDBACK_MS = 2800

export interface UseTop10 {
  state: Top10State
  /** Segundos que quedan en Contrarreloj (null en modo Normal). */
  timeLeft: number | null
  /** Milisegundos transcurridos (congelado al terminar). */
  elapsedMs: number
  guess: (text: string) => void
  giveUp: () => void
}

export function useTop10(config: Top10Config, onFinish?: (state: Top10State) => void): UseTop10 {
  const [state, dispatch] = useReducer(reducer, config, (c) => initTop10(c, Date.now()))
  const [now, setNow] = useState(() => Date.now())
  const finishedRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const playing = state.status === 'playing'
  const timed = state.config.mode === 'contrarreloj'

  // Reloj: solo corre mientras hay una partida en curso.
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [playing])

  const timeLeft = useMemo(
    () => (timed ? Math.max(0, TIMED_SECONDS - ((state.endedAt ?? now) - state.startedAt) / 1000) : null),
    [timed, now, state.startedAt, state.endedAt],
  )

  useEffect(() => {
    if (playing && timed && timeLeft !== null && timeLeft <= 0) dispatch({ type: 'TIMEOUT', now: Date.now() })
  }, [playing, timed, timeLeft])

  // Los mensajes se desvanecen solos.
  useEffect(() => {
    if (!state.feedback) return
    const id = window.setTimeout(() => dispatch({ type: 'CLEAR_FEEDBACK' }), FEEDBACK_MS)
    return () => window.clearTimeout(id)
  }, [state.feedback])

  // Aviso único al terminar.
  useEffect(() => {
    if (state.status !== 'playing' && !finishedRef.current) {
      finishedRef.current = true
      onFinishRef.current?.(state)
    }
  }, [state])

  const guess = useCallback((text: string) => dispatch({ type: 'GUESS', text, now: Date.now() }), [])
  const giveUp = useCallback(() => dispatch({ type: 'GIVE_UP', now: Date.now() }), [])

  return { state, timeLeft, elapsedMs: (state.endedAt ?? now) - state.startedAt, guess, giveUp }
}
