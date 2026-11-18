import { ExternalLink, TriangleAlert } from 'lucide-react'
import { wikipediaUrl } from '../utils/enlaces.ts'

/** Enlace pequeño a la búsqueda de una persona en Wikipedia (abre en otra pestaña). */
export function WikiLink({ nombre, className = '' }: { nombre: string; className?: string }) {
  return (
    <a
      href={wikipediaUrl(nombre)}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center gap-1 text-[11px] font-semibold text-cyan underline-offset-2 hover:underline ${className}`}
    >
      Wikipedia <ExternalLink size={11} aria-hidden="true" />
    </a>
  )
}

/** Enlace para avisar de un dato que no cuadra (abre un aviso prellenado en GitHub). */
export function ReportLink({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline ${className}`}
    >
      <TriangleAlert size={13} aria-hidden="true" /> ¿Un dato no cuadra? Repórtalo
    </a>
  )
}
