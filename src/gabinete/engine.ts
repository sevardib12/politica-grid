import type { Partido } from '../data/types.ts'
import { elegirUniforme, type Rng } from '../utils/cabinetRandomizer.ts'
import { TOTAL_SILLAS } from './posts.ts'
import type { Pool } from './pool.ts'
import { secuenciaDiaria } from './daily.ts'

// Motor puro de «Arma el Gabinete»: un reducer sin reloj ni azar propios (el tiempo entra por `now`,
// y la aleatoriedad por `ctx.rng`).

/** Segundos por turno en el modo «15 s por turno». */
export const SEGUNDOS_TURNO = 15
/** Duración del modo «Contrarreloj», en milisegundos: unos 12 s por silla, como los 2 min que había con 11 sillas. */
export const MS_CONTRARRELOJ = 300_000
/** Comodines de «Re-sortear partido» por partida. */
export const RESORTEOS = 2
/** Errores que terminan la partida. */
export const MAX_ERRORES = 3

export type Temporizador = 'cronometro' | 'turno' | 'contrarreloj'
export type Dificultad = 'normal' | 'dificil'
export type TipoError = 'partido' | 'repetido' | 'tiempo'
export type Estado = 'jugando' | 'ganada' | 'perdida'

export const TEMPORIZADOR_LABEL: Record<Temporizador, string> = {
  cronometro: 'Sin tiempo',
  turno: '15 s por turno',
  contrarreloj: `Contrarreloj ${MS_CONTRARRELOJ / 60_000} min`,
}

export interface ConfigGabinete {
  daily: boolean
  /** Reto diario: fecha AAAA-MM-DD. */
  dateKey: string | null
  temporizador: Temporizador
  dificultad: Dificultad
}

export interface Retroalimentacion {
  tipo: 'ok' | 'error' | 'info'
  texto: string
  /** Contador para que un mismo mensaje vuelva a animarse. */
  seq: number
}

export interface Motivo {
  kind: 'errores' | 'tiempo' | 'rendido' | 'sin_opciones'
  detalle: string
}

export interface EstadoGabinete {
  config: ConfigGabinete
  /** Político (id) en cada silla, o null si está libre. */
  sillas: (string | null)[]
  /** Partido con el que se nombró a cada silla. */
  partidoSilla: (Partido | null)[]
  /** Partido sorteado en este turno. */
  partido: Partido | null
  /** Político elegido en el buscador, pendiente de ubicar en una silla. */
  candidato: string | null
  resorteos: number
  errores: number
  registroErrores: { tipo: TipoError; texto: string }[]
  /** Reto diario: secuencia de partidos del día y cuántas entradas se han usado. */
  secuencia: Partido[] | null
  indiceSecuencia: number
  inicio: number
  turnoInicio: number
  fin: number | null
  estado: Estado
  motivo: Motivo | null
  retro: Retroalimentacion | null
  seq: number
}

export interface Contexto {
  pool: Pool
  rng: Rng
}

export type AccionGabinete =
  | { type: 'SELECCIONAR'; id: string | null; now: number }
  | { type: 'UBICAR'; silla: number; now: number }
  | { type: 'RESORTEAR'; now: number }
  | { type: 'RENDIRSE'; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'LIMPIAR_RETRO' }

/** Políticos ya ubicados en el gabinete. */
function usados(estado: Pick<EstadoGabinete, 'sillas'>): Set<string> {
  const s = new Set<string>()
  for (const id of estado.sillas) if (id) s.add(id)
  return s
}

/** Partidos con al menos un político sin usar, con cuántos quedan. */
export function disponibilidad(pool: Pool, usadosIds: ReadonlySet<string>, excluir?: Partido | null): { partido: Partido; disponibles: number }[] {
  const out: { partido: Partido; disponibles: number }[] = []
  for (const partido of pool.partidos) {
    if (partido === excluir) continue
    let n = 0
    for (const p of pool.porPartido.get(partido) ?? []) if (!usadosIds.has(p.id)) n++
    if (n > 0) out.push({ partido, disponibles: n })
  }
  return out
}

/** Sortea el siguiente partido: la secuencia del día en el reto diario; si no, al azar, igual para todos los disponibles. */
function sortear(estado: EstadoGabinete, ctx: Contexto, excluir?: Partido | null): { partido: Partido; indice: number } | null {
  const disp = disponibilidad(ctx.pool, usados(estado), excluir)
  if (disp.length === 0) return null
  if (estado.secuencia) {
    const posibles = new Set(disp.map((d) => d.partido))
    for (let i = estado.indiceSecuencia; i < estado.secuencia.length; i++) {
      const partido = estado.secuencia[i]
      if (posibles.has(partido)) return { partido, indice: i + 1 }
    }
    // Secuencia agotada (no debería pasar): el primer partido disponible, de forma determinista.
    return { partido: disp[0].partido, indice: estado.indiceSecuencia }
  }
  const elegido = elegirUniforme(
    disp.map((d) => d.partido),
    ctx.rng,
  )
  return elegido ? { partido: elegido, indice: estado.indiceSecuencia } : null
}

/** Estado inicial de una partida: sillas libres y el primer partido sorteado. */
export function iniciarGabinete(config: ConfigGabinete, ctx: Contexto, now: number): EstadoGabinete {
  const secuencia = config.daily && config.dateKey ? secuenciaDiaria(config.dateKey, ctx.pool) : null
  const base: EstadoGabinete = {
    config,
    sillas: Array.from({ length: TOTAL_SILLAS }, () => null),
    partidoSilla: Array.from({ length: TOTAL_SILLAS }, () => null),
    partido: null,
    candidato: null,
    resorteos: RESORTEOS,
    errores: 0,
    registroErrores: [],
    secuencia,
    indiceSecuencia: 0,
    inicio: now,
    turnoInicio: now,
    fin: null,
    estado: 'jugando',
    motivo: null,
    retro: null,
    seq: 0,
  }
  const primero = sortear(base, ctx)
  if (!primero) throw new Error('No hay políticos disponibles para jugar Arma el Gabinete')
  return { ...base, partido: primero.partido, indiceSecuencia: primero.indice }
}

function retro(estado: EstadoGabinete, tipo: Retroalimentacion['tipo'], texto: string): Retroalimentacion {
  return { tipo, texto, seq: estado.seq + 1 }
}

/** Suma un error. Si llega al límite, la partida termina con ese motivo. */
function errar(estado: EstadoGabinete, tipo: TipoError, texto: string, now: number, motivo?: Motivo): EstadoGabinete {
  const errores = estado.errores + 1
  const perdida = errores >= MAX_ERRORES
  return {
    ...estado,
    errores,
    registroErrores: [...estado.registroErrores, { tipo, texto }],
    estado: perdida ? 'perdida' : estado.estado,
    fin: perdida ? now : estado.fin,
    motivo: perdida ? (motivo ?? { kind: 'errores', detalle: `Tres errores. El último: ${texto}` }) : estado.motivo,
    retro: retro(estado, 'error', texto),
    seq: estado.seq + 1,
  }
}

export function reducirGabinete(estado: EstadoGabinete, accion: AccionGabinete, ctx: Contexto): EstadoGabinete {
  if (accion.type === 'LIMPIAR_RETRO') return estado.retro ? { ...estado, retro: null } : estado
  if (estado.estado !== 'jugando') return estado

  switch (accion.type) {
    case 'SELECCIONAR': {
      if (accion.id === null) return { ...estado, candidato: null }
      const p = ctx.pool.porId.get(accion.id)
      if (!p) return estado
      // Un político ya nombrado sí se puede elegir: al ubicarlo de nuevo cuenta como error.
      return { ...estado, candidato: accion.id }
    }

    case 'UBICAR': {
      if (!estado.candidato) {
        return { ...estado, retro: retro(estado, 'info', 'Primero elige a un político de la lista.'), seq: estado.seq + 1 }
      }
      if (estado.sillas[accion.silla] !== null) {
        return { ...estado, retro: retro(estado, 'info', 'Esa silla ya está ocupada. Elige otra.'), seq: estado.seq + 1 }
      }
      const id = estado.candidato
      const p = ctx.pool.porId.get(id)
      const nom = p?.nombre ?? id
      if (estado.sillas.includes(id)) {
        return errar({ ...estado, candidato: null }, 'repetido', `${nom} ya está en el gabinete.`, accion.now)
      }
      if (!p || !estado.partido || !p.partidos.includes(estado.partido)) {
        const pero = estado.partido ? `no militó en ${estado.partido}` : 'no pertenece al partido sorteado'
        return errar({ ...estado, candidato: null }, 'partido', `${nom} ${pero}.`, accion.now)
      }
      const sillas = estado.sillas.slice()
      sillas[accion.silla] = id
      const partidoSilla = estado.partidoSilla.slice()
      partidoSilla[accion.silla] = estado.partido
      const base: EstadoGabinete = {
        ...estado,
        sillas,
        partidoSilla,
        candidato: null,
        retro: retro(estado, 'ok', `¡Bien! ${p.nombre} queda en esa silla.`),
        seq: estado.seq + 1,
      }
      if (sillas.every((x) => x !== null)) {
        return { ...base, estado: 'ganada', fin: accion.now, partido: null }
      }
      const siguiente = sortear(base, ctx)
      if (!siguiente) {
        return { ...base, estado: 'perdida', fin: accion.now, motivo: { kind: 'sin_opciones', detalle: 'No quedan políticos disponibles para ningún partido.' } }
      }
      return { ...base, partido: siguiente.partido, indiceSecuencia: siguiente.indice, turnoInicio: accion.now }
    }

    case 'RESORTEAR': {
      if (estado.resorteos <= 0) {
        return { ...estado, retro: retro(estado, 'info', 'Ya usaste los dos re-sorteos.'), seq: estado.seq + 1 }
      }
      const siguiente = sortear({ ...estado, candidato: null }, ctx, estado.partido)
      if (!siguiente) {
        return { ...estado, retro: retro(estado, 'info', 'No hay otro partido disponible.'), seq: estado.seq + 1 }
      }
      return {
        ...estado,
        resorteos: estado.resorteos - 1,
        partido: siguiente.partido,
        indiceSecuencia: siguiente.indice,
        candidato: null,
        turnoInicio: accion.now,
        retro: retro(estado, 'info', `Nuevo partido: ${siguiente.partido}.`),
        seq: estado.seq + 1,
      }
    }

    case 'RENDIRSE':
      return { ...estado, estado: 'perdida', fin: accion.now, motivo: { kind: 'rendido', detalle: 'Te rendiste.' }, retro: null }

    case 'TICK': {
      if (estado.config.temporizador === 'contrarreloj' && accion.now - estado.inicio >= MS_CONTRARRELOJ) {
        return {
          ...estado,
          estado: 'perdida',
          fin: accion.now,
          motivo: { kind: 'tiempo', detalle: `Se acabaron los ${MS_CONTRARRELOJ / 60_000} minutos antes de llenar el gabinete.` },
          retro: null,
        }
      }
      if (estado.config.temporizador === 'turno' && accion.now - estado.turnoInicio >= SEGUNDOS_TURNO * 1000) {
        const partido = estado.partido ?? 'el partido sorteado'
        const texto = `Se acabó el turno con ${partido}.`
        const perdida = estado.errores + 1 >= MAX_ERRORES
        const tras = errar({ ...estado, candidato: null }, 'tiempo', texto, accion.now, {
          kind: 'tiempo',
          detalle: `Se acabó el tiempo del turno. Último partido: ${partido}.`,
        })
        if (perdida) return tras
        const siguiente = sortear({ ...tras, candidato: null }, ctx)
        if (!siguiente) return { ...tras, estado: 'perdida', fin: accion.now, motivo: { kind: 'sin_opciones', detalle: 'No quedan políticos disponibles.' } }
        return { ...tras, partido: siguiente.partido, indiceSecuencia: siguiente.indice, turnoInicio: accion.now }
      }
      return estado
    }
  }
}

/** Políticos disponibles del partido de este turno (para el buscador y para las pistas de la derrota). */
export function disponiblesDelPartido(estado: EstadoGabinete, ctx: Contexto): string[] {
  if (!estado.partido) return []
  const ya = usados(estado)
  return (ctx.pool.porPartido.get(estado.partido) ?? []).filter((p) => !ya.has(p.id)).map((p) => p.id)
}
