import { ArrowLeft, Check, Clock, Flag, Info, RefreshCw, Send, Share2, Skull, Timer, Trophy, TriangleAlert, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { formatDuration } from '../game/stats.ts'
import { cryptoRng } from '../utils/cabinetRandomizer.ts'
import { initials } from '../utils/text.ts'
import { disponiblesDelPartido, MAX_ERRORES, RESORTEOS, TEMPORIZADOR_LABEL, type ConfigGabinete, type Contexto, type EstadoGabinete } from '../gabinete/engine.ts'
import { buscarEnPartido, buscarNombreExacto, type Pool } from '../gabinete/pool.ts'
import { SILLAS, TOTAL_SILLAS } from '../gabinete/posts.ts'
import { textoCompartir } from '../gabinete/share.ts'
import { useGabinete } from '../gabinete/useGabinete.ts'
import { datoBreve } from '../gabinete/trayectoria.ts'
import type { Politician } from '../data/types.ts'
import { PartyLogo } from './PartyLogo.tsx'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { Ruleta } from './Ruleta.tsx'
import { Chip } from './ui.tsx'

const CONFIRMAR_MS = 4000
const NIVEL_LABEL: Record<1 | 2 | 3, string> = { 1: 'Cúpula', 2: 'Ministerios', 3: 'Departamentos administrativos' }

/** Retrato de una silla: foto real con `object-cover object-top`; si falla, las iniciales. */
function Retrato({ politico }: { politico: Politician }) {
  const [fallo, setFallo] = useState(false)
  const src = politico.foto_url ? `${import.meta.env.BASE_URL}${politico.foto_url.replace(/^\//, '')}` : null
  if (!src || fallo) {
    return (
      <span className="flex size-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-black text-slate-200">
        {initials(politico.nombre)}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFallo(true)}
      className="size-full object-cover object-top"
    />
  )
}

function Hud({
  estado,
  restanteMs,
  transcurridoMs,
  onResortear,
  onRendirse,
}: {
  estado: EstadoGabinete
  restanteMs: number | null
  transcurridoMs: number
  onResortear: () => void
  onRendirse: () => void
}) {
  const [confirmar, setConfirmar] = useState(false)
  const jugando = estado.estado === 'jugando'
  const llenas = estado.sillas.filter((s) => s !== null).length
  const temp = estado.config.temporizador
  const urgente = restanteMs !== null && (temp === 'turno' ? restanteMs <= 5000 : restanteMs <= 15000)

  useEffect(() => {
    if (!confirmar) return
    const id = window.setTimeout(() => setConfirmar(false), CONFIRMAR_MS)
    return () => window.clearTimeout(id)
  }, [confirmar])

  const reloj = temp === 'cronometro' ? formatDuration(transcurridoMs) : formatDuration(restanteMs ?? 0)

  return (
    <div className="mb-4 rounded-2xl border border-line bg-panel px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-sm">
        <div className={`flex items-center gap-1.5 font-bold tabular-nums ${urgente && jugando ? 'animate-pulse text-bad' : 'text-cyan'}`} title={TEMPORIZADOR_LABEL[temp]}>
          {temp === 'cronometro' ? <Clock size={16} aria-hidden="true" /> : <Timer size={16} aria-hidden="true" />}
          {reloj}
          {temp === 'turno' && <span className="text-[11px] font-semibold text-slate-500">por turno</span>}
        </div>
        <div className="font-semibold text-slate-200">
          Sillas: <span className="text-ok">{llenas}</span>
          <span className="text-slate-500"> / {TOTAL_SILLAS}</span>
        </div>
        <div className="font-semibold text-slate-200" aria-label={`Errores: ${estado.errores} de ${MAX_ERRORES}`}>
          Errores: <span className={estado.errores > 0 ? 'text-bad' : 'text-slate-300'}>{estado.errores}</span>
          <span className="text-slate-500"> / {MAX_ERRORES}</span>
        </div>
      </div>
      {jugando && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onResortear}
            disabled={estado.resorteos <= 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-ink/60 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:border-cyan hover:text-cyan disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Re-sortear partido ({estado.resorteos}/{RESORTEOS})
          </button>
          <button
            type="button"
            onClick={() => (confirmar ? onRendirse() : setConfirmar(true))}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              confirmar ? 'border-bad bg-bad/15 text-bad' : 'border-line bg-ink/60 text-slate-300 hover:border-bad hover:text-bad'
            }`}
          >
            <Flag size={14} aria-hidden="true" />
            {confirmar ? '¿Seguro? Toca otra vez' : 'Rendirse'}
          </button>
        </div>
      )}
    </div>
  )
}

function Retro({ estado }: { estado: EstadoGabinete }) {
  const r = estado.retro
  if (!r) return null
  const tono = r.tipo === 'ok' ? 'border-ok/40 bg-ok/10 text-ok' : r.tipo === 'error' ? 'border-bad/40 bg-bad/10 text-bad' : 'border-cyan/40 bg-cyan/10 text-cyan'
  const Icono = r.tipo === 'ok' ? Check : r.tipo === 'error' ? TriangleAlert : Info
  return (
    <div key={r.seq} role="status" className={`animate-rise mb-2 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${tono}`}>
      <Icono size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{r.texto}</span>
    </div>
  )
}

function SillaCard({
  indice,
  estado,
  pool,
  puedeNombrar,
  onUbicar,
}: {
  indice: number
  estado: EstadoGabinete
  pool: Pool
  puedeNombrar: boolean
  onUbicar: (i: number) => void
}) {
  const silla = SILLAS[indice]
  const id = estado.sillas[indice]
  const politico = id ? pool.porId.get(id) : undefined
  const partido = estado.partidoSilla[indice]

  if (politico && partido) {
    return (
      <article className="flex flex-col overflow-hidden rounded-2xl border border-ok/40 bg-ink/60">
        <div className="relative aspect-[3/4] w-full bg-panel">
          <Retrato politico={politico} />
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-panel p-0.5 shadow-md" title={`Nombrado por ${partido}`}>
            <PartyLogo partyName={partido} size="xs" decorative />
          </span>
        </div>
        <div className="p-2">
          <p className="line-clamp-3 text-[10px] font-bold uppercase leading-tight tracking-wide text-cyan">{silla.cargo}</p>
          <p className="mt-0.5 text-xs font-extrabold leading-tight text-slate-50">{politico.nombre}</p>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-400">{datoBreve(politico)}</p>
        </div>
      </article>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onUbicar(indice)}
      aria-label={`Silla libre: ${silla.cargo}`}
      className={`flex aspect-[3/4] w-full flex-col items-center justify-center rounded-2xl border border-dashed p-2 text-center transition ${
        puedeNombrar ? 'border-gold/60 bg-gold/5 hover:bg-gold/10' : 'border-line bg-ink/40 hover:border-slate-500'
      }`}
    >
      <span className="line-clamp-3 text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-400">{silla.cargo}</span>
      <span className={`mt-2 text-[11px] font-bold ${puedeNombrar ? 'text-gold' : 'text-slate-500'}`}>
        {puedeNombrar ? 'Nombrar aquí' : 'Vacía'}
      </span>
    </button>
  )
}

function Organigrama({
  estado,
  pool,
  puedeNombrar,
  onUbicar,
}: {
  estado: EstadoGabinete
  pool: Pool
  puedeNombrar: boolean
  onUbicar: (i: number) => void
}) {
  const niveles = [1, 2, 3] as const
  return (
    <div className="space-y-5" aria-label="Organigrama del gobierno">
      {niveles.map((nivel) => {
        const indices = SILLAS.map((s, i) => (s.nivel === nivel ? i : -1)).filter((i) => i >= 0)
        const rejilla =
          nivel === 1
            ? 'mx-auto grid max-w-xs grid-cols-2 gap-2 sm:max-w-sm sm:gap-3'
            : nivel === 2
              ? 'grid grid-cols-3 gap-2 sm:grid-cols-6'
              : 'grid grid-cols-2 gap-2 sm:grid-cols-4'
        return (
          <section key={nivel} aria-label={NIVEL_LABEL[nivel]}>
            <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">{NIVEL_LABEL[nivel]}</h3>
            <ul className={rejilla}>
              {indices.map((i) => (
                <li key={SILLAS[i].id}>
                  <SillaCard indice={i} estado={estado} pool={pool} puedeNombrar={puedeNombrar} onUbicar={onUbicar} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function Resultado({
  estado,
  ctx,
  onPlayAgain,
  onExit,
}: {
  estado: EstadoGabinete
  ctx: Contexto
  onPlayAgain: () => void
  onExit: () => void
}) {
  const [copiado, setCopiado] = useState(false)
  const ganada = estado.estado === 'ganada'
  const ms = (estado.fin ?? estado.inicio) - estado.inicio
  const fechaLegible = estado.config.dateKey ? estado.config.dateKey.split('-').reverse().join('/') : ''
  const ejemplos = estado.partido
    ? disponiblesDelPartido(estado, ctx)
        .slice(0, 4)
        .map((id) => ctx.pool.porId.get(id))
        .filter((p): p is Politician => p !== undefined)
    : []

  const compartir = async () => {
    const texto = textoCompartir(estado, fechaLegible)
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2200)
    } catch {
      try {
        await navigator.share?.({ text: texto })
      } catch {
        /* el usuario canceló o no hay soporte */
      }
    }
  }

  return (
    <section aria-label="Resultado" className={`animate-rise mb-4 rounded-3xl border p-5 ${ganada ? 'border-ok/40 bg-ok/10' : 'border-gold/30 bg-gold/5'}`}>
      <div className="flex items-start gap-3">
        {ganada ? <Trophy size={30} className="text-ok" aria-hidden="true" /> : <Skull size={30} className="text-gold" aria-hidden="true" />}
        <div>
          <p className="text-lg font-black text-slate-50">
            {ganada ? `Gabinete armado en ${formatDuration(ms)}` : `Partida perdida: ${estado.sillas.filter((s) => s !== null).length}/${TOTAL_SILLAS} sillas`}
          </p>
          <p className="text-sm text-slate-300">{ganada ? `Las ${TOTAL_SILLAS} sillas están llenas.` : estado.motivo?.detalle}</p>
        </div>
      </div>

      {!ganada && ejemplos.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Políticos válidos para {estado.partido} que te faltaron
          </p>
          <ul className="flex flex-wrap gap-2">
            {ejemplos.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-xl bg-ink/50 px-2.5 py-1.5">
                <PoliticianAvatar politician={p} size={32} />
                <span className="text-sm font-semibold text-slate-100">{p.nombre}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {estado.config.daily && (
        <p className="mt-3 text-xs text-slate-400">Reto diario: solo cuenta tu primer intento del día.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {estado.config.daily && ganada && (
          <button
            type="button"
            onClick={compartir}
            className="inline-flex items-center gap-2 rounded-2xl bg-gold px-4 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
          >
            {copiado ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
            {copiado ? 'Copiado' : 'Compartir resultado'}
          </button>
        )}
        {estado.config.daily && !ganada && (
          <button
            type="button"
            onClick={compartir}
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
          >
            {copiado ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
            {copiado ? 'Copiado' : 'Compartir'}
          </button>
        )}
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
        >
          <RefreshCw size={16} aria-hidden="true" />
          {estado.config.daily ? 'Repetir' : 'Otra partida'}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
        </button>
      </div>

      {estado.config.daily && (
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink/60 p-3 text-[13px] leading-relaxed text-slate-200">
          {textoCompartir(estado, fechaLegible)}
        </pre>
      )}
    </section>
  )
}

/** Pantalla de una partida de «Arma el Gabinete». */
export function GabineteGame({
  config,
  pool,
  onFinish,
  onExit,
  onPlayAgain,
}: {
  config: ConfigGabinete
  pool: Pool
  onFinish: (estado: EstadoGabinete) => void
  onExit: () => void
  onPlayAgain: () => void
}) {
  const game = useGabinete(config, pool, onFinish)
  const { estado, transcurridoMs, restanteMs } = game
  const jugando = estado.estado === 'jugando'
  const ctx: Contexto = useMemo(() => ({ pool, rng: cryptoRng }), [pool])
  const usadosIds = useMemo(() => new Set(estado.sillas.filter((s): s is string => s !== null)), [estado.sillas])

  const [texto, setTexto] = useState('')
  const [enfocado, setEnfocado] = useState(false)
  const [activo, setActivo] = useState(-1)
  const [aviso, setAviso] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Al cambiar de partido, el buscador empieza de cero.
  useEffect(() => {
    setTexto('')
    setActivo(-1)
    setAviso(null)
  }, [estado.partido])

  // Normal: sugerencias desde 2 letras. Difícil: desde 3 letras.
  const minimo = config.dificultad === 'dificil' ? 3 : 2
  const sugerencias = useMemo(() => {
    if (!jugando || !estado.partido || !enfocado) return []
    if (texto.replace(/\s/g, '').length < minimo) return []
    return buscarEnPartido(pool, estado.partido, texto, usadosIds, 6)
  }, [jugando, estado.partido, enfocado, texto, minimo, pool, usadosIds])

  const elegirSugerencia = (id: string) => {
    game.seleccionar(id)
    setTexto('')
    setActivo(-1)
    setAviso(null)
    inputRef.current?.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (activo >= 0 && sugerencias[activo]) return elegirSugerencia(sugerencias[activo].id)
    const exacto = buscarNombreExacto(pool, texto)
    if (exacto) return elegirSugerencia(exacto.id)
    setAviso(texto.trim() ? 'No encuentro a ese político en el juego.' : null)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (sugerencias.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActivo((a) => Math.min(a + 1, sugerencias.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActivo((a) => Math.max(a - 1, -1))
    }
  }

  const elegido = estado.candidato ? pool.porId.get(estado.candidato) : undefined

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-4 sm:pt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-cyan hover:text-cyan"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
        </button>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {config.daily ? <Chip tone="gold">Reto diario</Chip> : <Chip tone="cyan">Partida libre</Chip>}
          <Chip>{TEMPORIZADOR_LABEL[config.temporizador]}</Chip>
          <Chip>{config.dificultad === 'dificil' ? 'Difícil' : 'Normal'}</Chip>
        </div>
      </div>

      <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-50 sm:text-3xl">Arma el Gabinete</h1>
      <p className="mb-4 mt-1 text-sm text-slate-400">Gira la ruleta, nombra a un político de ese partido y ubícalo en una silla.</p>

      <Hud estado={estado} restanteMs={restanteMs} transcurridoMs={transcurridoMs} onResortear={game.resortear} onRendirse={game.rendirse} />

      {!jugando && <Resultado estado={estado} ctx={ctx} onPlayAgain={onPlayAgain} onExit={onExit} />}

      <section aria-labelledby="partido-sorteado" className="mb-4 rounded-3xl border border-line bg-panel p-4">
        <h2 id="partido-sorteado" className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Partido sorteado
        </h2>
        <Ruleta partido={estado.partido} giro={estado.turnoInicio % 1000003} />
        {estado.partido && jugando && (
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-xl bg-ink/60 px-3 py-1.5 text-sm font-bold text-slate-100">
              <PartyLogo partyName={estado.partido} size="xs" decorative />
              {estado.partido}
            </span>
          </div>
        )}
      </section>

      {jugando && (
        <section aria-label="Buscar político" className="mb-4">
          <Retro estado={estado} />
          {aviso && (
            <p role="status" className="mb-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm text-slate-300">
              {aviso}
            </p>
          )}
          {elegido ? (
            <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-gold/10 px-3 py-2">
              <div className="flex min-w-0 items-center gap-3">
                <PoliticianAvatar politician={elegido} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-50">{elegido.nombre}</p>
                  <p className="text-xs text-gold">Toca una silla libre para nombrarlo.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => game.seleccionar(null)}
                aria-label="Quitar selección"
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-100"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <form onSubmit={onSubmit} className="relative">
            {sugerencias.length > 0 && (
              <ul
                role="listbox"
                aria-label="Sugerencias"
                className="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
              >
                {sugerencias.map((p, i) => (
                  <li key={p.id} role="option" aria-selected={i === activo}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => elegirSugerencia(p.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left ${i === activo ? 'bg-gold/15' : 'hover:bg-white/5'}`}
                    >
                      <PoliticianAvatar politician={p} size={32} />
                      <span className={`text-sm font-semibold ${i === activo ? 'text-gold' : 'text-slate-100'}`}>{p.nombre}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Escribe el nombre de un político del partido sorteado</span>
                <input
                  ref={inputRef}
                  value={texto}
                  onChange={(e) => {
                    setTexto(e.target.value)
                    setActivo(-1)
                    setAviso(null)
                  }}
                  onFocus={() => setEnfocado(true)}
                  onBlur={() => setEnfocado(false)}
                  onKeyDown={onKeyDown}
                  placeholder={estado.partido ? `Un político de ${estado.partido}…` : 'Escribe un nombre…'}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 focus:border-gold focus:outline-none"
                />
              </label>
              <button
                type="submit"
                aria-label="Elegir"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
              >
                <Send size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Elegir</span>
              </button>
            </div>
          </form>
          <p className="mt-2 text-[11px] text-slate-500">
            Nombrar a alguien que no militó en {estado.partido ?? 'el partido'} cuesta un error, igual que repetir a alguien ya nombrado.
          </p>
        </section>
      )}

      <Organigrama estado={estado} pool={pool} puedeNombrar={Boolean(elegido) && jugando} onUbicar={game.ubicar} />
    </div>
  )
}
