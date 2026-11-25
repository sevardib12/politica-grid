import { ArrowLeft, Check, Info, RotateCcw, Share2, Skull, Trophy, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import {
  MAX_ATTEMPTS,
  describeEnd,
  type GameConfig,
  type GameState,
} from '../game/engine.ts'
import { shareText } from '../game/share.ts'
import { formatDuration } from '../game/stats.ts'
import { useGame } from '../game/useGame.ts'
import { boardCriteria } from '../utils/gridGenerator.ts'
import { Grid } from './Grid.tsx'
import { DIFFICULTY_LABEL } from './labels.ts'
import { SearchModal } from './SearchModal.tsx'
import { SolutionModal } from './SolutionModal.tsx'
import { Chip, Cifra, Franja, Marcador } from './ui.tsx'

/** Título y marcador: intentos, casillas, tiempo total y, si hay temporizador, el tiempo del turno. */
function Hud({ state, timeLeft, elapsedMs }: { state: GameState; timeLeft: number | null; elapsedMs: number }) {
  const { config } = state
  const urgent = timeLeft !== null && timeLeft <= 10
  const fraction = timeLeft !== null && config.timer > 0 ? timeLeft / config.timer : 0

  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-[2.9rem] text-slate-50 sm:text-[4rem]">
        Política <span className="text-gold">Grid</span>
      </h1>
      <div className="w-full sm:w-auto">
        <Marcador
          datos={[
            { etiqueta: 'Intentos', valor: <Cifra valor={state.attemptsLeft} total={MAX_ATTEMPTS} />, tono: 'gold' },
            { etiqueta: 'Casillas', valor: <Cifra valor={state.cells.filter(Boolean).length} total={9} />, tono: 'ok' },
            { etiqueta: 'Tiempo', valor: formatDuration(elapsedMs), title: 'Tiempo total de la partida' },
            ...(config.timer > 0
              ? [
                  {
                    etiqueta: 'Turno',
                    valor: timeLeft === null ? `${config.timer} s` : `${Math.ceil(timeLeft)} s`,
                    tono: 'cyan' as const,
                    title: 'Tiempo restante del turno',
                    urgente: urgent,
                  },
                ]
              : []),
          ]}
        />
        {config.timer > 0 && state.status === 'playing' && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel">
            <div
              className={`h-full rounded-full transition-[width] duration-300 ease-linear ${urgent ? 'bg-bad' : 'bg-cyan'}`}
              style={{ width: `${(timeLeft === null ? 1 : fraction) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function FeedbackToast({ state }: { state: GameState }) {
  const fb = state.feedback
  if (!fb) return <div className="hidden min-h-11 lg:block" aria-hidden="true" />
  const tone = fb.kind === 'ok' ? 'bg-ok/12 text-ok' : fb.kind === 'error' ? 'bg-bad/12 text-bad' : 'bg-cyan/12 text-cyan'
  const Icon = fb.kind === 'ok' ? Check : fb.kind === 'error' ? TriangleAlert : Info
  return (
    <div role="status" className={`animate-rise flex min-h-11 items-start gap-2 rounded-[10px] px-3 py-2.5 text-sm font-semibold ${tone}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{fb.kind === 'ok' ? `¡Bien! ${fb.text}` : fb.text}</span>
    </div>
  )
}

function LibrePanel({ state }: { state: GameState }) {
  return (
    <div className="rounded-[10px] border border-line bg-panel p-5">
      <h2 className="font-display text-[1.7rem] text-slate-50">Búsqueda libre</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
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
    <div className={`animate-rise rounded-xl border p-5 text-center ${won ? 'border-ok/50 bg-ok/[0.08]' : 'border-bad/40 bg-bad/[0.06]'}`}>
      <div className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-full ${won ? 'bg-ok/20 text-ok' : 'bg-bad/20 text-bad'}`}>
        {won ? <Trophy size={26} aria-hidden="true" /> : <Skull size={26} aria-hidden="true" />}
      </div>
      <h2 className="font-display text-[2.2rem] text-slate-50">{won ? '¡Ganaste!' : 'Partida terminada'}</h2>
      <p className="mt-1.5 text-sm text-slate-300">{describeEnd(state.endReason)}</p>

      <Marcador
        className="mt-4 text-left"
        datos={[
          { etiqueta: 'Casillas', valor: <Cifra valor={filled} total={9} />, tono: 'gold' },
          { etiqueta: 'Tiempo', valor: formatDuration(elapsedMs), tono: 'cyan' },
          { etiqueta: 'Fallos', valor: String(state.errors), tono: 'bad' },
        ]}
      />

      <p className="mt-4 text-xs text-slate-400">Toca cualquier casilla del tarjetón para ver todos los políticos que la cumplían.</p>

      <div className="mt-4 grid gap-2">
        <button type="button" onClick={onPlayAgain} className="btn-primary w-full">
          <RotateCcw size={16} aria-hidden="true" /> {state.config.daily ? 'Repetir (no cuenta)' : 'Nuevo tablero'}
        </button>
        <button type="button" onClick={copy} className="btn-secondary w-full">
          {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar resultado'}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold text-slate-300 hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
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
    game.selectCell(cell)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 pb-12 pt-4 sm:px-6 sm:pt-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onExit} className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Cambiar juego
        </button>
        <div className="flex flex-wrap items-center gap-1.5">
          {config.daily && <Chip tone="gold">Reto diario</Chip>}
          <Chip>{DIFFICULTY_LABEL[config.difficulty]}</Chip>
          <Chip>{config.timer === 0 ? 'Sin tiempo' : `${config.timer} s por turno`}</Chip>
        </div>
      </header>

      <Hud state={state} timeLeft={game.timeLeft} elapsedMs={game.elapsedMs} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-7">
        {/* El tablero es un tarjetón de papel. */}
        <section aria-label="Tarjetón" className="papel order-2 overflow-hidden lg:order-1">
          <Franja className="h-1.5" />
          <div className="p-2.5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-tinta px-1 pb-2 sm:mb-4 sm:px-0">
              <span className="font-display text-[1.6rem] tracking-[0.04em]">Tarjetón</span>
              <span className="etiqueta text-[10px] text-tinta-2 sm:text-[11px]">Un político distinto por casilla</span>
            </div>
            <Grid state={state} onCellClick={onCellClick} />
          </div>
        </section>

        {/* En móvil, el aviso y las reglas del turno van ENCIMA del tablero mientras se juega. */}
        <aside className={`space-y-3 lg:sticky lg:top-20 lg:order-2 ${playing ? 'order-1' : 'order-3'}`}>
          <FeedbackToast state={state} />
          {playing ? (
            <LibrePanel state={state} />
          ) : (
            <ResultPanel state={state} elapsedMs={game.elapsedMs} onPlayAgain={onPlayAgain} onExit={onExit} />
          )}
        </aside>
      </div>

      {playing && state.selectedCell !== null && (
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
