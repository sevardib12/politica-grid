import type { Partido } from './types.ts'

/** Cantidad de filas de un reto. */
export type Top10Size = 5 | 10

export type Top10Category = 'cargos' | 'congreso' | 'alcaldias' | 'presidenciales'

export const TOP10_CATEGORY_LABEL: Record<Top10Category, string> = {
  cargos: 'Últimos en el cargo',
  congreso: 'Más votados en Congreso',
  alcaldias: 'Gobernaciones, alcaldías y concejos',
  presidenciales: 'Presidenciales e hitos',
}

export interface Top10Item {
  /** 1 a `size`. En listas «últimos», 1 es el más reciente; en listas de votos, el más votado. */
  posicion: number
  nombre: string
  /** Otras formas de escribirlo que se aceptan: apellido, apodo, nombre corto… */
  aliases: string[]
  /** Partido en ese cargo o elección; `null` si fue independiente o su partido no está en el catálogo. */
  partido: Partido | null
  /** Lo que el jugador ve ANTES de adivinar: periodo, votos, año… */
  pista_visible: string
  /** Dato detallado que se revela al acertar o al rendirse. */
  dato_extra: string
}

export interface Top10Challenge {
  id: string
  /** Título en mayúsculas, como en el tablero: `ÚLTIMOS 10 PRESIDENTES DE COLOMBIA`. */
  titulo: string
  /** Aclara el orden y cualquier criterio (p. ej. «cada persona cuenta una vez»). */
  subtitulo: string
  categoria: Top10Category
  size: Top10Size
  items: Top10Item[]
  /** De dónde salen los datos (página y tipo de conteo). */
  fuente: string
  /** Advertencia opcional sobre los datos (conteos distintos entre fuentes, huecos…). */
  nota?: string
}
