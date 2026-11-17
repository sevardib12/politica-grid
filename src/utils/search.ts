import { POLITICIANS } from '../data/politicians.ts'
import type { Politician } from '../data/types.ts'
import { normalize } from './text.ts'

// Índice de búsqueda: nombre + alias normalizados (sin tildes ni mayúsculas).
const INDEX = POLITICIANS.map((p) => ({
  politician: p,
  haystack: normalize(`${p.nombre} ${p.alias ?? ''}`),
}))

/** Los más conocidos (presidentes, candidatos, congresistas) salen primero a igualdad de coincidencia. */
const fame = (p: Politician) =>
  (p.presidencial.presidente ? 3 : 0) +
  (p.presidencial.candidato_primera_vuelta ? 2 : 0) +
  (p.congreso.senador || p.congreso.representante_camara ? 1 : 0)

/**
 * Autocompletado: todas las palabras escritas deben aparecer en el nombre o
 * el alias, sin importar tildes ni mayúsculas ("alvaro uribe" → Álvaro Uribe).
 */
export function searchPoliticians(query: string, limit = 8): Politician[] {
  const whole = normalize(query)
  const tokens = whole.split(' ').filter(Boolean)
  if (tokens.length === 0) return []
  const scored = INDEX.filter((entry) => tokens.every((t) => entry.haystack.includes(t))).map((entry) => {
    const words = entry.haystack.split(' ')
    const wordStarts = tokens.filter((t) => words.some((w) => w.startsWith(t))).length
    return { entry, wordStarts, starts: entry.haystack.startsWith(whole) ? 1 : 0 }
  })
  return scored
    .sort(
      (a, b) =>
        b.wordStarts - a.wordStarts ||
        b.starts - a.starts ||
        fame(b.entry.politician) - fame(a.entry.politician) ||
        a.entry.politician.nombre.localeCompare(b.entry.politician.nombre, 'es'),
    )
    .slice(0, limit)
    .map((s) => s.entry.politician)
}
