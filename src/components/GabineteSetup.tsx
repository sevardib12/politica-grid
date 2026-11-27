import { useMemo } from 'react'
import { poolCompleto } from '../gabinete/pool.ts'
import { TEMPORIZADOR_LABEL, type Dificultad } from '../gabinete/engine.ts'
import { TOTAL_SILLAS } from '../gabinete/posts.ts'
import { rachaDiaria, type StatsGabinete } from '../gabinete/stats.ts'
import { dateKey, formatDuration } from '../game/stats.ts'
import type { GabineteSettings } from '../routing/settings.ts'
import { Ayuda, Despliegue, PanelLibre, Papeleta } from './MenuPiezas.tsx'
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
    <Despliegue
      papeleta={
        <Papeleta
          id="diario-gabinete"
          fecha={fecha}
          datos={[
            { etiqueta: 'Racha', valor: `${racha} ${racha === 1 ? 'día' : 'días'}`, title: 'Días seguidos con el reto diario ganado' },
            {
              etiqueta: 'Récord',
              valor: stats.mejorDiarioMs !== null ? formatDuration(stats.mejorDiarioMs) : '—',
              title: 'Mejor tiempo en un reto diario ganado',
            },
          ]}
          boton={resultadoHoy ? 'Repetir reto diario' : 'Jugar reto diario'}
          onJugar={onPlayDaily}
        >
          {resultadoHoy ? (
            <p className="rounded-md bg-tinta/[0.06] px-3 py-2">
              {resultadoHoy.ganada
                ? `Hoy lo armaste en ${formatDuration(resultadoHoy.ms)}.`
                : `Hoy llenaste ${resultadoHoy.llenas}/${TOTAL_SILLAS} sillas.`}{' '}
              Puedes repetirlo, pero solo cuenta el primer intento.
            </p>
          ) : (
            <p>La misma secuencia de partidos para todos, cada día una nueva. Cronómetro y sin límite de turno.</p>
          )}
        </Papeleta>
      }
      libre={
        <PanelLibre id="partida-gabinete" onJugar={onPlay}>
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
        </PanelLibre>
      }
      ayuda={
        <Ayuda>
          <li>
            Cada giro sortea un partido con la misma probabilidad para todos, mientras les quede algún político sin usar: el número de miembros
            no cuenta.
          </li>
          <li>
            Elige a un político del partido sorteado y toca una silla libre. Puedes ponerlo en cualquier silla; el cargo no restringe nada.
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
        </Ayuda>
      }
      nota={
        <>
          Juega toda la base: {candidatos.toLocaleString('es-CO')} políticos, de los que {conPartido.toLocaleString('es-CO')} salen en la
          ruleta por sus {partidos} partidos. Quien no tiene foto aparece con sus iniciales. Si ves un dato incorrecto, es un error de la
          base y no de tu respuesta.
        </>
      }
    />
  )
}
