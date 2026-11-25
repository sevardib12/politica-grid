import { User } from 'lucide-react'
import type { Top10Item } from '../data/top10Lists.ts'
import { personFor } from '../top10/people.ts'
import { PartyLogo } from './PartyLogo.tsx'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { WikiLink } from './Enlaces.tsx'
import { Sello } from './ui.tsx'

export type RowState = 'hidden' | 'found' | 'revealed'

/** Marca de sitio cuando la fila no tiene partido en el catálogo (independiente, movimiento local…). */
function NoParty() {
  return (
    <span
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-tinta/5 text-tinta-2 ring-1 ring-tinta/15"
      title="Sin partido en el catálogo"
      aria-hidden="true"
    >
      <User size={14} />
    </span>
  )
}

/**
 * Una fila del boletín. Antes de acertar se ve: posición + logo del partido + pista + nombre tachado.
 * `found` = acertada por el jugador (lleva el sello); `revealed` = revelada al rendirse o terminar sin acertarla.
 */
export function Top10Row({ item, state, fresh, by }: { item: Top10Item; state: RowState; fresh: boolean; by?: number }) {
  const open = state !== 'hidden'

  return (
    <li
      className={`flex min-h-[68px] items-center gap-2.5 border-b border-papel-line py-2.5 last:border-b-0 sm:gap-3.5 ${
        state === 'revealed' ? 'bg-tinta-roja/[0.04]' : ''
      } ${fresh ? 'animate-pop' : ''}`}
      aria-label={
        open ? `${item.posicion}. ${item.nombre}. ${item.pista_visible}. ${item.dato_extra}` : `${item.posicion}. Por adivinar. Pista: ${item.pista_visible}`
      }
    >
      <span
        className={`font-display w-8 shrink-0 text-right text-[2.1rem] tabular-nums sm:w-10 sm:text-[2.4rem] ${
          state === 'revealed' ? 'text-tinta-roja' : 'text-tinta'
        }`}
        aria-hidden="true"
      >
        {item.posicion}
      </span>

      {item.partido ? <PartyLogo partyName={item.partido} size="sm" /> : <NoParty />}

      <div className="min-w-0 flex-1">
        <span className="inline-flex max-w-full rounded bg-tinta-azul/10 px-1.5 py-0.5 text-[11px] font-extrabold uppercase tabular-nums tracking-[0.04em] text-tinta-azul sm:text-xs">
          <span className="truncate">{item.pista_visible}</span>
        </span>
        {open ? (
          <div className="mt-1">
            <p className="text-[17px] font-extrabold leading-tight text-tinta">
              {item.nombre}
              {by !== undefined && (
                <span className="ml-2 rounded-md bg-tinta px-1.5 py-0.5 align-middle text-[10px] font-black text-gold">J{by + 1}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-tinta-2">{item.dato_extra}</p>
            {state === 'found' || state === 'revealed' ? <WikiLink nombre={item.nombre} className="mt-1 text-tinta-azul!" /> : null}
          </div>
        ) : (
          <div className="tachado mt-1.5 h-5 w-full max-w-[13rem] rounded-[3px] sm:h-6" aria-hidden="true" />
        )}
      </div>

      {open && (
        <div className="relative shrink-0">
          <PoliticianAvatar politician={personFor(item)} size={44} smallSize={36} />
          {state === 'found' && <Sello className="absolute -right-1.5 -top-1.5 size-5" />}
        </div>
      )}
    </li>
  )
}
