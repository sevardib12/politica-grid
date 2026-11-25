import { BarChart3 } from 'lucide-react'
import { Franja } from './ui.tsx'

/** Barra superior: el logo y «Urna» llevan siempre al menú principal; «Estadísticas» está a mano en cualquier pantalla. */
export function Navbar({ onOpenStats }: { onOpenStats: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1b2647] bg-ink/90 backdrop-blur">
      <Franja className="h-1" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <a href="#/" className="flex shrink-0 items-center gap-2.5 rounded-lg text-slate-50" aria-label="Urna: menú principal">
          <img src={`${import.meta.env.BASE_URL}urna-logo.png`} alt="" className="size-8 sm:size-9" />
          <span className="font-display text-[1.7rem] tracking-[0.06em]">Urna</span>
        </a>

        <button type="button" onClick={onOpenStats} aria-label="Estadísticas" className="btn-secondary w-11 px-0 sm:w-auto sm:px-4">
          <BarChart3 size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Estadísticas</span>
        </button>
      </div>
    </header>
  )
}
