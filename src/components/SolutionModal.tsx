import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { POLITICIANS_BY_ID } from '../data/politicians.ts'
import { criterionOrThrow } from '../utils/criteria.ts'
import { reportarUrl } from '../utils/enlaces.ts'
import { validForCell, type Board } from '../utils/gridGenerator.ts'
import { ReportLink, WikiLink } from './Enlaces.tsx'
import { PartyChips, PartyLogo } from './PartyLogo.tsx'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { Chip, Modal } from './ui.tsx'

const TANDA = 40

/** Solucionario de una casilla: todos los políticos que cumplían el cruce. */
export function SolutionModal({
  board,
  cell,
  placedId,
  onClose,
}: {
  board: Board
  cell: number
  placedId: string | null
  onClose: () => void
}) {
  const row = criterionOrThrow(board.rows[Math.floor(cell / 3)])
  const col = criterionOrThrow(board.cols[cell % 3])
  const valid = useMemo(
    () =>
      // Primero los políticos de tablero; luego las fichas agregadas en bloque (regionales y congresistas).
      validForCell(board, Math.floor(cell / 3), cell % 3).sort(
        (a, b) => Number(!!a.perfil_regional) - Number(!!b.perfil_regional) || a.nombre.localeCompare(b.nombre, 'es'),
      ),
    [board, cell],
  )
  const placed = placedId ? POLITICIANS_BY_ID.get(placedId) : null
  // Con el Congreso completo un cruce puede tener cientos de respuestas: se muestran por tandas.
  const [limite, setLimite] = useState(TANDA)
  const visibles = useMemo(() => {
    const resto = valid.filter((p) => p.id !== placedId).slice(0, limite)
    const propia = valid.find((p) => p.id === placedId)
    return propia ? [propia, ...resto] : resto
  }, [valid, placedId, limite])
  const ocultos = valid.length - visibles.length

  return (
    <Modal
      wide
      onClose={onClose}
      title={
        <span className="block">
          Solucionario
          <span className="mt-1 block text-xs font-medium text-slate-400">
            {valid.length} {valid.length === 1 ? 'político cumple' : 'políticos cumplen'} este cruce
          </span>
        </span>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Chip tone="cyan">{row.tag}</Chip>
        {row.partido && <PartyLogo partyName={row.partido} size="sm" decorative />}
        <span className="font-semibold text-slate-100">{row.label}</span>
        <span className="font-bold text-gold">×</span>
        <Chip tone="cyan">{col.tag}</Chip>
        {col.partido && <PartyLogo partyName={col.partido} size="sm" decorative />}
        <span className="font-semibold text-slate-100">{col.label}</span>
      </div>

      {placed && (
        <p className="mb-3 flex items-center gap-2 rounded-xl bg-ok/10 px-3 py-2 text-sm text-ok">
          <Check size={16} aria-hidden="true" /> Tu respuesta: <strong>{placed.nombre}</strong>
        </p>
      )}

      <ul className="space-y-2">
        {visibles.map((p) => (
          <li
            key={p.id}
            className={`rounded-2xl border p-3 ${p.id === placedId ? 'border-ok/50 bg-ok/5' : 'border-line bg-ink/40'}`}
          >
            <div className="flex items-center gap-3">
              <PoliticianAvatar politician={p} size={48} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-50">
                  {p.nombre}
                  {p.alias && <span className="ml-1.5 font-medium italic text-slate-400">“{p.alias}”</span>}
                  <WikiLink nombre={p.nombre} className="ml-2 align-middle" />
                </p>
                {p.partidos.length > 0 ? (
                  <PartyChips partidos={p.partidos} size="xs" className="mt-1" />
                ) : (
                  <p className="text-xs text-slate-400">Sin partido registrado</p>
                )}
                {p.foto_fuente && (
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Foto:{' '}
                    {p.foto_origen ? (
                      <a
                        href={p.foto_origen}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline-offset-2 hover:text-slate-300 hover:underline"
                      >
                        {p.foto_fuente}
                      </a>
                    ) : (
                      p.foto_fuente
                    )}
                  </p>
                )}
              </div>
            </div>
            <ul className="mt-2 space-y-1 pl-1 text-xs text-slate-300">
              {[...row.explain(p), ...col.explain(p)].map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-ok">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {ocultos > 0 && (
        <button
          type="button"
          onClick={() => setLimite((l) => l + TANDA)}
          className="mt-3 w-full rounded-2xl border border-line bg-ink/40 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:bg-ink/70"
        >
          Mostrar {Math.min(TANDA, ocultos)} más ({ocultos} sin mostrar)
        </button>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <ReportLink
          href={reportarUrl(
            `Política Grid: casilla ${row.label} × ${col.label}`,
            `Solucionario de la casilla «${row.label} × ${col.label}» (${valid.length} políticos).`,
          )}
        />
      </div>
    </Modal>
  )
}
