import { Eye, Info, Plus } from 'lucide-react'
import { useState } from 'react'
import { POLITICIANS_BY_ID } from '../data/politicians.ts'
import { cellParties, explainCell, validForCell, type Board } from '../utils/gridGenerator.ts'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { Sello } from './ui.tsx'

export interface GridCellProps {
  board: Board
  cell: number
  politicianId: string | null
  /** La casilla se puede pulsar para jugar. */
  interactive: boolean
  /** Partida terminada: cualquier casilla abre el solucionario. */
  revealed: boolean
  flash: 'ok' | 'error' | null
  /** Búsqueda libre: casilla con el buscador abierto. */
  selected: boolean
  onClick: () => void
}

/** Respuestas válidas en toda la base (incluye fichas regionales, que no cuentan para la dificultad). */
const validCount = (board: Board, cell: number) => validForCell(board, Math.floor(cell / 3), cell % 3).length

export function GridCell({ board, cell, politicianId, interactive, revealed, flash, selected, onClick }: GridCellProps) {
  const [open, setOpen] = useState(false)
  const politician = politicianId ? (POLITICIANS_BY_ID.get(politicianId) ?? null) : null
  const col = cell % 3
  const align = col === 0 ? 'left-0' : col === 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'
  const base =
    'relative flex min-h-[5.75rem] min-w-0 flex-col items-center justify-center gap-1 rounded border-2 p-1.5 text-center transition sm:min-h-[8.75rem] sm:p-2'

  if (politician) {
    const why = explainCell(board, cell, politician)
    return (
      <div
        className={`group ${base} border-tinta bg-white ${flash === 'ok' ? 'animate-pop ring-2 ring-ok' : ''}`}
      >
        <button
          type="button"
          onClick={revealed ? onClick : () => setOpen((v) => !v)}
          aria-label={revealed ? `${politician.nombre}: ver respuestas de la casilla` : `${politician.nombre}: ver detalle`}
          className="flex w-full min-w-0 flex-col items-center gap-1 rounded-xl"
        >
          <PoliticianAvatar politician={politician} size={52} smallSize={36} partyBadges={cellParties(board, cell, politician)} />
          <span className="line-clamp-3 text-balance text-[10px] font-extrabold leading-tight text-tinta sm:text-[13px]">
            {politician.nombre}
          </span>
          {politician.alias && (
            <span className="hidden text-[11px] font-medium italic text-tinta-2 sm:block">“{politician.alias}”</span>
          )}
        </button>
        <Sello className="absolute -right-1.5 -top-1.5 size-5 sm:-right-2 sm:-top-2 sm:size-6" />
        <span
          className="absolute left-1 top-1 text-tinta-2 sm:left-1.5 sm:top-1.5"
          aria-hidden="true"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Info size={14} />
        </span>
        {open && (
          <div
            role="tooltip"
            className={`absolute top-full z-30 mt-1 w-56 rounded-xl border border-line bg-ink p-3 text-left text-xs shadow-2xl ${align}`}
            onMouseLeave={() => setOpen(false)}
          >
            <p className="mb-1 font-bold text-gold">¿Por qué cumple?</p>
            <ul className="space-y-1 text-slate-200">
              {[...why.row, ...why.col].map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-ok">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (revealed) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} border-dashed border-tinta-roja/60 bg-tinta-roja/5 text-tinta-roja hover:border-tinta-roja hover:bg-tinta-roja/10`}
      >
        <Eye size={18} aria-hidden="true" />
        <span className="text-[10px] font-bold leading-tight sm:text-xs">Ver respuestas</span>
        <span className="text-[10px] text-tinta-2">
          {validCount(board, cell)} {validCount(board, cell) === 1 ? 'válido' : 'válidos'}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-label={`Casilla vacía ${cell + 1}`}
      className={`${base} ${
        selected
          ? 'border-tinta-azul bg-tinta-azul/10 text-tinta-azul ring-[3px] ring-tinta-azul/25'
          : interactive
            ? 'border-dashed border-papel-dash text-tinta-2 hover:border-tinta hover:bg-tinta/5 hover:text-tinta'
            : 'border-dashed border-papel-line text-papel-dash'
      } ${flash === 'error' ? 'animate-shake border-bad! bg-bad/10!' : ''}`}
    >
      <Plus size={22} aria-hidden="true" />
    </button>
  )
}
