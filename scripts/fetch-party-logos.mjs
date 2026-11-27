#!/usr/bin/env node
// Descarga los logos de los partidos y movimientos de `src/data/parties.ts` a
// `public/parties/{id}.{ext}` desde Wikipedia / Wikimedia Commons.
//
// Para cada partido:
//   1. Busca su página en Wikipedia (es; en como respaldo) y lee del wikitext el
//      parámetro `logo` de la ficha del partido.
//   2. Si no hay, busca en Commons un archivo "Logo <partido>".
//   3. Pide a la API la miniatura de 250 px (los SVG llegan rasterizados a PNG, así
//      se ven igual en todos los navegadores) junto con autor y licencia.
//   4. Valida que sea una imagen real (firma binaria) y pese más de 1 KB.
//
// Escribe `src/data/partyLogos.ts` (id → logo_url / fuente / origen / licencia).
// Un partido sin logo queda pendiente y la interfaz dibuja un escudo con su sigla.
//
// Uso:
//   npm run logos                          # solo los partidos sin logo
//   npm run logos -- --force               # vuelve a descargar todo
//   npm run logos -- --only=mais,creemos   # ids concretos
//   npm run logos -- --dry                 # no escribe nada
//   npm run logos -- --verbose             # explica cada descarte

import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const UA = 'PoliticaGridApp/1.0'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'public', 'parties')
const LOGOS_TS = path.join(ROOT, 'src', 'data', 'partyLogos.ts')

const MIN_BYTES = 1024 // por debajo de 1 KB suele ser una página de error
const THUMB_WIDTH = 250 // el logo más grande se pinta a 56 px: 250 px cubre pantallas 4x
const MIN_SIDE = 40
const MAX_RATIO = 5 // ancho/alto: más que esto es un banner de texto, no un emblema
const MIN_GAP_MS = { 'upload.wikimedia.org': 2500, default: 1200 }

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const DRY = args.includes('--dry')
const VERBOSE = args.includes('--verbose')
const ONLY = (args.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean)

// Ayudas manuales cuando la búsqueda no basta:
//   es / en → títulos de página de Wikipedia, en orden de preferencia
//   file    → archivo de Commons (sin prefijo) que se sabe que es el logo correcto
//   manual  → el logo lo puso una persona en public/parties/ y partyLogos.ts; el script no lo toca
//   skip    → motivo por el que no se descarga nada (no hay un logo fiable y libre);
//             la interfaz usa el escudo con sigla
const HINTS = {
  'partido-liberal': { es: ['Partido Liberal Colombiano'], en: ['Colombian Liberal Party'] },
  'partido-conservador': { es: ['Partido Conservador Colombiano'], en: ['Colombian Conservative Party'] },
  'centro-democratico': { manual: 'emblema aportado por el usuario (hombre con la mano al corazón)', file: 'CENTRO DEMOCRÁTICO.svg', es: ['Centro Democrático (Colombia)'], en: ['Democratic Centre (Colombia)'] },
  'pacto-historico': { es: ['Pacto Histórico', 'Pacto Histórico (partido político)'], en: ['Historic Pact for Colombia'] },
  'colombia-humana': { es: ['Colombia Humana'], en: ['Colombia Humana'] },
  'polo-democratico': { es: ['Polo Democrático Alternativo'], en: ['Alternative Democratic Pole'] },
  'alianza-verde': { manual: 'logo «Partido Verde» con el girasol, aportado por el usuario', file: 'Alianza Verde (Colombia).svg', es: ['Alianza Verde (Colombia)'], en: ['Green Alliance (Colombia)'] },
  'cambio-radical': { es: ['Cambio Radical (Colombia)', 'Cambio Radical'], en: ['Radical Change (Colombia)'] },
  'partido-de-la-u': { es: ['Partido Social de Unidad Nacional', 'Partido de la U'], en: ['Social Party of National Unity'] },
  'nuevo-liberalismo': { es: ['Nuevo Liberalismo'], en: ['New Liberalism (Colombia)'] },
  'ad-m19': { es: ['Alianza Democrática M-19'], en: ['M-19 Democratic Alliance'] },
  mira: { es: ['Movimiento Independiente de Renovación Absoluta', 'MIRA (Colombia)'], en: ['Independent Movement of Absolute Renovation'] },
  'dignidad-y-compromiso': { es: ['Dignidad y Compromiso'], en: [] },
  mais: { es: ['Movimiento Alternativo Indígena y Social'], en: ['Alternative Indigenous and Social Movement'] },
  comunes: { es: ['Comunes (partido político)', 'Partido Comunes'], en: ['Comunes'] },
  'union-patriotica': { es: ['Unión Patriótica (Colombia)', 'Unión Patriótica'], en: ['Patriotic Union (Colombia)'] },
  'partido-comunista': { es: ['Partido Comunista Colombiano'], en: ['Colombian Communist Party'] },
  progresistas: { skip: 'Wikipedia no tiene artículo propio: «Movimiento Progresistas» redirige a Colombia Humana' },
  'salvacion-nacional': { es: ['Movimiento de Salvación Nacional'], en: ['National Salvation Movement'] },
  'compromiso-ciudadano': { es: ['Compromiso Ciudadano'], en: [] },
  'primero-colombia': { es: ['Primero Colombia'], en: [] },
  'nueva-fuerza-democratica': { es: ['Nueva Fuerza Democrática'], en: ['New Democratic Force'] },
  'si-colombia': { skip: 'Wikipedia solo enlaza el logo de "Somos", su sucesor; no hay logo propio en Commons' },
  'verde-oxigeno': { es: ['Partido Verde Oxígeno', 'Verde Oxígeno'], en: ['Oxygen Green Party'] },
  creemos: { es: ['Creemos (partido político)', 'Creemos Colombia'], en: [] },
  'liga-de-gobernantes': { file: 'Logotipo del partido Liga de Gobernantes Anticorrupción (LIGA) de Colombia.svg', es: ['Liga de Gobernantes Anticorrupción'], en: [] },
  'defensores-de-la-patria': { es: ['Defensores de la Patria'], en: [] },
  'colombia-democratica': { skip: 'Wikipedia solo enlaza el logo de "Somos", su sucesor; no hay logo propio en Commons' },
  'colombia-justa-libres': { es: ['Colombia Justa Libres'], en: ['Just Colombia Free'] },
  'alianza-social-independiente': { file: 'ASI Logo.svg', es: ['Alianza Social Independiente'], en: ['Independent Social Alliance'] },
  'colombianas-y-colombianos-por-la-paz': { skip: 'no hay logo propio en Commons (la búsqueda devolvía el del Partido Comunista)' },
  'fuerza-ciudadana': { es: ['Fuerza Ciudadana (Colombia)', 'Fuerza Ciudadana'], en: [] },
  'opcion-ciudadana': { es: ['Partido Opción Ciudadana', 'Opción Ciudadana'], en: ['Citizen Option'] },
}

// ── Utilidades ────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (...a) => console.log(...a)
const trace = (...a) => VERBOSE && console.log('   ·', ...a)

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const STOP = new Set(['de', 'la', 'el', 'los', 'las', 'del', 'y', 'partido', 'movimiento', 'colombia', 'colombiano', 'colombiana'])
const significant = (s) => normalize(s).split(' ').filter((t) => t.length > 1 && !STOP.has(t))

// ── Red: un hilo, pausa por host y espera compartida ante 429 ────────────

let cooldownUntil = 0
const lastAt = new Map()

async function get(url, { json = false, maxTries = 8 } = {}) {
  const host = new URL(url).host
  const gap = MIN_GAP_MS[host] ?? MIN_GAP_MS.default
  for (let attempt = 1; ; attempt++) {
    const wait = Math.max(cooldownUntil - Date.now(), (lastAt.get(host) ?? 0) + gap - Date.now())
    if (wait > 0) await sleep(wait)
    lastAt.set(host, Date.now())
    let res
    try {
      res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Api-User-Agent': UA, Accept: json ? 'application/json' : 'image/*,*/*;q=0.8' },
        redirect: 'follow',
        signal: AbortSignal.timeout(30_000),
      })
    } catch (err) {
      if (attempt >= maxTries) throw err
      trace(`red: ${err.cause?.code ?? err.message}; reintento ${attempt}`)
      await sleep(1500 * attempt)
      continue
    }
    if (res.status === 429 || res.status === 503) {
      const retry = Math.min(Number(res.headers.get('retry-after')) || 30, 180)
      cooldownUntil = Date.now() + retry * 1000
      log(`   · HTTP ${res.status} en ${host}: espero ${retry} s`)
      if (attempt >= maxTries + 4) throw new Error(`HTTP ${res.status} persistente en ${host}`)
      continue
    }
    return res
  }
}

async function api(host, params) {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params })
  const res = await get(`https://${host}/w/api.php?${qs}`, { json: true })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${host}`)
  return res.json()
}

// ── Wikipedia: página del partido → archivo del logo ─────────────────────

const LOGO_PARAMS = ['logo', 'logotipo', 'logo_partido', 'imagen', 'image', 'escudo', 'símbolo', 'simbolo']
const IMAGE_EXT = /\.(svg|png|jpe?g|webp|gif)$/i

function logoFromWikitext(wikitext) {
  const found = new Map()
  const re = /^\s*\|\s*([\p{L}_ ]+?)\s*=\s*(.*)$/gmu
  for (let m = re.exec(wikitext); m; m = re.exec(wikitext)) {
    const key = m[1].toLowerCase().replace(/ /g, '_')
    if (!LOGO_PARAMS.includes(key) || found.has(key)) continue
    let value = m[2].replace(/<!--.*?-->/g, '').replace(/\[\[|\]\]/g, '').trim()
    value = value.replace(/^(archivo|file|imagen|image)\s*:\s*/i, '').split('|')[0].trim()
    if (IMAGE_EXT.test(value)) found.set(key, value)
  }
  const key = LOGO_PARAMS.find((k) => found.has(k))
  return key ? found.get(key) : null
}

/** El título de la página debe contener todas las palabras significativas del nombre del partido. */
function titleMatches(title, party) {
  const have = new Set(normalize(title).split(' '))
  const want = significant(party.partido)
  return want.length > 0 && want.every((t) => have.has(t))
}

const isColombianParty = (wikitext) => /colombia/i.test(wikitext.slice(0, 6000)) && /partido|party|movimiento|movement/i.test(wikitext.slice(0, 6000))

async function pageWikitext(lang, title) {
  const data = await api(`${lang}.wikipedia.org`, { action: 'parse', page: title, prop: 'wikitext', redirects: '1' })
  if (data.error) return null
  return { title: data.parse.title, wikitext: data.parse.wikitext }
}

async function searchTitles(lang, query) {
  const data = await api(`${lang}.wikipedia.org`, { action: 'query', list: 'search', srsearch: query, srlimit: '4', srnamespace: '0' })
  return (data.query?.search ?? []).map((r) => r.title)
}

/** Candidatos de archivo de logo para un partido, en orden de confianza. */
async function* logoCandidates(party) {
  const hint = HINTS[party.id] ?? { es: [], en: [] }
  const seen = new Set()

  if (hint.file) {
    seen.add(`commons:${hint.file}`)
    yield { file: hint.file, wiki: 'commons.wikimedia.org', page: null }
  }

  for (const lang of ['es', 'en']) {
    const titles = [...(hint[lang] ?? [])]
    let searched = false
    for (let i = 0; i < titles.length || !searched; i++) {
      if (i >= titles.length) {
        searched = true
        try {
          for (const t of await searchTitles(lang, `${party.nombre} Colombia partido`)) if (!titles.includes(t)) titles.push(t)
        } catch (err) {
          trace(`búsqueda ${lang}: ${err.message}`)
        }
        if (i >= titles.length) break
      }
      let page
      try {
        page = await pageWikitext(lang, titles[i])
      } catch (err) {
        trace(`${lang}:${titles[i]}: ${err.message}`)
        continue
      }
      if (!page) {
        trace(`${lang}:${titles[i]}: no existe`)
        continue
      }
      if (i >= (hint[lang] ?? []).length && !titleMatches(page.title, party)) {
        trace(`${lang}:${page.title}: el título no corresponde a «${party.partido}»`)
        continue
      }
      if (!isColombianParty(page.wikitext)) {
        trace(`${lang}:${page.title}: no parece un partido colombiano`)
        continue
      }
      const file = logoFromWikitext(page.wikitext)
      if (!file) {
        trace(`${lang}:${page.title}: la ficha no trae logo`)
        continue
      }
      const key = `${lang}:${file}`
      if (seen.has(key)) continue
      seen.add(key)
      yield { file, wiki: `${lang}.wikipedia.org`, page: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}` }
    }
  }

  // Último recurso: buscar el archivo directamente en Commons.
  try {
    const data = await api('commons.wikimedia.org', {
      action: 'query',
      list: 'search',
      srsearch: `${party.nombre.replace(/\(.*?\)/g, '')} logo`,
      srnamespace: '6',
      srlimit: '6',
    })
    const want = significant(party.partido)
    for (const r of data.query?.search ?? []) {
      const name = r.title.replace(/^(Archivo|File):/i, '')
      const norm = normalize(name)
      if (!/logo|logotipo|emblema|escudo/.test(norm) || /bandera|flag|campa|candidat|mapa|map /.test(norm)) continue
      if (want.length && !want.every((t) => norm.includes(t))) continue
      if (!IMAGE_EXT.test(name)) continue
      const key = `commons:${name}`
      if (seen.has(key)) continue
      seen.add(key)
      yield { file: name, wiki: 'commons.wikimedia.org', page: null }
    }
  } catch (err) {
    trace(`commons: ${err.message}`)
  }
}

const stripHtml = (s) =>
  String(s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

/** Metadatos y URL de miniatura del archivo (en su wiki de origen y, si no, en Commons). */
async function fileInfo(file, wiki) {
  for (const host of [...new Set([wiki, 'commons.wikimedia.org'])]) {
    const data = await api(host, {
      action: 'query',
      titles: `File:${file}`,
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: String(THUMB_WIDTH),
    })
    const info = data.query?.pages?.[0]?.imageinfo?.[0]
    if (!info) continue
    const meta = info.extmetadata ?? {}
    return {
      url: info.url,
      thumb: info.thumburl ?? info.url,
      mime: info.mime,
      w: info.width,
      h: info.height,
      descripcion: info.descriptionurl ?? info.descriptionshorturl,
      licencia: stripHtml(meta.LicenseShortName?.value) || undefined,
      autor: stripHtml(meta.Artist?.value) || undefined,
    }
  }
  return null
}

// ── Validación de la imagen ───────────────────────────────────────────────

function sniff(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { ext: 'png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8) {
    for (let i = 2; i + 9 < buf.length; ) {
      if (buf[i] !== 0xff) {
        i++
        continue
      }
      const marker = buf[i + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2
        continue
      }
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { ext: 'jpg', h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
      i += 2 + buf.readUInt16BE(i + 2)
    }
    return null
  }
  if (buf.length > 10 && buf.toString('ascii', 0, 3) === 'GIF') return { ext: 'gif', w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) }
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = buf.toString('ascii', 12, 16)
    if (fmt === 'VP8X') return { ext: 'webp', w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) }
    if (fmt === 'VP8 ') return { ext: 'webp', w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
    if (fmt === 'VP8L') {
      const bits = buf.readUInt32LE(21)
      return { ext: 'webp', w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }
    }
  }
  const head = buf.subarray(0, 600).toString('utf8').trimStart()
  if (/^(<\?xml|<svg)/i.test(head) && /<svg[\s>]/i.test(buf.subarray(0, 2000).toString('utf8'))) {
    const vb = /viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/i.exec(head)
    return { ext: 'svg', w: vb ? Number(vb[1]) : 100, h: vb ? Number(vb[2]) : 100 }
  }
  return null
}

async function downloadLogo(info) {
  const urls = [...new Set([info.thumb, info.url])]
  for (const url of urls) {
    let res
    try {
      res = await get(url)
    } catch (err) {
      trace(`descarga ${url}: ${err.message}`)
      continue
    }
    const type = res.headers.get('content-type') ?? ''
    if (!res.ok || !/^image\//i.test(type)) {
      trace(`descarga ${url}: HTTP ${res.status} ${type}`)
      continue
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length <= MIN_BYTES) {
      trace(`descarga: ${buffer.length} B es demasiado poco`)
      continue
    }
    const img = sniff(buffer)
    if (!img) {
      trace('descarga: la firma binaria no es de una imagen conocida')
      continue
    }
    if (img.w < MIN_SIDE || img.h < MIN_SIDE) {
      trace(`descarga: ${img.w}×${img.h} es muy pequeña`)
      continue
    }
    if (img.w / img.h > MAX_RATIO || img.h / img.w > MAX_RATIO) {
      trace(`descarga: proporción ${img.w}×${img.h} no es un emblema`)
      continue
    }
    return { buffer, ...img }
  }
  return null
}

// ── Principal ─────────────────────────────────────────────────────────────

function renderLogosTs(logos) {
  const body = Object.keys(logos)
    .sort()
    .map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(logos[id])},`)
    .join('\n')
  return `// Generado por \`npm run logos\` (scripts/fetch-party-logos.mjs). No editar a mano.

export interface PartyLogoInfo {
  logo_url: string
  logo_fuente: string
  logo_origen?: string
  logo_licencia?: string
}

export const PARTY_LOGOS: Record<string, PartyLogoInfo> = {
${body}
}
`
}

async function main() {
  const { PARTIES } = await import(path.join(ROOT, 'src', 'data', 'parties.ts'))
  const { PARTY_LOGOS } = await import(path.join(ROOT, 'src', 'data', 'partyLogos.ts'))
  const logos = { ...PARTY_LOGOS }
  if (!DRY) await mkdir(OUT_DIR, { recursive: true })

  const unknown = ONLY.filter((id) => !PARTIES.some((p) => p.id === id))
  if (unknown.length) throw new Error(`ids desconocidos: ${unknown.join(', ')}`)
  const targets = PARTIES.filter((p) => (ONLY.length ? ONLY.includes(p.id) : FORCE || !logos[p.id]))
  log(`Logos: ${targets.length} partido(s) por procesar de ${PARTIES.length}${DRY ? ' (simulación)' : ''}\n`)

  const failed = []
  // Un mismo archivo no puede ser el logo de dos partidos (señal de un emparejamiento erróneo).
  const claimed = new Map(Object.entries(logos).filter(([, l]) => l.logo_origen).map(([id, l]) => [l.logo_origen, id]))
  let n = 0
  for (const party of targets) {
    const tag = `[${String(++n).padStart(2)}/${targets.length}] ${party.partido}`
    const manual = HINTS[party.id]?.manual
    if (manual) {
      log(`${tag}  = se conserva el logo manual: ${manual}`)
      continue
    }
    const skip = HINTS[party.id]?.skip
    if (skip) {
      if (!DRY && logos[party.id]) {
        claimed.delete(logos[party.id].logo_origen)
        delete logos[party.id]
        for (const f of await readdir(OUT_DIR)) if (f.startsWith(`${party.id}.`)) await unlink(path.join(OUT_DIR, f))
        await writeFile(LOGOS_TS, renderLogosTs(logos))
      }
      log(`${tag}  – sin logo: ${skip}`)
      failed.push(party)
      continue
    }
    let saved = null
    try {
      for await (const cand of logoCandidates(party)) {
        trace(`candidato ${cand.wiki}: ${cand.file}`)
        const info = await fileInfo(cand.file, cand.wiki)
        if (!info) {
          trace('el archivo no existe')
          continue
        }
        const owner = info.descripcion && claimed.get(info.descripcion)
        if (owner && owner !== party.id) {
          trace(`el archivo ya es el logo de «${owner}»`)
          continue
        }
        const image = await downloadLogo(info)
        if (!image) continue
        saved = { image, info, cand }
        break
      }
    } catch (err) {
      log(`${tag}  ✗ error: ${err.message}`)
      failed.push(party)
      continue
    }

    if (!saved) {
      log(`${tag}  ✗ sin logo (se usará el escudo con la sigla)`)
      failed.push(party)
      continue
    }

    const { image, info, cand } = saved
    if (info.descripcion) claimed.set(info.descripcion, party.id)
    if (!DRY) {
      // Un logo viejo con otra extensión no debe quedarse huérfano.
      for (const f of await readdir(OUT_DIR)) if (f.startsWith(`${party.id}.`) && f !== `${party.id}.${image.ext}`) await unlink(path.join(OUT_DIR, f))
      await writeFile(path.join(OUT_DIR, `${party.id}.${image.ext}`), image.buffer)
      logos[party.id] = {
        logo_url: `/parties/${party.id}.${image.ext}`,
        logo_fuente: cand.wiki.startsWith('commons') ? 'Wikimedia Commons' : cand.wiki.startsWith('es.') ? 'Wikipedia (es)' : 'Wikipedia (en)',
        ...(info.descripcion || cand.page ? { logo_origen: info.descripcion ?? cand.page } : {}),
        ...(info.licencia ? { logo_licencia: info.licencia } : {}),
      }
      await writeFile(LOGOS_TS, renderLogosTs(logos))
    }
    log(`${tag}  ✓ ${cand.file} → ${party.id}.${image.ext} (${image.w}×${image.h}, ${(image.buffer.length / 1024).toFixed(1)} KB${info.licencia ? `, ${info.licencia}` : ''})`)
  }

  const have = PARTIES.filter((p) => logos[p.id])
  const pending = PARTIES.filter((p) => !logos[p.id])
  log('\n── Resumen ─────────────────────────────────────')
  log(`Con logo   : ${have.length} de ${PARTIES.length}`)
  log(`Pendientes : ${pending.length}${pending.length ? ` → ${pending.map((p) => `${p.partido} (${p.id})`).join(', ')}` : ''}`)
  if (pending.length) log('Los pendientes se muestran como escudo con sigla y colores. Para forzar un archivo, agrega su título de página en HINTS.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
