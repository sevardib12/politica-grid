import { POLITICIANS } from '../data/politicians.ts'
import {
  COMISIONES,
  DECADAS,
  DEPARTAMENTOS,
  CIUDADES,
  GOBIERNOS,
  HITOS,
  MINISTERIOS,
  ORGANOS_CONTROL,
  PARTIDOS,
  REGIONES,
  type Partido,
  type Politician,
} from '../data/types.ts'

/** Familias de criterios: sirven para variar los tableros. */
export type CategoriaCriterio =
  | 'partido'
  | 'congreso'
  | 'mesa'
  | 'comision'
  | 'camara'
  | 'territorial'
  | 'presidencial'
  | 'ejecutivo'
  | 'control'
  | 'decada'
  | 'hito'
  | 'perfil'

export interface Criterion {
  id: string
  /** Nombre legible: "Representante por Antioquia". */
  label: string
  /** Etiqueta de categoría para los encabezados: "CÁMARA • ANTIOQUIA". */
  tag: string
  categoria: CategoriaCriterio
  /** Solo en criterios de partido: el partido o movimiento que representan. */
  partido?: Partido
  /** Criterios de nicho (circunscripción, comisión, asamblea, década exacta). */
  specific: boolean
  /** Ids de criterios que este criterio implica (cuerpo ⊆ implicado). */
  implies: string[]
  test: (p: Politician) => boolean
  /** Por qué un político cumple el criterio (para tooltips y solucionario). */
  explain: (p: Politician) => string[]
}

const ETIQUETA_CONTROL: Record<(typeof ORGANOS_CONTROL)[number], string> = {
  Procurador: 'Procurador/a General',
  Contralor: 'Contralor/a General',
  'Fiscal General': 'Fiscal General',
  'Defensor del Pueblo': 'Defensor/a del Pueblo',
  Registrador: 'Registrador/a Nacional',
}

const listar = (items: readonly string[]) => items.join(', ')
const up = (s: string) => s.toUpperCase()

function criterion(c: Criterion): Criterion {
  return c
}

/** Construye el catálogo completo de criterios a partir de los vocabularios. */
function buildAll(): Criterion[] {
  const out: Criterion[] = []

  // ── Partidos ────────────────────────────────────────────────────────────
  for (const partido of PARTIDOS) {
    out.push(
      criterion({
        id: `partido:${partido}`,
        label: partido,
        tag: 'PARTIDO',
        categoria: 'partido',
        partido,
        specific: false,
        implies: [],
        test: (p) => p.partidos.includes(partido),
        explain: (p) => [`Militó o fue avalado por ${partido}${p.partidos.length > 1 ? ` (también: ${listar(p.partidos.filter((x) => x !== partido))})` : ''}`],
      }),
    )
  }

  // ── Congreso ────────────────────────────────────────────────────────────
  out.push(
    criterion({
      id: 'senador',
      label: 'Senador/a',
      tag: 'CONGRESO',
      categoria: 'congreso',
      specific: false,
      implies: [],
      test: (p) => p.congreso.senador,
      explain: () => ['Senador/a de la República'],
    }),
    criterion({
      id: 'representante',
      label: 'Representante a la Cámara',
      tag: 'CONGRESO',
      categoria: 'congreso',
      specific: false,
      implies: [],
      test: (p) => p.congreso.representante_camara,
      explain: (p) => [
        p.congreso.departamentos_camara.length
          ? `Representante a la Cámara por ${listar(p.congreso.departamentos_camara)}`
          : 'Representante a la Cámara',
      ],
    }),
    criterion({
      id: 'pres_senado',
      label: 'Presidente/a del Senado',
      tag: 'MESA DIRECTIVA',
      categoria: 'mesa',
      specific: false,
      implies: ['senador'],
      test: (p) => p.congreso.presidente_senado,
      explain: () => ['Presidente/a del Senado'],
    }),
    criterion({
      id: 'pres_camara',
      label: 'Presidente/a de la Cámara',
      tag: 'MESA DIRECTIVA',
      categoria: 'mesa',
      specific: false,
      implies: ['representante'],
      test: (p) => p.congreso.presidente_camara,
      explain: () => ['Presidente/a de la Cámara de Representantes'],
    }),
    criterion({
      id: 'vice_congreso',
      label: 'Vicepresidente/a del Congreso',
      tag: 'MESA DIRECTIVA',
      categoria: 'mesa',
      specific: false,
      implies: [],
      test: (p) => p.congreso.vicepresidente_congreso,
      explain: () => ['Vicepresidente/a en la mesa directiva de Senado o Cámara'],
    }),
    criterion({
      id: 'comision',
      label: 'Presidente/a de comisión',
      tag: 'COMISIÓN',
      categoria: 'comision',
      specific: false,
      implies: [],
      test: (p) => p.congreso.presidente_comision.length > 0,
      explain: (p) => [`Presidió: ${listar(p.congreso.presidente_comision)}`],
    }),
  )
  for (const depto of DEPARTAMENTOS) {
    out.push(
      criterion({
        id: `rep:${depto}`,
        label: `Representante por ${depto}`,
        tag: `CÁMARA • ${up(depto)}`,
        categoria: 'camara',
        specific: true,
        implies: ['representante'],
        test: (p) => p.congreso.departamentos_camara.includes(depto),
        explain: () => [`Representante a la Cámara por ${depto}`],
      }),
    )
  }
  for (const comision of COMISIONES) {
    out.push(
      criterion({
        id: `comision:${comision}`,
        label: `Presidente/a de ${comision}`,
        tag: 'COMISIÓN',
        categoria: 'comision',
        specific: true,
        implies: ['comision'],
        test: (p) => p.congreso.presidente_comision.includes(comision),
        explain: () => [`Presidió la ${comision}`],
      }),
    )
  }

  // ── Poder territorial ───────────────────────────────────────────────────
  out.push(
    criterion({
      id: 'concejal',
      label: 'Concejal',
      tag: 'TERRITORIAL',
      categoria: 'territorial',
      specific: false,
      implies: [],
      test: (p) => p.territorial.concejal.length > 0,
      explain: (p) => [`Concejal de ${listar(p.territorial.concejal)}`],
    }),
    criterion({
      id: 'diputado',
      label: 'Diputado/a de Asamblea',
      tag: 'ASAMBLEA',
      categoria: 'territorial',
      specific: true,
      implies: [],
      test: (p) => p.territorial.diputado_asamblea.length > 0,
      explain: (p) => [`Diputado/a de la Asamblea de ${listar(p.territorial.diputado_asamblea)}`],
    }),
    criterion({
      id: 'alcalde',
      label: 'Alcalde/sa',
      tag: 'TERRITORIAL',
      categoria: 'territorial',
      specific: false,
      implies: [],
      test: (p) => p.territorial.alcalde.length > 0,
      explain: (p) => [`Alcalde/sa de ${listar(p.territorial.alcalde)}`],
    }),
    criterion({
      id: 'gobernador',
      label: 'Gobernador/a',
      tag: 'TERRITORIAL',
      categoria: 'territorial',
      specific: false,
      implies: [],
      test: (p) => p.territorial.gobernador.length > 0,
      explain: (p) => [`Gobernador/a de ${listar(p.territorial.gobernador)}`],
    }),
    criterion({
      id: 'edil',
      label: 'Edil/esa',
      tag: 'TERRITORIAL',
      categoria: 'territorial',
      specific: false,
      implies: [],
      test: (p) => p.territorial.edil,
      explain: () => ['Edil/esa de una junta administradora local'],
    }),
  )
  for (const ciudad of CIUDADES) {
    out.push(
      criterion({
        id: `concejal:${ciudad}`,
        label: `Concejal de ${ciudad}`,
        tag: `CONCEJO • ${up(ciudad)}`,
        categoria: 'territorial',
        specific: false,
        implies: ['concejal'],
        test: (p) => p.territorial.concejal.includes(ciudad),
        explain: () => [`Concejal de ${ciudad}`],
      }),
      criterion({
        id: `alcalde:${ciudad}`,
        label: `Alcalde/sa de ${ciudad}`,
        tag: `ALCALDÍA • ${up(ciudad)}`,
        categoria: 'territorial',
        specific: false,
        implies: ['alcalde'],
        test: (p) => p.territorial.alcalde.includes(ciudad),
        explain: () => [`Alcalde/sa de ${ciudad}`],
      }),
    )
  }
  for (const depto of DEPARTAMENTOS) {
    out.push(
      criterion({
        id: `diputado:${depto}`,
        label: `Diputado/a de ${depto}`,
        tag: `ASAMBLEA • ${up(depto)}`,
        categoria: 'territorial',
        specific: true,
        implies: ['diputado'],
        test: (p) => p.territorial.diputado_asamblea.includes(depto),
        explain: () => [`Diputado/a de la Asamblea de ${depto}`],
      }),
      criterion({
        id: `gobernador:${depto}`,
        label: `Gobernador/a de ${depto}`,
        tag: `GOBERNACIÓN • ${up(depto)}`,
        categoria: 'territorial',
        specific: false,
        implies: ['gobernador'],
        test: (p) => p.territorial.gobernador.includes(depto),
        explain: () => [`Gobernador/a de ${depto}`],
      }),
    )
  }

  // ── Carrera presidencial ────────────────────────────────────────────────
  out.push(
    criterion({
      id: 'candidato',
      label: 'Candidato/a presidencial',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      implies: [],
      test: (p) => p.presidencial.candidato_primera_vuelta,
      explain: () => ['Candidato/a presidencial'],
    }),
    criterion({
      id: 'segunda_vuelta',
      label: 'Llegó a segunda vuelta',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      implies: ['candidato'],
      test: (p) => p.presidencial.segunda_vuelta,
      explain: () => ['Pasó a la segunda vuelta presidencial'],
    }),
    criterion({
      id: 'formula_vp',
      label: 'Fórmula vicepresidencial',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      implies: [],
      test: (p) => p.presidencial.formula_vicepresidencial,
      explain: () => ['Fue fórmula vicepresidencial'],
    }),
    criterion({
      id: 'consulta',
      label: 'Consulta interpartidista',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      implies: [],
      test: (p) => p.presidencial.consulta_interpartidista,
      explain: () => ['Participó en una consulta interpartidista'],
    }),
    criterion({
      id: 'presidente',
      label: 'Presidente/a de la República',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      implies: ['candidato'],
      test: (p) => p.presidencial.presidente,
      explain: () => ['Presidente/a de la República'],
    }),
    criterion({
      id: 'vicepresidente',
      label: 'Vicepresidente/a de la República',
      tag: 'PRESIDENCIAL',
      categoria: 'presidencial',
      specific: false,
      // No implica "fórmula": hubo vicepresidentes designados por el Congreso.
      implies: [],
      test: (p) => p.presidencial.vicepresidente,
      explain: () => ['Vicepresidente/a de la República'],
    }),
  )

  // ── Ejecutivo, diplomacia y control ─────────────────────────────────────
  out.push(
    criterion({
      id: 'ministro',
      label: 'Ministro/a',
      tag: 'GABINETE',
      categoria: 'ejecutivo',
      specific: false,
      implies: [],
      test: (p) => p.ejecutivo.ministerios.length > 0,
      explain: (p) => [`Ministro/a de ${listar(p.ejecutivo.ministerios)}`],
    }),
    criterion({
      id: 'embajador',
      label: 'Embajador/a',
      tag: 'DIPLOMACIA',
      categoria: 'ejecutivo',
      specific: false,
      implies: [],
      test: (p) => p.ejecutivo.embajador,
      explain: () => ['Embajador/a de Colombia'],
    }),
    criterion({
      id: 'control',
      label: 'Jefe/a de órgano de control',
      tag: 'CONTROL',
      categoria: 'control',
      specific: false,
      implies: [],
      test: (p) => p.ejecutivo.organos_control.length > 0,
      explain: (p) => [`Dirigió: ${listar(p.ejecutivo.organos_control)}`],
    }),
  )
  for (const ministerio of MINISTERIOS) {
    out.push(
      criterion({
        id: `ministerio:${ministerio}`,
        label: `Ministro/a de ${ministerio}`,
        tag: `MINISTERIO • ${up(ministerio)}`,
        categoria: 'ejecutivo',
        specific: false,
        implies: ['ministro'],
        test: (p) => p.ejecutivo.ministerios.includes(ministerio),
        explain: () => [`Ministro/a de ${ministerio}`],
      }),
    )
  }
  for (const gobierno of GOBIERNOS) {
    out.push(
      criterion({
        id: `gabinete:${gobierno}`,
        label: `Gabinete de ${gobierno}`,
        tag: `GOBIERNO • ${up(gobierno)}`,
        categoria: 'ejecutivo',
        specific: false,
        implies: [],
        test: (p) => p.ejecutivo.gobiernos_gabinete.includes(gobierno),
        explain: (p) => [
          p.ejecutivo.ministerios.length
            ? `Gabinete de ${gobierno} (${listar(p.ejecutivo.ministerios)})`
            : `Gabinete de ${gobierno}`,
        ],
      }),
    )
  }
  for (const organo of ORGANOS_CONTROL) {
    out.push(
      criterion({
        id: `control:${organo}`,
        label: ETIQUETA_CONTROL[organo],
        tag: 'CONTROL',
        categoria: 'control',
        specific: false,
        implies: ['control'],
        test: (p) => p.ejecutivo.organos_control.includes(organo),
        explain: () => [`Ejerció como ${organo}`],
      }),
    )
  }

  // ── Décadas ─────────────────────────────────────────────────────────────
  for (const decada of DECADAS) {
    out.push(
      criterion({
        id: `decada:${decada}`,
        label: `Activo/a en los ${decada}`,
        tag: 'DÉCADA',
        categoria: 'decada',
        specific: false,
        implies: [],
        test: (p) => p.decadas_activo.includes(decada),
        explain: (p) => [`Activo/a en: ${listar(p.decadas_activo)}`],
      }),
      criterion({
        id: `decada_solo:${decada}`,
        label: `Solo activo/a en los ${decada}`,
        tag: 'DÉCADA EXACTA',
        categoria: 'decada',
        specific: true,
        implies: [`decada:${decada}`],
        test: (p) => p.decadas_activo.length === 1 && p.decadas_activo[0] === decada,
        explain: () => [`Su actividad pública se concentra solo en los ${decada}`],
      }),
    )
  }

  // ── Hitos ───────────────────────────────────────────────────────────────
  for (const hito of HITOS) {
    out.push(
      criterion({
        id: `hito:${hito}`,
        label: hito,
        tag: 'HITO',
        categoria: 'hito',
        specific: false,
        implies: [],
        test: (p) => p.hitos.includes(hito),
        explain: () => [hito],
      }),
    )
  }

  // ── Origen y perfil ─────────────────────────────────────────────────────
  for (const region of REGIONES) {
    out.push(
      criterion({
        id: `region:${region}`,
        label: `Origen: ${region}`,
        tag: 'ORIGEN',
        categoria: 'perfil',
        specific: false,
        implies: [],
        test: (p) => p.region_origen === region,
        explain: () => [`Región de origen: ${region}`],
      }),
    )
  }
  out.push(
    criterion({
      id: 'mujer',
      label: 'Mujer',
      tag: 'PERFIL',
      categoria: 'perfil',
      specific: false,
      implies: [],
      test: (p) => p.genero === 'Femenino',
      explain: () => ['Mujer'],
    }),
  )

  return out
}

/**
 * Catálogo de criterios con al menos un político en la base de datos.
 * Los criterios vacíos (p. ej. un ministerio sin nadie registrado) se
 * descartan para que nunca salgan en un tablero.
 */
export const CRITERIA: readonly Criterion[] = buildAll().filter((c) =>
  POLITICIANS.some((p) => c.test(p)),
)

export const CRITERIA_BY_ID: ReadonlyMap<string, Criterion> = new Map(CRITERIA.map((c) => [c.id, c]))

/** Cierre transitivo de `implies` (ids implicados directa o indirectamente). */
export function impliedClosure(id: string): Set<string> {
  const seen = new Set<string>()
  const stack = [id]
  while (stack.length) {
    const cur = CRITERIA_BY_ID.get(stack.pop() as string)
    if (!cur) continue
    for (const next of cur.implies) {
      if (!seen.has(next)) {
        seen.add(next)
        stack.push(next)
      }
    }
  }
  return seen
}

/**
 * Dos criterios son redundantes si uno implica al otro: cruzarlos no aporta
 * información (p. ej. "Senador/a" × "Presidente/a del Senado").
 */
export function areRedundant(a: Criterion, b: Criterion): boolean {
  if (a.id === b.id) return true
  return impliedClosure(a.id).has(b.id) || impliedClosure(b.id).has(a.id)
}

export function criterionOrThrow(id: string): Criterion {
  const c = CRITERIA_BY_ID.get(id)
  if (!c) throw new Error(`Criterio desconocido: ${id}`)
  return c
}
