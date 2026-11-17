import { TOP10_LISTS, type Top10Category } from '../data/top10Lists.ts'
import { createRng, shuffle } from '../utils/rng.ts'

// El reto diario recorre todas las listas en un orden fijo y mezclado: nunca repite una lista hasta
// haberlas jugado todas, y es idéntico para todos los jugadores de un mismo día.

const CICLO = shuffle(
  TOP10_LISTS.map((l) => l.id),
  createRng('politica-top10-ciclo-v1'),
)

export function dailyChallengeId(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
  return CICLO[((day % CICLO.length) + CICLO.length) % CICLO.length]
}

export type CategoryChoice = Top10Category | 'aleatoria'

/** Un reto al azar de la categoría elegida, evitando repetir el anterior si hay alternativa. */
export function randomChallengeId(category: CategoryChoice, avoid?: string): string {
  const pool = TOP10_LISTS.filter((l) => category === 'aleatoria' || l.categoria === category)
  const options = pool.length > 1 ? pool.filter((l) => l.id !== avoid) : pool
  return options[Math.floor(Math.random() * options.length)].id
}
