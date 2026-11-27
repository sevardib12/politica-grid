import { ArrowLeft, Check, Flag, Info, Plus, RefreshCw, Share2, Skull, Trophy, TriangleAlert, X } from 'lucide-react'
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
import { useGiro } from './giro.ts'
import { Chip, Cifra, Franja, Marcador } from './ui.tsx'

const CONFIRMAR_MS = 4000
const NIVEL_LABEL: Record<1 | 2 | 3, string> = { 1: 'Cúpula', 2: 'Ministerios', 3: 'Departamentos' }
const NIVEL_REJILLA: Record<1 | 2 | 3, string> = {
  1: 'grid w-full max-w-[22.5rem] grid-cols-2 gap-3',
  2: 'grid w-full grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5',
  3: 'grid w-full max-w-[31rem] grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5',
}

/** Retrato de una silla: foto real con `object-cover object-top`; si falla, las iniciales. */
function Retrato({ politico }: { politico: Politician }) {
  const [fallo, setFallo] = useState(false)
  const src = politico.foto_url ? `${import.meta.env.BASE_URL}${politico.foto_url.replace(/^\//, '')}` : null
  if (!src || fallo) {
    return (
      <span className="flex size-full items-center justify-center bg-gradient-to-br from-[#26335f] to-panel text-2xl font-black text-slate-50">
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

/** Marcador: reloj, sillas llenas y errores (tres casillas). */
function Hud({ estado, restanteMs, transcurridoMs }: { estado: EstadoGabinete; restanteMs: number | null; transcurridoMs: number }) {
  const jugando = estado.estado === 'jugando'
  const llenas = estado.sillas.filter((s) => s !== null).length
  const temp = estado.config.temporizador
  const urgente = restanteMs !== null && (temp === 'turno' ? restanteMs <= 5000 : restanteMs <= 15000)
  const reloj = temp === 'cronometro' ? formatDuration(transcurridoMs) : formatDuration(restanteMs ?? 0)

  return (
    <Marcador
      datos={[
        {
          etiqueta: temp === 'cronometro' ? 'Tiempo' : temp === 'turno' ? 'Turno' : 'Quedan',
          valor: reloj,
          tono: 'cyan',
          title: TEMPORIZADOR_LABEL[temp],
          urgente: urgente && jugando,
        },
        { etiqueta: 'Sillas', valor: <Cifra valor={llenas} total={TOTAL_SILLAS} />, tono: 'ok' },
        {
          etiqueta: 'Errores',
          ariaLabel: `Errores: ${estado.errores} de ${MAX_ERRORES}`,
          valor: (
            <span className="flex h-[1.9rem] items-center gap-1.5 sm:h-[2.6rem]">
              {Array.from({ length: MAX_ERRORES }, (_, i) => (
                <span key={i} className={`size-[18px] rounded ${i < estado.errores ? 'bg-bad' : 'ring-2 ring-inset ring-line'}`} />
              ))}
            </span>
          ),
        },
      ]}
    />
  )
}

/** Re-sortear y rendirse (rendirse pide un segundo toque). */
function Acciones({
  estado,
  girando,
  onResortear,
  onRendirse,
}: {
  estado: EstadoGabinete
  girando: boolean
  onResortear: () => void
  onRendirse: () => void
}) {
  const [confirmar, setConfirmar] = useState(false)

  useEffect(() => {
    if (!confirmar) return
    const id = window.setTimeout(() => setConfirmar(false), CONFIRMAR_MS)
    return () => window.clearTimeout(id)
  }, [confirmar])

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <button type="button" onClick={onResortear} disabled={estado.resorteos <= 0 || girando} className="btn-secondary bg-ink px-2 disabled:opacity-40">
        <RefreshCw size={16} aria-hidden="true" />
        <span>
          Re-sortear · {estado.resorteos}
          <span className="sr-only"> de {RESORTEOS}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => (confirmar ? onRendirse() : setConfirmar(true))}
        className={`btn-secondary px-2 ${confirmar ? 'border-bad! bg-bad/15! text-bad!' : 'bg-transparent text-slate-300 hover:border-bad! hover:text-bad!'}`}
      >
        <Flag size={16} aria-hidden="true" />
        {confirmar ? '¿Seguro? Otra vez' : 'Rendirse'}
      </button>
    </div>
  )
}

function Retro({ estado }: { estado: EstadoGabinete }) {
  const r = estado.retro
  if (!r) return null
  const tono = r.tipo === 'ok' ? 'bg-ok/12 text-ok' : r.tipo === 'error' ? 'bg-bad/12 text-bad' : 'bg-cyan/12 text-cyan'
  const Icono = r.tipo === 'ok' ? Check : r.tipo === 'error' ? TriangleAlert : Info
  return (
    <div key={r.seq} role="status" className={`animate-rise flex items-start gap-2 rounded-[10px] px-3 py-2.5 text-sm font-semibold ${tono}`}>
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
  const numero = String(indice + 1).padStart(2, '0')
  const id = estado.sillas[indice]
  const politico = id ? pool.porId.get(id) : undefined
  const partido = estado.partidoSilla[indice]

  if (politico && partido) {
    return (
      <article title={silla.cargo} className="flex flex-col overflow-hidden rounded-[10px] bg-papel text-tinta shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
        <div className="relative aspect-[4/5] w-full bg-panel-2">
          <Retrato politico={politico} />
          <span className="font-display absolute left-2 top-1.5 text-[13px] text-gold [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">{numero}</span>
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-white p-0.5 shadow-md" title={`Nombrado por ${partido}`}>
            <PartyLogo partyName={partido} size="xs" decorative />
          </span>
        </div>
        <div className="px-2 pb-2.5 pt-2">
          <p className="line-clamp-2 text-[10px] font-extrabold uppercase leading-tight tracking-[0.08em] text-tinta-azul">{silla.corto}</p>
          <p className="mt-0.5 text-[13px] font-extrabold leading-tight">{politico.nombre}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-tinta-2">{datoBreve(politico)}</p>
        </div>
      </article>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onUbicar(indice)}
      aria-label={`Silla libre: ${silla.cargo}`}
      className={`relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed p-2 text-center transition ${
        puedeNombrar ? 'border-gold/55 bg-gold/5 hover:bg-gold/10' : 'border-line bg-ink/40 hover:border-slate-600'
      }`}
    >
      <span aria-hidden="true" className="font-display absolute left-2 top-1.5 text-[12px] text-slate-400">
        {numero}
      </span>
      <span className={`font-display text-[1.05rem] sm:text-lg ${puedeNombrar ? 'text-slate-50' : 'text-slate-300'}`}>{silla.corto}</span>
      {puedeNombrar ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-gold">
          <Plus size={12} strokeWidth={2.6} aria-hidden="true" />
          Nombrar
        </span>
      ) : (
        <span className="text-[11px] font-bold text-slate-400">Vacía</span>
      )}
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
    <section aria-label="Organigrama del gobierno" className="flex min-w-0 flex-col items-center rounded-2xl border border-[#1b2647] bg-panel/55 px-3 pb-5 pt-4 sm:px-5">
      <div className="mb-4 flex w-full items-baseline justify-between gap-3">
        <h2 className="etiqueta text-slate-400">Organigrama del gobierno</h2>
        <span className="etiqueta text-slate-400">{TOTAL_SILLAS} sillas</span>
      </div>
      {niveles.map((nivel) => {
        const indices = SILLAS.map((s, i) => (s.nivel === nivel ? i : -1)).filter((i) => i >= 0)
        return (
          <section key={nivel} aria-label={NIVEL_LABEL[nivel]} className="flex w-full flex-col items-center">
            {nivel > 1 && <div aria-hidden="true" className="h-7 w-0.5 bg-line" />}
            {nivel === 2 && <div aria-hidden="true" className="h-0.5 w-[70%] bg-line" />}
            <h3 className={`font-display mb-2.5 text-[1.4rem] tracking-[0.04em] text-gold ${nivel === 2 ? 'mt-4' : nivel === 3 ? 'mt-1' : ''}`}>
              {NIVEL_LABEL[nivel]}
              {nivel > 1 && <span className="text-apagado"> · {indices.length}</span>}
            </h3>
            <ul className={NIVEL_REJILLA[nivel]}>
              {indices.map((i) => (
                <li key={SILLAS[i].id}>
                  <SillaCard indice={i} estado={estado} pool={pool} puedeNombrar={puedeNombrar} onUbicar={onUbicar} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
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
    <section aria-label="Resultado" className={`animate-rise rounded-xl border p-5 ${ganada ? 'border-ok/50 bg-ok/[0.08]' : 'border-gold/40 bg-gold/[0.05]'}`}>
      <div className="flex items-start gap-3">
        {ganada ? <Trophy size={30} className="shrink-0 text-ok" aria-hidden="true" /> : <Skull size={30} className="shrink-0 text-gold" aria-hidden="true" />}
        <div>
          <p className="font-display text-[1.9rem] text-slate-50">
            {ganada ? `Gabinete armado en ${formatDuration(ms)}` : `Partida perdida: ${estado.sillas.filter((s) => s !== null).length}/${TOTAL_SILLAS} sillas`}
          </p>
          <p className="mt-1.5 text-sm text-slate-300">{ganada ? `Las ${TOTAL_SILLAS} sillas están llenas.` : estado.motivo?.detalle}</p>
        </div>
      </div>

      {!ganada && ejemplos.length > 0 && (
        <div className="mt-4">
          <p className="etiqueta mb-2 text-[11px] text-slate-400">Políticos válidos para {estado.partido} que te faltaron</p>
          <ul className="flex flex-wrap gap-2">
            {ejemplos.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-lg bg-ink/60 px-2.5 py-1.5">
                <PoliticianAvatar politician={p} size={32} />
                <span className="text-sm font-semibold text-slate-100">{p.nombre}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {estado.config.daily && <p className="mt-3 text-xs text-slate-400">Reto diario: solo cuenta tu primer intento del día.</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {estado.config.daily && (
          <button type="button" onClick={compartir} className={ganada ? 'btn-primary' : 'btn-secondary'}>
            {copiado ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
            {copiado ? 'Copiado' : ganada ? 'Compartir resultado' : 'Compartir'}
          </button>
        )}
        <button type="button" onClick={onPlayAgain} className="btn-secondary">
          <RefreshCw size={16} aria-hidden="true" />
          {estado.config.daily ? 'Repetir' : 'Otra partida'}
        </button>
        <button type="button" onClick={onExit} className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
        </button>
      </div>

      {estado.config.daily && (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-ink/60 p-3 text-[13px] leading-relaxed text-slate-200">{textoCompartir(estado, fechaLegible)}</pre>
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
  const giro = estado.turnoInicio % 1000003
  // El partido nuevo no se muestra hasta que la ruleta para (ver useGiro).
  const { girando, mostrado } = useGiro(estado.partido, giro)
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
    if (!jugando || girando || !estado.partido || !enfocado) return []
    if (texto.replace(/\s/g, '').length < minimo) return []
    return buscarEnPartido(pool, estado.partido, texto, usadosIds, 6)
  }, [jugando, girando, estado.partido, enfocado, texto, minimo, pool, usadosIds])

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
    <div className="relative">
      {/* Fachada de la Casa de Nariño, de Claude Design: detrás de todo, sin interceptar clics. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}fondos/casa-de-narino.webp)`,
          backgroundPosition: 'center top',
          backgroundSize: '2000px auto',
          backgroundRepeat: 'no-repeat',
        }}
      />
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
        </button>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {config.daily ? <Chip tone="gold">Reto diario</Chip> : <Chip tone="cyan">Partida libre</Chip>}
          <Chip>{TEMPORIZADOR_LABEL[config.temporizador]}</Chip>
          <Chip>{config.dificultad === 'dificil' ? 'Difícil' : 'Normal'}</Chip>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Columna de control: marcador, sorteo y buscador. En escritorio queda al lado del organigrama. */}
        <div className="flex flex-col gap-4 lg:w-[22.5rem] lg:shrink-0">
          <div>
            <h1 className="font-display text-[2.6rem] text-slate-50 sm:text-[3.75rem]">
              Arma el <span className="text-gold">Gabinete</span>
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-300">Gira la ruleta, nombra a un político de ese partido y ubícalo en una silla.</p>
          </div>

          <Hud estado={estado} restanteMs={restanteMs} transcurridoMs={transcurridoMs} />

          {!jugando && <Resultado estado={estado} ctx={ctx} onPlayAgain={onPlayAgain} onExit={onExit} />}

          <section aria-labelledby="partido-sorteado" className="rounded-xl border border-line bg-panel p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="partido-sorteado" className="etiqueta text-slate-400">
                Partido sorteado
              </h2>
              <Franja className="h-1 w-10" />
            </div>
            <Ruleta partido={estado.partido} giro={giro} girando={girando} />
            {jugando && <Acciones estado={estado} girando={girando} onResortear={game.resortear} onRendirse={game.rendirse} />}
          </section>

          {jugando && (
            <section aria-label="Buscar político" className="flex flex-col gap-2.5">
              <Retro estado={estado} />
              {aviso && (
                <p role="status" className="rounded-[10px] border border-line bg-panel px-3 py-2 text-sm text-slate-300">
                  {aviso}
                </p>
              )}
              {elegido ? (
                <div className="flex items-center justify-between gap-3 rounded-[10px] border border-gold bg-gold/[0.08] py-2 pl-3 pr-1">
                  <div className="flex min-w-0 items-center gap-3">
                    <PoliticianAvatar politician={elegido} size={42} />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-extrabold text-slate-50">{elegido.nombre}</p>
                      <p className="text-[13px] text-gold">Toca una silla libre para nombrarlo.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => game.seleccionar(null)}
                    aria-label="Quitar selección"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-slate-50"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              <form onSubmit={onSubmit} className="relative">
                {sugerencias.length > 0 && (
                  <ul
                    role="listbox"
                    aria-label="Sugerencias"
                    className="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
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
                      placeholder={girando ? 'La ruleta está girando…' : mostrado ? `Un político de ${mostrado}…` : 'Escribe un nombre…'}
                      disabled={girando}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="send"
                      className="min-h-[50px] w-full rounded-[10px] border border-line bg-panel px-3.5 text-base text-slate-50 placeholder:text-slate-500 focus:border-gold focus:outline-none"
                    />
                  </label>
                  <button type="submit" disabled={girando} className="btn-primary min-h-[50px] shrink-0 px-4 disabled:pointer-events-none disabled:opacity-40">
                    Elegir
                  </button>
                </div>
              </form>
              <p className="text-[13px] leading-relaxed text-slate-400">
                Nombrar a alguien que no militó en {mostrado ?? 'el partido'} cuesta un error, igual que repetir a alguien ya nombrado.
              </p>
            </section>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Organigrama estado={estado} pool={pool} puedeNombrar={Boolean(elegido) && jugando} onUbicar={game.ubicar} />
        </div>
      </div>
    </div>
    </div>
  )
}
