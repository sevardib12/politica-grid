import {
  DECADAS,
  type Decada,
  type Hito,
  type Politician,
  type Congreso,
  type Territorial,
  type Presidencial,
  type Ejecutivo,
  type Genero,
  type Partido,
  type Region,
} from './types.ts'

/**
 * Entrada compacta: sólo se escribe lo que es verdadero. `build` rellena el
 * resto con valores vacíos para producir un `Politician` completo y estricto.
 */
export interface PoliticianInput {
  id: string
  nombre: string
  alias?: string
  genero: Genero
  region: Region
  partidos: Partido[]
  congreso?: Partial<Congreso>
  territorial?: Partial<Territorial>
  presidencial?: Partial<Presidencial>
  ejecutivo?: Partial<Ejecutivo>
  decadas: Decada[]
  hitos?: Hito[]
  perfil_regional?: boolean
}

/**
 * Genera décadas a partir de rangos legibles: `d('1990s-2000s', '2020s')`.
 */
export function d(...rangos: string[]): Decada[] {
  const out = new Set<Decada>()
  for (const rango of rangos) {
    const [desde, hasta = desde] = rango.split('-')
    const i = DECADAS.indexOf(desde as Decada)
    const j = DECADAS.indexOf(hasta as Decada)
    if (i < 0 || j < 0 || j < i) throw new Error(`Rango de décadas inválido: ${rango}`)
    for (let k = i; k <= j; k++) out.add(DECADAS[k])
  }
  return DECADAS.filter((x) => out.has(x))
}

export function build(input: PoliticianInput): Politician {
  const hitos = new Set<Hito>(input.hitos ?? [])
  // "Militó en 3 o más partidos" se deriva de `partidos`, no se escribe a mano.
  if (new Set(input.partidos).size >= 3) hitos.add('Militó en 3 o más partidos')

  return {
    id: input.id,
    nombre: input.nombre,
    ...(input.alias ? { alias: input.alias } : {}),
    genero: input.genero,
    region_origen: input.region,
    partidos: input.partidos,
    congreso: {
      senador: false,
      representante_camara: false,
      departamentos_camara: [],
      presidente_senado: false,
      presidente_camara: false,
      vicepresidente_congreso: false,
      presidente_comision: [],
      ...input.congreso,
    },
    territorial: {
      concejal: [],
      diputado_asamblea: [],
      alcalde: [],
      gobernador: [],
      edil: false,
      ...input.territorial,
    },
    presidencial: {
      candidato_primera_vuelta: false,
      segunda_vuelta: false,
      formula_vicepresidencial: false,
      consulta_interpartidista: false,
      presidente: false,
      vicepresidente: false,
      ...input.presidencial,
    },
    ejecutivo: {
      ministerios: [],
      gobiernos_gabinete: [],
      embajador: false,
      organos_control: [],
      presidente: input.presidencial?.presidente ?? false,
      vicepresidente: input.presidencial?.vicepresidente ?? false,
      departamentos_administrativos: [],
      ...input.ejecutivo,
    },
    decadas_activo: input.decadas,
    hitos: [...hitos],
    ...(input.perfil_regional ? { perfil_regional: true } : {}),
  }
}
