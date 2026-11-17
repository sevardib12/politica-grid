// Valida las listas de Política Top 10 y prueba el motor de coincidencia.
// Uso: npm run validate:top10

import { PARTY_BY_NAME } from '../src/data/parties.ts'
import { TOP10_CATEGORY_LABEL, TOP10_LISTS, type Top10Category, type Top10Challenge } from '../src/data/top10Lists.ts'
import { hasProfile } from '../src/top10/people.ts'
import { judge, tokenize, type Verdict } from '../src/top10/match.ts'

const errors: string[] = []
const warnings: string[] = []
const err = (list: Top10Challenge, msg: string) => errors.push(`[${list.id}] ${msg}`)
const warn = (list: Top10Challenge, msg: string) => warnings.push(`[${list.id}] ${msg}`)

const CATEGORIES = Object.keys(TOP10_CATEGORY_LABEL) as Top10Category[]

/** Primer número de una pista: «1.497.596 votos · 2023» → 1497596; «64,51 % · 1994» → 64.51. */
function leadingNumber(pista: string): number | null {
  const m = /^(\d[\d.]*(?:,\d+)?)/.exec(pista.trim())
  if (!m) return null
  const raw = m[1]
  return raw.includes(',') ? Number(raw.replace(/\./g, '').replace(',', '.')) : Number(raw.replace(/\./g, ''))
}

function firstYear(pista: string): number | null {
  const m = /(?<!\d)(19|20)\d{2}(?!\d)/.exec(pista)
  return m ? Number(m[0]) : null
}

const describe = (v: Verdict) => (v.kind === 'match' || v.kind === 'repeat' ? `${v.kind}#${v.index + 1}` : v.kind)

for (const list of TOP10_LISTS) {
  if (!CATEGORIES.includes(list.categoria)) err(list, `categoría desconocida: ${list.categoria}`)
  if (list.size !== 5 && list.size !== 10) err(list, `tamaño inválido: ${list.size}`)
  if (list.items.length !== list.size) err(list, `size ${list.size} pero ${list.items.length} filas`)
  if (list.titulo !== list.titulo.toUpperCase()) warn(list, 'el título no está en mayúsculas')
  if (!list.fuente.trim()) err(list, 'falta la fuente')

  const seenNames = new Set<string>()
  list.items.forEach((item, i) => {
    const where = `fila ${i + 1} (${item.nombre})`
    if (item.posicion !== i + 1) err(list, `${where}: posicion ${item.posicion} en vez de ${i + 1}`)
    if (!item.nombre.trim()) err(list, `${where}: nombre vacío`)
    if (!item.pista_visible.trim()) err(list, `${where}: falta pista_visible`)
    if (!item.dato_extra.trim()) err(list, `${where}: falta dato_extra`)
    if (item.aliases.length === 0) warn(list, `${where}: sin aliases`)
    if (item.partido !== null && !PARTY_BY_NAME.has(item.partido)) err(list, `${where}: partido fuera del catálogo: ${item.partido}`)

    const key = tokenize(item.nombre).join(' ')
    if (seenNames.has(key)) err(list, `${where}: nombre repetido en la lista`)
    seenNames.add(key)

    // Todo lo que el jugador podría escribir con razón debe llevar a ESTA fila.
    const none = list.items.map(() => false)
    const forms = [item.nombre, ...item.aliases]
    for (const form of forms) {
      const v = judge(list, none, form)
      if (v.kind === 'match' && v.index === i) continue
      if (v.kind === 'ambiguous' && v.indexes.includes(i)) {
        // Un nombre completo ambiguo es un error: no se podría acertar. Un alias corto, solo un aviso.
        if (form === item.nombre) err(list, `${where}: el nombre completo es ambiguo (${v.indexes.map((n) => n + 1).join(', ')})`)
        else warn(list, `${where}: el alias «${form}» es ambiguo con las filas ${v.indexes.map((n) => n + 1).join(', ')}`)
        continue
      }
      err(list, `${where}: «${form}» da ${describe(v)} en vez de acertar la fila ${i + 1}`)
    }
  })

  // El orden de las filas debe ser monótono: votos descendentes o años descendentes.
  const numbers = list.items.map((it) => leadingNumber(it.pista_visible))
  const years = list.items.map((it) => firstYear(it.pista_visible))
  if (numbers.every((n) => n !== null) && /votos|%/.test(list.items[0].pista_visible)) {
    numbers.forEach((n, i) => {
      if (i > 0 && n! > numbers[i - 1]!) err(list, `la fila ${i + 1} (${n}) supera a la fila ${i} (${numbers[i - 1]}): el orden no es descendente`)
    })
  } else if (years.every((y) => y !== null)) {
    years.forEach((y, i) => {
      if (i > 0 && y! > years[i - 1]!) err(list, `la fila ${i + 1} (${y}) es posterior a la fila ${i} (${years[i - 1]}): el orden no es del más reciente al más antiguo`)
    })
  } else {
    warn(list, 'no se pudo comprobar el orden de las filas')
  }
}

// ── Pruebas del motor de coincidencia ─────────────────────────────────────

const byId = (id: string) => {
  const l = TOP10_LISTS.find((x) => x.id === id)
  if (!l) throw new Error(`falta la lista ${id}`)
  return l
}

const cases: [string, string, string, Verdict['kind'], number?][] = [
  ['presidentes', 'petro', 'Petro', 'match', 1],
  ['presidentes', 'sin tildes', 'ivan duque', 'match', 2],
  ['presidentes', 'apellido con tilde', 'Álvaro Uribe', 'match', 4],
  ['presidentes', 'partícula', 'de la Espriella', 'match', 0],
  ['presidentes', 'erratas', 'Samprer', 'match', 6],
  ['presidentes', 'nombre de pila suelto', 'Gustavo', 'vague'],
  ['presidentes', 'demasiado corto', 'Pe', 'vague'],
  ['presidentes', 'no está en la lista', 'Rojas Pinilla', 'wrong'],
  ['alcaldes-bogota', 'Galán sin tilde', 'Galan', 'match', 0],
  ['alcaldes-bogota', 'nombre completo', 'Carlos Fernando Galan', 'match', 0],
  ['alcaldes-bogota', 'apodo', 'Lucho Garzón', 'match', 5],
  ['alcaldes-bogota', 'Mockus', 'mockus', 'match', 6],
  ['alcaldes-medellin', 'apodo Fico', 'Fico', 'match', 0],
  ['alcaldes-barranquilla', 'homónimos: apellido compartido', 'Pumarejo', 'ambiguous'],
  ['alcaldes-barranquilla', 'homónimos: nombre compartido', 'Jaime Pumarejo', 'ambiguous'],
  ['alcaldes-barranquilla', 'homónimos: segundo apellido', 'Pumarejo Certain', 'match', 9],
  ['alcaldes-barranquilla', 'homónimos: segundo apellido', 'Pumarejo Heins', 'match', 1],
  ['min-salud', 'dos Londoño', 'Londoño', 'ambiguous'],
  ['min-transporte', 'apellido con guion', 'Alvarez Correa', 'match', 9],
]

let failed = 0
for (const [id, label, input, expected, index] of cases) {
  const list = byId(id)
  const v = judge(list, list.items.map(() => false), input)
  const ok = v.kind === expected && (index === undefined || (v.kind === 'match' && v.index === index))
  if (!ok) {
    failed++
    errors.push(`[prueba] ${id} · ${label}: «${input}» dio ${describe(v)}, se esperaba ${expected}${index === undefined ? '' : `#${index + 1}`}`)
  }
}

// Una fila ya acertada se reconoce como repetida, y entre homónimos se elige la que falta.
{
  const list = byId('alcaldes-barranquilla')
  const found = list.items.map((_, i) => i === 1)
  const v = judge(list, found, 'Jaime Pumarejo')
  if (!(v.kind === 'match' && v.index === 9)) errors.push(`[prueba] con Pumarejo Heins acertado, «Jaime Pumarejo» debería ir a Pumarejo Certain (dio ${describe(v)})`)
  const again = judge(byId('presidentes'), byId('presidentes').items.map((_, i) => i === 1), 'Petro')
  if (again.kind !== 'repeat') errors.push(`[prueba] «Petro» ya acertado debería ser repeat (dio ${describe(again)})`)
}

// ── Resumen ───────────────────────────────────────────────────────────────

const byCat = new Map<Top10Category, number>()
for (const l of TOP10_LISTS) byCat.set(l.categoria, (byCat.get(l.categoria) ?? 0) + 1)
const rows = TOP10_LISTS.reduce((n, l) => n + l.items.length, 0)
const withParty = TOP10_LISTS.flatMap((l) => l.items).filter((i) => i.partido !== null).length
const profiles = new Set(TOP10_LISTS.flatMap((l) => l.items).filter((i) => hasProfile(i.nombre)).map((i) => i.nombre))
const people = new Set(TOP10_LISTS.flatMap((l) => l.items).map((i) => tokenize(i.nombre).join(' ')))

console.log(`${TOP10_LISTS.length} listas (${TOP10_LISTS.filter((l) => l.size === 10).length} de 10 filas, ${TOP10_LISTS.filter((l) => l.size === 5).length} de 5) · ${rows} filas`)
for (const c of CATEGORIES) console.log(`  ${TOP10_CATEGORY_LABEL[c].padEnd(26)} ${byCat.get(c) ?? 0} listas`)
console.log(`${people.size} personas distintas · ${withParty}/${rows} filas con partido (logo o escudo) · ${profiles.size} con ficha en la base de políticos (foto si existe)`)
console.log(`${cases.length + 2} pruebas del motor de coincidencia, ${failed} fallidas`)

if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`)
  for (const w of warnings) console.log(`  · ${w}`)
}
if (errors.length) {
  console.error(`\nErrores (${errors.length}):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log('\n✓ Listas de Top 10 validadas')
