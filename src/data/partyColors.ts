import { PARTY_BY_NAME } from './parties.ts'
import type { Politician } from './types.ts'

export const NEUTRAL_COLOR = '#64748B'

/** Color del partido principal (el primero de la lista) para bordes y avatares. */
export function partyColor(p: Pick<Politician, 'partidos'>): string {
  return (p.partidos.length > 0 ? PARTY_BY_NAME.get(p.partidos[0])?.color_primario : undefined) ?? NEUTRAL_COLOR
}
