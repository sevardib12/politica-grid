import { BarChart3 } from 'lucide-react'

/** Barra superior: el logo y «Urna» llevan siempre al menú principal; «Estadísticas» está a mano en cualquier pantalla. */
export function Navbar({ onOpenStats }: { onOpenStats: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-2.5">
        <a
          href="#/"
          className="flex shrink-0 items-center gap-2 rounded-lg text-base font-black tracking-tight text-slate-50"
          aria-label="Urna: menú principal"
        >
          <img src={`${import.meta.env.BASE_URL}urna-logo.png`} alt="" className="size-8" />
          <span>Urna</span>
        </a>

        <button
          type="button"
          onClick={onOpenStats}
          aria-label="Estadísticas"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan hover:text-cyan"
        >
          <BarChart3 size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Estadísticas</span>
        </button>
      </div>
    </header>
  )
}
