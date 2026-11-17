import type { Top10Challenge, Top10Item } from '../data/top10Types.ts'
import { normalize } from '../utils/text.ts'

// Evaluación de lo que escribe el jugador. Reglas (en este orden):
//
//   1. Coincidencia exacta, sin tildes ni mayúsculas, con el nombre completo, un alias, o cualquier
//      tramo del nombre que incluya algún apellido («Galán», «Luis Carlos Galán», «Carlos Galán»).
//      Un nombre de pila suelto («Luis») no cuenta: es demasiado ambiguo.
//   2. Si no hay coincidencia exacta, tolera una errata (distancia de edición 1, o 2 si son 9+ letras).
//   3. Si lo escrito coincide con varias filas sin acertar, avisa sin quitar vida.
//   4. Si solo es parte de un nombre (un nombre de pila), pide más precisión sin quitar vida.
//   5. Si no es nada de lo anterior, es un fallo.

const PARTICLES = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'el'])

/** Palabras comparables de un texto: sin tildes, sin partículas ni guiones. */
export function tokenize(text: string): string[] {
  return normalize(text.replace(/-/g, ' '))
    .split(' ')
    .filter((t) => t !== '' && !PARTICLES.has(t))
}

export type Verdict =
  | { kind: 'match'; index: number }
  | { kind: 'repeat'; index: number }
  | { kind: 'ambiguous'; indexes: number[] }
  | { kind: 'vague' }
  | { kind: 'wrong' }

interface ItemKeys {
  /** Formas que se aceptan tal cual (ya normalizadas, con palabras unidas por espacio). */
  exact: Set<string>
  /** Palabras del nombre, para detectar entradas «vagas». */
  words: Set<string>
}

function buildKeys(item: Top10Item): ItemKeys {
  const toks = tokenize(item.nombre)
  const exact = new Set<string>()
  const add = (t: readonly string[]) => {
    if (t.length > 0) exact.add(t.join(' '))
  }
  add(toks)
  for (const alias of item.aliases) add(tokenize(alias))

  // El nombre de pila va primero; en nombres de 4+ palabras hay dos apellidos al final.
  const n = toks.length
  const surnameStart = n >= 4 ? n - 2 : n >= 2 ? 1 : 0
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (j >= surnameStart) add(toks.slice(i, j + 1))
    }
  }
  if (n >= 2) {
    add([toks[0], toks[n - 1]])
    add([toks[0], toks[surnameStart]])
  }
  return { exact, words: new Set(toks) }
}

const cache = new WeakMap<Top10Challenge, ItemKeys[]>()

function keysFor(challenge: Top10Challenge): ItemKeys[] {
  let keys = cache.get(challenge)
  if (!keys) {
    keys = challenge.items.map(buildKeys)
    cache.set(challenge, keys)
  }
  return keys
}

/** Distancia de edición con tope: devuelve `max + 1` en cuanto se sabe que lo supera. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      curr.push(value)
      if (value < rowMin) rowMin = value
    }
    if (rowMin > max) return max + 1
    prev = curr
  }
  return prev[b.length]
}

function resolve(candidates: number[], found: readonly boolean[]): Verdict | null {
  if (candidates.length === 0) return null
  const open = candidates.filter((i) => !found[i])
  if (open.length === 1) return { kind: 'match', index: open[0] }
  if (open.length > 1) return { kind: 'ambiguous', indexes: open }
  return { kind: 'repeat', index: candidates[0] }
}

/** Evalúa un intento contra un reto. `found[i]` indica qué filas ya están acertadas. */
export function judge(challenge: Top10Challenge, found: readonly boolean[], input: string): Verdict {
  const guess = tokenize(input).join(' ')
  if (guess.replace(/ /g, '').length < 3) return { kind: 'vague' }
  const keys = keysFor(challenge)

  const exact = keys.flatMap((k, i) => (k.exact.has(guess) ? [i] : []))
  const exactVerdict = resolve(exact, found)
  if (exactVerdict) return exactVerdict

  const tolerance = guess.length >= 9 ? 2 : guess.length >= 5 ? 1 : 0
  if (tolerance > 0) {
    let best = tolerance + 1
    let bestItems: number[] = []
    keys.forEach((k, i) => {
      let itemBest = tolerance + 1
      for (const form of k.exact) {
        if (form.length < 4) continue
        itemBest = Math.min(itemBest, editDistance(guess, form, tolerance))
      }
      if (itemBest < best) {
        best = itemBest
        bestItems = [i]
      } else if (itemBest === best && itemBest <= tolerance) {
        bestItems.push(i)
      }
    })
    const fuzzy = best <= tolerance ? resolve(bestItems, found) : null
    if (fuzzy) return fuzzy
  }

  const words = guess.split(' ')
  if (keys.some((k) => words.every((w) => k.words.has(w)))) return { kind: 'vague' }
  return { kind: 'wrong' }
}
