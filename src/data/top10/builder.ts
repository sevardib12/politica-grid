import type { Partido } from '../types.ts'
import type { Top10Category, Top10Challenge } from '../top10Types.ts'

/** Ficha compacta de una fila: [nombre, aliases, partido, pista visible, dato extra]. */
export type ItemSpec = readonly [
  nombre: string,
  aliases: readonly string[],
  partido: Partido | null,
  pista: string,
  extra: string,
]

export interface ListaSpec {
  id: string
  titulo: string
  subtitulo: string
  categoria: Top10Category
  fuente: string
  nota?: string
  items: readonly ItemSpec[]
}

/** Convierte una lista compacta en un `Top10Challenge`; el tamaño sale del número de filas. */
export function lista(spec: ListaSpec): Top10Challenge {
  const size = spec.items.length
  if (size !== 5 && size !== 10) throw new Error(`${spec.id}: una lista tiene 5 o 10 filas, no ${size}`)
  return {
    id: spec.id,
    titulo: spec.titulo,
    subtitulo: spec.subtitulo,
    categoria: spec.categoria,
    size,
    fuente: spec.fuente,
    ...(spec.nota ? { nota: spec.nota } : {}),
    items: spec.items.map(([nombre, aliases, partido, pista, extra], i) => ({
      posicion: i + 1,
      nombre,
      aliases: [...aliases],
      partido,
      pista_visible: pista,
      dato_extra: extra,
    })),
  }
}

/** Texto estándar de orden para las listas «últimos». */
export const ORDEN_RECIENTE =
  'Del más reciente (1) al más antiguo. Cada persona cuenta una vez, por su periodo más reciente; no se cuentan interinos ni encargados.'
