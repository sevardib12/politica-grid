import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { cryptoRng } from '../utils/cabinetRandomizer.ts'
import { MS_CONTRARRELOJ, SEGUNDOS_TURNO, iniciarGabinete, reducirGabinete, type AccionGabinete, type ConfigGabinete, type Contexto, type EstadoGabinete } from './engine.ts'
import type { Pool } from './pool.ts'

const FEEDBACK_MS = 2800

export interface UseGabinete {
  estado: EstadoGabinete
  /** Milisegundos transcurridos desde el inicio (congelado al terminar). */
  transcurridoMs: number
  /** Milisegundos que quedan del turno (15 s) o de la partida (contrarreloj); null si no hay cuenta atrás. */
  restanteMs: number | null
  seleccionar: (id: string | null) => void
  ubicar: (silla: number) => void
  resortear: () => void
  rendirse: () => void
}

/** Estado de una partida con su reloj, el feedback que se desvanece y el aviso único al terminar. */
export function useGabinete(config: ConfigGabinete, pool: Pool, onFinish?: (estado: EstadoGabinete) => void): UseGabinete {
  const ctx: Contexto = useMemo(() => ({ pool, rng: cryptoRng }), [pool])
  const [estado, dispatch] = useReducer(
    (s: EstadoGabinete, a: AccionGabinete) => reducirGabinete(s, a, ctx),
    undefined,
    () => iniciarGabinete(config, ctx, Date.now()),
  )
  const [ahora, setAhora] = useState(() => Date.now())
  const terminadaRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const jugando = estado.estado === 'jugando'

  // Reloj: corre solo durante la partida.
  useEffect(() => {
    if (!jugando) return
    const id = window.setInterval(() => {
      const now = Date.now()
      setAhora(now)
      dispatch({ type: 'TICK', now })
    }, 250)
    return () => window.clearInterval(id)
  }, [jugando])

  // Los mensajes se desvanecen solos.
  useEffect(() => {
    if (!estado.retro) return
    const id = window.setTimeout(() => dispatch({ type: 'LIMPIAR_RETRO' }), FEEDBACK_MS)
    return () => window.clearTimeout(id)
  }, [estado.retro])

  // Aviso único al terminar (estadísticas).
  useEffect(() => {
    if (!jugando && !terminadaRef.current) {
      terminadaRef.current = true
      onFinishRef.current?.(estado)
    }
  }, [jugando, estado])

  const fin = estado.fin ?? ahora
  const transcurridoMs = Math.max(0, fin - estado.inicio)
  let restanteMs: number | null = null
  if (estado.config.temporizador === 'contrarreloj') restanteMs = Math.max(0, MS_CONTRARRELOJ - transcurridoMs)
  if (estado.config.temporizador === 'turno') restanteMs = Math.max(0, SEGUNDOS_TURNO * 1000 - (fin - estado.turnoInicio))

  const seleccionar = useCallback((id: string | null) => dispatch({ type: 'SELECCIONAR', id, now: Date.now() }), [])
  const ubicar = useCallback((silla: number) => dispatch({ type: 'UBICAR', silla, now: Date.now() }), [])
  const resortear = useCallback(() => dispatch({ type: 'RESORTEAR', now: Date.now() }), [])
  const rendirse = useCallback(() => dispatch({ type: 'RENDIRSE', now: Date.now() }), [])

  return { estado, transcurridoMs, restanteMs, seleccionar, ubicar, resortear, rendirse }
}
