import { useMemo, type CSSProperties } from 'react'
import { PARTIDOS, type Partido } from '../data/types.ts'
import { mulberry32 } from '../utils/cabinetRandomizer.ts'
import { DURACION_GIRO_MS } from './giro.ts'
import { PartyLogo } from './PartyLogo.tsx'

const ALTO = 56
/** Partidos que pasan por la ruleta antes de parar: más filas, más sensación de giro. */
const RELLENO = 28

/**
 * Ruleta: cada vez que sale un partido nuevo, la tira de partidos gira y se detiene con el sorteado en la franja
 * del centro, entre filetes de oro. Cada giro es una animación nueva (la clave es `giro`). Los partidos que
 * asoman arriba y abajo nunca son el sorteado ni se repiten seguidos: así no se ve dos veces el mismo partido.
 * Solo es vista: el partido lo decide el motor. Con «reducir movimiento» para en el sorteado sin animar.
 */
export function Ruleta({ partido, giro, girando }: { partido: Partido | null; giro: number; girando: boolean }) {
  // Relleno determinista por giro (sin azar en el render).
  const tira = useMemo(() => {
    const destino = partido ?? PARTIDOS[0]
    const otros = PARTIDOS.filter((p) => p !== destino)
    const rng = mulberry32(giro * 7919 + 17)
    const elegir = (anterior: Partido | null): Partido => {
      let p = otros[Math.floor(rng() * otros.length)]
      while (p === anterior) p = otros[Math.floor(rng() * otros.length)]
      return p
    }
    const relleno: Partido[] = []
    let anterior: Partido | null = null
    for (let i = 0; i < RELLENO; i++) {
      anterior = elegir(anterior)
      relleno.push(anterior)
    }
    // La última fila del relleno está justo arriba del sorteado; la de después, justo debajo.
    return [...relleno, destino, elegir(null)]
  }, [giro, partido])

  // El sorteado (penúltimo de la tira) queda en la fila del medio de las tres visibles.
  const fin = -(tira.length - 3) * ALTO

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-[10px] bg-ink [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]"
      style={{ height: ALTO * 3 }}
      role="img"
      aria-label={girando ? 'La ruleta está girando' : partido ? `Partido sorteado: ${partido}` : 'Girando la ruleta'}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 border-y-2 border-gold bg-panel-2"
        style={{ top: ALTO, height: ALTO }}
      />
      <ul
        key={giro}
        aria-hidden="true"
        className="ruleta-tira relative"
        style={
          {
            '--fin': `${fin}px`,
            animation: `ruleta-girar ${DURACION_GIRO_MS}ms cubic-bezier(0.15, 0.8, 0.2, 1) both`,
          } as CSSProperties
        }
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
