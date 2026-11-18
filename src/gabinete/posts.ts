/** Los 11 cargos del organigrama, en tres niveles. Cualquier político del partido sorteado puede ocupar cualquiera. */
export interface Silla {
  id: string
  nivel: 1 | 2 | 3
  cargo: string
}

export const SILLAS: readonly Silla[] = [
  { id: 'presidente', nivel: 1, cargo: 'Presidente de la República' },
  { id: 'vicepresidente', nivel: 1, cargo: 'Vicepresidente de la República' },
  { id: 'interior', nivel: 2, cargo: 'Ministro/a del Interior' },
  { id: 'hacienda', nivel: 2, cargo: 'Ministro/a de Hacienda' },
  { id: 'defensa', nivel: 2, cargo: 'Ministro/a de Defensa' },
  { id: 'canciller', nivel: 2, cargo: 'Canciller (Relaciones Exteriores)' },
  { id: 'salud', nivel: 2, cargo: 'Ministro/a de Salud' },
  { id: 'dapre', nivel: 3, cargo: 'Director/a del DAPRE' },
  { id: 'dnp', nivel: 3, cargo: 'Director/a del DNP' },
  { id: 'dane', nivel: 3, cargo: 'Director/a del DANE' },
  { id: 'dps', nivel: 3, cargo: 'Director/a de Prosperidad Social' },
]

export const TOTAL_SILLAS = SILLAS.length
