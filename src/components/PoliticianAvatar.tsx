import { useState, type CSSProperties } from 'react'
import { partyColor } from '../data/partyColors.ts'
import type { Politician } from '../data/types.ts'
import { initials } from '../utils/text.ts'
import { PartyLogo } from './PartyLogo.tsx'

/** Resuelve una ruta pública (`/politicians/x.jpg`) respetando la base de Vite. */
function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/**
 * Retrato circular del político con un borde del color de su partido.
 *
 * Usa la foto local (`foto_url`) con `object-cover object-top` para no cortar
 * la cabeza. Si no hay foto, o falla la carga, muestra las iniciales sobre el
 * color del partido principal.
 *
 * `smallSize` es el tamaño en pantallas pequeñas (< 640 px); si se omite se
 * usa `size` en todas.
 */
export function PoliticianAvatar({
  politician,
  size = 40,
  smallSize,
  priority = false,
  partyBadges,
}: {
  politician: Pick<Politician, 'nombre' | 'partidos' | 'foto_url'>
  size?: number
  smallSize?: number
  /** Carga inmediata (p. ej. la carta de la Ruleta) en vez de diferida. */
  priority?: boolean
  /** Logos pequeños de partido en la esquina inferior derecha (máximo 2). */
  partyBadges?: readonly string[]
}) {
  const src = politician.foto_url ? publicUrl(politician.foto_url) : null
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showPhoto = src !== null && failedSrc !== src

  const style = {
    '--av': `${size}px`,
    '--av-sm': `${smallSize ?? size}px`,
    '--party': partyColor(politician),
  } as CSSProperties

  const avatar = (
    <span aria-hidden="true" className={`pol-avatar ${showPhoto ? 'pol-avatar--photo' : ''}`} style={style}>
      {showPhoto ? (
        <img
          src={src}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onError={() => setFailedSrc(src)}
          className="size-full object-cover object-top"
        />
      ) : (
        initials(politician.nombre)
      )}
    </span>
  )

  const badges = (partyBadges ?? []).slice(0, 2)
  if (badges.length === 0) return avatar

  // El avatar recorta su contenido (overflow-hidden), por eso la insignia vive fuera de él.
  return (
    <span className="relative inline-flex shrink-0">
      {avatar}
      <span aria-hidden="true" className="absolute -bottom-1 -right-1.5 flex -space-x-1.5 sm:-right-2">
        {badges.map((nombre) => (
          <span key={nombre} className="rounded-md bg-panel p-px shadow-sm">
            <PartyLogo partyName={nombre} size="xs" decorative />
          </span>
        ))}
      </span>
    </span>
  )
}
