import { formatDuration } from '../game/stats.ts'
import { SILLAS } from './posts.ts'
import type { EstadoGabinete } from './engine.ts'

/** Cuadrados por fila: los 18 ministerios salen en tres filas de seis. */
const POR_FILA = 6

/** Texto del reto diario para compartir, con una cuadrícula por niveles del organigrama. */
export function textoCompartir(estado: EstadoGabinete, fechaLegible: string): string {
  const llenas = estado.sillas.filter((s) => s !== null).length
  const cuadro = (i: number) => (estado.sillas[i] !== null ? '🟩' : estado.estado === 'perdida' ? '🟥' : '⬜')
  const filas: string[] = []
  for (const nivel of [1, 2, 3] as const) {
    const idx = SILLAS.map((s, i) => (s.nivel === nivel ? i : -1)).filter((i) => i >= 0)
    for (let i = 0; i < idx.length; i += POR_FILA) filas.push(idx.slice(i, i + POR_FILA).map(cuadro).join(''))
  }
  const cabecera =
    estado.estado === 'ganada'
      ? `🏛️ Gabinete armado en ${formatDuration((estado.fin ?? estado.inicio) - estado.inicio)}`
      : `🏛️ Gabinete: ${llenas}/${SILLAS.length} sillas`
  return [`Arma el Gabinete · ${fechaLegible}`, cabecera, ...filas, `Errores: ${estado.errores}/3`].join('\n')
}
