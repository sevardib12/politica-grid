// Base de datos de Política Top 10: retos de 10 y de 5 filas, en cuatro categorías.
//
// Cada fila lleva `posicion`, `nombre`, `aliases`, `partido`, `pista_visible` (lo que se ve antes
// de acertar) y `dato_extra` (lo que se revela al acertar). Los datos viven en `src/data/top10/`:
//
//   cargos-ejecutivo.ts         presidentes, vicepresidentes y ministerios
//   cargos-territorial.ts       alcaldes de Bogotá, Medellín, Cali y Barranquilla; gobernadores de Antioquia
//   cargos-congreso-control.ts  presidentes del Senado y la Cámara, Procurador, Contralor, Fiscal
//   votos.ts                    Senado 2014/2018/2022 y alcaldes de Bogotá por votación
//   presidenciales.ts           primeras y segundas vueltas, mujeres, derrotados
//
// `npm run validate:top10` comprueba la estructura (posiciones, tamaños, aliases sin choques).

import { CARGOS_CONGRESO_CONTROL } from './top10/cargos-congreso-control.ts'
import { CARGOS_EJECUTIVO } from './top10/cargos-ejecutivo.ts'
import { CARGOS_TERRITORIAL } from './top10/cargos-territorial.ts'
import { PRESIDENCIALES } from './top10/presidenciales.ts'
import { VOTOS_ALCALDIAS, VOTOS_CONGRESO } from './top10/votos.ts'
import type { Top10Challenge } from './top10Types.ts'

export type { Top10Category, Top10Challenge, Top10Item, Top10Size } from './top10Types.ts'
export { TOP10_CATEGORY_LABEL } from './top10Types.ts'

export const TOP10_LISTS: readonly Top10Challenge[] = [
  ...CARGOS_EJECUTIVO,
  ...CARGOS_TERRITORIAL,
  ...CARGOS_CONGRESO_CONTROL,
  ...VOTOS_CONGRESO,
  ...VOTOS_ALCALDIAS,
  ...PRESIDENCIALES,
]

export const TOP10_BY_ID: ReadonlyMap<string, Top10Challenge> = new Map(TOP10_LISTS.map((l) => [l.id, l]))

if (TOP10_BY_ID.size !== TOP10_LISTS.length) {
  throw new Error('top10Lists.ts: hay ids de lista duplicados')
}
