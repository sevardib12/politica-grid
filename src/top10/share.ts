import { foundCount, MAX_LIVES, MODE_LABEL, type Top10State } from './engine.ts'

const KEYCAPS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

/** Texto compartible: `1️⃣🟩 2️⃣🟩 3️⃣🟥 …`, 🟩 acertada y 🟥 no. */
export function shareText(state: Top10State): string {
  const { config, challenge } = state
  const cells = challenge.items.map((_, i) => `${KEYCAPS[i]}${state.found[i] ? '🟩' : '🟥'}`)
  const rows: string[] = []
  for (let i = 0; i < cells.length; i += 5) rows.push(cells.slice(i, i + 5).join(' '))
  const hearts = '❤️'.repeat(state.lives) + '🖤'.repeat(MAX_LIVES - state.lives)
  const head = config.daily ? `Política Top 10 · ${config.dateKey}` : state.duel ? 'Política Top 10 · duelo' : 'Política Top 10'
  const resumen = state.duel
    ? `J1 ${state.duel.scores[0]} – ${state.duel.scores[1]} J2`
    : `${foundCount(state)}/${challenge.size} · ${hearts} · ${MODE_LABEL[config.mode]}`
  return [head, challenge.titulo, ...rows, resumen].join('\n')
}
