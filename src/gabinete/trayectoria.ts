import type { Politician } from '../data/types.ts'

/**
 * Un dato breve de la trayectoria de una persona, sacado de su ficha: cargos del Ejecutivo, Congreso
 * o territorio. Se usa en cada silla del organigrama. Sin cargos, dice en qué décadas estuvo activa.
 */
export function datoBreve(p: Politician): string {
  const e = p.ejecutivo
  const frases: string[] = []
  if (p.presidencial.presidente) frases.push('Presidente de la República')
  if (p.presidencial.vicepresidente) frases.push('Vicepresidente de la República')
  if (e.departamentos_administrativos?.length) frases.push(`Director/a de ${e.departamentos_administrativos.join(' y ')}`)
  if (e.ministerios.length) frases.push(`Ministro/a de ${e.ministerios.slice(0, 2).join(' y ')}`)
  if (p.congreso.senador) frases.push('Senador/a')
  else if (p.congreso.representante_camara) frases.push('Representante a la Cámara')
  if (p.territorial.gobernador.length) frases.push(`Gobernador/a de ${p.territorial.gobernador[0]}`)
  if (p.territorial.alcalde.length) frases.push(`Alcalde/sa de ${p.territorial.alcalde[0]}`)
  if (e.embajador) frases.push('Embajador/a')
  if (frases.length === 0 && p.territorial.concejal.length) frases.push(`Concejal/a de ${p.territorial.concejal[0]}`)
  if (frases.length === 0) return p.decadas_activo.length ? `Activo/a en los ${p.decadas_activo.join(', ')}` : 'Sin cargos registrados'
  const gobierno = e.gobiernos_gabinete.at(-1)
  const base = frases.slice(0, 2).join(' · ')
  return gobierno && e.ministerios.length ? `${base} (${gobierno})` : base
}
