import { User } from 'lucide-react'
import type { Top10Item } from '../data/top10Lists.ts'
import { personFor } from '../top10/people.ts'
import { PartyLogo } from './PartyLogo.tsx'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { WikiLink } from './Enlaces.tsx'

export type RowState = 'hidden' | 'found' | 'revealed'

/** Marca de sitio cuando la fila no tiene partido en el catálogo (independiente, movimiento local…). */
function NoParty() {
  return (
    <span
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-500 ring-1 ring-white/10"
      title="Sin partido en el catálogo"
      aria-hidden="true"
    >
      <User size={14} />
    </span>
  )
}

/**
 * Una fila del reto. Antes de acertar se ve: posición + logo del partido + pista + barra oculta.
 * `found` = acertada por el jugador; `revealed` = revelada al rendirse o terminar sin acertarla.
 */
export function Top10Row({ item, state, fresh, by }: { item: Top10Item; state: RowState; fresh: boolean; by?: number }) {
  const open = state !== 'hidden'
  const tone =
    state === 'found'
      ? 'border-ok/50 bg-ok/10'
      : state === 'revealed'
        ? 'border-bad/40 bg-bad/5'
        : 'border-line bg-panel'

  return (
    <li
      className={`flex items-center gap-2.5 rounded-2xl border px-2.5 py-2.5 transition-colors sm:gap-3.5 sm:px-3.5 ${tone} ${fresh ? 'animate-pop' : ''}`}
      aria-label={
        open ? `${item.posicion}. ${item.nombre}. ${item.pista_visible}. ${item.dato_extra}` : `${item.posicion}. Por adivinar. Pista: ${item.pista_visible}`
      }
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-black tabular-nums sm:size-9 sm:text-base ${
          state === 'found' ? 'bg-ok text-ink' : state === 'revealed' ? 'bg-bad/80 text-ink' : 'bg-gold text-ink'
        }`}
        aria-hidden="true"
      >
        {item.posicion}
      </span>

      {item.partido ? <PartyLogo partyName={item.partido} size="sm" /> : <NoParty />}

      <div className="min-w-0 flex-1">
        <span className="inline-flex max-w-full rounded-full bg-cyan/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-cyan sm:text-xs">
          <span className="truncate">{item.pista_visible}</span>
        </span>
        {open ? (
          <div className="mt-1">
            <p className="text-sm font-extrabold leading-tight text-slate-50 sm:text-base">
              {item.nombre}
              {by !== undefined && (
                <span className="ml-2 rounded-md bg-ink/70 px-1.5 py-0.5 align-middle text-[10px] font-black text-gold">J{by + 1}</span>
              )}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-300 sm:text-xs">{item.dato_extra}</p>
            {state === 'found' || state === 'revealed' ? <WikiLink nombre={item.nombre} className="mt-1" /> : null}
          </div>
        ) : (
          <div className="mt-1.5 h-5 w-full max-w-[16rem] rounded-md bg-slate-700/50 sm:h-6" aria-hidden="true" />
        )}
      </div>

      {open && <PoliticianAvatar politician={personFor(item)} size={44} smallSize={36} />}
    </li>
  )
}
