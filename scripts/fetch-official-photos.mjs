#!/usr/bin/env node
// Descarga retratos de los políticos de la base de datos y los guarda en
// `public/politicians/`, con una cascada de fuentes:
//
//   1. Portales oficiales del Estado (.gov.co)
//        · Senado de la República  → directorio de senadores
//        · Cámara de Representantes → buscador del sitio + ficha del representante
//        · Presidencia / Ministerios → páginas de perfil indicadas en OFFICIAL_HINTS
//   2. Congreso Visible (Universidad de los Andes) → fichas de congresistas desde 2002
//   3. Wikipedia / Wikimedia Commons (es, y en como último recurso)
//
// Escribe `src/data/photos.ts` (id → foto_url / foto_fuente / foto_origen), que
// `src/data/politicians.ts` fusiona con cada ficha.
//
// Uso:
//   npm run fotos                      # procesa a quien aún no tiene foto
//   npm run fotos -- --force           # vuelve a descargar todo
//   npm run fotos -- --only=uribe-velez,petro-urrego
//   npm run fotos -- --no-wiki         # solo fuentes oficiales y Congreso Visible
//   npm run fotos -- --dry             # no escribe nada
//   npm run fotos -- --verbose         # explica cada descarte

import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// ── Configuración ─────────────────────────────────────────────────────────

const UA = 'PoliticaGridApp/1.0'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'public', 'politicians')
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache')
const PHOTOS_TS = path.join(ROOT, 'src', 'data', 'photos.ts')

const CONCURRENCY = 3
const MIN_BYTES = 5 * 1024 // por debajo de 5 KB suele ser un placeholder roto
const MIN_SIDE = 90 // px
const MAX_RATIO = 1.7 // ancho/alto: más ancho que esto es un banner, no un retrato
const MIN_RATIO = 0.45

const FUENTE = {
  senado: 'Senado de la República',
  camara: 'Cámara de Representantes',
  oficial: 'Presidencia / Ministerio',
  congresoVisible: 'Congreso Visible (Uniandes)',
  concejoMedellin: 'Concejo de Medellín',
  wikimedia: 'Wikimedia',
}
const OFICIALES = new Set([FUENTE.senado, FUENTE.camara, FUENTE.oficial, FUENTE.concejoMedellin])

/**
 * Páginas de perfil oficiales (.gov.co) de Presidencia o Ministerios, por id de
 * político. Presidencia y varios ministerios no responden a clientes
 * automáticos y no hay un directorio común, así que esta tabla es el punto de
 * entrada para agregar perfiles a mano: se extrae el retrato de la página.
 *   'id-del-politico': ['https://www.minhacienda.gov.co/...']
 */
const OFFICIAL_HINTS = {}

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const FORCE = flag('force')
const DRY = flag('dry')
const NO_WIKI = flag('no-wiki')
const VERBOSE = flag('verbose')
const TRACE = flag('trace') // imprime cada petición con su duración
const ONLY = opt('only')?.split(',').filter(Boolean)

const log = (...m) => console.log(...m)
const why = (...m) => VERBOSE && console.log('   ·', ...m)

// ── Utilidades de texto ───────────────────────────────────────────────────

const STOP = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'el', 'e'])

function tokens(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t))
}

/**
 * Dos nombres coinciden si comparten al menos dos palabras y uno contiene al
 * otro por completo (no importa el orden: «Agudelo García Ana Paola» ≈
 * «Ana Paola Agudelo»).
 */
function nameMatches(a, b) {
  const A = tokens(a)
  const B = tokens(b)
  const shared = A.filter((t) => B.includes(t)).length
  return shared >= 2 && (shared === A.length || shared === B.length)
}

const matchesAny = (names, other) => names.some((n) => nameMatches(n, other))

// ── HTTP (sin dependencias) ───────────────────────────────────────────────

const lastHit = new Map()
const MIN_GAP = (host) => {
  if (host === 'upload.wikimedia.org') return 400
  if (host.endsWith('wikipedia.org') || host.endsWith('wikimedia.org')) return 1300 // la API REST limita ráfagas
  if (host.endsWith('.gov.co') || host.endsWith('uniandes.edu.co')) return 350
  return 200
}
/** Pausa común por host: si uno recibe 429, todos los trabajadores esperan. */
const cooldownUntil = new Map()
const relaxedHosts = new Set()
const TLS_ERRORS = new Set([
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'UNABLE_TO_GET_ISSUER_CERT',
  'SELF_SIGNED_CERT_IN_CHAIN',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'CERT_HAS_EXPIRED',
  'ERR_TLS_CERT_ALTNAME_INVALID',
])

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function throttle(host) {
  const slot = Math.max(Date.now(), (lastHit.get(host) ?? 0) + MIN_GAP(host), cooldownUntil.get(host) ?? 0)
  lastHit.set(host, slot)
  const wait = slot - Date.now()
  if (wait > 0) await sleep(wait)
}

function rawGet(url, { insecure = false, headers = {}, timeout = 25000 } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const lib = u.protocol === 'http:' ? http : https
    const req = lib.request(
      u,
      {
        method: 'GET',
        headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Encoding': 'identity', ...headers },
        rejectUnauthorized: !insecure,
        timeout,
      },
      (res) => {
        const chunks = []
        let size = 0
        res.on('data', (c) => {
          size += c.length
          if (size > 25 * 1024 * 1024) req.destroy(new Error('respuesta demasiado grande'))
          else chunks.push(c)
        })
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) }))
        res.on('error', reject)
      },
    )
    req.on('timeout', () => req.destroy(new Error('tiempo de espera agotado')))
    req.on('error', reject)
    req.end()
  })
}

/**
 * GET con redirecciones, reintentos ante 429/5xx y tolerancia a certificados
 * mal encadenados SOLO en hosts `.gov.co` (se descargan imágenes públicas, sin
 * credenciales). Devuelve null si la petición falla.
 */
async function get(url, options = {}, depth = 0) {
  if (depth > 5) return null
  const host = new URL(url).hostname
  let rateLimited = 0
  for (let attempt = 0; attempt < 3; attempt++) {
    await throttle(host)
    let res
    const started = Date.now()
    try {
      res = await rawGet(url, { ...options, insecure: relaxedHosts.has(host) })
      if (TRACE) console.log(`     ${Date.now() - started} ms  ${res.status}  ${url.slice(0, 110)}`)
    } catch (err) {
      if (TRACE) console.log(`     ${Date.now() - started} ms  ERR ${err.code ?? err.message}  ${url.slice(0, 110)}`)
      if (TLS_ERRORS.has(err.code) && host.endsWith('.gov.co') && !relaxedHosts.has(host)) {
        relaxedHosts.add(host)
        log(`   ⚠ certificado no verificable en ${host}: se tolera para esta descarga`)
        attempt--
        continue
      }
      why(`fallo de red en ${url}: ${err.code ?? err.message}`)
      if (attempt === 2) return null
      await sleep(600 * (attempt + 1))
      continue
    }
    if ([301, 302, 303, 307, 308].includes(res.status) && res.headers.location) {
      return get(new URL(res.headers.location, url).href, options, depth + 1)
    }
    if (res.status === 429 || res.status >= 500) {
      const retry = Number(res.headers['retry-after'])
      const waitS = Math.min(120, Number.isFinite(retry) ? retry + 1 : 8 * (attempt + 1))
      cooldownUntil.set(host, Math.max(cooldownUntil.get(host) ?? 0, Date.now() + waitS * 1000))
      why(`HTTP ${res.status} en ${host}: todos esperan ${waitS} s`)
      attempt-- // un 429 no cuenta como intento fallido
      if (++rateLimited > 12) return null
      continue
    }
    return { ...res, url }
  }
  return null
}

const getText = async (url, options) => {
  const r = await get(url, options)
  return r && r.status === 200 ? r.body.toString('utf8') : null
}

const getJson = async (url, options) => {
  const text = await getText(url, { headers: { Accept: 'application/json' }, ...options })
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

// ── Validación de imágenes ────────────────────────────────────────────────

/** Tipo y dimensiones leyendo la cabecera (JPEG, PNG, WebP). */
function imageInfo(buf) {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++
        continue
      }
      const marker = buf[i + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0xff) {
        i += marker === 0xff ? 1 : 2
        continue
      }
      if (marker === 0xd9) break
      const length = buf.readUInt16BE(i + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { ext: 'jpg', h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
      }
      i += 2 + length
    }
    return null
  }
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { ext: 'png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  }
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = buf.toString('ascii', 12, 16)
    if (fmt === 'VP8X') return { ext: 'webp', w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) }
    if (fmt === 'VP8 ') return { ext: 'webp', w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
    if (fmt === 'VP8L') {
      const bits = buf.readUInt32LE(21)
      return { ext: 'webp', w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }
    }
  }
  return null
}

const NOT_A_PORTRAIT = /logo|escudo|banner|icon|icono|sprite|placeholder|default|sin[-_]?foto|no[-_]?image|avatar[-_]?default|header|footer|background|fondo|bandera|gov-?co/i

/** Descarga una imagen y comprueba que parezca un retrato. */
async function downloadImage(url) {
  if (NOT_A_PORTRAIT.test(decodeURIComponent(url.split('?')[0]).split('/').pop() ?? '')) {
    why(`descartada por nombre de archivo: ${url}`)
    return null
  }
  const res = await get(url, { headers: { Accept: 'image/*,*/*;q=0.5' } })
  if (!res || res.status !== 200) {
    why(`HTTP ${res?.status ?? 'sin respuesta'}: ${url}`)
    return null
  }
  const type = String(res.headers['content-type'] ?? '')
  if (!type.toLowerCase().startsWith('image/') || type.includes('svg')) {
    why(`content-type no válido (${type}): ${url}`)
    return null
  }
  if (res.body.length <= MIN_BYTES) {
    why(`pesa ${res.body.length} B (≤ 5 KB): ${url}`)
    return null
  }
  const info = imageInfo(res.body)
  if (!info) {
    why(`formato no reconocido: ${url}`)
    return null
  }
  const ratio = info.w / info.h
  if (info.w < MIN_SIDE || info.h < MIN_SIDE || ratio > MAX_RATIO || ratio < MIN_RATIO) {
    why(`dimensiones poco adecuadas (${info.w}×${info.h}): ${url}`)
    return null
  }
  return { buffer: res.body, ext: info.ext, w: info.w, h: info.h }
}

// ── Fuente 1a: Senado de la República ─────────────────────────────────────

async function loadSenadoIndex() {
  const entries = new Map()
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const pages = ['https://www.senado.gov.co/index.php/el-senado/senadores']
  for (const letter of letters) pages.push(`https://www.senado.gov.co/index.php/el-senado/senadores?lastletter=${letter}`)
  for (const page of pages) {
    const html = await getText(page)
    if (!html) continue
    for (const block of html.split('modazdirectory__row').slice(1)) {
      const img = block.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*modazdirectory__image/)
      const name = block.match(/<h3>([^<]+)<\/h3>/)?.[1]?.trim()
      const party = block.match(/<h3>[^<]+<\/h3>\s*<p>([^<]*)<\/p>/)?.[1]?.trim() ?? ''
      if (!img || !name) continue
      entries.set(name, { name, party, image: new URL(img[1], page).href })
    }
  }
  return [...entries.values()]
}

// ── Fuente 1b: Cámara de Representantes ───────────────────────────────────

async function camaraCandidates(p, names) {
  const query = tokens(p.nombre).join(' ')
  const html = await getText(`https://www.camara.gov.co/?s=${encodeURIComponent(query)}`)
  if (!html) return []
  const profiles = new Map()
  for (const m of html.matchAll(/<a[^>]*href="(https:\/\/www\.camara\.gov\.co\/representantes\/[a-z0-9-]+\/)(?:\?[^"]*)?"[^>]*>([^<]{4,90})<\/a>/gi)) {
    const text = m[2].trim()
    if (matchesAny(names, text)) profiles.set(m[1], text)
  }
  if (profiles.size > 1) {
    why(`varias fichas de la Cámara para ${p.nombre}: ${[...profiles.values()].join(' | ')}`)
    return []
  }
  const out = []
  for (const [url, text] of profiles) {
    const page = await getText(url)
    if (!page) continue
    const tag = page.match(/<img[^>]*class="[^"]*\bfoto\b[^"]*"[^>]*>/i)?.[0]
    const src = tag?.match(/data-src="([^"]+)"/i)?.[1] ?? tag?.match(/\ssrc="(https?:[^"]+)"/i)?.[1]
    if (src) out.push({ url: new URL(src, url).href, fuente: FUENTE.camara, origen: url, etiqueta: text })
  }
  return out
}

// ── Fuente 1c: Presidencia / Ministerios (páginas indicadas a mano) ───────

async function officialHintCandidates(p) {
  const out = []
  for (const pageUrl of OFFICIAL_HINTS[p.id] ?? []) {
    const html = await getText(pageUrl)
    if (!html) continue
    const found = []
    const og = html.match(/property="og:image"[^>]*content="([^"]+)"/i)?.[1] ?? html.match(/content="([^"]+)"[^>]*property="og:image"/i)?.[1]
    if (og) found.push(og)
    for (const m of html.matchAll(/<img[^>]*(?:data-src|src)="([^"]+\.(?:jpe?g|png|webp)[^"]*)"[^>]*>/gi)) found.push(m[1])
    for (const src of found.slice(0, 12)) out.push({ url: new URL(src, pageUrl).href, fuente: FUENTE.oficial, origen: pageUrl })
  }
  return out
}

// ── Fuente 2: Congreso Visible ────────────────────────────────────────────

/**
 * Congreso Visible publica un listado por corporación y cuatrienio. Se
 * descargan una sola vez (con 500 filas por página caben completos) y se
 * indexan por id de perfil; luego se busca por nombre en memoria.
 */
async function loadCongresoVisibleIndex() {
  const byId = new Map()
  for (const corp of [1, 2]) {
    for (let cuat = 1; cuat <= 12; cuat++) {
      const url = `https://congresovisible.uniandes.edu.co/congresistas/?page=1&rows=500&search=&corporacion=${corp}&cuatrienio=${cuat}&`
      const html = await getText(url)
      if (!html) continue
      for (const card of html.split('</a>')) {
        const m = card.match(/href="(\/congresistas\/perfil\/[^"]+\/(\d+))"[\s\S]*?<img src="([^"]*\/uploads\/persona\/[^"]+)" alt="([^"]*)"/)
        if (m && !byId.has(m[2])) byId.set(m[2], { id: m[2], perfil: new URL(m[1], url).href, img: m[3], nombre: m[4] })
      }
    }
  }
  return [...byId.values()]
}

function congresoVisibleCandidates(p, names, index) {
  const hits = index.filter((e) => matchesAny(names, e.nombre))
  if (hits.length > 1) {
    why(`Congreso Visible: ${hits.length} perfiles para ${p.nombre}: ${hits.map((h) => h.nombre).join(' | ')}`)
    return []
  }
  if (hits.length === 0) return []
  const h = hits[0]
  const big = h.img.replace(/-\d+px(\.\w+)$/, '-510px$1')
  return [
    { url: big, fuente: FUENTE.congresoVisible, origen: h.perfil, etiqueta: h.nombre },
    { url: h.img, fuente: FUENTE.congresoVisible, origen: h.perfil, etiqueta: h.nombre },
  ]
}

// ── Fuente 2b: Concejo de Medellín (perfiles con og:image) ──────────────

function slug(text) {
  return tokens(text).join('-')
}

/** Perfiles del Concejo de Medellín: la URL sale del nombre (con y sin segundos nombres). */
async function concejoMedellinCandidates(p) {
  const t = tokens(p.nombre)
  const variants = [slug(p.nombre), [t[0], ...t.slice(-2)].join('-'), [...t.slice(0, 2), ...t.slice(-2)].join('-')]
  for (const v of [...new Set(variants)]) {
    const url = `https://www.concejodemedellin.gov.co/blog/concejales/${v}/`
    const html = await getText(url)
    if (!html) continue
    const title = /<meta property="og:title" content="([^"]+)"/.exec(html)?.[1]?.replace(/ - Concejo de Medellín$/, '')
    const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1]
    if (!title || !image || !nameMatches(p.nombre, title)) {
      why(`Concejo de Medellín: ${url} no corresponde a ${p.nombre} (${title ?? 'sin título'})`)
      continue
    }
    return [{ url: image, fuente: FUENTE.concejoMedellin, origen: url, etiqueta: title }]
  }
  return []
}

// ── Fuente 3: Wikipedia / Wikimedia Commons ───────────────────────────────

const WIKI_DESC = /colombian|polític|president|senador|represent|alcald|gobernador|ministr|candidat|guerrill|diplom|embajador|abogad|economista|periodista|congres|fiscal|procurador|contralor|registrador|constituyente|sindical|activista|ingenier/i

/**
 * Título exacto de Wikipedia para quien la búsqueda por nombre no encuentra
 * (apodos, nombres formales distintos al título). id → título.
 */
const WIKI_TITLES = {}
// Fichas regionales: título del artículo que enlazaban las propias tablas electorales de Wikipedia.
try {
  Object.assign(WIKI_TITLES, JSON.parse(await readFile(path.join(ROOT, 'scripts', 'wiki-titulos-regionales.json'), 'utf8')))
} catch {
  /* sin títulos regionales */
}

/** Lugares de los cargos de una ficha regional (para exigir que el artículo hable de ellos). */
function regionalPlaces(p) {
  return [...p.territorial.gobernador, ...p.territorial.alcalde, ...p.territorial.concejal].map((x) => tokens(x).join(' '))
}

function wikiQueries(p) {
  const t = tokens(p.nombre)
  const qs = [p.nombre, t.slice(0, -1).join(' ')]
  if (p.alias) qs.push(`${p.alias} ${t.at(-1)}`)
  return [...new Set(qs.filter((q) => q && q.split(' ').length >= 2))]
}

async function wikiCandidates(lang, p, names) {
  const host = `${lang}.wikipedia.org`
  // Fichas regionales: solo el artículo conocido (sin búsqueda libre, que rinde poco y arriesga homónimos).
  const queries = p.perfil_regional ? (WIKI_TITLES[p.id] ? wikiQueries(p).slice(0, 1) : []) : wikiQueries(p)
  for (const q of queries) {
    const forced = Boolean(WIKI_TITLES[p.id]) && q === wikiQueries(p)[0]
    const search = forced
      ? { pages: [{ key: WIKI_TITLES[p.id].replace(/ /g, '_'), title: WIKI_TITLES[p.id], description: 'político colombiano' }] }
      : await getJson(`https://${host}/w/rest.php/v1/search/page?q=${encodeURIComponent(q)}&limit=8`)
    for (const page of search?.pages ?? []) {
      if (!forced && !matchesAny(names, page.title)) continue
      if (!forced && page.description && !WIKI_DESC.test(page.description)) continue
      const summary = await getJson(`https://${host}/api/rest_v1/page/summary/${encodeURIComponent(page.key)}`)
      if (!summary || summary.type === 'disambiguation') continue
      const blob = `${summary.description ?? ''} ${summary.extract ?? ''}`
      if (!/colombia/i.test(blob) || !WIKI_DESC.test(blob)) {
        why(`Wikipedia (${lang}): «${page.title}» no parece un político colombiano`)
        continue
      }
      // Ficha regional hallada por búsqueda: el artículo debe nombrar su departamento o ciudad (evita homónimos).
      if (p.perfil_regional && !forced) {
        const text = tokens(blob).join(' ')
        if (!regionalPlaces(p).some((place) => text.includes(place))) {
          why(`Wikipedia (${lang}): «${page.title}» no menciona ${regionalPlaces(p).join(' / ')}; se descarta por posible homónimo`)
          continue
        }
      }
      const original = summary.originalimage
      const thumb = summary.thumbnail
      const urls = []
      // Se prefiere el original si es liviano; si no, la miniatura de 500 px (paso admitido por Wikimedia).
      if (original && original.width <= 900) urls.push(original.source)
      if (thumb) {
        const resized = thumb.source.replace(/\/\d+px-/, '/500px-')
        urls.push(thumb.width >= 500 || !original || original.width > 900 ? resized : thumb.source, thumb.source)
      }
      if (original && original.width > 900 && !thumb) urls.push(original.source)
      if (urls.length === 0) {
        why(`Wikipedia (${lang}): «${page.title}» no tiene imagen`)
        return []
      }
      const origen = summary.content_urls?.desktop?.page ?? `https://${host}/wiki/${page.key}`
      return [...new Set(urls)].map((url) => ({ url, fuente: FUENTE.wikimedia, origen, etiqueta: page.title }))
    }
  }
  return []
}

// ── Orquestación ──────────────────────────────────────────────────────────

/** Guarda en disco (24 h) el resultado de una carga lenta, para poder repetir la ejecución. */
async function cached(name, loader) {
  const file = path.join(CACHE_DIR, `${name}.json`)
  try {
    if (Date.now() - (await stat(file)).mtimeMs < 24 * 3600 * 1000) return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    /* sin caché */
  }
  const data = await loader()
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(file, JSON.stringify(data))
  return data
}

async function loadPoliticians() {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'politicians.ts')).href)
  return mod.POLITICIANS
}

async function loadExisting() {
  try {
    const mod = await import(`${pathToFileURL(PHOTOS_TS).href}?t=${Date.now()}`)
    return { ...mod.FOTOS }
  } catch {
    return {}
  }
}

async function saveImage(id, image) {
  const final = path.join(OUT_DIR, `${id}.${image.ext}`)
  // Un solo archivo por político: se borran restos con otra extensión.
  for (const name of await readdir(OUT_DIR)) {
    if (name.startsWith(`${id}.`) && name !== `${id}.${image.ext}`) await unlink(path.join(OUT_DIR, name))
  }
  await writeFile(final, image.buffer)
  return `/politicians/${id}.${image.ext}`
}

async function tryCandidates(p, candidates) {
  for (const c of candidates) {
    const image = await downloadImage(c.url)
    if (image) return { ...c, image }
  }
  return null
}

function renderPhotosTs(fotos) {
  const body = Object.keys(fotos)
    .sort()
    .map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(fotos[id])},`)
    .join('\n')
  return `// Generado por \`npm run fotos\` (scripts/fetch-official-photos.mjs). No editar a mano.

export interface FotoInfo {
  foto_url: string
  foto_fuente: string
  foto_origen?: string
}

export const FOTOS: Record<string, FotoInfo> = {
${body}
}
`
}

async function main() {
  const politicians = await loadPoliticians()
  // Se conservan las fotos ya descargadas; --force o --only las reemplazan solo si se halla una nueva.
  const fotos = await loadExisting()
  if (!DRY) await mkdir(OUT_DIR, { recursive: true })

  const targets = politicians.filter((p) => (ONLY ? ONLY.includes(p.id) : FORCE || !fotos[p.id]))
  log(`Políticos: ${politicians.length} · por procesar: ${targets.length}${FORCE ? ' (--force)' : ''}`)

  log('\nCargando el directorio de senadores…')
  const senado = await cached('senado', loadSenadoIndex)
  log(`  ${senado.length} senadores con foto en senado.gov.co`)
  log('Cargando el índice de Congreso Visible…')
  const cvIndex = await cached('congreso-visible', loadCongresoVisibleIndex)
  log(`  ${cvIndex.length} congresistas en Congreso Visible\n`)

  async function resolve(p) {
    const names = [p.nombre, p.alias].filter(Boolean)
    let hit = null

    // 1a. Senado
    if (p.congreso.senador) {
      const matches = senado.filter((s) => nameMatches(p.nombre, s.name))
      if (matches.length === 1) {
        hit = await tryCandidates(p, [{ url: matches[0].image, fuente: FUENTE.senado, origen: 'https://www.senado.gov.co/index.php/el-senado/senadores' }])
      } else if (matches.length > 1) why(`Senado: ${matches.length} coincidencias para ${p.nombre}`)
    }
    // 1b. Cámara (solo quienes fueron representantes en 2020+)
    if (!hit && p.congreso.representante_camara && p.decadas_activo.includes('2020s')) {
      hit = await tryCandidates(p, await camaraCandidates(p, names))
    }
    // 1c. Presidencia / Ministerios (páginas indicadas)
    if (!hit && OFFICIAL_HINTS[p.id]) hit = await tryCandidates(p, await officialHintCandidates(p))
    // 2. Congreso Visible
    if (!hit && (p.congreso.senador || p.congreso.representante_camara)) {
      hit = await tryCandidates(p, congresoVisibleCandidates(p, names, cvIndex))
    }
    // 2b. Concejo de Medellín
    if (!hit && p.territorial.concejal.includes('Medellín')) {
      hit = await tryCandidates(p, await concejoMedellinCandidates(p))
    }
    // 3. Wikipedia / Wikimedia (las fichas regionales solo en español: la edición en inglés casi nunca las cubre)
    if (!hit && !NO_WIKI) {
      hit = await tryCandidates(p, await wikiCandidates('es', p, names))
      if (!hit && !p.perfil_regional) hit = await tryCandidates(p, await wikiCandidates('en', p, names))
    }
    return hit
  }

  // photos.ts se reescribe tras cada hallazgo para no perder trabajo si algo falla.
  let persisting = Promise.resolve()
  const persist = () => {
    if (DRY) return persisting
    persisting = persisting.then(() => writeFile(PHOTOS_TS, renderPhotosTs(fotos)))
    return persisting
  }

  let done = 0
  const queue = [...targets]
  const worker = async () => {
    for (let p = queue.shift(); p; p = queue.shift()) {
      const hit = await resolve(p)
      const tag = `[${String(++done).padStart(3)}/${targets.length}] ${p.nombre}`
      if (hit) {
        if (!DRY) {
          const foto_url = await saveImage(p.id, hit.image)
          fotos[p.id] = { foto_url, foto_fuente: hit.fuente, ...(hit.origen ? { foto_origen: hit.origen } : {}) }
          await persist()
        }
        log(`${tag}  ✓ ${hit.fuente} (${hit.image.w}×${hit.image.h}, ${(hit.image.buffer.length / 1024).toFixed(0)} KB)`)
      } else {
        log(`${tag}  ✗ sin foto nueva`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (!DRY) await writeFile(PHOTOS_TS, renderPhotosTs(fotos))

  // ── Resumen ────────────────────────────────────────────────────────────
  const total = politicians.length
  const final = DRY ? {} : fotos
  const count = (pred) => Object.values(final).filter((f) => pred(f.foto_fuente)).length
  const oficiales = count((f) => OFICIALES.has(f))
  const cv = count((f) => f === FUENTE.congresoVisible)
  const wiki = count((f) => f === FUENTE.wikimedia)
  const pendientes = politicians.filter((p) => !final[p.id])

  log('\n══════════ Resumen ══════════')
  log(`Con foto oficial .gov.co : ${oficiales}`)
  for (const f of OFICIALES) log(`   · ${f}: ${count((x) => x === f)}`)
  log(`Con Congreso Visible     : ${cv}`)
  log(`Con Wikipedia/Wikimedia  : ${wiki}`)
  log(`Pendientes               : ${pendientes.length} de ${total}`)
  if (relaxedHosts.size) log(`Hosts .gov.co con certificado tolerado: ${[...relaxedHosts].join(', ')}`)
  if (pendientes.length) {
    log('\nPendientes (id — nombre):')
    for (const p of pendientes) log(`  - ${p.id} — ${p.nombre}`)
  }
  if (DRY) log('\n(--dry: no se escribió ningún archivo)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
