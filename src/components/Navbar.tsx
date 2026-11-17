import { LayoutGrid, ListOrdered, type LucideIcon } from 'lucide-react'

export type GameId = 'grid' | 'top10'

const GAMES: { id: GameId; label: string; short: string; Icon: LucideIcon }[] = [
  { id: 'grid', label: 'Política Grid', short: 'Grid', Icon: LayoutGrid },
  { id: 'top10', label: 'Política Top 10', short: 'Top 10', Icon: ListOrdered },
]

/** Barra superior del hub: alterna entre los dos juegos sin recargar la página. */
export function Navbar({ game, onChange }: { game: GameId; onChange: (g: GameId) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        <a
          href="#/grid"
          onClick={(e) => {
            e.preventDefault()
            onChange('grid')
          }}
          className="flex items-center gap-2 rounded-lg text-sm font-black tracking-tight text-slate-50"
          aria-label="Política: inicio"
        >
          <span className="inline-grid grid-cols-3 gap-0.5" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`size-1.5 rounded-[2px] ${i === 4 ? 'bg-gold' : 'bg-cyan/70'}`} />
            ))}
          </span>
          <span className="hidden sm:inline">
            Política <span className="text-gold">Juegos</span>
          </span>
        </a>

        <nav aria-label="Juegos" className="flex gap-1 rounded-2xl border border-line bg-panel p-1">
          {GAMES.map(({ id, label, short, Icon }) => {
            const active = id === game
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold transition ${
                  active ? 'bg-gold text-ink shadow' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
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
