import { Landmark, LayoutGrid, ListOrdered, type LucideIcon } from 'lucide-react'

export type GameId = 'grid' | 'top10' | 'gabinete'

const GAMES: { id: GameId; label: string; short: string; Icon: LucideIcon }[] = [
  { id: 'grid', label: 'Política Grid', short: 'Grid', Icon: LayoutGrid },
  { id: 'top10', label: 'Política Top 10', short: 'Top 10', Icon: ListOrdered },
  { id: 'gabinete', label: 'Arma el Gabinete', short: 'Gabinete', Icon: Landmark },
]

/** Barra superior del hub: alterna entre los dos juegos sin recargar la página. */
export function Navbar({ game, onChange }: { game: GameId; onChange: (g: GameId) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-2.5">
        <a
          href="#/grid"
          onClick={(e) => {
            e.preventDefault()
            onChange('grid')
          }}
          className="flex shrink-0 items-center gap-2 rounded-lg text-base font-black tracking-tight text-slate-50"
          aria-label="Urna: inicio"
        >
          <img src={`${import.meta.env.BASE_URL}urna-logo.png`} alt="" className="size-8 rounded-lg bg-white p-0.5" />
          <span>Urna</span>
        </a>

        <nav aria-label="Juegos" className="flex shrink-0 gap-1 rounded-2xl border border-line bg-panel p-1">
          {GAMES.map(({ id, label, short, Icon }) => {
            const active = id === game
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-1.5 text-sm font-bold transition sm:px-3 ${
                  active ? 'bg-gold text-ink shadow' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} aria-hidden="true" className="hidden sm:block" />
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
