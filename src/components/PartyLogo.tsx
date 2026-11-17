import { useState } from 'react'
import { PARTY_BY_ID, PARTY_BY_NAME, type PartyInfo } from '../data/parties.ts'
import { readableOn } from '../utils/color.ts'

export type PartyLogoSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Lado del logo (y relleno interno del recuadro claro). Los tamaños `md` y `lg`
 * se reducen en móvil para que los encabezados del tablero no crezcan de más.
 */
const BOX: Record<PartyLogoSize, string> = {
  xs: 'size-5 rounded-md p-[2px]',
  sm: 'size-7 rounded-lg p-[3px]',
  md: 'size-8 rounded-lg p-[3px] sm:size-10 sm:p-1',
  lg: 'size-12 rounded-xl p-1 sm:size-14 sm:p-1.5',
}

const BADGE_BOX: Record<PartyLogoSize, string> = {
  xs: 'size-5',
  sm: 'size-7',
  md: 'size-8 sm:size-10',
  lg: 'size-12 sm:size-14',
}

function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** Tamaño de letra de la sigla dentro del escudo (viewBox de 40 de ancho). */
function siglaFontSize(sigla: string): number {
  if (sigla.length <= 2) return 17
  if (sigla.length === 3) return 13.5
  return 10.5
}

/** Escudo con la sigla del partido y sus colores; sustituye al logo si no hay imagen. */
function ShieldBadge({ party, className }: { party: PartyInfo; className: string }) {
  const text = readableOn(party.color_primario, [party.color_secundario, '#FFFFFF', '#0B1120'])
  return (
    <svg viewBox="0 0 40 46" className={`shrink-0 drop-shadow-sm ${className}`} aria-hidden="true" focusable="false">
      <path
        d="M20 2 36.5 7.5V22c0 10.4-7.4 17.6-16.5 21.5C10.9 39.6 3.5 32.4 3.5 22V7.5Z"
        fill={party.color_primario}
        stroke={party.color_secundario}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontSize={siglaFontSize(party.sigla)}
        fontWeight="800"
        letterSpacing="-0.3"
        fill={text}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {party.sigla}
      </text>
    </svg>
  )
}

/**
 * Logo de un partido o movimiento.
 *
 * Con imagen descargada: va sobre un recuadro claro (`bg-white/95`) con
 * `object-contain`, para que emblemas oscuros se lean sobre el fondo oscuro del
 * juego. Sin imagen, o si falla la carga: escudo con la sigla y los colores del
 * partido.
 *
 * Recibe el partido por `partyName` (etiqueta de la base de datos, p. ej. "Partido
 * Liberal") o por `partyId` (slug, p. ej. `partido-liberal`). Si no existe, no pinta nada.
 * Con `decorative`, se oculta a lectores de pantalla (úsalo junto al nombre escrito).
 */
export function PartyLogo({
  partyName,
  partyId,
  size = 'sm',
  decorative = false,
  className = '',
}: {
  partyName?: string
  partyId?: string
  size?: PartyLogoSize
  decorative?: boolean
  className?: string
}) {
  const party = partyId ? PARTY_BY_ID.get(partyId) : partyName ? PARTY_BY_NAME.get(partyName) : undefined
  const src = party?.logo_url ? publicUrl(party.logo_url) : null
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (!party) return null

  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': party.nombre, title: party.nombre }

  if (src === null || failedSrc === src) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center ${BADGE_BOX[size]} ${className}`} {...a11y}>
        <ShieldBadge party={party} className="size-full" />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-white/95 ring-1 ring-black/10 ${BOX[size]} ${className}`}
      {...a11y}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailedSrc(src)}
        className="size-full object-contain"
      />
    </span>
  )
}

/** Lista de partidos con su logo y su nombre, p. ej. "Partidos en los que militó". */
export function PartyChips({
  partidos,
  size = 'xs',
  className = '',
}: {
  partidos: readonly string[]
  size?: PartyLogoSize
  className?: string
}) {
  if (partidos.length === 0) return null
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Partidos">
      {partidos.map((nombre) => (
        <li
          key={nombre}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/60 py-0.5 pl-0.5 pr-2.5 text-xs font-semibold text-slate-200"
        >
          <PartyLogo partyName={nombre} size={size} decorative className="rounded-full!" />
          {nombre}
        </li>
      ))}
    </ul>
  )
}
