import type { Partido } from '../data/types.ts'
import { mulberry32, semillaDeFecha } from '../utils/cabinetRandomizer.ts'
import type { Pool } from './pool.ts'

/** Entradas de la secuencia del día: de sobra para cualquier partida (11 ubicaciones y 2 re-sorteos). */
export const LARGO_SECUENCIA = 200

/**
 * Secuencia de partidos del reto diario. Es la misma para todos: se genera con Mulberry32 sembrado
 * con la fecha y con la misma regla de disponibilidad del juego, consumiendo un político por giro
 * (el primero sin usar, por id). Así los partidos salen con probabilidad proporcional a sus miembros
 * disponibles, sin depender de lo que cada jugador haga.
 */
export function secuenciaDiaria(key: string, pool: Pool): Partido[] {
  const rng = mulberry32(semillaDeFecha(key))
  const usados = new Set<string>()
  const disponibles = new Map<Partido, number>()
  for (const partido of pool.partidos) disponibles.set(partido, pool.porPartido.get(partido)?.length ?? 0)
  const secuencia: Partido[] = []
  while (secuencia.length < LARGO_SECUENCIA) {
    const opciones = [...disponibles.entries()].filter(([, n]) => n > 0)
    if (opciones.length === 0) break
    const total = opciones.reduce((s, [, n]) => s + n, 0)
    let r = rng() * total
    let elegido = opciones[opciones.length - 1][0]
    for (const [partido, n] of opciones) {
      if (r < n) {
        elegido = partido
        break
      }
      r -= n
    }
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
