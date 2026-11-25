import { useEffect, useMemo, useState } from 'react'
import { PARTIDOS, type Partido } from '../data/types.ts'
import { mulberry32 } from '../utils/cabinetRandomizer.ts'
import { PartyLogo } from './PartyLogo.tsx'

const ALTO = 56
const RELLENO = 16

/**
 * Ruleta visual: una tira de partidos que se desplaza y se detiene con el sorteado en la franja del centro,
 * entre filetes de oro; arriba y abajo asoman los vecinos. Solo es vista: el partido lo decide el motor. La
 * animación se desactiva con «reducir movimiento».
 */
export function Ruleta({ partido, giro }: { partido: Partido | null; giro: number }) {
  const [llegada, setLlegada] = useState(false)

  // Relleno determinista por giro (sin azar en el render); uno más al final para que asome debajo del sorteado.
  const tira = useMemo(() => {
    const rng = mulberry32(giro * 7919 + 17)
    const relleno = Array.from({ length: RELLENO }, () => PARTIDOS[Math.floor(rng() * PARTIDOS.length)])
    const despues = PARTIDOS[Math.floor(rng() * PARTIDOS.length)]
    return [...relleno, partido ?? PARTIDOS[0], despues]
  }, [giro, partido])

  // Primero en la posición de salida; dos fotogramas después, a la posición final.
  useEffect(() => {
    setLlegada(false)
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setLlegada(true)))
    return () => cancelAnimationFrame(a)
  }, [giro])

  // El sorteado (penúltimo de la tira) queda en la fila del medio de las tres visibles.
  const desplazamiento = llegada ? -(tira.length - 3) * ALTO : 0

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-[10px] bg-ink [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]"
      style={{ height: ALTO * 3 }}
      role="img"
      aria-label={partido ? `Partido sorteado: ${partido}` : 'Girando la ruleta'}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 border-y-2 border-gold bg-panel-2"
        style={{ top: ALTO, height: ALTO }}
      />
      <ul
        aria-hidden="true"
        className="relative motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-[cubic-bezier(0.15,0.8,0.2,1)]"
        style={{ transform: `translateY(${desplazamiento}px)` }}
      >
        {tira.map((p, i) => (
          <li key={i} style={{ height: ALTO }} className="flex items-center justify-center gap-3 px-4">
            <PartyLogo partyName={p} size="md" decorative />
            <span className="font-display line-clamp-2 min-w-0 pt-0.5 text-[1.35rem] leading-[1.05] text-slate-50">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
