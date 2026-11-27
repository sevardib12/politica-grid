import type { Partido } from '../data/types.ts'
import { elegirUniforme, mulberry32, semillaDeFecha } from '../utils/cabinetRandomizer.ts'
import type { Pool } from './pool.ts'

/** Entradas de la secuencia del día: de sobra para cualquier partida (una por silla, más los re-sorteos y los turnos vencidos). */
export const LARGO_SECUENCIA = 200

/**
 * Secuencia de partidos del reto diario. Es la misma para todos: se genera con Mulberry32 sembrado
 * con la fecha y con la misma regla de disponibilidad del juego, consumiendo un político por giro
 * (el primero sin usar, por id). Cada giro elige con la misma probabilidad entre los partidos que
 * todavía tienen alguien sin usar, así no sale antes uno por tener más miembros, ni depende de lo
 * que haga cada jugador.
 */
export function secuenciaDiaria(key: string, pool: Pool): Partido[] {
  const rng = mulberry32(semillaDeFecha(key))
  const usados = new Set<string>()
  const disponibles = new Map<Partido, number>()
  for (const partido of pool.partidos) disponibles.set(partido, pool.porPartido.get(partido)?.length ?? 0)
  const secuencia: Partido[] = []
  while (secuencia.length < LARGO_SECUENCIA) {
    const opciones = [...disponibles.entries()].filter(([, n]) => n > 0).map(([partido]) => partido)
    const elegido = elegirUniforme(opciones, rng)
    if (elegido === null) break
    secuencia.push(elegido)
    const miembro = (pool.porPartido.get(elegido) ?? []).find((p) => !usados.has(p.id))
    if (!miembro) continue
    usados.add(miembro.id)
    for (const partido of miembro.partidos) {
      const n = disponibles.get(partido)
      if (n !== undefined && n > 0) disponibles.set(partido, n - 1)
    }
  }
  return secuencia
}
