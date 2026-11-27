// Catálogo de partidos y movimientos: nombre oficial, sigla, colores y logo.
//
// La clave de cada entrada es la etiqueta que usan los políticos y los criterios
// del tablero (`Partido`). Al ser un `Record<Partido, …>`, TypeScript obliga a
// que todo partido del vocabulario tenga ficha: si se agrega uno a `PARTIDOS`
// y no aquí, `npm run build` falla.
//
// Los logos NO se escriben a mano: `npm run logos` (scripts/fetch-party-logos.mjs)
// los descarga a `public/parties/` y genera `partyLogos.ts`. Un partido sin logo
// descargado se dibuja como un escudo con su sigla y sus colores (ver PartyLogo).
//
// Los colores se tomaron mirando el logo de cada partido (el dominante y el de acento);
// los partidos colombianos no publican manuales de marca, así que son aproximados. Los
// tres partidos sin logo (Sí Colombia, Colombia Democrática y Colombianas y Colombianos
// por la Paz) conservan colores de referencia, sin emblema del que tomarlos.

import { PARTY_LOGOS } from './partyLogos.ts'
import { PARTIDOS, type Partido } from './types.ts'

export interface PartyInfo {
  /** Slug estable, también nombre del archivo del logo: `partido-liberal`. */
  id: string
  /** Etiqueta del partido en la base de datos y en los criterios del tablero. */
  partido: Partido
  /** Nombre oficial completo. */
  nombre: string
  sigla: string
  color_primario: string
  color_secundario: string
  /** Ruta local del logo, p. ej. `/parties/partido-liberal.png`. Ausente si no se descargó. */
  logo_url?: string
  logo_fuente?: string
  logo_origen?: string
  logo_licencia?: string
}

type PartyBase = Pick<PartyInfo, 'id' | 'nombre' | 'sigla' | 'color_primario' | 'color_secundario'>

const BASE: Record<Partido, PartyBase> = {
  'Partido Liberal': {
    id: 'partido-liberal',
    nombre: 'Partido Liberal Colombiano',
    sigla: 'PLC',
    color_primario: '#D4342C',
    color_secundario: '#FFFFFF',
  },
  'Partido Conservador': {
    id: 'partido-conservador',
    nombre: 'Partido Conservador Colombiano',
    sigla: 'PCC',
    color_primario: '#2A62AD',
    color_secundario: '#FFFFFF',
  },
  'Centro Democrático': {
    id: 'centro-democratico',
    nombre: 'Centro Democrático',
    sigla: 'CD',
    color_primario: '#1F3F6E',
    color_secundario: '#D4202A',
  },
  'Pacto Histórico': {
    id: 'pacto-historico',
    nombre: 'Pacto Histórico',
    sigla: 'PH',
    color_primario: '#7C3AED',
    color_secundario: '#FACC15',
  },
  'Colombia Humana': {
    id: 'colombia-humana',
    nombre: 'Colombia Humana',
    sigla: 'CH',
    color_primario: '#9333EA',
    color_secundario: '#FFFFFF',
  },
  'Polo Democrático': {
    id: 'polo-democratico',
    nombre: 'Polo Democrático Alternativo',
    sigla: 'PDA',
    color_primario: '#FFD21F',
    color_secundario: '#111827',
  },
  'Alianza Verde': {
    id: 'alianza-verde',
    nombre: 'Partido Alianza Verde',
    sigla: 'AV',
    color_primario: '#1E7B34',
    color_secundario: '#F7D117',
  },
  'Cambio Radical': {
    id: 'cambio-radical',
    nombre: 'Partido Cambio Radical',
    sigla: 'CR',
    color_primario: '#D7263D',
    color_secundario: '#1E3A8A',
  },
  'Partido de la U': {
    id: 'partido-de-la-u',
    nombre: 'Partido Social de Unidad Nacional (Partido de la U)',
    sigla: 'PU',
    color_primario: '#F59E0B',
    color_secundario: '#2E9B46',
  },
  'Nuevo Liberalismo': {
    id: 'nuevo-liberalismo',
    nombre: 'Nuevo Liberalismo',
    sigla: 'NL',
    color_primario: '#C8102E',
    color_secundario: '#FFFFFF',
  },
  'AD M-19': {
    id: 'ad-m19',
    nombre: 'Alianza Democrática M-19',
    sigla: 'M19',
    color_primario: '#1E4FA0',
    color_secundario: '#D32F2F',
  },
  MIRA: {
    id: 'mira',
    nombre: 'Movimiento Independiente de Renovación Absoluta (MIRA)',
    sigla: 'MIRA',
    color_primario: '#1F6FB5',
    color_secundario: '#FFFFFF',
  },
  'Dignidad y Compromiso': {
    id: 'dignidad-y-compromiso',
    nombre: 'Dignidad y Compromiso',
    sigla: 'DyC',
    color_primario: '#4A2C8F',
    color_secundario: '#FFFFFF',
  },
  MAIS: {
    id: 'mais',
    nombre: 'Movimiento Alternativo Indígena y Social (MAIS)',
    sigla: 'MAIS',
    color_primario: '#D32F2F',
    color_secundario: '#F2C200',
  },
  Comunes: {
    id: 'comunes',
    nombre: 'Partido Comunes',
    sigla: 'COM',
    color_primario: '#C62828',
    color_secundario: '#2E7D32',
  },
  'Unión Patriótica': {
    id: 'union-patriotica',
    nombre: 'Unión Patriótica',
    sigla: 'UP',
    color_primario: '#F2C200',
    color_secundario: '#D32F2F',
  },
  'Partido Comunista Colombiano': {
    id: 'partido-comunista',
    nombre: 'Partido Comunista Colombiano',
    sigla: 'PCC',
    color_primario: '#B71C1C',
    color_secundario: '#FFD54F',
  },
  'Progresistas': {
    id: 'progresistas',
    nombre: 'Progresistas',
    sigla: 'PRO',
    color_primario: '#0E7490',
    color_secundario: '#FFFFFF',
  },
  'Salvación Nacional': {
    id: 'salvacion-nacional',
    nombre: 'Movimiento de Salvación Nacional',
    sigla: 'MSN',
    color_primario: '#1E3A8A',
    color_secundario: '#D32F2F',
  },
  'Compromiso Ciudadano': {
    id: 'compromiso-ciudadano',
    nombre: 'Compromiso Ciudadano',
    sigla: 'CC',
    color_primario: '#F2A81D',
    color_secundario: '#D32F2F',
  },
  'Primero Colombia': {
    id: 'primero-colombia',
    nombre: 'Primero Colombia',
    sigla: 'PRC',
    color_primario: '#1D4ED8',
    color_secundario: '#F2C200',
  },
  'Nueva Fuerza Democrática': {
    id: 'nueva-fuerza-democratica',
    nombre: 'Nueva Fuerza Democrática',
    sigla: 'NFD',
    color_primario: '#E07B1A',
    color_secundario: '#1E3A8A',
  },
  'Sí Colombia': {
    id: 'si-colombia',
    nombre: 'Sí Colombia',
    sigla: 'SC',
    color_primario: '#E11D48',
    color_secundario: '#FFFFFF',
  },
  'Verde Oxígeno': {
    id: 'verde-oxigeno',
    nombre: 'Partido Verde Oxígeno',
    sigla: 'PVO',
    color_primario: '#5B2A86',
    color_secundario: '#8BC34A',
  },
  Creemos: {
    id: 'creemos',
    nombre: 'Creemos',
    sigla: 'CRE',
    color_primario: '#8E1F4B',
    color_secundario: '#F4C430',
  },
  'Liga de Gobernantes Anticorrupción': {
    id: 'liga-de-gobernantes',
    nombre: 'Liga de Gobernantes Anticorrupción',
    sigla: 'LIGA',
    color_primario: '#F5A623',
    color_secundario: '#1F2937',
  },
  'Defensores de la Patria': {
    id: 'defensores-de-la-patria',
    nombre: 'Defensores de la Patria',
    sigla: 'DDP',
    color_primario: '#2F4399',
    color_secundario: '#D32F2F',
  },
  'Colombia Democrática': {
    id: 'colombia-democratica',
    nombre: 'Colombia Democrática',
    sigla: 'CDE',
    color_primario: '#3B82F6',
    color_secundario: '#FFFFFF',
  },
  'Colombia Justa Libres': {
    id: 'colombia-justa-libres',
    nombre: 'Colombia Justa Libres',
    sigla: 'CJL',
    color_primario: '#C77D0A',
    color_secundario: '#FFFFFF',
  },
  'Alianza Social Independiente': {
    id: 'alianza-social-independiente',
    nombre: 'Alianza Social Independiente',
    sigla: 'ASI',
    color_primario: '#E8830C',
    color_secundario: '#1E3A8A',
  },
  'Colombianas y Colombianos por la Paz': {
    id: 'colombianas-y-colombianos-por-la-paz',
    nombre: 'Colombianas y Colombianos por la Paz',
    sigla: 'CCP',
    color_primario: '#C026D3',
    color_secundario: '#FFFFFF',
  },
  'Fuerza Ciudadana': {
    id: 'fuerza-ciudadana',
    nombre: 'Fuerza Ciudadana',
    sigla: 'FC',
    color_primario: '#F58220',
    color_secundario: '#FFFFFF',
  },
  'Opción Ciudadana': {
    id: 'opcion-ciudadana',
    nombre: 'Partido Opción Ciudadana (antes PIN y Convergencia Ciudadana)',
    sigla: 'OC',
    color_primario: '#E8590C',
    color_secundario: '#1E3A8A',
  },
}

/** Todos los partidos, en el orden de `PARTIDOS`, con su logo si se descargó. */
export const PARTIES: readonly PartyInfo[] = PARTIDOS.map((partido) => {
  const base = BASE[partido]
  return { ...base, partido, ...PARTY_LOGOS[base.id] }
})

export const PARTY_BY_NAME: ReadonlyMap<string, PartyInfo> = new Map(PARTIES.map((p) => [p.partido, p]))
export const PARTY_BY_ID: ReadonlyMap<string, PartyInfo> = new Map(PARTIES.map((p) => [p.id, p]))

if (PARTY_BY_ID.size !== PARTIES.length) throw new Error('parties.ts: ids de partido duplicados')
