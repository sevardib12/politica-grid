// Aleatoriedad de «Arma el Gabinete».
//
// · Partida libre: números de `crypto.getRandomValues`, impredecibles y distintos en cada partida.
// · Reto diario: Mulberry32 sembrado con la fecha (AAAA-MM-DD → AAAAMMDD), así todos ven la misma
//   secuencia de partidos ese día.
//
// Cada giro elige un partido con probabilidad proporcional a sus políticos disponibles (los que
// todavía no están en el gabinete). Se usa búsqueda binaria sobre los pesos acumulados, y solo
// entran partidos con al menos un disponible: nunca sale uno sin miembros.

/** Número en [0, 1). */
export type Rng = () => number

/** Generador impredecible para la partida libre. */
export function cryptoRng(): number {
  const buf = new Uint32Array(1)
  globalThis.crypto.getRandomValues(buf)
  return buf[0] / 4294967296
}

/** Mulberry32: generador pequeño y determinista a partir de una semilla entera. */
export function mulberry32(semilla: number): Rng {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Semilla del reto diario: la fecha como entero AAAAMMDD (2026-11-18 → 20261118). */
export function semillaDeFecha(key: string): number {
  return Number(key.replace(/-/g, ''))
}

/**
 * Índice del primer elemento cuyo peso acumulado supera `r`. `acumulados` debe ser estrictamente
 * creciente (solo pesos positivos). Búsqueda binaria: O(log n).
 */
export function indiceAcumulado(acumulados: readonly number[], r: number): number {
  let lo = 0
  let hi = acumulados.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (acumulados[mid] > r) hi = mid
    else lo = mid + 1
  }
  return lo
}

/**
 * Elige una opción con probabilidad proporcional a su peso. Ignora pesos no positivos. Devuelve
 * `null` si no hay ninguna opción con peso.
 */
export function elegirPonderado<T>(opciones: readonly { valor: T; peso: number }[], rng: Rng): T | null {
  const validas = opciones.filter((o) => o.peso > 0)
  if (validas.length === 0) return null
  const acumulados: number[] = []
  let total = 0
  for (const o of validas) {
    total += o.peso
    acumulados.push(total)
  }
  const r = rng() * total
  return validas[indiceAcumulado(acumulados, r)].valor
}
