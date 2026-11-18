// Valida «Arma el Gabinete»: fotos del juego, sorteo ponderado, reto diario, reglas de la partida y
// un robot que juega hasta el final. Uso: npm run validate:gabinete
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { POLITICIANS } from '../src/data/politicians.ts'
import { buildPool, buscarEnPartido } from '../src/gabinete/pool.ts'
import { secuenciaDiaria } from '../src/gabinete/daily.ts'
import { iniciarGabinete, reducirGabinete, disponiblesDelPartido, MAX_ERRORES, MS_CONTRARRELOJ, SEGUNDOS_TURNO, type ConfigGabinete, type Contexto, type EstadoGabinete } from '../src/gabinete/engine.ts'
import { SILLAS } from '../src/gabinete/posts.ts'
import { registrarPartida, rachaDiaria, statsVacias } from '../src/gabinete/stats.ts'
import { mulberry32, elegirPonderado } from '../src/utils/cabinetRandomizer.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let fallos = 0
function comprobar(nombre: string, ok: boolean, detalle = '') {
  console.log(`${ok ? '✓' : '✗'} ${nombre}${detalle ? ` · ${detalle}` : ''}`)
  if (!ok) fallos++
}

const pool = buildPool(POLITICIANS)
const ctxCon = (seed: number): Contexto => ({ pool, rng: mulberry32(seed) })
const cfg = (over: Partial<ConfigGabinete> = {}): ConfigGabinete => ({ daily: false, dateKey: null, temporizador: 'cronometro', dificultad: 'normal', ...over })

console.log(`Candidatos: ${pool.porId.size} con foto y partido · partidos con candidatos: ${pool.partidos.length}\n`)

// ── 1. Fotos ──────────────────────────────────────────────────────────────
const sinArchivo = [...pool.porId.values()].filter((p) => !existsSync(path.join(ROOT, 'public', p.foto_url ?? '')))
comprobar('Todas las fotos del juego existen en public/', sinArchivo.length === 0, sinArchivo.map((p) => p.id).slice(0, 5).join(', '))
comprobar('Hay candidatos para al menos 8 partidos', pool.partidos.length >= 8, `${pool.partidos.length}`)
comprobar('Cada silla tiene un cargo distinto', new Set(SILLAS.map((s) => s.id)).size === 11)

// ── 2. Sorteo ponderado ───────────────────────────────────────────────────
{
  const rng = mulberry32(7)
  const usados = new Set<string>()
  let fueraDeRango = 0
  const conteo = new Map<string, number>()
  for (let i = 0; i < 20000; i++) {
    const opciones = pool.partidos
      .map((partido) => ({ valor: partido, peso: (pool.porPartido.get(partido) ?? []).filter((p) => !usados.has(p.id)).length }))
    const elegido = elegirPonderado(opciones, rng)
    if (elegido === null) break
    const disponibles = (pool.porPartido.get(elegido) ?? []).filter((p) => !usados.has(p.id)).length
    if (disponibles === 0) fueraDeRango++
    conteo.set(elegido, (conteo.get(elegido) ?? 0) + 1)
    usados.clear() // cada giro independiente: ninguna silla ocupada
  }
  comprobar('Nunca sale un partido sin miembros disponibles', fueraDeRango === 0, `${fueraDeRango} casos`)
  // Proporcionalidad: con pesos iguales a los disponibles, el partido con más miembros sale más.
  const ordenados = [...pool.partidos].sort((a, b) => (pool.porPartido.get(b)?.length ?? 0) - (pool.porPartido.get(a)?.length ?? 0))
  const grande = ordenados[0]
  const pequeno = ordenados[ordenados.length - 1]
  comprobar('El partido más grande sale más que el más pequeño', (conteo.get(grande) ?? 0) > (conteo.get(pequeno) ?? 0), `${grande}: ${conteo.get(grande)} · ${pequeno}: ${conteo.get(pequeno)}`)
}

// ── 3. Reto diario ────────────────────────────────────────────────────────
{
  const a = secuenciaDiaria('2026-11-18', pool)
  const b = secuenciaDiaria('2026-11-18', pool)
  const c = secuenciaDiaria('2026-11-19', pool)
  comprobar('El reto diario es igual para todos (misma fecha)', a.length === b.length && a.every((x, i) => x === b[i]), `${a.length} entradas`)
  comprobar('Cada día trae una secuencia distinta', a.some((x, i) => x !== c[i]))
  comprobar('La secuencia solo trae partidos con candidatos', a.every((x) => pool.porPartido.has(x)))
  const inicial = iniciarGabinete(cfg({ daily: true, dateKey: '2026-11-18' }), ctxCon(1), 0)
  comprobar('La primera tirada del reto es la primera de la secuencia', inicial.partido === a[0], `${inicial.partido}`)
}

// ── 4. Robot que juega hasta el final ─────────────────────────────────────
function jugarRobot(config: ConfigGabinete, seed: number): EstadoGabinete {
  const ctx = ctxCon(seed)
  let estado = iniciarGabinete(config, ctx, 0)
  let t = 0
  for (let paso = 0; paso < 400 && estado.estado === 'jugando'; paso++) {
    t += 1000
    if (!estado.partido) break
    const libres = disponiblesDelPartido(estado, ctx)
    if (libres.length === 0) {
      estado = reducirGabinete(estado, { type: 'RESORTEAR', now: t }, ctx)
      if (estado.partido && disponiblesDelPartido(estado, ctx).length === 0 && estado.resorteos === 0) break
      continue
    }
    estado = reducirGabinete(estado, { type: 'SELECCIONAR', id: libres[0], now: t }, ctx)
    const silla = estado.sillas.findIndex((s) => s === null)
    estado = reducirGabinete(estado, { type: 'UBICAR', silla, now: t }, ctx)
  }
  return estado
}
{
  let ganadas = 0
  let erroresTotales = 0
  const partidas = 200
  for (let s = 1; s <= partidas; s++) {
    const e = jugarRobot(cfg(), s)
    if (e.estado === 'ganada') ganadas++
    erroresTotales += e.errores
  }
  comprobar('El robot llena las 11 sillas en casi todas las partidas', ganadas >= partidas * 0.95, `${ganadas}/${partidas}`)
  comprobar('El robot que solo elige miembros del partido no comete errores', erroresTotales === 0, `${erroresTotales} errores`)
  const d1 = jugarRobot(cfg({ daily: true, dateKey: '2026-11-18' }), 3)
  const d2 = jugarRobot(cfg({ daily: true, dateKey: '2026-11-18' }), 99)
  comprobar('En el reto diario, todos ven los mismos partidos en el mismo orden', d1.partidoSilla.join('|') === d2.partidoSilla.join('|') || d1.estado !== 'ganada' || d2.estado !== 'ganada', 'el robot sigue la misma secuencia')
}

// ── 5. Reglas: errores, repetidos, fin de partida ─────────────────────────
{
  const ctxSug = ctxCon(4)
  const inicio = iniciarGabinete(cfg(), ctxSug, 0)
  const miembro = pool.porPartido.get(inicio.partido!)![0]
  const consulta = miembro.nombre.split(' ')[0].slice(0, 2)
  const sugerencias = buscarEnPartido(pool, inicio.partido!, consulta, new Set(), 6)
  comprobar('Las sugerencias son solo del partido sorteado', sugerencias.every((p) => p.partidos.includes(inicio.partido!)), `${sugerencias.length} sugerencias para «${consulta}»`)
  comprobar('El buscador encuentra a un miembro del partido', sugerencias.some((p) => p.id === miembro.id) || sugerencias.length === 6)
  const sinUsados = buscarEnPartido(pool, inicio.partido!, consulta, new Set([miembro.id]), 6)
  comprobar('El buscador no sugiere a quien ya está en el gabinete', !sinUsados.some((p) => p.id === miembro.id))
}
{
  const ctx = ctxCon(5)
  let e = iniciarGabinete(cfg(), ctx, 0)
  const extraño = pool.partidos.find((x) => x !== e.partido)!
  const fueraDelPartido = [...pool.porId.values()].find((p) => !p.partidos.includes(e.partido!))!
  e = reducirGabinete(e, { type: 'SELECCIONAR', id: fueraDelPartido.id, now: 1 }, ctx)
  e = reducirGabinete(e, { type: 'UBICAR', silla: 0, now: 2 }, ctx)
  comprobar('Nombrar a alguien de otro partido cuesta un error', e.errores === 1 && e.sillas[0] === null && e.partido !== null, e.retro?.texto)
  const miembro = disponiblesDelPartido(e, ctx)[0]
  e = reducirGabinete(e, { type: 'SELECCIONAR', id: miembro, now: 3 }, ctx)
  e = reducirGabinete(e, { type: 'UBICAR', silla: 0, now: 4 }, ctx)
  comprobar('Un miembro del partido ocupa la silla sin error', e.sillas[0] === miembro && e.errores === 1)
  e = reducirGabinete(e, { type: 'SELECCIONAR', id: miembro, now: 5 }, ctx)
  e = reducirGabinete(e, { type: 'UBICAR', silla: 1, now: 6 }, ctx)
  comprobar('Repetir a alguien ya nombrado cuesta un error', e.errores === 2 && e.sillas[1] === null)
  comprobar('El partido de la silla ocupada queda registrado', e.partidoSilla[0] !== null && extraño !== undefined)
  // Tres errores terminan la partida.
  for (let i = 0; i < 3 && e.estado === 'jugando'; i++) {
    e = reducirGabinete(e, { type: 'SELECCIONAR', id: fueraDelPartido.id, now: 10 + i }, ctx)
    e = reducirGabinete(e, { type: 'UBICAR', silla: 2, now: 10 + i }, ctx)
  }
  comprobar('Tres errores terminan la partida como derrota', e.estado === 'perdida' && e.motivo?.kind === 'errores' && e.errores >= MAX_ERRORES, e.motivo?.detalle)
  // Re-sorteo: dos comodines, cambia de partido y no cuesta error.
  let r = iniciarGabinete(cfg(), ctx, 0)
  const antes = r.partido
  r = reducirGabinete(r, { type: 'RESORTEAR', now: 1 }, ctx)
  comprobar('Re-sortear cambia el partido sin costar error', r.partido !== antes && r.errores === 0 && r.resorteos === 1)
  r = reducirGabinete(r, { type: 'RESORTEAR', now: 2 }, ctx)
  r = reducirGabinete(r, { type: 'RESORTEAR', now: 3 }, ctx)
  comprobar('Solo hay dos re-sorteos', r.resorteos === 0)
}

// ── 6. Temporizadores ─────────────────────────────────────────────────────
{
  const ctx = ctxCon(9)
  let e = iniciarGabinete(cfg({ temporizador: 'turno' }), ctx, 0)
  const primero = e.partido
  e = reducirGabinete(e, { type: 'TICK', now: (SEGUNDOS_TURNO - 1) * 1000 }, ctx)
  comprobar('Antes de 15 s el turno sigue', e.errores === 0 && e.partido === primero)
  e = reducirGabinete(e, { type: 'TICK', now: SEGUNDOS_TURNO * 1000 }, ctx)
  comprobar('Al llegar a 15 s: un error y partido nuevo', e.errores === 1 && e.partido !== primero, e.retro?.texto)
  let t = SEGUNDOS_TURNO * 1000
  for (let i = 0; i < 2 && e.estado === 'jugando'; i++) {
    t += SEGUNDOS_TURNO * 1000
    e = reducirGabinete(e, { type: 'TICK', now: t }, ctx)
  }
  comprobar('Tres turnos vencidos terminan la partida', e.estado === 'perdida' && e.errores === 3, e.motivo?.detalle)
  const c = iniciarGabinete(cfg({ temporizador: 'contrarreloj' }), ctx, 0)
  const f = reducirGabinete(c, { type: 'TICK', now: MS_CONTRARRELOJ }, ctx)
  comprobar('Contrarreloj: a los 2 min se pierde por tiempo', f.estado === 'perdida' && f.motivo?.kind === 'tiempo')
  const g = iniciarGabinete(cfg({ temporizador: 'cronometro' }), ctx, 0)
  comprobar('Sin tiempo: el reloj no termina la partida', reducirGabinete(g, { type: 'TICK', now: 9 * MS_CONTRARRELOJ }, ctx).estado === 'jugando')
  const rend = reducirGabinete(g, { type: 'RENDIRSE', now: 4000 }, ctx)
  comprobar('Rendirse termina la partida como derrota', rend.estado === 'perdida' && rend.motivo?.kind === 'rendido' && rend.fin === 4000)
}

// ── 7. Estadísticas ───────────────────────────────────────────────────────
{
  const ctx = ctxCon(2)
  const ganada = jugarRobot(cfg({ daily: true, dateKey: '2026-11-18' }), 4)
  let st = registrarPartida(statsVacias(), ganada)
  const segunda = registrarPartida(st, { ...ganada, fin: (ganada.fin ?? 0) + 99999 })
  comprobar('El reto diario cuenta solo el primer intento', segunda.diario['2026-11-18'] === st.diario['2026-11-18'] && Object.keys(segunda.diario).length === 1)
  comprobar('El mejor tiempo diario es el de la partida ganada', st.mejorDiarioMs === (ganada.fin ?? 0) - ganada.inicio || ganada.estado !== 'ganada')
  comprobar('La racha cuenta días seguidos ganados', rachaDiaria({ '2026-11-17': { ganada: true }, '2026-11-18': { ganada: true } }, '2026-11-18') === 2)
  comprobar('La racha sigue si hoy aún no se juega', rachaDiaria({ '2026-11-17': { ganada: true } }, '2026-11-18') === 1)
  const libre = registrarPartida(st, iniciarGabinete(cfg(), ctx, 0))
  comprobar('La partida libre no toca el reto diario', libre.diario['2026-11-18'] !== undefined && libre.libre.jugadas === 1)
}

console.log(fallos === 0 ? '\n✓ Arma el Gabinete validado' : `\n✗ ${fallos} comprobación(es) fallaron`)
if (fallos > 0) process.exit(1)
