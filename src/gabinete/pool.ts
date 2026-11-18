import { POLITICIANS } from '../data/politicians.ts'
import { PARTIDOS, type Partido, type Politician } from '../data/types.ts'

/**
 * Candidatos del juego: toda la base de datos. Cada político entra por los partidos en los que
 * militó (los de `partidos`); quien no tiene partido registrado no sale en ningún sorteo, pero se
 * puede escribir su nombre (y sería un error: no militó en el partido sorteado). Sin foto, la silla
 * muestra las iniciales.
 */
export interface Pool {
  /** Todos los políticos de la base, por id. */
  porId: Map<string, Politician>
  /** Políticos de cada partido (uno puede estar en varios). Ordenados por id. */
  porPartido: Map<Partido, Politician[]>
  /** Partidos con al menos un político, en el orden del catálogo. */
  partidos: Partido[]
}

export function buildPool(fuente: readonly Politician[] = POLITICIANS): Pool {
  const candidatos = fuente.slice().sort((a, b) => a.id.localeCompare(b.id))
  const porId = new Map<string, Politician>()
  const porPartido = new Map<Partido, Politician[]>()
  for (const p of candidatos) {
    porId.set(p.id, p)
    for (const partido of new Set(p.partidos)) {
      const lista = porPartido.get(partido)
      if (lista) lista.push(p)
      else porPartido.set(partido, [p])
    }
  }
  const partidos = PARTIDOS.filter((x) => porPartido.has(x))
  return { porId, porPartido, partidos }
}

/** Texto de búsqueda sin tildes ni guiones, en minúsculas. */
export function claveBusqueda(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Coincidencias del buscador: nombres que empiezan por lo escrito, o cuyas palabras empiezan por cada palabra escrita. */
export function buscarEnPartido(p: Pool, partido: Partido, texto: string, excluir: ReadonlySet<string>, limite = 6): Politician[] {
  const q = claveBusqueda(texto)
  if (q.length < 2) return []
  const palabras = q.split(' ')
  const lista = p.porPartido.get(partido) ?? []
  const inicio: Politician[] = []
  const resto: Politician[] = []
  for (const candidato of lista) {
    if (excluir.has(candidato.id)) continue
    const nombre = claveBusqueda(candidato.nombre)
    if (nombre.startsWith(q)) inicio.push(candidato)
    else if (palabras.every((w) => nombre.split(' ').some((t) => t.startsWith(w)))) resto.push(candidato)
  }
  return [...inicio, ...resto].slice(0, limite)
}

/** Búsqueda exacta por nombre dentro del juego (cualquier partido). */
export function buscarNombreExacto(p: Pool, texto: string): Politician | null {
  const q = claveBusqueda(texto)
  if (!q) return null
  for (const candidato of p.porId.values()) if (claveBusqueda(candidato.nombre) === q) return candidato
  return null
}
