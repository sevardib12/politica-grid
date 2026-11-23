import { CalendarDays, ChevronDown, Flame, Play, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { poolCompleto } from '../gabinete/pool.ts'
import { TEMPORIZADOR_LABEL, type Dificultad } from '../gabinete/engine.ts'
import { TOTAL_SILLAS } from '../gabinete/posts.ts'
import { rachaDiaria, type StatsGabinete } from '../gabinete/stats.ts'
import { dateKey, formatDuration } from '../game/stats.ts'
import type { GabineteSettings } from '../routing/settings.ts'
import { Segmented } from './ui.tsx'

const DIFICULTAD_LABEL: Record<Dificultad, string> = { normal: 'Normal', dificil: 'Difícil' }

/** Lo que se despliega en la tarjeta de Arma el Gabinete del menú: reto diario, partida libre y reglas. */
export function GabineteSetup({
  settings,
  onSettings,
  stats,
  onPlay,
  onPlayDaily,
}: {
  settings: GabineteSettings
  onSettings: (s: GabineteSettings) => void
  stats: StatsGabinete
  onPlay: () => void
  onPlayDaily: () => void
}) {
  const [ayuda, setAyuda] = useState(false)
  const hoy = dateKey()
  const resultadoHoy = stats.diario[hoy]
  const racha = rachaDiaria(stats.diario, hoy)
  const fecha = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
  const { candidatos, conPartido, partidos } = useMemo(() => {
    const pool = poolCompleto()
    return {
      candidatos: pool.porId.size,
      conPartido: new Set([...pool.porPartido.values()].flat().map((p) => p.id)).size,
      partidos: pool.partidos.length,
    }
  }, [])

  return (
    <div className="space-y-4">
      <section
        aria-labelledby="diario-gabinete"
        className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-panel to-panel p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 id="diario-gabinete" className="flex items-center gap-2 text-lg font-extrabold text-gold">
              <CalendarDays size={20} aria-hidden="true" /> Reto diario
            </h3>
            <p className="mt-1 text-sm text-slate-300 first-letter:uppercase">{fecha}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-sm font-bold text-gold"
              title="Días seguidos con el reto diario ganado"
            >
              <Flame size={16} aria-hidden="true" /> Racha: {racha}
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-sm font-bold text-cyan"
              title="Mejor tiempo en un reto diario ganado"
            >
              <Trophy size={14} aria-hidden="true" /> Récord:{' '}
              {stats.mejorDiarioMs !== null ? formatDuration(stats.mejorDiarioMs) : '—'}
            </span>
          </div>
        </div>
        {resultadoHoy ? (
          <p className="mt-3 rounded-xl bg-ink/50 px-3 py-2 text-sm text-slate-200">
            {resultadoHoy.ganada
              ? `Hoy lo armaste en ${formatDuration(resultadoHoy.ms)}.`
              : `Hoy llenaste ${resultadoHoy.llenas}/${TOTAL_SILLAS} sillas.`}{' '}
            Puedes repetirlo, pero solo cuenta el primer intento.
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-300">La misma secuencia de partidos para todos, cada día una nueva. Cronómetro y sin límite de turno.</p>
        )}
        <button
          type="button"
          onClick={onPlayDaily}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-110 active:scale-[0.98]"
        >
          <Play size={16} aria-hidden="true" fill="currentColor" />
          {resultadoHoy ? 'Repetir reto diario' : 'Jugar reto diario'}
        </button>
      </section>

      <section aria-labelledby="partida-gabinete" className="rounded-3xl border border-line bg-ink/40 p-5">
        <h3 id="partida-gabinete" className="mb-4 text-lg font-extrabold text-slate-50">
          Partida libre
        </h3>
        <div className="space-y-5">
          <Segmented
            label="Temporizador"
            value={settings.temporizador}
            onChange={(temporizador) => onSettings({ ...settings, temporizador })}
            options={[
              { value: 'cronometro', label: TEMPORIZADOR_LABEL.cronometro, hint: 'cuenta para el récord' },
              { value: 'turno', label: TEMPORIZADOR_LABEL.turno, hint: '15 s para cada giro' },
              { value: 'contrarreloj', label: TEMPORIZADOR_LABEL.contrarreloj, hint: 'todo el gabinete' },
            ]}
          />
          <Segmented
            label="Dificultad"
            value={settings.dificultad}
            onChange={(dificultad) => onSettings({ ...settings, dificultad })}
            options={[
              { value: 'normal', label: DIFICULTAD_LABEL.normal, hint: 'con sugerencias' },
              { value: 'dificil', label: DIFICULTAD_LABEL.dificil, hint: 'sugerencias desde 3 letras' },
            ]}
          />
        </div>
        <button
          type="button"
          onClick={onPlay}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3.5 text-base font-extrabold text-ink transition hover:brightness-110 active:scale-[0.99]"
        >
          <Play size={18} aria-hidden="true" fill="currentColor" /> Jugar
        </button>
      </section>

      <section className="rounded-3xl border border-line bg-ink/40">
        <button
          type="button"
          onClick={() => setAyuda((v) => !v)}
          aria-expanded={ayuda}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-100"
        >
          Cómo se juega
          <ChevronDown size={18} className={`transition ${ayuda ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {ayuda && (
          <ul className="space-y-2 px-5 pb-5 text-sm leading-relaxed text-slate-300">
            <li>
              Cada giro sortea un partido. Su probabilidad depende de cuántos de sus políticos quedan sin usar: los partidos con más
              miembros salen más.
            </li>
            <li>
              Elige a un político del partido sorteado y toca una silla libre. Puedes ponerlo en cualquier silla; el cargo no restringe
              nada.
            </li>
            <li>Cada silla llena muestra el retrato, el partido con el que fue nombrado y un dato de su trayectoria.</li>
            <li>
              Cuestan un error: nombrar a alguien que no militó en el partido sorteado, repetir a alguien ya nombrado y dejar que se acabe el
              turno de 15 s. Con 3 errores pierdes.
            </li>
            <li>Tienes 2 comodines de «Re-sortear partido» (cambian el partido sin costar error) y el botón de rendirse.</li>
            <li>
              Gana quien llena las {TOTAL_SILLAS} sillas: presidencia, vicepresidencia y los 18 ministerios, más cuatro departamentos. En «
              {TEMPORIZADOR_LABEL.contrarreloj}» pierdes si se acaba el tiempo antes.
            </li>
          </ul>
        )}
      </section>

      <p className="px-1 text-center text-xs text-slate-500">
        Juega toda la base: {candidatos} políticos, de los que {conPartido} salen en la ruleta por sus {partidos} partidos. Quien no tiene
        foto aparece con sus iniciales. Si ves un dato incorrecto, es un error de la base y no de tu respuesta.
      </p>
    </div>
  )
}
