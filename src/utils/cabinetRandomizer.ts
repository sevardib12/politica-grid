// Aleatoriedad de «Arma el Gabinete».
//
// · Partida libre: números de `crypto.getRandomValues`, impredecibles y distintos en cada partida.
// · Reto diario: Mulberry32 sembrado con la fecha (AAAA-MM-DD → AAAAMMDD), así todos ven la misma
//   secuencia de partidos ese día.
//
// Cada giro elige un partido con la misma probabilidad que los demás, entre los que todavía tienen
// al menos un político disponible (uno que no esté ya en el gabinete). Cuántos políticos tiene cada
// partido no cuenta: un partido chico sale tanto como el más grande.

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
 * Elige una opción con la misma probabilidad para todas. Devuelve `null` si no hay ninguna.
 */
export function elegirUniforme<T>(opciones: readonly T[], rng: Rng): T | null {
  if (opciones.length === 0) return null
  const indice = Math.min(Math.floor(rng() * opciones.length), opciones.length - 1)
  return opciones[indice]
}
