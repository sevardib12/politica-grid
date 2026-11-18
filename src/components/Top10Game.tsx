import { ArrowLeft, Check, Clock, Flag, Heart, Info, RotateCcw, Send, Share2, Skull, Timer, Trophy, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { TOP10_CATEGORY_LABEL } from '../data/top10Lists.ts'
import { formatDuration } from '../game/stats.ts'
import { describeEnd, foundCount, MAX_LIVES, MODE_LABEL, TIMED_SECONDS, type Top10Config, type Top10State } from '../top10/engine.ts'
import { suggestNames } from '../top10/people.ts'
import { shareText } from '../top10/share.ts'
import { useTop10 } from '../top10/useTop10.ts'
import { Top10Row, type RowState } from './Top10Row.tsx'
import { Chip } from './ui.tsx'

const SUGGEST_KEY = 'politica-top10:sugerencias'

function loadSuggest(): boolean {
  try {
    return localStorage.getItem(SUGGEST_KEY) !== 'off'
  } catch {
    return true
  }
}

function Hud({
  state,
  timeLeft,
  elapsedMs,
  onGiveUp,
}: {
  state: Top10State
  timeLeft: number | null
  elapsedMs: number
  onGiveUp: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  const playing = state.status === 'playing'
  const timed = state.config.mode === 'contrarreloj'
  const urgent = timeLeft !== null && timeLeft <= 15

  // La confirmación de «Rendirse» se cancela sola para no dejar el botón armado.
  useEffect(() => {
    if (!confirm) return
    const id = window.setTimeout(() => setConfirm(false), 4000)
    return () => window.clearTimeout(id)
  }, [confirm])

  return (
    <div className="mb-4 rounded-2xl border border-line bg-panel px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-sm">
        <div className="flex items-center gap-1" aria-label={`Vidas: ${state.lives} de ${MAX_LIVES}`}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} size={20} aria-hidden="true" className={i < state.lives ? 'fill-bad text-bad' : 'text-slate-600'} />
          ))}
        </div>

        <div className="font-semibold text-slate-200">
          Aciertos: <span className="text-ok">{foundCount(state)}</span>
          <span className="text-slate-500"> / {state.challenge.size}</span>
        </div>

        {timed ? (
          <div
            className={`flex items-center gap-1.5 font-bold tabular-nums ${urgent && playing ? 'animate-pulse text-bad' : 'text-cyan'}`}
            title="Tiempo restante"
          >
            <Timer size={16} aria-hidden="true" />
            {timeLeft === null ? TIMED_SECONDS : Math.ceil(timeLeft)} s
          </div>
        ) : (
          <div className="flex items-center gap-1.5 tabular-nums text-slate-300" title="Tiempo transcurrido">
            <Clock size={15} aria-hidden="true" />
            {formatDuration(elapsedMs)}
          </div>
        )}

        {playing && (
          <button
            type="button"
            onClick={() => (confirm ? onGiveUp() : setConfirm(true))}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              confirm ? 'border-bad bg-bad/15 text-bad' : 'border-line bg-ink/60 text-slate-300 hover:border-bad hover:text-bad'
            }`}
          >
            <Flag size={14} aria-hidden="true" />
            {confirm ? '¿Seguro? Toca otra vez' : 'Rendirse'}
          </button>
        )}
      </div>
      {timed && playing && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-linear ${urgent ? 'bg-bad' : 'bg-cyan'}`}
            style={{ width: `${((timeLeft ?? TIMED_SECONDS) / TIMED_SECONDS) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

function ResultCard({
  state,
  elapsedMs,
  onPlayAgain,
  onExit,
}: {
  state: Top10State
  elapsedMs: number
  onPlayAgain: () => void
  onExit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const won = state.status === 'won'
  const Icon = won ? Trophy : state.status === 'gaveup' ? Flag : Skull

  const share = async () => {
    const text = shareText(state)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      try {
        await navigator.share?.({ text })
      } catch {
        /* el usuario canceló o no hay soporte */
      }
    }
  }

  return (
    <section
      aria-label="Resultado"
      className={`animate-rise mb-4 rounded-3xl border p-5 ${won ? 'border-ok/40 bg-ok/10' : 'border-gold/30 bg-gold/5'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={30} aria-hidden="true" className={won ? 'text-ok' : 'text-gold'} />
        <div>
          <p className="text-lg font-black text-slate-50">
            {foundCount(state)} / {state.challenge.size}
            <span className="ml-2 text-sm font-semibold text-slate-400">· {formatDuration(elapsedMs)}</span>
          </p>
          <p className="text-sm text-slate-300">{describeEnd(state)}</p>
        </div>
      </div>

      {state.config.daily && (
        <p className="mt-3 text-xs text-slate-400">Reto diario: solo cuenta tu primer intento del día.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-2xl bg-gold px-4 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Compartir resultado'}
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
        >
          <RotateCcw size={16} aria-hidden="true" />
          {state.config.daily ? 'Repetir' : 'Otra lista'}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Inicio
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-xl bg-ink/60 p-3 text-[13px] leading-relaxed text-slate-200">{shareText(state)}</pre>
    </section>
  )
}

function Toast({ state }: { state: Top10State }) {
  const fb = state.feedback
  if (!fb) return null
  const tone =
    fb.kind === 'ok' ? 'border-ok/40 bg-ok/10 text-ok' : fb.kind === 'error' ? 'border-bad/40 bg-bad/10 text-bad' : 'border-cyan/40 bg-cyan/10 text-cyan'
  const Icon = fb.kind === 'ok' ? Check : fb.kind === 'error' ? TriangleAlert : Info
  return (
    <div key={fb.seq} role="status" className={`animate-rise mb-2 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${tone}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{fb.text}</span>
    </div>
  )
}

/** Pantalla de una partida de Política Top 10. */
export function Top10Game({
  config,
  onFinish,
  onExit,
  onPlayAgain,
}: {
  config: Top10Config
  onFinish: (state: Top10State) => void
  onExit: () => void
  onPlayAgain: () => void
}) {
  const game = useTop10(config, onFinish)
  const { state, timeLeft, elapsedMs } = game
  const { challenge } = state
  const playing = state.status === 'playing'

  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)
  const [suggestOn, setSuggestOn] = useState(loadSuggest)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastSent = useRef('')

  useEffect(() => {
    // En pantallas táctiles no se enfoca solo, para no abrir el teclado antes de ver la lista.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus()
  }, [])

  // Si el intento fue «ambiguo» o «vago» no se pierde lo escrito: se puede corregir.
  useEffect(() => {
    if (state.feedback?.kind === 'info') setText((t) => (t === '' ? lastSent.current : t))
  }, [state.feedback])

  const suggestions = useMemo(() => (suggestOn && focused && playing ? suggestNames(text) : []), [suggestOn, focused, playing, text])

  const send = (value: string) => {
    if (value.trim() === '') return
    lastSent.current = value
    game.guess(value)
    setText('')
    setActive(-1)
    inputRef.current?.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(active >= 0 && suggestions[active] ? suggestions[active] : text)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    }
  }

  const toggleSuggest = () => {
    const next = !suggestOn
    setSuggestOn(next)
    try {
      localStorage.setItem(SUGGEST_KEY, next ? 'on' : 'off')
    } catch {
      /* sin almacenamiento */
    }
  }

  const lastFound = state.foundOrder[state.foundOrder.length - 1] ?? -1

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6 pt-4 sm:pt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-cyan hover:text-cyan"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Salir
        </button>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Chip tone="cyan">{TOP10_CATEGORY_LABEL[challenge.categoria]}</Chip>
          <Chip>{MODE_LABEL[state.config.mode]}</Chip>
          {state.config.daily && <Chip tone="gold">Reto diario</Chip>}
        </div>
      </div>

      <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-slate-50 sm:text-3xl">{challenge.titulo}</h1>
      <p className="mb-4 mt-1.5 text-sm text-slate-400">{challenge.subtitulo}</p>

      <Hud state={state} timeLeft={timeLeft} elapsedMs={elapsedMs} onGiveUp={game.giveUp} />

      {!playing && <ResultCard state={state} elapsedMs={elapsedMs} onPlayAgain={onPlayAgain} onExit={onExit} />}

      <ol className="space-y-2" aria-label={`Lista de ${challenge.size} filas`}>
        {challenge.items.map((item, i) => {
          const rowState: RowState = state.found[i] ? 'found' : playing ? 'hidden' : 'revealed'
          return <Top10Row key={item.posicion} item={item} state={rowState} fresh={i === lastFound && playing} />
        })}
      </ol>

      {!playing && (
        <details className="mt-5 rounded-2xl border border-line bg-panel/60 px-4 py-3 text-sm text-slate-300">
          <summary className="cursor-pointer font-bold text-slate-100">Fuente y notas de los datos</summary>
          <p className="mt-2 text-xs leading-relaxed">{challenge.fuente}</p>
          {challenge.nota && <p className="mt-2 text-xs leading-relaxed text-slate-400">{challenge.nota}</p>}
        </details>
      )}

      {playing && (
        <div className="sticky bottom-0 z-30 -mx-4 mt-4 border-t border-line bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <Toast state={state} />
          <form onSubmit={onSubmit} className="relative">
            {suggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Sugerencias"
                className="absolute inset-x-0 bottom-full mb-2 overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
              >
                {suggestions.map((s, i) => (
                  <li key={s} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => send(s)}
                      className={`block w-full px-4 py-2 text-left text-sm font-semibold ${i === active ? 'bg-gold/15 text-gold' : 'text-slate-100 hover:bg-white/5'}`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Escribe un político</span>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setActive(-1)
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={onKeyDown}
                  placeholder="Escribe un nombre o apellido…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-base text-slate-50 placeholder:text-slate-500 focus:border-gold focus:outline-none"
                />
              </label>
              <button
                type="submit"
                aria-label="Probar"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
              >
                <Send size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Probar</span>
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>Sin tildes también sirve. Un error cuesta una vida; los intentos vagos o ambiguos no.</span>
            <button type="button" onClick={toggleSuggest} aria-pressed={suggestOn} className="shrink-0 font-semibold text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline">
              Sugerencias: {suggestOn ? 'sí' : 'no'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
