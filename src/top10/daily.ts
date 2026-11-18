import { TOP10_LISTS, type Top10Category } from '../data/top10Lists.ts'
import { createRng, shuffle } from '../utils/rng.ts'

// El reto diario recorre todas las listas en un orden fijo y mezclado: nunca repite una lista hasta
// haberlas jugado todas, y es idéntico para todos los jugadores de un mismo día.

const SEMILLA = 'politica-top10-ciclo-v1'

// Listas añadidas después de que el reto diario ya se publicaba. Cambiar el ciclo mueve el reto de
// todos los días, así que los días hasta el 17 de noviembre de 2026 siguen con el ciclo anterior
// (sin estas listas) para que nadie vea otra lista de la que ya jugó.
const LISTAS_NUEVAS = new Set(['concejales-bogota-2023', 'concejales-medellin-2023', 'min-justicia', 'min-agricultura', 'min-vivienda', 'min-tic'])
const ULTIMO_DIA_CICLO_ANTERIOR = Math.floor(Date.UTC(2026, 10, 17) / 86_400_000)

const CICLO = shuffle(
  TOP10_LISTS.map((l) => l.id),
  createRng(SEMILLA),
)
const CICLO_ANTERIOR = shuffle(
  TOP10_LISTS.map((l) => l.id).filter((id) => !LISTAS_NUEVAS.has(id)),
  createRng(SEMILLA),
)

export function dailyChallengeId(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
  const ciclo = day <= ULTIMO_DIA_CICLO_ANTERIOR ? CICLO_ANTERIOR : CICLO
  return ciclo[((day % ciclo.length) + ciclo.length) % ciclo.length]
}

export type CategoryChoice = Top10Category | 'aleatoria'

/** Un reto al azar de la categoría elegida, evitando repetir el anterior si hay alternativa. */
export function randomChallengeId(category: CategoryChoice, avoid?: string): string {
  const pool = TOP10_LISTS.filter((l) => category === 'aleatoria' || l.categoria === category)
  const options = pool.length > 1 ? pool.filter((l) => l.id !== avoid) : pool
  return options[Math.floor(Math.random() * options.length)].id
}
