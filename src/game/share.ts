import { DIFFICULTY_LABEL, MODE_LABEL } from '../components/labels.ts'
import { formatDuration } from './stats.ts'
import type { GameState } from './engine.ts'

/** Texto compartible estilo Wordle con el resultado de la partida. */
export function shareText(state: GameState): string {
  const { config } = state
  const filled = state.cells.filter((c) => c !== null).length
  const rows = [0, 1, 2].map((r) =>
    [0, 1, 2].map((c) => (state.cells[r * 3 + c] ? '🟩' : '⬛')).join(''),
  )
  const title = config.daily ? `Política Grid · ${config.seed.replace('diario-', '')}` : 'Política Grid'
  const ms = (state.endedAt ?? Date.now()) - state.startedAt
  return [
    title,
    `${DIFFICULTY_LABEL[config.difficulty]} · ${MODE_LABEL[config.mode]}`,
    ...rows,
    `${filled}/9${state.status === 'won' ? ` en ${formatDuration(ms)}` : ''}`,
  ].join('\n')
}
