/**
 * Las 24 sillas del organigrama, en tres niveles: la cúpula, los 18 ministerios en funcionamiento y cuatro
 * departamentos administrativos. Cualquier político del partido sorteado puede ocupar cualquiera.
 *
 * Los ministerios van en el orden de precedencia (el de la creación de cada cartera). El de Igualdad y
 * Equidad no está: la Corte Constitucional tumbó su ley de creación y el Decreto 0626 de 2026 lo puso en
 * liquidación desde junio de 2026.
 */
export interface Silla {
  id: string
  nivel: 1 | 2 | 3
  cargo: string
  /** Nombre corto para la silla del organigrama («Hacienda», «DANE»): el nivel ya dice qué tipo de cargo es. */
  corto: string
}

export const SILLAS: readonly Silla[] = [
  { id: 'presidente', nivel: 1, cargo: 'Presidente de la República', corto: 'Presidencia' },
  { id: 'vicepresidente', nivel: 1, cargo: 'Vicepresidente de la República', corto: 'Vicepresidencia' },
  { id: 'interior', nivel: 2, cargo: 'Ministro/a del Interior', corto: 'Interior' },
  { id: 'canciller', nivel: 2, cargo: 'Canciller (Relaciones Exteriores)', corto: 'Relaciones Exteriores' },
  { id: 'hacienda', nivel: 2, cargo: 'Ministro/a de Hacienda', corto: 'Hacienda' },
  { id: 'justicia', nivel: 2, cargo: 'Ministro/a de Justicia', corto: 'Justicia' },
  { id: 'defensa', nivel: 2, cargo: 'Ministro/a de Defensa', corto: 'Defensa' },
  { id: 'agricultura', nivel: 2, cargo: 'Ministro/a de Agricultura', corto: 'Agricultura' },
  { id: 'salud', nivel: 2, cargo: 'Ministro/a de Salud', corto: 'Salud' },
  { id: 'trabajo', nivel: 2, cargo: 'Ministro/a de Trabajo', corto: 'Trabajo' },
  { id: 'minas', nivel: 2, cargo: 'Ministro/a de Minas y Energía', corto: 'Minas y Energía' },
  { id: 'comercio', nivel: 2, cargo: 'Ministro/a de Comercio', corto: 'Comercio' },
  { id: 'educacion', nivel: 2, cargo: 'Ministro/a de Educación', corto: 'Educación' },
  { id: 'ambiente', nivel: 2, cargo: 'Ministro/a de Ambiente', corto: 'Ambiente' },
  { id: 'vivienda', nivel: 2, cargo: 'Ministro/a de Vivienda', corto: 'Vivienda' },
  { id: 'tic', nivel: 2, cargo: 'Ministro/a de las TIC', corto: 'TIC' },
  { id: 'transporte', nivel: 2, cargo: 'Ministro/a de Transporte', corto: 'Transporte' },
  { id: 'cultura', nivel: 2, cargo: 'Ministro/a de Cultura', corto: 'Cultura' },
  { id: 'deporte', nivel: 2, cargo: 'Ministro/a del Deporte', corto: 'Deporte' },
  { id: 'ciencia', nivel: 2, cargo: 'Ministro/a de Ciencia', corto: 'Ciencia' },
  { id: 'dapre', nivel: 3, cargo: 'Director/a del DAPRE', corto: 'DAPRE' },
  { id: 'dnp', nivel: 3, cargo: 'Director/a del DNP', corto: 'DNP' },
  { id: 'dane', nivel: 3, cargo: 'Director/a del DANE', corto: 'DANE' },
  { id: 'dps', nivel: 3, cargo: 'Director/a de Prosperidad Social', corto: 'Prosperidad Social' },
]

export const TOTAL_SILLAS = SILLAS.length
