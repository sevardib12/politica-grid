import type { Criterion } from '../utils/criteria.ts'
import { PartyLogo } from './PartyLogo.tsx'

/**
 * Encabezado de fila o columna: etiqueta de categoría + nombre del criterio.
 * Si el criterio es un partido, se muestra además su logo.
 */
export function CriterionHeader({ criterion }: { criterion: Criterion }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-panel px-1.5 py-2 text-center sm:gap-1.5 sm:px-2.5 sm:py-3">
      {criterion.partido && <PartyLogo partyName={criterion.partido} size="md" decorative />}
      <span className="max-w-full text-balance rounded-full bg-cyan/10 px-1.5 py-0.5 text-[7.5px] font-extrabold uppercase leading-tight tracking-normal text-cyan sm:px-2 sm:text-[10px] sm:tracking-wider">
        {criterion.tag}
      </span>
      <span className="text-balance break-words text-[10.5px] font-bold leading-tight text-slate-50 sm:text-sm">
        {criterion.label}
      </span>
    </div>
  )
}
