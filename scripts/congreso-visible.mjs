// Descarga los congresistas de Congreso Visible (Uniandes, congresovisible.uniandes.edu.co): los listados de Cámara
// y Senado de cada cuatrienio, un índice de personas únicas y el perfil de cada una. Guarda todo en
// scripts/.cache/cv/ (no se versiona). Después, `npm run congreso:generar` cruza los perfiles con la base.
//
//   npm run congreso            descarga lo que falte (listados, índice y perfiles); reanuda si se corta
//   npm run congreso -- --listados   vuelve a bajar los listados (p. ej. cuando cambia el Congreso vigente)
//
// Notas de uso: tres conexiones con pausas de 250 ms y reintentos con espera creciente ante 429 o 5xx;
// agente genérico `PoliticaGridApp/1.0`. Unos 1.900 perfiles tardan alrededor de 35 minutos.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DIR = fileURLToPath(new URL('./.cache/cv/', import.meta.url))
const BASE = 'https://congresovisible.uniandes.edu.co'
const UA = { 'User-Agent': 'PoliticaGridApp/1.0' }
// Cuatrienios con datos (10 = 2026–2030) y corporaciones (1 = Cámara, 2 = Senado).
const CUATRIENIOS = [1, 2, 4, 6, 7, 8, 9, 10]
const CORPORACIONES = [1, 2]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(`${DIR}perfiles`, { recursive: true })

async function pedir(url) {
  for (let intento = 0; intento < 4; intento++) {
    try {
      const res = await fetch(url, { headers: UA })
      if (res.status === 429 || res.status >= 500) { await sleep(3000 * (intento + 1)); continue }
      if (!res.ok) return null
      return await res.text()
    } catch {
      await sleep(2000)
    }
  }
  return null
}

// 1. Listados
const reListados = process.argv.includes('--listados')
for (const corp of CORPORACIONES) {
  for (const cuat of CUATRIENIOS) {
    const file = `${DIR}l-${corp}-${cuat}.html`
    if (existsSync(file) && !reListados) continue
    const html = await pedir(`${BASE}/congresistas/?page=1&rows=500&corporacion=${corp}&cuatrienio=${cuat}`)
    if (!html) { console.log(`Sin listado: corporación ${corp}, cuatrienio ${cuat}`); continue }
    writeFileSync(file, html)
    await sleep(500)
  }
}

// 2. Índice de personas únicas
const dec = (s) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
const personas = new Map()
for (const corp of CORPORACIONES) {
  for (const cuat of CUATRIENIOS) {
    const file = `${DIR}l-${corp}-${cuat}.html`
    if (!existsSync(file)) continue
    const html = readFileSync(file, 'utf8')
    for (const card of html.split('<div class=""><a href="/congresistas/perfil/').slice(1)) {
      const m = /^([^"]+)\/(\d+)"/.exec(card)
      if (!m) continue
      const nombre = dec((/alt="([^"]*)"/.exec(card) || [])[1] || '')
      const lis = [...card.matchAll(/<li>(.*?)<\/li>/g)].map((x) => dec(x[1].replace(/<[^>]+>|<!--.*?-->/g, '').trim()))
      const p = personas.get(m[2]) ?? { id: m[2], slug: m[1], nombre, apariciones: [] }
      p.apariciones.push({ corp, cuat, partido: lis[1] || '' })
      personas.set(m[2], p)
    }
  }
}
const indice = [...personas.values()]
writeFileSync(`${DIR}indice.json`, JSON.stringify(indice))
console.log(`Índice: ${indice.length} personas únicas`)

// 3. Perfiles (solo los campos que usa el generador)
const cola = indice.filter((p) => !existsSync(`${DIR}perfiles/${p.id}.json`))
console.log(`Perfiles por descargar: ${cola.length}`)
let hechos = 0
let fallos = 0
async function perfil(p) {
  const html = await pedir(`${BASE}/congresistas/perfil/${p.slug}/${p.id}/`)
  const m = html && /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/.exec(html)
  const d = m && JSON.parse(m[1]).props?.pageProps?.data
  if (!d) { fallos++; console.log('Falló', p.id, p.nombre); return }
  const salida = {
    id: p.id, nombres: d.nombres, apellidos: d.apellidos, genero: d.genero?.nombre ?? null, fallecido: d.fecha_fallecimiento ?? null,
    nacimiento: d.lugar_nacimiento ? { municipio: d.lugar_nacimiento.nombre, departamento: d.lugar_nacimiento.departamento?.nombre ?? null } : null,
    periodos: (d.congresista?.detalle ?? []).map((x) => ({
      corp: x.corporacion_id, cuat: x.cuatrienio?.nombre ?? null, ini: x.cuatrienio?.fechaInicio ?? null, fin: x.cuatrienio?.fechaFin ?? null,
      partido: x.partido?.nombre ?? null, circ: x.circunscripcion?.nombre ?? null, dep: x.departamento?.nombre ?? null,
    })),
    trayectoria: (d.persona_trayectoria_publica ?? []).map((x) => ({ cargo: x.cargo, fecha: x.fecha, fin: x.fecha_final, partido: x.partido?.nombre ?? null })),
  }
  writeFileSync(`${DIR}perfiles/${p.id}.json`, JSON.stringify(salida))
  hechos++
  if (hechos % 100 === 0) console.log(`  ${hechos} perfiles`)
}
let i = 0
async function trabajador() {
  while (i < cola.length) {
    await perfil(cola[i++])
    await sleep(250)
  }
}
await Promise.all([trabajador(), trabajador(), trabajador()])
console.log(`Listo: ${hechos} descargados, ${fallos} fallos`)
