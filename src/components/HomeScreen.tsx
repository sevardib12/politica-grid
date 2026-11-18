import { BarChart3, CalendarDays, ChevronDown, Flame, Play } from 'lucide-react'
import { useState } from 'react'
import type { Mode, TimerSeconds } from '../game/engine.ts'
import { currentStreak, dailyDifficulty, dateKey, formatDuration, type Stats } from '../game/stats.ts'
import { DIFFICULTIES, type Difficulty } from '../utils/gridGenerator.ts'
import { POLITICIANS } from '../data/politicians.ts'
import { DIFFICULTY_HINT, DIFFICULTY_LABEL } from './labels.ts'
import { Segmented } from './ui.tsx'

export interface Settings {
  mode: Mode
  timer: TimerSeconds
  difficulty: Difficulty
}

const MODE_TEXT =
  'Las 9 casillas están abiertas. Toca una, busca al político por nombre y acierta con 9 intentos en total.'

export function HomeScreen({
  settings,
  onSettings,
  stats,
  onPlay,
  onPlayDaily,
  onOpenStats,
}: {
  settings: Settings
  onSettings: (s: Settings) => void
  stats: Stats
  onPlay: () => void
  onPlayDaily: () => void
  onOpenStats: () => void
}) {
  const [help, setHelp] = useState(false)
  const today = dateKey()
  const todayResult = stats.daily[today]
  const streak = currentStreak(stats.daily)
  const dailyLevel = dailyDifficulty(today)
  const dateLabel = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:pt-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-grid grid-cols-3 gap-1" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`size-3.5 rounded-[5px] ${i === 4 ? 'bg-gold' : 'bg-cyan/70'}`} />
            ))}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
            Política <span className="text-gold">Grid</span>
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-300 sm:text-base">
            Completa la cuadrícula cruzando cargos, partidos y épocas de la política colombiana, de los años 80 a 2026.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenStats}
          aria-label="Estadísticas"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan hover:text-cyan"
        >
          <BarChart3 size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Estadísticas</span>
        </button>
      </header>

      <section
        aria-labelledby="diario"
        className="mb-6 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-panel to-panel p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="diario" className="flex items-center gap-2 text-lg font-extrabold text-gold">
              <CalendarDays size={20} aria-hidden="true" /> Reto diario
            </h2>
            <p className="mt-1 text-sm text-slate-300 first-letter:uppercase">
              {dateLabel} · {DIFFICULTY_LABEL[dailyLevel]}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-sm font-bold text-gold" title="Días seguidos con el reto diario ganado">
            <Flame size={16} aria-hidden="true" /> Racha: {streak}
          </div>
        </div>
        {todayResult ? (
          <p className="mt-3 rounded-xl bg-ink/50 px-3 py-2 text-sm text-slate-200">
            {todayResult.won
              ? `Hoy lo ganaste en ${formatDuration(todayResult.ms)}.`
              : `Hoy completaste ${todayResult.filled}/9 casillas.`}{' '}
            Puedes repetirlo, pero solo cuenta el primer intento.
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-300">El mismo tablero para todos, cada día uno nuevo.</p>
        )}
        <button
          type="button"
          onClick={onPlayDaily}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
        >
          <Play size={16} aria-hidden="true" fill="currentColor" />
          {todayResult ? 'Repetir reto diario' : 'Jugar reto diario'}
        </button>
      </section>

      <section aria-labelledby="partida" className="rounded-3xl border border-line bg-panel p-5">
        <h2 id="partida" className="mb-4 text-lg font-extrabold text-slate-50">
          Partida libre
        </h2>

        <div className="space-y-5">
          <p className="-mb-1 text-sm leading-relaxed text-slate-300">{MODE_TEXT}</p>

          <Segmented
            label="Temporizador (por turno)"
            value={settings.timer}
            onChange={(timer) => onSettings({ ...settings, timer })}
            options={[
              { value: 0, label: 'Sin tiempo' },
              { value: 90, label: '90 s' },
              { value: 60, label: '60 s' },
              { value: 40, label: '40 s' },
            ]}
          />

          <Segmented
            label="Dificultad"
            value={settings.difficulty}
            onChange={(difficulty) => onSettings({ ...settings, difficulty })}
            options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))}
          />
          <p className="-mt-3 text-xs text-slate-400">{DIFFICULTY_HINT[settings.difficulty]} en la base de datos.</p>
        </div>

        <button
          type="button"
          onClick={onPlay}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3.5 text-base font-extrabold text-ink transition hover:brightness-110 active:scale-[0.99]"
        >
          <Play size={18} aria-hidden="true" fill="currentColor" /> Jugar
        </button>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-panel/60">
        <button
          type="button"
          onClick={() => setHelp((v) => !v)}
          aria-expanded={help}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-100"
        >
          Cómo se juega
          <ChevronDown size={18} className={`transition ${help ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {help && (
          <ul className="space-y-2 px-5 pb-5 text-sm leading-relaxed text-slate-300">
            <li>
              Cada casilla cruza el criterio de su fila con el de su columna: por ejemplo, <em>Senador/a</em> × <em>Partido Liberal</em>.
            </li>
            <li>Ubica en cada casilla a un político que cumpla los dos criterios. No puedes repetir políticos.</li>
            <li>Los tableros siempre tienen solución: hay al menos 9 políticos distintos que llenan las 9 casillas.</li>
            <li>El temporizador es por turno: si se acaba, termina la partida.</li>
            <li>Al terminar puedes tocar cualquier casilla para ver todos los políticos que la cumplían y por qué.</li>
          </ul>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-slate-500">
        {POLITICIANS.length} políticos en la base de datos. Hecha para jugar y aprender: si ves un dato incorrecto, es un error de la
        base y no de tu respuesta.
      </p>
    </div>
  )
}
