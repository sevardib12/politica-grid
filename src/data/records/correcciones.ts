import type { Decada, Gobierno, Hito, Ministerio, Partido, Politician } from '../types.ts'

// Correcciones de partido verificadas, cada una con su fuente. Se aplican después de construir todas las
// fichas (ver politicians.ts) y no tocan los archivos generados, así que sobreviven a una nueva descarga.
//
// Tres reglas guían estas correcciones:
//   1. El partido de una persona es su militancia, no el del gobierno en el que trabajó.
//   2. Quien llegó al Congreso en una lista de coalición conserva su partido de origen: no pasa al partido
//      mayoritario de la coalición. Congreso Visible registra la lista («Pacto Histórico Coalición»,
//      «Alianza por Colombia»…), no el partido; por eso esas fichas quedaban sin partido o en el de la lista.
//   3. Ante la duda, no se corrige: se deja como estaba y se anota en el README como pendiente.
//   4. El Pacto Histórico dejó de ser una coalición: el Polo, la UP y el PCC se fusionaron en él en 2025,
//      Progresistas se sumó en diciembre de 2025 y Colombia Humana en marzo de 2026 (Wikipedia: «Pacto
//      Histórico (coalición política)»). Quien viene de esos partidos y está hoy en el Pacto lleva los dos:
//      el de origen y el Pacto. No cuenta quien salió antes (Robledo, Navarro) ni el MAIS, que no se fusionó.
//
// `agregar` suma el partido de origen que faltaba; `quitar` saca el partido que se había asignado por la
// lista de coalición. El primero de `partidos` sigue siendo el principal, salvo que `principal` lo cambie.

interface Correccion {
  agregar?: Partido[]
  quitar?: Partido[]
  /** Partido que pasa al frente (da el color del avatar). */
  principal?: Partido
  /** Cargos de gabinete que faltaban en una ficha que ya existía. */
  ministerios?: Ministerio[]
  gobiernos?: Gobierno[]
  decadas?: Decada[]
  hitos?: Hito[]
  fuente: string
}

const SENADO_2026 = 'Senado de la República: lista de senadores 2026–2030 con su partido (senado.gov.co, consultada el 25-11-2026)'
const TABLA_HACIENDA = 'Wikipedia (es): «Ministerio de Hacienda y Crédito Público de Colombia», tabla de ministros con columna de partido'
const ANEXO_INTERIOR = 'Wikipedia (es): «Anexo:Ministros del Interior de Colombia», tabla 1995–hoy'
const ANEXO_JUSTICIA = 'Wikipedia (es): «Anexo:Ministros de Justicia de Colombia»'
const ANEXO_EDUCACION = 'Wikipedia (es): «Anexo:Ministros de Educación Nacional (Colombia)»'
const ANEXO_AGRICULTURA = 'Wikipedia (es): «Anexo:Ministros de Agricultura de Colombia»'
const TABLA = (pagina: string) => `Wikipedia (es): «${pagina}», tabla de ministros`
const ficha = (titulo: string) => `Wikipedia (es): «${titulo}», ficha (infobox) y texto del artículo`
const CH_2022 = 'Wikipedia (es): «Colombia Humana», elegidos en 2022 «con el aval de Colombia Humana dentro de la coalición»'
const PACTO_SENADO_2022 = 'Wikipedia (es): «Pacto Histórico (coalición política)», tabla de senadores 2022 con su partido'
const FICHA_UP = 'Wikipedia (es): «Unión Patriótica (Colombia)», ficha: dirigentes del partido'
const FICHA_PCC = 'Wikipedia (es): «Partido Comunista Colombiano», ficha: dirigentes del partido'
const FUSION = 'el partido se fusionó en el Pacto Histórico en 2025 (Wikipedia: «Partido Comunista Colombiano», ficha)'

export const CORRECCIONES: Readonly<Record<string, Correccion>> = {
  // Senado 2026–2030: elegidos en listas de coalición que la base tenía sin partido.
  'rua-sanchez-luis': { agregar: ['Alianza Social Independiente'], fuente: SENADO_2026 },
  'escobar-ortiz-wilder': { agregar: ['Alianza Social Independiente'], fuente: SENADO_2026 },
  'moreno-hurtado-gustavo': { agregar: ['Alianza Social Independiente'], fuente: SENADO_2026 },
  'pedraza-sandoval-jennifer': { agregar: ['Dignidad y Compromiso'], fuente: SENADO_2026 },
  'villalba-gomez-maria': { agregar: ['Nuevo Liberalismo'], fuente: SENADO_2026 },
  'padilla-villarraga-andrea': { agregar: ['Alianza Verde'], fuente: SENADO_2026 },
  'enriquez-caicedo-carlos': { agregar: ['Alianza Verde'], fuente: SENADO_2026 },
  'baute-gonzalez-gonzalo': { agregar: ['Cambio Radical'], fuente: SENADO_2026 },
  'espitia-cabrales-edgardo': { agregar: ['Cambio Radical'], fuente: SENADO_2026 },
  'lopez-rodriguez-nelson': { agregar: ['Cambio Radical'], fuente: SENADO_2026 },

  // Senado 2026–2030: elegidos en la lista del Pacto Histórico por un partido que se fusionó en él (regla 4):
  // conservan el Pacto y suman el de origen.
  'avella-esquivel-aida': { agregar: ['Unión Patriótica'], principal: 'Unión Patriótica', fuente: `${SENADO_2026}; ${FICHA_UP} (presidenta desde 2014)` },
  'benavides-mora-carlos': { agregar: ['Polo Democrático'], fuente: SENADO_2026 },
  'florez-hernandez-alex': { agregar: ['Colombia Humana'], fuente: `${SENADO_2026}; ${CH_2022}` },
  'florez-porras-pedro': { agregar: ['Colombia Humana'], fuente: `${SENADO_2026}; ${CH_2022}` },
  'silva-idrobo-ferney': { agregar: ['Colombia Humana'], fuente: SENADO_2026 },
  // Del MAIS, que no se fusionó en el Pacto: queda en su partido.
  'peralta-martha': { quitar: ['Pacto Histórico'], fuente: SENADO_2026 },

  // Congreso 2022–2026: elegidos en la coalición del Pacto con el aval de un partido que luego se fusionó.
  'florez-schneider-gloria': { agregar: ['Colombia Humana'], fuente: CH_2022 },
  'zuleta-lopez-isabel': { agregar: ['Colombia Humana'], fuente: `${CH_2022}; ${PACTO_SENADO_2022}` },
  'hernandez-silva-yuly': { agregar: ['Colombia Humana'], fuente: CH_2022 },
  'daza-guevara-robert': { agregar: ['Polo Democrático'], fuente: PACTO_SENADO_2022 },
  'escaf-tijerino-agmeth': { agregar: ['Colombia Humana'], fuente: CH_2022 },
  'carrascal-rojas-maria': { agregar: ['Colombia Humana'], fuente: CH_2022 },
  'bastidas-rosero-jorge': { agregar: ['Colombia Humana'], fuente: CH_2022 },
  'ramirez-boscan-carmen': { agregar: ['Colombia Humana'], fuente: CH_2022 },

  // Dirigentes de la UP y del PCC que ya estaban en la base solo con el Pacto.
  'becerra-yanez-gabriel': { agregar: ['Unión Patriótica', 'Partido Comunista Colombiano', 'Polo Democrático'], fuente: `${ficha('Gabriel Becerra')}: secretario general de la UP (2017), dirigente del PCC, dirección nacional del Polo (2005)` },
  'quiroga-carrillo-jahel': { agregar: ['Unión Patriótica'], fuente: `${ficha('Jahel Quiroga')}: «perteneciente al partido Unión Patriótica»; ${FICHA_UP}` },
  'sanchez-barreto-heidy': { agregar: ['Unión Patriótica'], fuente: FICHA_UP },
  'londono-ocampo-maria': { agregar: ['Partido Comunista Colombiano'], fuente: FICHA_PCC },

  // Militantes de esos partidos que la base tenía sin el Pacto y cuyo artículo lo registra.
  'ines-ramirez-gloria': { agregar: ['Partido Comunista Colombiano', 'Unión Patriótica', 'Pacto Histórico'], fuente: `${ficha('Gloria Inés Ramírez')}: PCC 2012–2025 y la UP; ${FICHA_PCC}; ${FUSION}` },
  'german-umana-german': { agregar: ['Pacto Histórico'], fuente: `${ficha('Germán Umaña')}: «miembro del movimiento político Pacto Histórico»` },
  'bonilla-gonzalez-ricardo': { agregar: ['Pacto Histórico'], fuente: `${ficha('Ricardo Bonilla González')}: afiliación Pacto Histórico` },
  'rusinque-cielo': { agregar: ['Pacto Histórico'], fuente: `${ficha('Cielo Rusinque')}: afiliación Pacto Histórico` },
  'alfonso-jaramillo-guillermo': { agregar: ['Progresistas', 'Pacto Histórico'], fuente: `${ficha('Guillermo Alfonso Jaramillo')}: Progresistas (2011–2014), Pacto Histórico (2021–)` },

  // Progresistas: el movimiento de Petro (2011) y el partido de María José Pizarro (2025).
  'petro-urrego': { agregar: ['Progresistas'], fuente: 'Wikipedia (es): «Colombia Humana» (fundada en 2011 como «Movimiento Progresistas», con Petro como líder)' },
  'pizarro-maria-jose': { agregar: ['Progresistas'], fuente: 'Wikipedia (es): «Pacto Histórico (coalición política)», ficha (Progresistas) y tabla de senadores (MAIS–Progresistas)' },

  // UP: congresista que la base tenía sin partido.
  'sarmiento-bohorquez-octavio': { agregar: ['Unión Patriótica', 'Partido Liberal'], fuente: `${ficha('Octavio Sarmiento Bohórquez')}: liberal; «se unió a la Unión Patriótica, partido por el cual fue elegido congresista»` },

  // Ministros de Hacienda: el partido que registra la tabla del ministerio y faltaba en la ficha.
  'hommes-rudolf': { agregar: ['Partido Liberal'], fuente: TABLA_HACIENDA },
  'ocampo-jose-antonio': { agregar: ['Partido Liberal'], fuente: TABLA_HACIENDA },
  'carrasquilla-alberto': { agregar: ['Partido Conservador'], fuente: TABLA_HACIENDA },
  'zuluaga-oscar-ivan': { agregar: ['Partido de la U'], fuente: TABLA_HACIENDA },
  'echeverry-juan-carlos': { agregar: ['Partido Conservador'], fuente: TABLA_HACIENDA },
  'cardenas-mauricio': { agregar: ['Partido Conservador'], fuente: TABLA_HACIENDA },
  'restrepo-abondano-jose': { agregar: ['Partido Conservador'], fuente: TABLA_HACIENDA },
  'guevara-castaneda-diego': { agregar: ['Colombia Humana'], fuente: TABLA_HACIENDA },

  // Ministros cuya ficha no coincidía con su artículo.
  'velez-torres-irene': { agregar: ['Pacto Histórico'], quitar: ['Colombia Humana'], fuente: ficha('Irene Vélez Torres') },
  'avila-plazas-german': { agregar: ['Polo Democrático', 'Pacto Histórico'], fuente: `${ficha('Germán Ávila Plazas')}: fue secretario general del Polo; afiliación Pacto Histórico` },
  'andres-camacho-omar': { agregar: ['Colombia Humana'], fuente: `${ficha('Omar Andrés Camacho')}: «se vinculó a la Colombia Humana y al Pacto Histórico»` },

  // Ministros del Interior que estaban en la base sin ese cargo.
  'holguin-sardi-carlos': { ministerios: ['Interior'], gobiernos: ['Uribe'], decadas: ['2000s'], fuente: ANEXO_INTERIOR },
  'valencia-cossio-fabio': { ministerios: ['Interior'], gobiernos: ['Uribe'], decadas: ['2000s'], fuente: ANEXO_INTERIOR },

  // Ministros de las otras carteras (1978–2018) que estaban en la base sin ese cargo. Cartera, periodo y
  // presidente salen de la tabla de ministros de cada cartera en Wikipedia.
  'camilo-restrepo-juan': { ministerios: ['Minas y Energía'], gobiernos: ['Gaviria'], decadas: ['1990s'], fuente: `Wikipedia (es): «Ministerio de Minas y Energía (Colombia)», tabla de ministros («Camilo Restrepo Salazar»); ${ficha('Juan Camilo Restrepo')}` },
  'fernanda-campo-maria': { agregar: ['Partido Conservador'], fuente: `${ANEXO_EDUCACION}; ${ficha('María Fernanda Campo')}` },
  'rojas-arroyo-santiago': { agregar: ['Partido Conservador'], fuente: `${TABLA('Ministerio de Comercio, Industria y Turismo')}; ${ficha('Santiago Rojas Arroyo')}` },
  'gonzalez-diaz-andres': { ministerios: ['Justicia'], gobiernos: ['Gaviria'], decadas: ['1990s'], fuente: ANEXO_JUSTICIA },
  'cuellar-bastidas-parmenio': { ministerios: ['Justicia'], gobiernos: ['Pastrana'], decadas: ['1990s'], fuente: ANEXO_JUSTICIA },
  'valdivieso-sarmiento-alfonso': { ministerios: ['Educación'], gobiernos: ['Gaviria'], decadas: ['1990s'], fuente: ANEXO_EDUCACION },
  'restrepo-gallego-griselda': { ministerios: ['Trabajo'], gobiernos: ['Santos'], decadas: ['2010s'], fuente: TABLA('Ministerio del Trabajo') },
  'londono-capurro-luis': { ministerios: ['Agricultura'], gobiernos: ['Turbay'], decadas: ['1980s'], fuente: ANEXO_AGRICULTURA },
  // Ministerio de Ambiente, Vivienda y Desarrollo Territorial (2003–2011): cuenta como Ambiente y como Vivienda.
  'lozano-ramirez-juan': { ministerios: ['Ambiente', 'Vivienda'], gobiernos: ['Uribe'], decadas: ['2000s'], fuente: TABLA('Ministerio de Ambiente y Desarrollo Sostenible') },
  'suarez-perez-sandra': { agregar: ['Primero Colombia'], fuente: TABLA('Ministerio de Ambiente y Desarrollo Sostenible') },
  'gomez-martinez-juan': { ministerios: ['Transporte'], gobiernos: ['Samper'], decadas: ['1990s'], fuente: 'Wikipedia (es): «Anexo:Ministros de Transporte de Colombia»' },
  // Comercio Exterior (1991–2002) y Desarrollo Económico (hasta 2002) se fusionaron en Comercio, Industria y Turismo.
  'ramos-botero': { ministerios: ['Comercio'], gobiernos: ['Samper'], decadas: ['1990s'], fuente: TABLA('Ministerio de Comercio, Industria y Turismo') },
  'maria-orozco-angela': { gobiernos: ['Pastrana'], decadas: ['2000s'], fuente: TABLA('Ministerio de Comercio, Industria y Turismo') },
  // Estaba dos veces (también como ficha del M-19); se dejó una. Su ficha: «Alianza Democrática M-19 (1991–1992)»
  // y diputado de la Asamblea Nacional Constituyente de 1991; ministro de Minas de Betancur (1984–1985).
  'alvaro-leyva-alvaro': { agregar: ['AD M-19'], hitos: ['Constituyente de 1991'], ministerios: ['Minas y Energía'], gobiernos: ['Betancur'], decadas: ['1980s', '1990s'], fuente: ficha('Álvaro Leyva') },
}

/** Aplica la corrección de una ficha, si la tiene, y recalcula el hito que depende del número de partidos. */
export function conCorreccion(p: Politician): Politician {
  const c = CORRECCIONES[p.id]
  if (!c) return p
  const quitar = new Set(c.quitar ?? [])
  const partidos = p.partidos.filter((x) => !quitar.has(x))
  for (const x of c.agregar ?? []) if (!partidos.includes(x)) partidos.push(x)
  if (c.principal) partidos.sort((a, b) => Number(b === c.principal) - Number(a === c.principal))
  const union = <T,>(a: readonly T[], b: readonly T[] = []): T[] => [...a, ...b.filter((x) => !a.includes(x))]
  const hitos: Hito[] = union(p.hitos, c.hitos).filter((h) => h !== 'Militó en 3 o más partidos')
  if (new Set(partidos).size >= 3) hitos.push('Militó en 3 o más partidos')
  const ejecutivo = {
    ...p.ejecutivo,
    ministerios: union(p.ejecutivo.ministerios, c.ministerios),
    gobiernos_gabinete: union(p.ejecutivo.gobiernos_gabinete, c.gobiernos),
  }
  return { ...p, partidos, hitos, ejecutivo, decadas_activo: union(p.decadas_activo, c.decadas) }
}
