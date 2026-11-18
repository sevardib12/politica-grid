// Cruza los perfiles de Congreso Visible (los baja `npm run congreso`) con la base: crea las fichas de quien falta y
// calcula qué datos le faltan a las fichas que ya existen (complementos, siempre agregando, nunca quitando).
// Escribe src/data/records/congresistas.ts y un informe en scripts/.cache/cv/.
//
//   npm run congreso:generar
//
// Es idempotente: compara contra las fichas escritas a mano (sin `congresistas.ts` ni los complementos), así que se
// puede repetir cuando se actualicen los perfiles. Revisa el informe y `git diff` antes de aceptar el resultado.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { presidencia } from '../src/data/records/presidencia.ts'
import { congreso } from '../src/data/records/congreso.ts'
import { mesas } from '../src/data/records/mesas.ts'
import { territorial } from '../src/data/records/territorial.ts'
import { gabinete } from '../src/data/records/gabinete.ts'
import { ministros } from '../src/data/records/ministros.ts'
import { administrativos } from '../src/data/records/administrativos.ts'
import { regional } from '../src/data/records/regional.ts'
import { CIUDADES, DEPARTAMENTOS, MINISTERIOS, DECADAS } from '../src/data/types.ts'
import { normalize } from '../src/utils/text.ts'

const POLITICIANS = [...presidencia, ...congreso, ...mesas, ...territorial, ...gabinete, ...ministros, ...administrativos, ...regional]
const DIR = fileURLToPath(new URL('./.cache/cv/', import.meta.url))
const SALIDA = fileURLToPath(new URL('../src/data/records/congresistas.ts', import.meta.url))
const n = (s: string) => normalize(s)
const STOP = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'el', 'e'])
const toks = (s: string) => n(String(s).replace(/\(.*?\)/g, ' ')).split(' ').filter((t) => t && !STOP.has(t))

const DEP_REGION: Record<string, string> = {
  Antioquia: 'Antioquia', Bogotá: 'Bogotá', Atlántico: 'Caribe', Bolívar: 'Caribe', Cesar: 'Caribe', Córdoba: 'Caribe', 'La Guajira': 'Caribe',
  Magdalena: 'Caribe', Sucre: 'Caribe', 'San Andrés y Providencia': 'Caribe', 'Valle del Cauca': 'Valle del Cauca', Santander: 'Santanderes',
  'Norte de Santander': 'Santanderes', Caldas: 'Eje Cafetero', Risaralda: 'Eje Cafetero', Quindío: 'Eje Cafetero', Cauca: 'Cauca/Nariño',
  Nariño: 'Cauca/Nariño', Boyacá: 'Boyacá/Cundinamarca', Cundinamarca: 'Boyacá/Cundinamarca', Meta: 'Llanos/Amazonía', Casanare: 'Llanos/Amazonía',
  Arauca: 'Llanos/Amazonía', Vichada: 'Llanos/Amazonía', Guaviare: 'Llanos/Amazonía', Guainía: 'Llanos/Amazonía', Vaupés: 'Llanos/Amazonía',
  Amazonas: 'Llanos/Amazonía', Caquetá: 'Llanos/Amazonía', Putumayo: 'Llanos/Amazonía', Tolima: 'Tolima/Huila', Huila: 'Tolima/Huila', Chocó: 'Pacífico/Chocó',
}
const findIn = <T extends string>(list: readonly T[], text: string, aliases: Record<string, T> = {}): T | null => {
  const t = ' ' + n(text).replace(/[^a-z0-9]+/g, ' ') + ' '
  for (const [a, v] of Object.entries(aliases)) if (t.includes(' ' + n(a).replace(/[^a-z0-9]+/g, ' ').trim() + ' ')) return v
  for (const x of [...list].sort((a, b) => b.length - a.length)) if (t.includes(' ' + n(x) + ' ')) return x
  return null
}
const DEP_ALIAS: Record<string, (typeof DEPARTAMENTOS)[number]> = { 'san andres': 'San Andrés y Providencia', valle: 'Valle del Cauca', 'distrito capital': 'Bogotá', 'bogota d c': 'Bogotá', 'bogota d.c.': 'Bogotá' }
const CITY_ALIAS: Record<string, (typeof CIUDADES)[number]> = { 'cartagena de indias': 'Cartagena', 'santiago de cali': 'Cali', 'san juan de pasto': 'Pasto', 'san jose de cucuta': 'Cúcuta', 'bogota d c': 'Bogotá' }
const MIN_MAP: [RegExp, (typeof MINISTERIOS)[number]][] = [
  [/interior|gobierno/, 'Interior'], [/hacienda/, 'Hacienda'], [/defensa/, 'Defensa'], [/relaciones exteriores|canciller/, 'Relaciones Exteriores'],
  [/salud|proteccion social/, 'Salud'], [/educacion/, 'Educación'], [/justicia/, 'Justicia'], [/minas/, 'Minas y Energía'], [/trabajo/, 'Trabajo'],
  [/agricultura/, 'Agricultura'], [/ambiente/, 'Ambiente'], [/tecnologias|comunicaciones|\btic\b/, 'TIC'], [/vivienda/, 'Vivienda'],
  [/transporte|obras publicas/, 'Transporte'], [/comercio|desarrollo economico/, 'Comercio'],
]
const GOB: [number, string][] = [[1978, 'Turbay'], [1982, 'Betancur'], [1986, 'Barco'], [1990, 'Gaviria'], [1994, 'Samper'], [1998, 'Pastrana'], [2002, 'Uribe'], [2010, 'Santos'], [2018, 'Duque'], [2022, 'Petro']]
const gobiernoDe = (y: number) => { if (y >= 2026) return null; let g: string | null = null; for (const [a, name] of GOB) if (y >= a) g = name; return g }
const decadasDe = (a: number, b: number) => DECADAS.filter((d) => { const s = Number(d.slice(0, 4)); return b >= s && a <= s + 9 })

// Partidos: solo por nombre exacto de Congreso Visible; coaliciones y mezclas quedan sin partido (ante la duda, se omite).
const PARTY_EXACT: Record<string, string> = {
  'liberal colombiano': 'Partido Liberal', 'conservador colombiano': 'Partido Conservador', 'partido de la u partido de la union por la gente': 'Partido de la U',
  'cambio radical': 'Cambio Radical', 'centro democratico': 'Centro Democrático', 'pacto historico coalicion': 'Pacto Histórico', 'coalicion pacto historico frente amplio': 'Pacto Histórico',
  'alianza verde': 'Alianza Verde', 'partido verde': 'Alianza Verde', 'pda polo democratico alternativo': 'Polo Democrático', comunes: 'Comunes', mira: 'MIRA',
  'asi alianza social independiente': 'Alianza Social Independiente', 'salvacion nacional': 'Salvación Nacional', 'colombia democratica': 'Colombia Democrática',
  'mais movimiento alternativo indigena y social': 'MAIS', 'verde oxigeno': 'Verde Oxígeno', 'movimiento nueva fuerza democratica': 'Nueva Fuerza Democrática',
  'colombia justa libres antes movimiento libres': 'Colombia Justa Libres', 'alianza democratica m 19': 'AD M-19', 'nuevo liberalismo': 'Nuevo Liberalismo',
  'colombia humana': 'Colombia Humana', creemos: 'Creemos', 'si colombia': 'Sí Colombia', 'fuerza ciudadana': 'Fuerza Ciudadana', 'liga de gobernantes anticorrupcion': 'Liga de Gobernantes Anticorrupción',
  'pin partido de integracion nacional': 'Opción Ciudadana', 'opcion ciudadana': 'Opción Ciudadana', 'convergencia ciudadana': 'Opción Ciudadana',
}
const partyOf = (raw: string | null): string | null => (raw ? PARTY_EXACT[n(raw).replace(/[^a-z0-9]+/g, ' ').trim()] ?? null : null)

type Cargo = { texto: string; desde: number | null; hasta: number | null }
interface Upd {
  senador: boolean; representante: boolean; deptosCamara: Set<string>; presSenado: boolean; presCamara: boolean
  gobernador: Set<string>; alcalde: Set<string>; concejal: Set<string>; diputado: Set<string>
  ministerios: Set<string>; gobiernos: Set<string>; embajador: boolean; control: Set<string>; decadas: Set<string>
}
const newUpd = (): Upd => ({ senador: false, representante: false, deptosCamara: new Set(), presSenado: false, presCamara: false, gobernador: new Set(), alcalde: new Set(), concejal: new Set(), diputado: new Set(), ministerios: new Set(), gobiernos: new Set(), embajador: false, control: new Set(), decadas: new Set() })

/** Cargos de la trayectoria pública (texto libre) que encajan en el esquema; el resto se ignora. */
function aplicar(u: Upd, c: Cargo): boolean {
  const t = n(c.texto)
  const years = () => { if (c.desde) for (const d of decadasDe(c.desde, c.hasta ?? c.desde)) u.decadas.add(d) }
  if (/encargad|ad hoc|delegatari|interin|\(e\)/.test(t)) return false
  if (/vicecontralor|viceminist|vicepresid|secretari|subsecret|director|gerente|asesor|jefe|magistrad|juez|personer|edil|candidat|precandidat|rector|decano|superintend|consejer|presidente de la junta/.test(t)) return false
  if (/presidente del senado/.test(t)) { u.presSenado = true; u.senador = true; years(); return true }
  if (/presidente de la camara/.test(t)) { u.presCamara = true; u.representante = true; years(); return true }
  if (/^gobernador|^gobernadora/.test(t)) { const d = findIn(DEPARTAMENTOS, t, DEP_ALIAS); if (d) { u.gobernador.add(d); years(); return true } return false }
  if (/^alcalde|^alcaldesa/.test(t)) { const ci = findIn(CIUDADES, t, CITY_ALIAS); if (ci) { u.alcalde.add(ci); years(); return true } return false }
  if (/^concejal/.test(t)) { const ci = findIn(CIUDADES, t, CITY_ALIAS); if (ci) { u.concejal.add(ci); years(); return true } return false }
  if (/^diputad/.test(t)) { const d = findIn(DEPARTAMENTOS, t, DEP_ALIAS); if (d) { u.diputado.add(d); years(); return true } return false }
  if (/^ministr/.test(t)) {
    const m = MIN_MAP.find(([re]) => re.test(t))?.[1]
    if (!m) return false
    u.ministerios.add(m)
    if (c.desde) { const g = gobiernoDe(c.desde); if (g) u.gobiernos.add(g) }
    years(); return true
  }
  if (/^embajador/.test(t)) { u.embajador = true; years(); return true }
  if (/^contralor general/.test(t)) { u.control.add('Contralor'); years(); return true }
  if (/^procurador general/.test(t)) { u.control.add('Procurador'); years(); return true }
  if (/fiscal general/.test(t)) { u.control.add('Fiscal General'); years(); return true }
  if (/defensor del pueblo/.test(t)) { u.control.add('Defensor del Pueblo'); years(); return true }
  if (/registrador nacional/.test(t)) { u.control.add('Registrador'); years(); return true }
  return false
}

interface Periodo { corp: number; cuat: string | null; ini: number | null; fin: number | null; partido: string | null; circ: string | null; dep: string | null }
interface Perfil { id: string; nombres: string; apellidos: string; genero: string | null; fallecido: string | null; nacimiento: { municipio: string; departamento: string | null } | null; periodos: Periodo[]; trayectoria: { cargo: string; fecha: string | null; fin: string | null; partido: string | null }[] }

const PART = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e', 'van', 'von'])
const titulo = (s: string) => s.trim().replace(/\s+/g, ' ').split(' ').map((w, i) => (PART.has(w.toLowerCase()) && i > 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ')
const slug = (s: string) => n(s).replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, '-')

const perfiles: Perfil[] = readdirSync(`${DIR}perfiles`).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${DIR}perfiles/${f}`, 'utf8')))
const dbToks = POLITICIANS.map((p) => ({ p, t: toks(p.nombre) }))
const match = (a: string[], b: string[]) => { const sh = a.filter((t) => b.includes(t)).length; return sh >= 2 && (sh === a.length || sh === b.length) }

function resumen(pf: Perfil) {
  const u = newUpd()
  const aniosDe = (pe: Periodo) => (pe.ini ? decadasDe(pe.ini, (pe.fin ?? pe.ini + 4) - 1) : [])
  const partidos: { p: string; ini: number }[] = []
  const deptos = new Set<string>()
  for (const pe of pf.periodos) {
    if (pe.corp === 2) u.senador = true
    if (pe.corp === 1) { u.representante = true; const d = pe.dep ? findIn(DEPARTAMENTOS, pe.dep, DEP_ALIAS) : null; if (d && /territorial/i.test(pe.circ ?? '')) deptos.add(d) }
    for (const d of aniosDe(pe)) u.decadas.add(d)
    const p = partyOf(pe.partido)
    if (p) partidos.push({ p, ini: pe.ini ?? 0 })
  }
  for (const t of pf.trayectoria) {
    const desde = t.fecha ? Number(t.fecha.slice(0, 4)) : null
    const hasta = t.fin ? Number(t.fin.slice(0, 4)) : desde
    if (!t.cargo) continue
    aplicar(u, { texto: t.cargo, desde: desde && desde > 1950 ? desde : null, hasta: hasta && hasta > 1950 ? hasta : null })
  }
  for (const d of deptos) u.deptosCamara.add(d)
  // Partido principal: el que más veces los avaló; a igualdad, el más reciente. El resto, cronológico.
  const cuenta = new Map<string, { n: number; last: number }>()
  for (const x of partidos) { const c = cuenta.get(x.p) ?? { n: 0, last: 0 }; c.n++; c.last = Math.max(c.last, x.ini); cuenta.set(x.p, c) }
  const orden = [...cuenta.entries()].sort((a, b) => b[1].n - a[1].n || b[1].last - a[1].last).map(([p]) => p)
  const principal = orden[0]
  const cron = [...new Set(partidos.slice().sort((a, b) => a.ini - b.ini).map((x) => x.p))]
  const partidosOrd = principal ? [principal, ...cron.filter((p) => p !== principal)] : []
  const dep = pf.nacimiento?.departamento ? findIn(DEPARTAMENTOS, pf.nacimiento.departamento, DEP_ALIAS) : null
  const region = dep ? DEP_REGION[dep] ?? 'Sin dato' : 'Sin dato'
  return { u, partidos: partidosOrd, region, dep }
}

// CV a veces escribe sin tilde («Angel», «Fernandez»): si el mismo token aparece con tilde en otro nombre
// (de CV o de la base), se usa la forma con tilde más frecuente.
const quitaTilde = (w: string) => w.replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u')
const corpus = new Map<string, Map<string, number>>()
const alimentar = (nombre: string) => {
  for (const w of nombre.split(/\s+/)) {
    const l = w.toLowerCase()
    const k = quitaTilde(l)
    if (k === l) continue
    const m = corpus.get(k) ?? new Map<string, number>()
    m.set(l, (m.get(l) ?? 0) + 1)
    corpus.set(k, m)
  }
}
for (const p of POLITICIANS) alimentar(p.nombre)
for (const pf of perfiles) alimentar(`${pf.nombres} ${pf.apellidos}`)
// Tildes que CV pone de más (en español, «Luis» no lleva tilde).
const TILDE_DE_MAS: Record<string, string> = { luís: 'luis', carmén: 'carmen', araújo: 'araujo', cháves: 'chaves' }
const igualaCaja = (orig: string, nuevo: string) => (orig.charAt(0) === orig.charAt(0).toUpperCase() ? nuevo.charAt(0).toUpperCase() + nuevo.slice(1) : nuevo)
const conTildes = (nombre: string) =>
  nombre.split(' ').map((w) => {
    const l = w.toLowerCase()
    if (TILDE_DE_MAS[l]) return igualaCaja(w, TILDE_DE_MAS[l])
    if (quitaTilde(l) !== l) return w
    const m = corpus.get(l)
    if (!m) return w
    const mejor = [...m.entries()].filter(([f]) => !TILDE_DE_MAS[f]).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (!mejor) return w
    return w.charAt(0) === w.charAt(0).toUpperCase() ? mejor.charAt(0).toUpperCase() + mejor.slice(1) : mejor
  }).join(' ')

const nuevos: unknown[] = []
const vistos = new Map<string, string[]>() // id de la base → ids de CV que coinciden
const complementos: Record<string, unknown> = {}
const informe = { total: perfiles.length, yaEnBase: 0, nuevos: 0, ambiguos: [] as string[], conflictos: [] as string[], sinGenero: 0, sinPartido: 0, noMapeados: {} as Record<string, number>, idsRepetidos: 0 }
const usados = new Set(POLITICIANS.map((p) => p.id))

for (const pf of perfiles) {
  const nombre = titulo(`${pf.nombres} ${pf.apellidos}`)
  const t = toks(nombre)
  const hits = dbToks.filter((d) => match(t, d.t))
  const r = resumen(pf)
  for (const pe of pf.periodos) if (pe.partido && !partyOf(pe.partido)) informe.noMapeados[pe.partido] = (informe.noMapeados[pe.partido] ?? 0) + 1
  if (hits.length > 1) { informe.ambiguos.push(`${nombre} → ${hits.map((h) => h.p.nombre).join(' | ')}`); informe.yaEnBase++; continue }
  let homonimo = false
  if (hits.length === 1) {
    informe.yaEnBase++
    const p = hits[0].p
    const gen = pf.genero === 'Femenino' ? 'Femenino' : 'Masculino'
    if (pf.genero && gen !== p.genero) { informe.conflictos.push(`${nombre} (CV ${gen}) ≠ ${p.nombre} (${p.genero}): homónimo, ficha nueva`); homonimo = true }
    else if (r.region !== 'Sin dato' && p.region_origen !== 'Sin dato' && r.region !== p.region_origen) {
      // Con tres o más palabras en común es la misma persona (el lugar de nacimiento puede estar mal en alguna de las dos fuentes);
      // con solo dos, podría ser un homónimo.
      const comunes = t.filter((x) => hits[0].t.includes(x)).length
      if (comunes >= 3) informe.conflictos.push(`${nombre}: misma persona, pero nace ${r.region} (CV) y ${p.region_origen} (base): se deja la base`)
      else { informe.conflictos.push(`${nombre} (nace ${r.region}) ≠ ${p.nombre} (${p.region_origen}): homónimo, ficha nueva`); homonimo = true }
    }
    if (!homonimo) {
    vistos.set(p.id, [...(vistos.get(p.id) ?? []), pf.id])
    // Solo se agrega lo que falta.
    const c: Record<string, unknown> = {}
    const cong: Record<string, unknown> = {}
    if (r.u.senador && !p.congreso.senador) cong.senador = true
    if (r.u.representante && !p.congreso.representante_camara) cong.representante_camara = true
    const dn = [...r.u.deptosCamara].filter((d) => !p.congreso.departamentos_camara.includes(d as never))
    if (dn.length) cong.departamentos_camara = dn
    if (r.u.presSenado && !p.congreso.presidente_senado) cong.presidente_senado = true
    if (r.u.presCamara && !p.congreso.presidente_camara) cong.presidente_camara = true
    if (Object.keys(cong).length) c.congreso = cong
    const ps = r.partidos.filter((x) => !p.partidos.includes(x as never))
    if (ps.length) c.partidos = ps
    const ds = [...r.u.decadas].filter((d) => !p.decadas_activo.includes(d as never))
    if (ds.length) c.decadas = ds
    if (r.region !== 'Sin dato' && p.region_origen === 'Sin dato') c.region = r.region
    if (Object.keys(c).length) complementos[p.id] = { nombre: p.nombre, ...c }
    continue
    }
  }
  // Ficha nueva
  if (!pf.genero) { informe.sinGenero++; continue }
  let id = slug(`${pf.apellidos} ${pf.nombres.split(' ')[0]}`)
  if (usados.has(id)) { id = `${id}-${pf.id}`; informe.idsRepetidos++ }
  usados.add(id)
  if (!r.partidos.length) informe.sinPartido++
  const reg: Record<string, unknown> = { id, nombre: conTildes(nombre), genero: pf.genero === 'Femenino' ? 'Femenino' : 'Masculino', region: r.region, partidos: r.partidos, cv: Number(pf.id) }
  const cong: Record<string, unknown> = {}
  if (r.u.senador) cong.senador = true
  if (r.u.representante) cong.representante_camara = true
  if (r.u.deptosCamara.size) cong.departamentos_camara = [...r.u.deptosCamara]
  if (r.u.presSenado) cong.presidente_senado = true
  if (r.u.presCamara) cong.presidente_camara = true
  if (Object.keys(cong).length) reg.congreso = cong
  const terr: Record<string, unknown> = {}
  if (r.u.gobernador.size) terr.gobernador = [...r.u.gobernador]
  if (r.u.alcalde.size) terr.alcalde = [...r.u.alcalde]
  if (r.u.concejal.size) terr.concejal = [...r.u.concejal]
  if (r.u.diputado.size) terr.diputado_asamblea = [...r.u.diputado]
  if (Object.keys(terr).length) reg.territorial = terr
  const ej: Record<string, unknown> = {}
  if (r.u.ministerios.size) ej.ministerios = [...r.u.ministerios]
  if (r.u.gobiernos.size) ej.gobiernos_gabinete = [...r.u.gobiernos]
  if (r.u.embajador) ej.embajador = true
  if (r.u.control.size) ej.organos_control = [...r.u.control]
  if (Object.keys(ej).length) reg.ejecutivo = ej
  reg.decadas = DECADAS.filter((d) => r.u.decadas.has(d))
  nuevos.push(reg)
  informe.nuevos++
}

// Auditoría de la base contra CV (solo informa; CV no cubre antes de 1998).
const porId = new Map(perfiles.map((p) => [p.id, p]))
const audit = { dbCongreso: 0, sinCV: [] as string[], discrepancias: [] as string[] }
for (const p of POLITICIANS) {
  if (!p.congreso.senador && !p.congreso.representante_camara) continue
  audit.dbCongreso++
  const ids = vistos.get(p.id)
  if (!ids) { audit.sinCV.push(`${p.nombre} [${p.decadas_activo.join(',')}]`); continue }
  const pers = ids.map((i) => porId.get(i)!).flatMap((x) => x.periodos)
  const hasS = pers.some((x) => x.corp === 2), hasC = pers.some((x) => x.corp === 1)
  if (p.congreso.senador && !hasS) audit.discrepancias.push(`${p.nombre}: la base dice Senado y CV solo tiene ${hasC ? 'Cámara' : 'nada'}`)
  if (p.congreso.representante_camara && !hasC) audit.discrepancias.push(`${p.nombre}: la base dice Cámara y CV solo tiene ${hasS ? 'Senado' : 'nada'}`)
}
writeFileSync(`${DIR}auditoria.json`, JSON.stringify(audit, null, 1))
console.log('AUDITORÍA base→CV:', audit.dbCongreso, 'con congreso; sin CV:', audit.sinCV.length, '; discrepancias:', audit.discrepancias.length)
writeFileSync(`${DIR}informe.json`, JSON.stringify(informe, null, 1))
console.log(JSON.stringify({ ...informe, ambiguos: informe.ambiguos.length, conflictos: informe.conflictos.length, noMapeados: Object.entries(informe.noMapeados).sort((a, b) => b[1] - a[1]).slice(0, 25) }, null, 1))

// ── Emisión de src/data/records/congresistas.ts ──
const CODIGOS: Record<string, string> = {
  'Partido Liberal': 'PL', 'Partido Conservador': 'PC', 'Centro Democrático': 'CD', 'Pacto Histórico': 'PH', 'Colombia Humana': 'CH', 'Polo Democrático': 'PDA',
  'Alianza Verde': 'AV', 'Cambio Radical': 'CR', 'Partido de la U': 'U', 'Nuevo Liberalismo': 'NL', 'AD M-19': 'M19', MIRA: 'MIRA', 'Dignidad y Compromiso': 'DYC',
  MAIS: 'MAIS', Comunes: 'COM', 'Unión Patriótica': 'UP', 'Salvación Nacional': 'SN', 'Compromiso Ciudadano': 'CCI', 'Primero Colombia': 'P1', 'Nueva Fuerza Democrática': 'NFD',
  'Sí Colombia': 'SIC', 'Verde Oxígeno': 'VO', Creemos: 'CRE', 'Liga de Gobernantes Anticorrupción': 'LGA', 'Defensores de la Patria': 'DP', 'Colombia Democrática': 'CDE',
  'Colombia Justa Libres': 'CJL', 'Alianza Social Independiente': 'ASI', 'Colombianas y Colombianos por la Paz': 'CCP', 'Fuerza Ciudadana': 'FC', 'Opción Ciudadana': 'OC',
}
const cod = (ps: string[]) => ps.map((p) => { const c = CODIGOS[p]; if (!c) throw new Error('partido sin código: ' + p); return c })
const rangos = (ds: string[]) => {
  // ['1990s','2000s','2020s'] → '1990s-2000s,2020s'
  const ORD = ['1980s', '1990s', '2000s', '2010s', '2020s']
  const idx = ds.map((d) => ORD.indexOf(d)).sort((a, b) => a - b)
  const out: string[] = []
  for (let i = 0; i < idx.length;) { let j = i; while (idx[j + 1] === idx[j] + 1) j++; out.push(i === j || idx[i] === idx[j] ? ORD[idx[i]] : `${ORD[idx[i]]}-${ORD[idx[j]]}`); i = j + 1 }
  return out.join(',')
}
const J = JSON.stringify
const filas = (nuevos as any[]).map((r) => {
  const cong = r.congreso ?? {}
  const tipo = (cong.senador ? 'S' : '') + (cong.representante_camara ? 'C' : '')
  const extra: Record<string, unknown> = {}
  const cx: Record<string, unknown> = {}
  if (cong.presidente_senado) cx.presidente_senado = true
  if (cong.presidente_camara) cx.presidente_camara = true
  if (Object.keys(cx).length) extra.congreso = cx
  if (r.territorial) extra.territorial = r.territorial
  if (r.ejecutivo) extra.ejecutivo = r.ejecutivo
  const ex = Object.keys(extra).length ? `, ${J(extra)}` : ''
  return `  c(${J(r.id)}, ${J(r.nombre)}, '${r.genero === 'Femenino' ? 'F' : 'M'}', ${J(r.region)}, '${cod(r.partidos).join(',')}', '${tipo}', ${J(cong.departamentos_camara ?? [])}, '${rangos(r.decadas)}'${ex}),`
})
const comp = Object.entries(complementos as Record<string, any>).map(([id, v]) => {
  const o: Record<string, unknown> = {}
  if (v.congreso?.senador) o.senador = true
  if (v.congreso?.representante_camara) o.camara = true
  if (v.congreso?.presidente_senado) o.presSenado = true
  if (v.congreso?.presidente_camara) o.presCamara = true
  if (v.congreso?.departamentos_camara) o.deptos = v.congreso.departamentos_camara
  if (v.partidos) o.partidos = cod(v.partidos).join(',')
  if (v.decadas) o.decadas = rangos(v.decadas)
  if (v.region) o.region = v.region
  return `  ${J(id)}: ${J(o)}, // ${v.nombre}`
})
const codeTable = Object.entries(CODIGOS).map(([p, c]) => `  ${c}: ${J(p)},`).join('\n')
const out = `// Congresistas de la Cámara y el Senado de 1998 a 2030 que faltaban en la base, tomados de Congreso
// Visible (Uniandes, congresovisible.uniandes.edu.co): ${filas.length} fichas nuevas y ${comp.length} complementos a fichas que ya existían.
//
// Criterios de rigor:
//   · Salen de las listas de congresistas de la Cámara y el Senado de los cuatrienios 1998–2002 a 2026–2030 y de
//     cada perfil (nombre, género, lugar de nacimiento, periodos, partido y circunscripción).
//   · partidos: el partido que avaló al congresista en cada periodo, solo si es un partido del catálogo. Las
//     coaliciones y los movimientos fuera del catálogo se omiten (queda sin partido): ante la duda, se omite.
//   · region: departamento de nacimiento del perfil; sin ese dato, 'Sin dato'.
//   · departamentos_camara: solo en las curules territoriales (no en las especiales ni internacionales).
//   · decadas: las décadas que cubren sus periodos.
//   · Cargos de la trayectoria pública (alcaldías, gobernaciones, concejos, asambleas, ministerios…) solo cuando
//     el texto encaja con el vocabulario de la base.
//   · Antes de 1998 Congreso Visible no tiene datos: los congresistas anteriores solo están si ya tenían ficha.
//   · Las fichas nuevas llevan perfil_regional: valen como respuesta y salen en el buscador y el solucionario,
//     pero no generan ni calibran tableros.
//   · Los complementos solo agregan datos que le faltaban a una ficha existente (nunca quitan ni cambian).
//
// Generado por \`npm run congreso:generar\` (scripts/congreso-visible-generar.ts) a partir de los perfiles que baja
// \`npm run congreso\`; para corregir un dato, edita el generador (o agrega la ficha a mano en otro archivo), no la fila.

import { build, d, type PoliticianInput } from '../builder.ts'
import { DECADAS, type Decada, type Departamento, type Partido, type Politician, type Region } from '../types.ts'

/** Códigos cortos de partido, solo para que el archivo pese menos. */
const P: Record<string, Partido> = {
${codeTable}
}
const partidosDe = (codigos: string): Partido[] =>
  codigos
    ? codigos.split(',').map((c) => {
        const p = P[c]
        if (!p) throw new Error(\`congresistas.ts: código de partido desconocido: \${c}\`)
        return p
      })
    : []
const decadasDe = (rangos: string): Decada[] => (rangos ? d(...rangos.split(',')) : [])

type Extra = Pick<PoliticianInput, 'territorial' | 'ejecutivo' | 'congreso'>

/** Ficha de congresista: \`tipo\` es 'S' (Senado), 'C' (Cámara) o 'SC' (ambos). */
function c(
  id: string,
  nombre: string,
  genero: 'M' | 'F',
  region: Region,
  partidos: string,
  tipo: 'S' | 'C' | 'SC' | '',
  departamentos: Departamento[],
  decadas: string,
  extra: Extra = {},
): Politician {
  return build({
    id,
    nombre,
    genero: genero === 'M' ? 'Masculino' : 'Femenino',
    region,
    partidos: partidosDe(partidos),
    congreso: { senador: tipo.includes('S'), representante_camara: tipo.includes('C'), departamentos_camara: departamentos, ...extra.congreso },
    ...(extra.territorial ? { territorial: extra.territorial } : {}),
    ...(extra.ejecutivo ? { ejecutivo: extra.ejecutivo } : {}),
    decadas: decadasDe(decadas),
    perfil_regional: true,
  })
}

export const congresistas: Politician[] = [
${filas.join('\n')}
]

/** Datos que le faltaban a fichas que ya existían, según Congreso Visible. Solo agregan. */
interface Complemento {
  senador?: true
  camara?: true
  presSenado?: true
  presCamara?: true
  deptos?: Departamento[]
  partidos?: string
  decadas?: string
  region?: Region
}

const COMPLEMENTOS: Record<string, Complemento> = {
${comp.join('\n')}
}

export function conComplementos(p: Politician): Politician {
  const x = COMPLEMENTOS[p.id]
  if (!x) return p
  const partidos = [...p.partidos, ...partidosDe(x.partidos ?? '').filter((q) => !p.partidos.includes(q))]
  const decadas = x.decadas ? decadasDe(x.decadas) : []
  const hitos = new Set(p.hitos)
  if (new Set(partidos).size >= 3) hitos.add('Militó en 3 o más partidos')
  return {
    ...p,
    region_origen: p.region_origen === 'Sin dato' && x.region ? x.region : p.region_origen,
    partidos,
    congreso: {
      ...p.congreso,
      senador: p.congreso.senador || !!x.senador,
      representante_camara: p.congreso.representante_camara || !!x.camara,
      presidente_senado: p.congreso.presidente_senado || !!x.presSenado,
      presidente_camara: p.congreso.presidente_camara || !!x.presCamara,
      departamentos_camara: [...p.congreso.departamentos_camara, ...(x.deptos ?? []).filter((q) => !p.congreso.departamentos_camara.includes(q))],
    },
    decadas_activo: DECADAS.filter((q) => p.decadas_activo.includes(q) || decadas.includes(q)),
    hitos: [...hitos],
  }
}
`
writeFileSync(SALIDA, out)
console.log('emitido:', filas.length, 'fichas,', comp.length, 'complementos,', out.length, 'bytes')

