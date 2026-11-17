import { POLITICIANS } from '../data/politicians.ts'
import { TOP10_LISTS, type Top10Item } from '../data/top10Lists.ts'
import type { Politician } from '../data/types.ts'
import { normalize } from '../utils/text.ts'
import { tokenize } from './match.ts'

// Une cada fila de un reto con la ficha del político (si existe en la base de datos de Política
// Grid) para mostrar su foto, y ofrece sugerencias de autocompletado.

/** Lo mínimo que necesita un avatar. */
export type PersonLike = Pick<Politician, 'nombre' | 'partidos' | 'foto_url'>

const resolved = new Map<string, Politician | null>()

/**
 * Busca en la base de políticos a la persona de una fila: todas las palabras del nombre de la fila
 * deben estar en el nombre de la ficha (y la fila debe tener al menos nombre y apellido), y el
 * resultado debe ser único. Ante la duda no se asocia a nadie, para no mostrar la foto equivocada.
 */
function findPolitician(nombre: string): Politician | null {
  const cached = resolved.get(nombre)
  if (cached !== undefined) return cached
  const want = tokenize(nombre)
  let found: Politician | null = null
  if (want.length >= 2) {
    const matches = POLITICIANS.filter((p) => {
      const have = new Set(tokenize(p.nombre))
      return want.every((w) => have.has(w))
    })
    if (matches.length === 1) found = matches[0]
  }
  resolved.set(nombre, found)
  return found
}

/** Persona de una fila: la ficha de la base si existe; si no, un perfil mínimo con el partido de la fila. */
export function personFor(item: Pick<Top10Item, 'nombre' | 'partido'>): PersonLike {
  const known = findPolitician(item.nombre)
  if (known) return known
  return { nombre: item.nombre, partidos: item.partido ? [item.partido] : [] }
}

export function hasProfile(nombre: string): boolean {
  return findPolitician(nombre) !== null
}

// ── Sugerencias ───────────────────────────────────────────────────────────

interface Suggestion {
  nombre: string
  key: string
}

const POOL: readonly Suggestion[] = (() => {
  const names = new Set<string>()
  for (const l of TOP10_LISTS) for (const it of l.items) names.add(it.nombre)
  for (const p of POLITICIANS) names.add(p.nombre)
  const all = [...names].map((nombre) => ({ nombre, words: tokenize(nombre) }))
  // «Iván Name» y «Iván Name Vásquez» son la misma persona: se deja la forma más completa.
  const unique = all.filter(
    (a) => !all.some((b) => b !== a && b.words.length > a.words.length && a.words.every((w) => b.words.includes(w))),
  )
  return unique
    .map((u) => u.nombre)
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map((nombre) => ({ nombre, key: normalize(nombre.replace(/-/g, ' ')) }))
})()

/**
 * Sugerencias para un texto parcial: nombres de todo el juego (no solo de la lista actual, para no
 * delatar las respuestas) cuyo nombre o apellido empieza por lo escrito.
 */
export function suggestNames(query: string, limit = 6): string[] {
  const q = normalize(query.replace(/-/g, ' '))
  if (q.replace(/ /g, '').length < 3) return []
  const words = q.split(' ')
  const starts: string[] = []
  const contains: string[] = []
  for (const s of POOL) {
    if (s.key.startsWith(q)) starts.push(s.nombre)
    else if (words.every((w) => s.key.split(' ').some((t) => t.startsWith(w)))) contains.push(s.nombre)
  }
  return [...starts, ...contains].slice(0, limit)
}
