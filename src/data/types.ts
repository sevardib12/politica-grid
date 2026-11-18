// Vocabularios cerrados y tipos estrictos de la base de datos de políticos.
// Usar uniones de literales evita erratas silenciosas en los datos: si un
// departamento o partido está mal escrito, `npm run build` falla.

export const REGIONES = [
  'Antioquia',
  'Bogotá',
  'Caribe',
  'Valle del Cauca',
  'Santanderes',
  'Eje Cafetero',
  'Cauca/Nariño',
  'Boyacá/Cundinamarca',
  'Llanos/Amazonía',
  'Tolima/Huila',
  'Pacífico/Chocó',
] as const
/**
 * `Sin dato` marca fichas cuyo lugar de nacimiento no se pudo confirmar; no
 * genera criterio de origen, así que nunca valida ni invalida una casilla.
 */
export type Region = (typeof REGIONES)[number] | 'Sin dato'

export const DECADAS = ['1980s', '1990s', '2000s', '2010s', '2020s'] as const
export type Decada = (typeof DECADAS)[number]

export type Genero = 'Masculino' | 'Femenino'

export const PARTIDOS = [
  'Partido Liberal',
  'Partido Conservador',
  'Centro Democrático',
  'Pacto Histórico',
  'Colombia Humana',
  'Polo Democrático',
  'Alianza Verde',
  'Cambio Radical',
  'Partido de la U',
  'Nuevo Liberalismo',
  'AD M-19',
  'MIRA',
  'Dignidad y Compromiso',
  'MAIS',
  'Comunes',
  'Unión Patriótica',
  'Salvación Nacional',
  'Compromiso Ciudadano',
  'Primero Colombia',
  'Nueva Fuerza Democrática',
  'Sí Colombia',
  'Verde Oxígeno',
  'Creemos',
  'Liga de Gobernantes Anticorrupción',
  'Defensores de la Patria',
  'Colombia Democrática',
  'Colombia Justa Libres',
  'Alianza Social Independiente',
  'Colombianas y Colombianos por la Paz',
  'Fuerza Ciudadana',
] as const
export type Partido = (typeof PARTIDOS)[number]

export const DEPARTAMENTOS = [
  'Bogotá',
  'Antioquia',
  'Valle del Cauca',
  'Atlántico',
  'Santander',
  'Norte de Santander',
  'Cauca',
  'Boyacá',
  'Bolívar',
  'Cundinamarca',
  'Nariño',
  'Córdoba',
  'Tolima',
  'Caldas',
  'Risaralda',
  'Quindío',
  'Huila',
  'Meta',
  'Cesar',
  'Magdalena',
  'La Guajira',
  'Sucre',
  'Chocó',
  'Caquetá',
  'Casanare',
  'Amazonas',
  'Arauca',
  'Putumayo',
  'Guaviare',
  'Guainía',
  'Vaupés',
  'Vichada',
  'San Andrés y Providencia',
] as const
export type Departamento = (typeof DEPARTAMENTOS)[number]

export const CIUDADES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Popayán',
  'Bucaramanga',
  'Cartagena',
  'Pereira',
  'Manizales',
  'Cúcuta',
  'Ibagué',
  'Pasto',
  'Zipaquirá',
  'Montería',
  'Santa Marta',
  'Neiva',
  'Villavicencio',
  'Armenia',
  'Tunja',
  'Valledupar',
  'Sincelejo',
  'Envigado',
  'Soacha',
  'Barrancabermeja',
  'Guacarí',
  'Sonsón',
  'Garzón',
  'Itagüí',
  'San Gil',
  // Capitales de departamento agregadas con los alcaldes regionales
  'Leticia',
  'Arauca',
  'Florencia',
  'Yopal',
  'Quibdó',
  'Riohacha',
  'Mocoa',
  'Inírida',
  'San José del Guaviare',
  'Mitú',
  'Puerto Carreño',
] as const
export type Ciudad = (typeof CIUDADES)[number]

export const MINISTERIOS = [
  'Interior',
  'Hacienda',
  'Defensa',
  'Relaciones Exteriores',
  'Salud',
  'Educación',
  'Justicia',
  'Minas y Energía',
  'Trabajo',
  'Agricultura',
  'Ambiente',
  'TIC',
  'Vivienda',
  'Transporte',
  'Comercio',
] as const
export type Ministerio = (typeof MINISTERIOS)[number]

export const GOBIERNOS = [
  'Turbay',
  'Betancur',
  'Barco',
  'Gaviria',
  'Samper',
  'Pastrana',
  'Uribe',
  'Santos',
  'Duque',
  'Petro',
  'De la Espriella',
] as const
export type Gobierno = (typeof GOBIERNOS)[number]

export const ORGANOS_CONTROL = [
  'Procurador',
  'Contralor',
  'Fiscal General',
  'Defensor del Pueblo',
  'Registrador',
] as const
export type OrganoControl = (typeof ORGANOS_CONTROL)[number]

export const COMISIONES = [
  'Comisión I (Constitucional)',
  'Comisión II (Internacional)',
  'Comisión III (Hacienda)',
  'Comisión IV (Presupuesto)',
  'Comisión V (Agro/Ambiente)',
  'Comisión VI (Comunicaciones/Transporte)',
  'Comisión VII (Salud/Trabajo)',
  'Comisión de Acusaciones',
] as const
export type Comision = (typeof COMISIONES)[number]

export const HITOS = [
  'Constituyente de 1991',
  'Exguerrillero desmovilizado',
  'Destituido o sancionado',
  'Curul de Oposición (Estatuto)',
  'Militó en 3 o más partidos',
] as const
export type Hito = (typeof HITOS)[number]

export interface Congreso {
  senador: boolean
  representante_camara: boolean
  departamentos_camara: Departamento[]
  presidente_senado: boolean
  presidente_camara: boolean
  /** Mesa directiva (vicepresidencias) de Senado o Cámara. */
  vicepresidente_congreso: boolean
  presidente_comision: Comision[]
}

export interface Territorial {
  concejal: Ciudad[]
  diputado_asamblea: Departamento[]
  alcalde: Ciudad[]
  gobernador: Departamento[]
  edil: boolean
}

export interface Presidencial {
  candidato_primera_vuelta: boolean
  segunda_vuelta: boolean
  formula_vicepresidencial: boolean
  consulta_interpartidista: boolean
  /** Ejerció la Presidencia de la República. */
  presidente: boolean
  /** Ejerció la Vicepresidencia de la República. */
  vicepresidente: boolean
}

export interface Ejecutivo {
  ministerios: Ministerio[]
  gobiernos_gabinete: Gobierno[]
  embajador: boolean
  organos_control: OrganoControl[]
}

export interface Politician {
  id: string
  nombre: string
  alias?: string
  genero: Genero
  region_origen: Region
  /**
   * Partidos o movimientos de militancia o aval. Convención: el primer
   * elemento es el partido principal (el más identificado con la persona y el
   * que da color al avatar); el resto va en orden cronológico.
   */
  partidos: Partido[]
  congreso: Congreso
  territorial: Territorial
  presidencial: Presidencial
  ejecutivo: Ejecutivo
  decadas_activo: Decada[]
  hitos: Hito[]
  /**
   * Ficha de alcance regional (gobernadores, alcaldes de capitales y concejales
   * agregados en bloque): cuenta como respuesta válida, aparece en el buscador y
   * en el solucionario, pero no se usa para generar ni calibrar tableros.
   */
  perfil_regional?: boolean
  /** Ruta local del retrato, p. ej. `/politicians/santos-calderon.jpg`. */
  foto_url?: string
  /** Quién publica la foto: «Senado de la República», «Cámara de Representantes», «Wikimedia»… */
  foto_fuente?: string
  /** Página de origen (perfil oficial o archivo de Wikimedia) para dar crédito. */
  foto_origen?: string
}
