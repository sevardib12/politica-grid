import type { Criterion } from '../utils/criteria.ts'
import { PartyLogo } from './PartyLogo.tsx'

/**
 * Encabezado de fila o columna del tarjetón, impreso en tinta: categoría + nombre del criterio. Si el criterio
 * es un partido, se muestra además su logo. Las columnas llevan un filete abajo; las filas, a la derecha.
 */
export function CriterionHeader({ criterion, eje }: { criterion: Criterion; eje: 'fila' | 'columna' }) {
  const columna = eje === 'columna'
  return (
    <div
      className={`flex min-w-0 flex-col gap-1 border-tinta sm:gap-1.5 ${
        columna ? 'items-center justify-end border-b-2 px-0.5 pb-2 text-center sm:px-1 sm:pb-2.5' : 'items-start justify-center border-r-2 pr-1.5 text-left sm:pr-2.5'
      }`}
    >
      {criterion.partido && <PartyLogo partyName={criterion.partido} size="md" decorative />}
      <span className="max-w-full text-balance text-[8px] font-extrabold uppercase leading-tight tracking-[0.08em] text-tinta-azul sm:text-[10px] sm:tracking-[0.14em]">
        {criterion.tag}
      </span>
      <span className="text-balance break-words text-[11px] font-extrabold leading-tight text-tinta sm:text-[15px]">{criterion.label}</span>
    </div>
  )
}
