import { Fragment } from 'react'
import type { GameState } from '../game/engine.ts'
import { boardCriteria } from '../utils/gridGenerator.ts'
import { CriterionHeader } from './CriterionHeader.tsx'
import { GridCell } from './GridCell.tsx'

export function Grid({
  state,
  onCellClick,
}: {
  state: GameState
  onCellClick: (cell: number) => void
}) {
  const { rows, cols } = boardCriteria(state.board)
  const playing = state.status === 'playing'

  return (
    <div
      className="grid grid-cols-[minmax(5rem,0.95fr)_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[minmax(7rem,0.9fr)_repeat(3,minmax(0,1fr))] sm:gap-2.5"
      role="group"
      aria-label="Tablero de 3 por 3"
    >
      <div aria-hidden="true" />
      {cols.map((c) => (
        <CriterionHeader key={c.id} criterion={c} />
      ))}
      {rows.map((row, r) => (
        <Fragment key={row.id}>
          <CriterionHeader criterion={row} />
          {[0, 1, 2].map((c) => {
            const cell = r * 3 + c
            const placed = state.cells[cell]
            const fb = state.feedback
            const flash = fb && 'cell' in fb && fb.cell === cell ? (fb.kind === 'ok' ? 'ok' : fb.kind === 'error' ? 'error' : null) : null
            const interactive = playing && placed === null
            return (
              <GridCell
                key={cell}
                board={state.board}
                cell={cell}
                politicianId={placed}
                interactive={interactive}
                revealed={!playing}
                flash={flash}
                selected={state.selectedCell === cell}
                onClick={() => onCellClick(cell)}
              />
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}
