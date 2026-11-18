import { useEffect, useMemo, useState } from 'react'
import { PARTIDOS, type Partido } from '../data/types.ts'
import { mulberry32 } from '../utils/cabinetRandomizer.ts'
import { PartyLogo } from './PartyLogo.tsx'

const ALTO = 64
const RELLENO = 16

/**
 * Ruleta visual: una tira de logos que se desplaza y se detiene en el partido sorteado. Solo es
 * vista: el partido lo decide el motor. La animación se desactiva con «reducir movimiento».
 */
export function Ruleta({ partido, giro }: { partido: Partido | null; giro: number }) {
  const [llegada, setLlegada] = useState(false)

  // Relleno determinista por giro (sin azar en el render).
  const tira = useMemo(() => {
    const rng = mulberry32(giro * 7919 + 17)
    const relleno = Array.from({ length: RELLENO }, () => PARTIDOS[Math.floor(rng() * PARTIDOS.length)])
    return [...relleno, partido ?? PARTIDOS[0]]
  }, [giro, partido])

  // Primero en la posición de salida; dos fotogramas después, a la posición final.
  useEffect(() => {
    setLlegada(false)
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setLlegada(true)))
    return () => cancelAnimationFrame(a)
  }, [giro])

  const desplazamiento = llegada ? -(tira.length - 1) * ALTO : 0

  return (
    <div
      className="relative mx-auto h-16 w-full max-w-xs overflow-hidden rounded-2xl border border-gold/40 bg-ink/70"
      role="img"
      aria-label={partido ? `Partido sorteado: ${partido}` : 'Girando la ruleta'}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-gold/60" aria-hidden="true" />
      <ul
        aria-hidden="true"
        className="motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-[cubic-bezier(0.15,0.8,0.2,1)]"
        style={{ transform: `translateY(${desplazamiento}px)` }}
      >
        {tira.map((p, i) => (
          <li key={i} style={{ height: ALTO }} className="flex items-center justify-center gap-2 px-3">
            <PartyLogo partyName={p} size="md" decorative />
            <span className="truncate text-sm font-bold text-slate-100">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
