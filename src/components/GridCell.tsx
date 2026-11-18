import { Eye, Info, Plus } from 'lucide-react'
import { useState } from 'react'
import { POLITICIANS_BY_ID } from '../data/politicians.ts'
import { cellParties, explainCell, validForCell, type Board } from '../utils/gridGenerator.ts'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'

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
    'relative flex min-h-[5.75rem] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border p-1.5 text-center transition sm:min-h-[8.25rem] sm:p-2'

  if (politician) {
    const why = explainCell(board, cell, politician)
    return (
      <div
        className={`group ${base} border-ok/40 bg-gradient-to-b from-panel-2 to-panel ${flash === 'ok' ? 'animate-pop ring-2 ring-ok' : ''}`}
      >
        <button
          type="button"
          onClick={revealed ? onClick : () => setOpen((v) => !v)}
          aria-label={revealed ? `${politician.nombre}: ver respuestas de la casilla` : `${politician.nombre}: ver detalle`}
          className="flex w-full min-w-0 flex-col items-center gap-1 rounded-xl"
        >
          <PoliticianAvatar politician={politician} size={52} smallSize={36} partyBadges={cellParties(board, cell, politician)} />
          <span className="line-clamp-3 text-balance text-[10px] font-bold leading-tight text-slate-50 sm:text-[13px]">
            {politician.nombre}
          </span>
          {politician.alias && (
            <span className="hidden text-[11px] font-medium italic text-slate-400 sm:block">“{politician.alias}”</span>
          )}
        </button>
        <span
          className="absolute right-1 top-1 text-ok/80 sm:right-1.5 sm:top-1.5"
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
        className={`${base} border-dashed border-bad/40 bg-bad/5 text-bad/90 hover:border-bad hover:bg-bad/10`}
      >
        <Eye size={18} aria-hidden="true" />
        <span className="text-[10px] font-semibold leading-tight sm:text-xs">Ver respuestas</span>
        <span className="text-[10px] text-slate-400">
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
          ? 'border-cyan bg-cyan/10'
          : interactive
            ? 'border-dashed border-line bg-ink/40 text-slate-400 hover:border-gold hover:bg-gold/10 hover:text-gold'
            : 'border-dashed border-line/60 bg-ink/30 text-slate-600'
      } ${flash === 'error' ? 'animate-shake border-bad! bg-bad/10!' : ''}`}
    >
      <Plus size={22} aria-hidden="true" />
    </button>
  )
}
