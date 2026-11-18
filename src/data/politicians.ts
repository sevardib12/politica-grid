import type { Politician } from './types.ts'
import { presidencia } from './records/presidencia.ts'
import { congreso } from './records/congreso.ts'
import { territorial } from './records/territorial.ts'
import { gabinete } from './records/gabinete.ts'
import { mesas } from './records/mesas.ts'
import { regional } from './records/regional.ts'
import { ministros } from './records/ministros.ts'
import { administrativos } from './records/administrativos.ts'
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
  ...mesas,
  ...territorial,
  ...gabinete,
  ...ministros,
  ...administrativos,
  ...regional,
]

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

export const POLITICIANS_BY_ID: ReadonlyMap<string, Politician> = new Map(
  POLITICIANS.map((p) => [p.id, p]),
)

/**
 * Políticos con los que se generan y calibran los tableros: todos menos las
 * fichas de perfil regional. Las regionales siguen valiendo como respuesta.
 */
export const POLITICOS_TABLERO: readonly Politician[] = POLITICIANS.filter((p) => !p.perfil_regional)
