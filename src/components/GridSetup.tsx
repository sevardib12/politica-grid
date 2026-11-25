import { POLITICIANS } from '../data/politicians.ts'
import { currentStreak, dailyDifficulty, dateKey, formatDuration, type Stats } from '../game/stats.ts'
import type { GridSettings } from '../routing/settings.ts'
import { DIFFICULTIES } from '../utils/gridGenerator.ts'
import { DIFFICULTY_HINT, DIFFICULTY_LABEL } from './labels.ts'
import { Ayuda, Despliegue, PanelLibre, Papeleta } from './MenuPiezas.tsx'
import { Segmented } from './ui.tsx'

const MODE_TEXT =
  'Las 9 casillas están abiertas. Toca una, busca al político por nombre y acierta con 9 intentos en total.'

/** Lo que se despliega en la tarjeta de Política Grid del menú: reto diario, partida libre y reglas. */
export function GridSetup({
  settings,
  onSettings,
  stats,
  onPlay,
  onPlayDaily,
}: {
  settings: GridSettings
  onSettings: (s: GridSettings) => void
  stats: Stats
  onPlay: () => void
  onPlayDaily: () => void
}) {
  const today = dateKey()
  const todayResult = stats.daily[today]
  const streak = currentStreak(stats.daily)
  const dailyLevel = dailyDifficulty(today)
  const dateLabel = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <Despliegue
      papeleta={
        <Papeleta
          id="diario"
          fecha={dateLabel}
          datos={[
            { etiqueta: 'Racha', valor: `${streak} ${streak === 1 ? 'día' : 'días'}`, title: 'Días seguidos con el reto diario ganado' },
            { etiqueta: 'Dificultad', valor: DIFFICULTY_LABEL[dailyLevel], title: 'Dificultad del tablero de hoy' },
          ]}
          boton={todayResult ? 'Repetir reto diario' : 'Jugar reto diario'}
          onJugar={onPlayDaily}
        >
          {todayResult ? (
            <p className="rounded-md bg-tinta/[0.06] px-3 py-2">
              {todayResult.won ? `Hoy lo ganaste en ${formatDuration(todayResult.ms)}.` : `Hoy completaste ${todayResult.filled}/9 casillas.`}{' '}
              Puedes repetirlo, pero solo cuenta el primer intento.
            </p>
          ) : (
            <p>El mismo tablero para todos, cada día uno nuevo.</p>
          )}
        </Papeleta>
      }
      libre={
        <PanelLibre id="partida" onJugar={onPlay}>
          <p className="-mt-1 text-[15px] leading-relaxed text-slate-300">{MODE_TEXT}</p>
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
          <div>
            <Segmented
              label="Dificultad"
              value={settings.difficulty}
              onChange={(difficulty) => onSettings({ ...settings, difficulty })}
              options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))}
            />
            <p className="mt-2 text-[13px] text-slate-400">{DIFFICULTY_HINT[settings.difficulty]} en la base de datos.</p>
          </div>
        </PanelLibre>
      }
      ayuda={
        <Ayuda>
          <li>
            Cada casilla cruza el criterio de su fila con el de su columna: por ejemplo, <em>Senador/a</em> × <em>Partido Liberal</em>.
          </li>
          <li>Ubica en cada casilla a un político que cumpla los dos criterios. No puedes repetir políticos.</li>
          <li>Los tableros siempre tienen solución: hay al menos 9 políticos distintos que llenan las 9 casillas.</li>
          <li>El temporizador es por turno: si se acaba, termina la partida.</li>
          <li>Al terminar puedes tocar cualquier casilla para ver todos los políticos que la cumplían y por qué.</li>
        </Ayuda>
      }
      nota={
        <>
          {POLITICIANS.length.toLocaleString('es-CO')} políticos en la base de datos. Hecha para jugar y aprender: si ves un dato incorrecto,
          es un error de la base y no de tu respuesta.
        </>
      }
    />
  )
}
