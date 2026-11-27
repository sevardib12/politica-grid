import type { Politician } from './types.ts'
import { presidencia } from './records/presidencia.ts'
import { congreso } from './records/congreso.ts'
import { territorial } from './records/territorial.ts'
import { gabinete } from './records/gabinete.ts'
import { mesas } from './records/mesas.ts'
import { regional } from './records/regional.ts'
import { ministros } from './records/ministros.ts'
import { administrativos } from './records/administrativos.ts'
import { congresistas, conComplementos } from './records/congresistas.ts'
import { m19 } from './records/m19.ts'
import { up } from './records/up.ts'
import { ministrosTablas } from './records/ministros-tablas.ts'
import { CORRECCIONES, conCorreccion } from './records/correcciones.ts'
import { FOTOS } from './photos.ts'

export type { Politician } from './types.ts'

/**
 * Base de datos de políticos colombianos (1980s-2026).
 *
 * Los datos se compilaron de memoria y se contrastaron en parte con fuentes
 * públicas (listas de presidentes del Senado y la Cámara, elecciones de 2026,
 * mesas directivas recientes). Criterio editorial: ante la duda, el dato se
 * omite; así el juego nunca valida una respuesta dudosa, a costa de que
 * alguna respuesta correcta quede fuera del solucionario.
 */
const SIN_FOTO: readonly Politician[] = [
  ...presidencia,
  ...congreso,
  ...m19,
  ...up,
  ...mesas,
  ...territorial,
  ...gabinete,
  ...ministros,
  ...ministrosTablas,
  ...administrativos,
  ...regional,
  ...congresistas,
]
  .map(conComplementos)
  // Partidos verificados que corrigen la fuente original (coaliciones, militancia real): ver records/correcciones.ts.
  .map(conCorreccion)

// Los retratos (`foto_url`, `foto_fuente`, `foto_origen`) los genera
// `scripts/fetch-official-photos.mjs` en `photos.ts`; aquí se fusionan con
// cada ficha para que `Politician` los lleve directamente.
export const POLITICIANS: readonly Politician[] = SIN_FOTO.map((p) =>
  FOTOS[p.id] ? { ...p, ...FOTOS[p.id] } : p,
)

const ids = new Set<string>()
for (const p of POLITICIANS) {
  if (ids.has(p.id)) throw new Error(`id duplicado en la base de datos: ${p.id}`)
  ids.add(p.id)
}
for (const id of Object.keys(CORRECCIONES)) {
  if (!ids.has(id)) throw new Error(`corrección para un id que no existe: ${id}`)
}

export const POLITICIANS_BY_ID: ReadonlyMap<string, Politician> = new Map(
  POLITICIANS.map((p) => [p.id, p]),
)

/**
 * Políticos con los que se generan y calibran los tableros: todos menos las
 * fichas agregadas en bloque (`perfil_regional`: regionales y congresistas de
 * Congreso Visible). Esas siguen valiendo como respuesta.
 */
export const POLITICOS_TABLERO: readonly Politician[] = POLITICIANS.filter((p) => !p.perfil_regional)
