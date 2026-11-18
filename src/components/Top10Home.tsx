import { CalendarDays, ChevronDown, Flame, ListOrdered, Play } from 'lucide-react'
import { useState } from 'react'
import { TOP10_BY_ID, TOP10_CATEGORY_LABEL, TOP10_LISTS, type Top10Category } from '../data/top10Lists.ts'
import { currentStreak, dateKey } from '../game/stats.ts'
import { dailyChallengeId, type CategoryChoice } from '../top10/daily.ts'
import { MAX_LIVES, MODE_LABEL, TIMED_SECONDS, type Top10Mode, type Top10Players } from '../top10/engine.ts'
import type { Top10Stats } from '../top10/stats.ts'
import { Chip, Segmented } from './ui.tsx'

export interface Top10Settings {
  category: CategoryChoice
  mode: Top10Mode
  players: Top10Players
}

const CATEGORIES: Top10Category[] = ['cargos', 'congreso', 'alcaldias', 'presidenciales']

const CATEGORY_HINT: Record<Top10Category, string> = {
  cargos: 'Presidentes, alcaldes, ministros, procuradores…',
  congreso: 'Senadores más votados',
  alcaldias: 'Gobernadores, alcaldes de capitales y concejales por votos',
  presidenciales: 'Primeras y segundas vueltas, mujeres',
}

function countIn(category: CategoryChoice): number {
  return category === 'aleatoria' ? TOP10_LISTS.length : TOP10_LISTS.filter((l) => l.categoria === category).length
}

export function Top10Home({
  settings,
  onSettings,
  stats,
  onPlay,
  onPlayDaily,
}: {
  settings: Top10Settings
  onSettings: (s: Top10Settings) => void
  stats: Top10Stats
  onPlay: () => void
  onPlayDaily: () => void
}) {
  const [help, setHelp] = useState(false)
  const today = dateKey()
  const todayResult = stats.daily[today]
  const streak = currentStreak(stats.daily)
  const daily = TOP10_BY_ID.get(dailyChallengeId(today))
  const dateLabel = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
  const accuracy = stats.itemsTotal > 0 ? Math.round((stats.itemsFound / stats.itemsTotal) * 100) : null

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:pt-10">
      <header className="mb-8">
        <span className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-gold text-ink" aria-hidden="true">
          <ListOrdered size={22} />
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
          Política <span className="text-gold">Top 10</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-slate-300 sm:text-base">
          Adivina las 10 (o 5) respuestas de una lista de la política colombiana: los últimos presidentes, los más votados, los ministros…
          Cada fila trae una pista; tienes {MAX_LIVES} fallos.
        </p>
      </header>

      <section
        aria-labelledby="diario-top10"
        className="mb-6 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-panel to-panel p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="diario-top10" className="flex items-center gap-2 text-lg font-extrabold text-gold">
              <CalendarDays size={20} aria-hidden="true" /> Reto Diario Top 10
            </h2>
            <p className="mt-1 text-sm text-slate-300 first-letter:uppercase">{dateLabel}</p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-sm font-bold text-gold"
            title="Días seguidos con el reto diario ganado (todas las filas acertadas)"
          >
            <Flame size={16} aria-hidden="true" /> Racha: {streak}
          </div>
        </div>

        {daily && (
          <p className="mt-3 text-balance text-base font-extrabold leading-snug text-slate-50">
            {daily.titulo}
            <span className="ml-2 align-middle">
              <Chip tone="cyan">{TOP10_CATEGORY_LABEL[daily.categoria]}</Chip>
            </span>
          </p>
        )}

        {todayResult ? (
          <p className="mt-3 rounded-xl bg-ink/50 px-3 py-2 text-sm text-slate-200">
            {todayResult.won
              ? `Hoy completaste la lista (${todayResult.found}/${todayResult.size}).`
              : `Hoy acertaste ${todayResult.found}/${todayResult.size}.`}{' '}
            Puedes repetirla, pero solo cuenta el primer intento.
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-300">La misma lista para todos, cada día una nueva. La racha cuenta los días en que aciertas todas las filas.</p>
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

      <section aria-labelledby="partida-top10" className="rounded-3xl border border-line bg-panel p-5">
        <h2 id="partida-top10" className="mb-4 text-lg font-extrabold text-slate-50">
          Partida libre
        </h2>

        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Categoría</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['aleatoria', ...CATEGORIES] as CategoryChoice[]).map((c) => {
                const active = settings.category === c
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSettings({ ...settings, category: c })}
                    className={`rounded-2xl border px-3 py-2.5 text-left transition ${
                      active ? 'border-gold bg-gold/10' : 'border-line bg-ink/60 hover:border-slate-500'
                    } ${c === 'aleatoria' ? 'col-span-2' : ''}`}
                  >
                    <span className={`block text-sm font-bold ${active ? 'text-gold' : 'text-slate-100'}`}>
                      {c === 'aleatoria' ? 'Aleatoria' : TOP10_CATEGORY_LABEL[c]}
                      <span className="ml-1.5 text-xs font-semibold text-slate-500">{countIn(c)} listas</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {c === 'aleatoria' ? 'Una lista al azar de todas las categorías' : CATEGORY_HINT[c]}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <Segmented
            label="Jugadores"
            value={settings.players}
            onChange={(players) => onSettings({ ...settings, players })}
            options={[
              { value: 1, label: 'Un jugador', hint: 'tú solo' },
              { value: 2, label: 'Duelo por turnos', hint: 'dos en este mismo teléfono' },
            ]}
          />

          {settings.players === 1 && (
            <Segmented
              label="Modo de tiempo"
              value={settings.mode}
              onChange={(mode) => onSettings({ ...settings, mode })}
              options={[
                { value: 'normal', label: MODE_LABEL.normal, hint: 'sin límite' },
                { value: 'contrarreloj', label: MODE_LABEL.contrarreloj, hint: `${TIMED_SECONDS} s en cuenta regresiva` },
              ]}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onPlay}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3.5 text-base font-extrabold text-ink transition hover:brightness-110 active:scale-[0.99]"
        >
          <Play size={18} aria-hidden="true" fill="currentColor" /> Jugar
        </button>
      </section>

      {stats.played > 0 && (
        <section aria-label="Tus estadísticas" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['Partidas', String(stats.played)],
            ['Listas completas', String(stats.won)],
            ['Aciertos', accuracy === null ? '—' : `${stats.itemsFound} (${accuracy} %)`],
            ['Mejor racha', String(stats.maxStreak)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line bg-panel/60 px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-0.5 text-lg font-black text-slate-50">{value}</p>
            </div>
          ))}
        </section>
      )}

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
            <li>Cada lista tiene 10 o 5 filas numeradas. De cada fila ves el partido y una pista (años, votos…); el nombre está oculto.</li>
            <li>Escribe un nombre en la caja de abajo: sirve el nombre completo, el apellido o un apodo, con o sin tildes, y se perdonan erratas pequeñas.</li>
            <li>Acertar rellena su fila al instante, en cualquier orden. Un nombre que no está en la lista cuesta una vida; tienes {MAX_LIVES}.</li>
            <li>Si lo escrito es muy vago («Luis») o sirve para dos personas de la lista, te avisamos sin quitarte vida.</li>
            <li>Puedes rendirte (🏳) para ver las filas que faltan con sus datos completos.</li>
            <li>En «Últimos…» la fila 1 es el más reciente; en las listas de votos, el más votado.</li>
            <li>En el duelo, los dos se turnan en este mismo teléfono: acertar suma la fila y pasa el turno; un nombre que no está cuesta una vida y también pasa el turno. Cada uno tiene 3 vidas y gana quien más filas acierte.</li>
          </ul>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-slate-500">
        {TOP10_LISTS.length} listas verificadas con Wikipedia y prensa. Si ves un dato incorrecto, es un error de la base y no de tu respuesta.
      </p>
    </div>
  )
}
