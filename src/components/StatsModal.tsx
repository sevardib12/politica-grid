import { Flame, Trophy } from 'lucide-react'
import { useState } from 'react'
import { currentStreak, formatDuration, type Stats } from '../game/stats.ts'
import { DIFFICULTIES, type Difficulty } from '../utils/gridGenerator.ts'
import { DIFFICULTY_LABEL, MODE_LABEL } from './labels.ts'
import { Modal } from './ui.tsx'

function Tile({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
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

export function StatsModal({
  stats,
  onReset,
  onClose,
}: {
  stats: Stats
  onReset: () => void
  onClose: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0
  const streak = currentStreak(stats.daily)
  const times = Object.entries(stats.bestTimes).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Modal title="Tus estadísticas" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Partidas" value={stats.played} />
        <Tile label="Victorias" value={`${stats.won} (${winRate}%)`} />
        <Tile label="Racha diaria" value={streak} icon={<Flame size={20} aria-hidden="true" />} />
        <Tile label="Mejor racha" value={stats.maxStreak} icon={<Trophy size={18} aria-hidden="true" />} />
      </div>

      <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">Por dificultad</h3>
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

      <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">Mejores tiempos</h3>
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

      <div className="mt-6 border-t border-line pt-4">
        {confirm ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-300">¿Borrar todo?</span>
            <button
              type="button"
              onClick={() => {
                onReset()
                setConfirm(false)
              }}
              className="rounded-lg bg-bad/20 px-3 py-1.5 font-semibold text-bad hover:bg-bad/30"
            >
              Sí, borrar
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/10">
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="text-xs font-semibold text-slate-500 hover:text-bad">
            Borrar estadísticas
          </button>
        )}
      </div>
    </Modal>
  )
}
