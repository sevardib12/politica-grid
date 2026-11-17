import {
  ArrowLeft,
  Check,
  Clock,
  Heart,
  Home,
  Info,
  RotateCcw,
  Share2,
  SkipForward,
  Skull,
  Timer,
  Trophy,
  TriangleAlert,
} from 'lucide-react'
import { useState } from 'react'
import { POLITICIANS_BY_ID } from '../data/politicians.ts'
import {
  MAX_ATTEMPTS,
  MAX_ERRORS,
  MAX_SKIPS,
  describeEnd,
  type GameConfig,
  type GameState,
} from '../game/engine.ts'
import { shareText } from '../game/share.ts'
import { formatDuration } from '../game/stats.ts'
import { useGame } from '../game/useGame.ts'
import { boardCriteria } from '../utils/gridGenerator.ts'
import { PartyChips } from './PartyLogo.tsx'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { Grid } from './Grid.tsx'
import { DIFFICULTY_LABEL, MODE_LABEL } from './labels.ts'
import { SearchModal } from './SearchModal.tsx'
import { SolutionModal } from './SolutionModal.tsx'
import { Chip } from './ui.tsx'

function Hud({ state, timeLeft, elapsedMs }: { state: GameState; timeLeft: number | null; elapsedMs: number }) {
  const { config } = state
  const ruleta = config.mode === 'ruleta'
  const urgent = timeLeft !== null && timeLeft <= 10
  const fraction = timeLeft !== null && config.timer > 0 ? timeLeft / config.timer : 0

  return (
    <div className="mb-4 rounded-2xl border border-line bg-panel px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-sm">
        {ruleta ? (
          <div className="flex items-center gap-1" aria-label={`Errores: ${state.errors} de ${MAX_ERRORS}`}>
            {Array.from({ length: MAX_ERRORS }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                aria-hidden="true"
                className={i < MAX_ERRORS - state.errors ? 'fill-bad text-bad' : 'text-slate-600'}
              />
            ))}
          </div>
        ) : (
          <div className="font-semibold text-slate-200">
            Intentos: <span className="text-gold">{state.attemptsLeft}</span>
            <span className="text-slate-500"> / {MAX_ATTEMPTS}</span>
          </div>
        )}

        {ruleta && (
          <div className="font-semibold text-slate-200">
            Saltos: <span className="text-gold">{state.skipsLeft}</span>
            <span className="text-slate-500"> / {MAX_SKIPS}</span>
          </div>
        )}

        <div className="font-semibold text-slate-200">
          Casillas: <span className="text-ok">{state.cells.filter(Boolean).length}</span>
          <span className="text-slate-500"> / 9</span>
        </div>

        <div className="flex items-center gap-1.5 tabular-nums text-slate-300" title="Tiempo total de la partida">
          <Clock size={15} aria-hidden="true" />
          {formatDuration(elapsedMs)}
        </div>

        {config.timer > 0 && (
          <div
            className={`flex items-center gap-1.5 font-bold tabular-nums ${urgent ? 'animate-pulse text-bad' : 'text-cyan'}`}
            title="Tiempo restante del turno"
          >
            <Timer size={16} aria-hidden="true" />
            {timeLeft === null ? `${config.timer} s` : `${Math.ceil(timeLeft)} s`}
          </div>
        )}
      </div>
      {config.timer > 0 && state.status === 'playing' && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-linear ${urgent ? 'bg-bad' : 'bg-cyan'}`}
            style={{ width: `${(timeLeft === null ? 1 : fraction) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

function FeedbackToast({ state }: { state: GameState }) {
  const fb = state.feedback
  if (!fb) return <div className="hidden min-h-10 lg:block" aria-hidden="true" />
  const tone =
    fb.kind === 'ok'
      ? 'border-ok/40 bg-ok/10 text-ok'
      : fb.kind === 'error'
        ? 'border-bad/40 bg-bad/10 text-bad'
        : 'border-cyan/40 bg-cyan/10 text-cyan'
  const Icon = fb.kind === 'ok' ? Check : fb.kind === 'error' ? TriangleAlert : Info
  return (
    <div role="status" className={`animate-rise flex min-h-10 items-start gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${tone}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{fb.kind === 'ok' ? `¡Bien! ${fb.text}` : fb.text}</span>
    </div>
  )
}

function RuletaPanel({ state, onSkip }: { state: GameState; onSkip: () => void }) {
  const politician = state.current ? POLITICIANS_BY_ID.get(state.current) : null
  const auto = state.autoCell !== null
  return (
    <div className="rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/10 to-panel p-4 sm:p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-gold lg:text-center">Político en turno</p>
      {politician ? (
        <div key={politician.id} className="mt-3 flex flex-col gap-3 lg:mt-4 lg:items-center lg:text-center">
          <div className="flex items-center gap-4 lg:flex-col lg:gap-3">
            <PoliticianAvatar politician={politician} size={96} smallSize={64} priority />
            <div className="min-w-0">
              <p className="text-lg font-black leading-tight text-slate-50 lg:text-xl">{politician.nombre}</p>
              {politician.alias && <p className="mt-0.5 text-sm italic text-slate-400">“{politician.alias}”</p>}
            </div>
          </div>
          <PartyChips partidos={politician.partidos} size="sm" className="lg:justify-center" />
          <p className="text-sm text-slate-300 lg:max-w-[16rem]">
            {auto
              ? 'Solo encaja en una casilla libre: se ubicará automáticamente…'
              : 'Toca la casilla del tablero donde encaje. Un error te cuesta una vida.'}
          </p>
          <button
            type="button"
            onClick={onSkip}
            disabled={state.skipsLeft === 0 || auto}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-ink/60 px-4 py-2 text-sm font-bold text-slate-100 transition hover:border-cyan hover:text-cyan disabled:opacity-40 disabled:hover:border-line disabled:hover:text-slate-100"
          >
            <SkipForward size={16} aria-hidden="true" /> Saltar político ({state.skipsLeft})
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Preparando el siguiente político…</p>
      )}
    </div>
  )
}

function LibrePanel({ state }: { state: GameState }) {
  return (
    <div className="rounded-3xl border border-cyan/30 bg-gradient-to-b from-cyan/10 to-panel p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-cyan">Búsqueda libre</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Toca cualquier casilla vacía y busca al político. Tienes <strong className="text-gold">{state.attemptsLeft}</strong> intentos en
        total: acertar y fallar gasta uno.
      </p>
    </div>
  )
}

function ResultPanel({
  state,
  elapsedMs,
  onPlayAgain,
  onExit,
}: {
  state: GameState
  elapsedMs: number
  onPlayAgain: () => void
  onExit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const won = state.status === 'won'
  const filled = state.cells.filter(Boolean).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText(state))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* portapapeles no disponible */
    }
  }

  return (
    <div
      className={`animate-rise rounded-3xl border p-5 text-center ${
        won ? 'border-ok/40 bg-gradient-to-b from-ok/10 to-panel' : 'border-bad/40 bg-gradient-to-b from-bad/10 to-panel'
      }`}
    >
      <div className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-full ${won ? 'bg-ok/20 text-ok' : 'bg-bad/20 text-bad'}`}>
        {won ? <Trophy size={26} aria-hidden="true" /> : <Skull size={26} aria-hidden="true" />}
      </div>
      <h2 className="text-2xl font-black text-slate-50">{won ? '¡Ganaste!' : 'Partida terminada'}</h2>
      <p className="mt-1 text-sm text-slate-300">{describeEnd(state.endReason)}</p>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-ink/50 p-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Casillas</dt>
          <dd className="text-lg font-extrabold text-gold">{filled}/9</dd>
        </div>
        <div className="rounded-xl bg-ink/50 p-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tiempo</dt>
          <dd className="text-lg font-extrabold tabular-nums text-cyan">{formatDuration(elapsedMs)}</dd>
        </div>
        <div className="rounded-xl bg-ink/50 p-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fallos</dt>
          <dd className="text-lg font-extrabold text-bad">{state.errors}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-slate-400">Toca cualquier casilla del tablero para ver todos los políticos que la cumplían.</p>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-extrabold text-ink hover:brightness-110"
        >
          <RotateCcw size={16} aria-hidden="true" /> {state.config.daily ? 'Repetir (no cuenta)' : 'Nuevo tablero'}
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-ink/60 px-4 py-2.5 text-sm font-bold text-slate-100 hover:border-cyan hover:text-cyan"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar resultado'}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white"
        >
          <Home size={16} aria-hidden="true" /> Volver al inicio
        </button>
      </div>
    </div>
  )
}

export function GameScreen({
  config,
  onFinish,
  onExit,
  onPlayAgain,
}: {
  config: GameConfig
  onFinish: (state: GameState) => void
  onExit: () => void
  onPlayAgain: () => void
}) {
  const game = useGame(config, onFinish)
  const { state } = game
  const [solutionCell, setSolutionCell] = useState<number | null>(null)
  const playing = state.status === 'playing'
  const { rows, cols } = boardCriteria(state.board)

  const onCellClick = (cell: number) => {
    if (!playing) return setSolutionCell(cell)
    if (config.mode === 'ruleta') game.place(cell)
    else game.selectCell(cell)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-12 pt-4 sm:px-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={18} aria-hidden="true" /> Inicio
        </button>
        <div className="flex flex-wrap items-center gap-1.5">
          {config.daily && <Chip tone="gold">Reto diario</Chip>}
          <Chip tone="cyan">{MODE_LABEL[config.mode]}</Chip>
          <Chip>{DIFFICULTY_LABEL[config.difficulty]}</Chip>
          <Chip>{config.timer === 0 ? 'Sin tiempo' : `${config.timer} s por turno`}</Chip>
        </div>
      </header>

      <Hud state={state} timeLeft={game.timeLeft} elapsedMs={game.elapsedMs} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-5">
        <div className="order-2 lg:order-1">
          <Grid state={state} onCellClick={onCellClick} />
        </div>

        {/* En móvil, el político en turno va ENCIMA del tablero mientras se juega. */}
        <aside className={`space-y-3 lg:sticky lg:top-4 lg:order-2 ${playing ? 'order-1' : 'order-3'}`}>
          <FeedbackToast state={state} />
          {playing ? (
            config.mode === 'ruleta' ? (
              <RuletaPanel state={state} onSkip={game.skip} />
            ) : (
              <LibrePanel state={state} />
            )
          ) : (
            <ResultPanel state={state} elapsedMs={game.elapsedMs} onPlayAgain={onPlayAgain} onExit={onExit} />
          )}
        </aside>
      </div>

      {playing && config.mode === 'libre' && state.selectedCell !== null && (
        <SearchModal
          row={rows[Math.floor(state.selectedCell / 3)]}
          col={cols[state.selectedCell % 3]}
          used={new Set(state.cells.filter((c): c is string => c !== null))}
          attemptsLeft={state.attemptsLeft}
          timeLeft={game.timeLeft}
          onGuess={game.guess}
          onClose={() => game.selectCell(null)}
        />
      )}

      {solutionCell !== null && (
        <SolutionModal
          board={state.board}
          cell={solutionCell}
          placedId={state.cells[solutionCell]}
          onClose={() => setSolutionCell(null)}
        />
      )}
    </div>
  )
}
