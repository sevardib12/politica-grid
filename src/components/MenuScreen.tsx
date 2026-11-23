import { Landmark, LayoutGrid, ListOrdered } from 'lucide-react'
import { useState } from 'react'
import { POLITICIANS } from '../data/politicians.ts'
import { dateKey } from '../game/stats.ts'
import { navigate, type GameId } from '../routing/route.ts'
import type { AllSettings } from '../routing/settings.ts'
import { useStats } from '../stats/useStats.ts'
import { GabineteSetup } from './GabineteSetup.tsx'
import { GameCard } from './GameCard.tsx'
import { GridSetup } from './GridSetup.tsx'
import { Top10Setup } from './Top10Setup.tsx'

/**
 * Página principal (#/): los tres juegos en un acordeón. Solo una tarjeta está abierta a la vez; cada una
 * trae su reto diario y su partida libre, y al jugar navega a la ruta del juego con lo elegido.
 */
export function MenuScreen({
  settings,
  onSettings,
}: {
  settings: AllSettings
  onSettings: (s: AllSettings) => void
}) {
  const stats = useStats()
  const [open, setOpen] = useState<GameId | null>(null)
  const toggle = (id: GameId) => setOpen((current) => (current === id ? null : id))
  const hoy = dateKey()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:pt-10">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
          Bienvenido a <span className="text-gold">Urna</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-slate-300 sm:text-base">
          Elige un juego. Todos se juegan con la misma base de datos de {POLITICIANS.length.toLocaleString('es-CO')} políticos
          colombianos, de los años 80 a 2026.
        </p>
      </header>

      <div className="space-y-3">
        <GameCard
          icon={<LayoutGrid size={26} />}
          title={
            <>
              Política <span className="text-gold">Grid</span>
            </>
          }
          description="Completa la cuadrícula cruzando cargos, partidos y épocas."
          dailyDone={Boolean(stats.grid.daily[hoy])}
          open={open === 'grid'}
          onToggle={() => toggle('grid')}
        >
          <GridSetup
            settings={settings.grid}
            onSettings={(grid) => onSettings({ ...settings, grid })}
            stats={stats.grid}
            onPlay={() => navigate({ page: 'grid', daily: false, settings: settings.grid })}
            onPlayDaily={() => navigate({ page: 'grid', daily: true, settings: settings.grid })}
          />
        </GameCard>

        <GameCard
          icon={<ListOrdered size={26} />}
          title={
            <>
              Política <span className="text-gold">Top 10</span>
            </>
          }
          description="Adivina las respuestas de una lista de la política colombiana."
          dailyDone={Boolean(stats.top10.daily[hoy])}
          open={open === 'top10'}
          onToggle={() => toggle('top10')}
        >
          <Top10Setup
            settings={settings.top10}
            onSettings={(top10) => onSettings({ ...settings, top10 })}
            stats={stats.top10}
            onPlay={() => navigate({ page: 'top10', daily: false, settings: settings.top10 })}
            onPlayDaily={() => navigate({ page: 'top10', daily: true, settings: settings.top10 })}
          />
        </GameCard>

        <GameCard
          icon={<Landmark size={26} />}
          title={
            <>
              Arma el <span className="text-gold">Gabinete</span>
            </>
          }
          description="Gira la ruleta y llena las 11 sillas del gobierno."
          dailyDone={Boolean(stats.gabinete.diario[hoy])}
          open={open === 'gabinete'}
          onToggle={() => toggle('gabinete')}
        >
          <GabineteSetup
            settings={settings.gabinete}
            onSettings={(gabinete) => onSettings({ ...settings, gabinete })}
            stats={stats.gabinete}
            onPlay={() => navigate({ page: 'gabinete', daily: false, settings: settings.gabinete })}
            onPlayDaily={() => navigate({ page: 'gabinete', daily: true, settings: settings.gabinete })}
          />
        </GameCard>
      </div>
    </div>
  )
}
