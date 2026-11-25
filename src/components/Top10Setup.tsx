import { TOP10_BY_ID, TOP10_CATEGORY_LABEL, TOP10_LISTS, type Top10Category } from '../data/top10Lists.ts'
import { currentStreak, dateKey } from '../game/stats.ts'
import type { Top10Settings } from '../routing/settings.ts'
import { dailyChallengeId, type CategoryChoice } from '../top10/daily.ts'
import { MAX_LIVES, MODE_LABEL, TIMED_SECONDS } from '../top10/engine.ts'
import type { Top10Stats } from '../top10/stats.ts'
import { Ayuda, Despliegue, PanelLibre, Papeleta } from './MenuPiezas.tsx'
import { Segmented } from './ui.tsx'

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

/** Lo que se despliega en la tarjeta de Política Top 10 del menú: reto diario, partida libre y reglas. */
export function Top10Setup({
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
  const today = dateKey()
  const todayResult = stats.daily[today]
  const streak = currentStreak(stats.daily)
  const daily = TOP10_BY_ID.get(dailyChallengeId(today))
  const dateLabel = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <Despliegue
      papeleta={
        <Papeleta
          id="diario-top10"
          fecha={dateLabel}
          datos={[
            {
              etiqueta: 'Racha',
              valor: `${streak} ${streak === 1 ? 'día' : 'días'}`,
              title: 'Días seguidos con el reto diario ganado (todas las filas acertadas)',
            },
            ...(daily ? [{ etiqueta: 'Filas', valor: String(daily.items.length) }] : []),
          ]}
          boton={todayResult ? 'Repetir reto diario' : 'Jugar reto diario'}
          onJugar={onPlayDaily}
        >
          {daily && (
            <p className="mb-2 text-balance text-lg font-extrabold leading-snug text-tinta">
              {daily.titulo}
              <span className="ml-2 inline-flex rounded bg-tinta-azul/10 px-1.5 py-0.5 align-middle text-[11px] font-extrabold uppercase tracking-[0.08em] text-tinta-azul">
                {TOP10_CATEGORY_LABEL[daily.categoria]}
              </span>
            </p>
          )}
          {todayResult ? (
            <p className="rounded-md bg-tinta/[0.06] px-3 py-2">
              {todayResult.won
                ? `Hoy completaste la lista (${todayResult.found}/${todayResult.size}).`
                : `Hoy acertaste ${todayResult.found}/${todayResult.size}.`}{' '}
              Puedes repetirla, pero solo cuenta el primer intento.
            </p>
          ) : (
            <p className="text-tinta-2">La misma lista para todos, cada día una nueva. La racha cuenta los días en que aciertas todas las filas.</p>
          )}
        </Papeleta>
      }
      libre={
        <PanelLibre id="partida-top10" onJugar={onPlay}>
          <fieldset>
            <legend className="etiqueta mb-2 text-slate-400">Categoría</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['aleatoria', ...CATEGORIES] as CategoryChoice[]).map((c) => {
                const active = settings.category === c
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSettings({ ...settings, category: c })}
                    className={`rounded-lg border px-3 py-2.5 text-left transition ${
                      active ? 'border-gold bg-gold/10' : 'border-line bg-panel hover:border-slate-600'
                    } ${c === 'aleatoria' ? 'col-span-2' : ''}`}
                  >
                    <span className={`block text-sm font-bold ${active ? 'text-gold' : 'text-slate-50'}`}>
                      {c === 'aleatoria' ? 'Aleatoria' : TOP10_CATEGORY_LABEL[c]}
                      <span className="ml-1.5 text-xs font-semibold text-slate-400">{countIn(c)} listas</span>
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
        </PanelLibre>
      }
      ayuda={
        <Ayuda>
          <li>Cada lista tiene 10 o 5 filas numeradas. De cada fila ves el partido y una pista (años, votos…); el nombre está oculto.</li>
          <li>
            Escribe un nombre en la caja de abajo: sirve el nombre completo, el apellido o un apodo, con o sin tildes, y se perdonan erratas
            pequeñas.
          </li>
          <li>Acertar rellena su fila al instante, en cualquier orden. Un nombre que no está en la lista cuesta una vida; tienes {MAX_LIVES}.</li>
          <li>Si lo escrito es muy vago («Luis») o sirve para dos personas de la lista, te avisamos sin quitarte vida.</li>
          <li>Puedes rendirte para ver las filas que faltan con sus datos completos.</li>
          <li>En «Últimos…» la fila 1 es el más reciente; en las listas de votos, el más votado.</li>
          <li>
            En el duelo, los dos se turnan en este mismo teléfono: acertar suma la fila y pasa el turno; un nombre que no está cuesta una vida
            y también pasa el turno. Cada uno tiene 3 vidas y gana quien más filas acierte.
          </li>
        </Ayuda>
      }
      nota={<>{TOP10_LISTS.length} listas verificadas con Wikipedia y prensa. Si ves un dato incorrecto, es un error de la base y no de tu respuesta.</>}
    />
  )
}
