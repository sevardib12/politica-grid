import { Flame, Trophy } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { TEMPORIZADOR_LABEL, type Temporizador } from '../gabinete/engine.ts'
import { rachaDiaria, type StatsGabinete } from '../gabinete/stats.ts'
import { currentStreak, dateKey, formatDuration, type Stats } from '../game/stats.ts'
import type { GameId } from '../routing/route.ts'
import { useStats } from '../stats/useStats.ts'
import { top10Streak, type Top10Stats } from '../top10/stats.ts'
import { DIFFICULTIES, type Difficulty } from '../utils/gridGenerator.ts'
import { DIFFICULTY_LABEL, MODE_LABEL } from './labels.ts'
import { Modal, Segmented } from './ui.tsx'

function Tile({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/50 p-3 text-center">
      <p className="flex items-center justify-center gap-1 text-2xl font-extrabold text-gold">
        {icon}
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">{children}</h3>
}

function GridStatsView({ stats }: { stats: Stats }) {
  const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0
  const streak = currentStreak(stats.daily)
  const times = Object.entries(stats.bestTimes).sort(([a], [b]) => a.localeCompare(b))

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Partidas" value={stats.played} />
        <Tile label="Victorias" value={`${stats.won} (${winRate}%)`} />
        <Tile label="Racha diaria" value={streak} icon={<Flame size={20} aria-hidden="true" />} />
        <Tile label="Mejor racha" value={stats.maxStreak} icon={<Trophy size={18} aria-hidden="true" />} />
      </div>

      <SectionTitle>Por dificultad</SectionTitle>
      <ul className="space-y-1.5">
        {DIFFICULTIES.map((d: Difficulty) => {
          const s = stats.byDifficulty[d]
          return (
            <li key={d} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
              <span className="font-semibold text-slate-100">{DIFFICULTY_LABEL[d]}</span>
              <span className="text-slate-300">
                {s.won} / {s.played} ganadas
              </span>
            </li>
          )
        })}
      </ul>

      <SectionTitle>Mejores tiempos</SectionTitle>
      {times.length === 0 ? (
        <p className="rounded-xl bg-white/5 px-3 py-3 text-sm text-slate-400">Aún no has ganado ninguna partida.</p>
      ) : (
        <ul className="space-y-1.5">
          {times.map(([key, ms]) => {
            const [mode, difficulty, timer] = key.split('|')
            return (
              <li key={key} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                <span className="text-slate-200">
                  {MODE_LABEL[mode as keyof typeof MODE_LABEL]} · {DIFFICULTY_LABEL[difficulty as Difficulty]} ·{' '}
                  {timer === '0' ? 'sin tiempo' : `${timer} s`}
                </span>
                <span className="font-bold tabular-nums text-cyan">{formatDuration(ms)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

function Top10StatsView({ stats }: { stats: Top10Stats }) {
  const accuracy = stats.itemsTotal > 0 ? Math.round((stats.itemsFound / stats.itemsTotal) * 100) : null
  const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Partidas" value={stats.played} />
        <Tile label="Listas completas" value={`${stats.won} (${winRate}%)`} />
        <Tile label="Racha diaria" value={top10Streak(stats)} icon={<Flame size={20} aria-hidden="true" />} />
        <Tile label="Mejor racha" value={stats.maxStreak} icon={<Trophy size={18} aria-hidden="true" />} />
      </div>
      <SectionTitle>Aciertos</SectionTitle>
      <p className="rounded-xl bg-white/5 px-3 py-3 text-sm text-slate-200">
        {accuracy === null
          ? 'Aún no has jugado ninguna lista.'
          : `${stats.itemsFound} de ${stats.itemsTotal} filas acertadas (${accuracy} %).`}
      </p>
      <p className="mt-2 text-xs text-slate-500">Los duelos de dos jugadores no cuentan en tus estadísticas.</p>
    </>
  )
}

const TEMPORIZADORES: Temporizador[] = ['cronometro', 'turno', 'contrarreloj']

function GabineteStatsView({ stats }: { stats: StatsGabinete }) {
  const racha = rachaDiaria(stats.diario, dateKey())
  const retosJugados = Object.keys(stats.diario).length
  const retosGanados = Object.values(stats.diario).filter((r) => r.ganada).length
  const tiempos = TEMPORIZADORES.filter((t) => stats.libre.mejorMs[t] !== undefined)

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Libres jugadas" value={stats.libre.jugadas} />
        <Tile label="Libres ganadas" value={stats.libre.ganadas} />
        <Tile label="Racha diaria" value={racha} icon={<Flame size={20} aria-hidden="true" />} />
        <Tile
          label="Récord diario"
          value={stats.mejorDiarioMs !== null ? formatDuration(stats.mejorDiarioMs) : '—'}
          icon={<Trophy size={18} aria-hidden="true" />}
        />
      </div>

      <SectionTitle>Retos diarios</SectionTitle>
      <p className="rounded-xl bg-white/5 px-3 py-3 text-sm text-slate-200">
        {retosJugados === 0 ? 'Aún no has jugado ningún reto diario.' : `${retosGanados} ganados de ${retosJugados} jugados.`}
      </p>

      <SectionTitle>Mejores tiempos en partida libre</SectionTitle>
      {tiempos.length === 0 ? (
        <p className="rounded-xl bg-white/5 px-3 py-3 text-sm text-slate-400">Aún no has ganado ninguna partida libre.</p>
      ) : (
        <ul className="space-y-1.5">
          {tiempos.map((t) => (
            <li key={t} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
              <span className="text-slate-200">{TEMPORIZADOR_LABEL[t]}</span>
              <span className="font-bold tabular-nums text-cyan">{formatDuration(stats.libre.mejorMs[t] ?? 0)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

const GAME_NAME: Record<GameId, string> = { grid: 'Política Grid', top10: 'Política Top 10', gabinete: 'Arma el Gabinete' }

/** Estadísticas de los tres juegos en un solo modal; se abre en el juego en el que estás (o Grid en el menú). */
export function StatsModal({ initialGame, onClose }: { initialGame: GameId; onClose: () => void }) {
  const stats = useStats()
  const [game, setGame] = useState<GameId>(initialGame)
  const [confirm, setConfirm] = useState(false)

  const reset = () => {
    if (game === 'grid') stats.resetGrid()
    else if (game === 'top10') stats.resetTop10()
    else stats.resetGabinete()
    setConfirm(false)
  }

  return (
    <Modal title="Tus estadísticas" onClose={onClose}>
      <Segmented
        label="Juego"
        value={game}
        onChange={(g) => {
          setGame(g)
          setConfirm(false)
        }}
        options={[
          { value: 'grid', label: 'Grid' },
          { value: 'top10', label: 'Top 10' },
          { value: 'gabinete', label: 'Gabinete' },
        ]}
      />

      <div className="mt-4">
        {game === 'grid' && <GridStatsView stats={stats.grid} />}
        {game === 'top10' && <Top10StatsView stats={stats.top10} />}
        {game === 'gabinete' && <GabineteStatsView stats={stats.gabinete} />}
      </div>

      <div className="mt-6 border-t border-line pt-4">
        {confirm ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-300">¿Borrar las de {GAME_NAME[game]}?</span>
            <button type="button" onClick={reset} className="rounded-lg bg-bad/20 px-3 py-1.5 font-semibold text-bad hover:bg-bad/30">
              Sí, borrar
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/10">
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="text-xs font-semibold text-slate-500 hover:text-bad">
            Borrar estadísticas de {GAME_NAME[game]}
          </button>
        )}
      </div>
    </Modal>
  )
}
