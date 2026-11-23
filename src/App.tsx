import { useEffect, useState } from 'react'
import { GabineteApp } from './components/GabineteApp.tsx'
import { GridApp } from './components/GridApp.tsx'
import { MenuScreen } from './components/MenuScreen.tsx'
import { Navbar } from './components/Navbar.tsx'
import { StatsModal } from './components/StatsModal.tsx'
import { Top10App } from './components/Top10App.tsx'
import { useRoute, type GameId } from './routing/route.ts'
import { DEFAULT_SETTINGS, type AllSettings } from './routing/settings.ts'
import { StatsProvider } from './stats/StatsProvider.tsx'

// Urna: un menú principal (#/) con los tres juegos y, por cada juego, una ruta que arranca la partida con lo que
// diga su configuración (#/grid, #/top10, #/gabinete; ver routing/route.ts). La ruta vive en el hash: sirve para
// enlazar, recargar y el botón «atrás» sin servidor ni router. Cambiar de ruta desmonta la pantalla anterior.

const GAME_TITLE: Record<GameId, string> = { grid: 'Política Grid', top10: 'Política Top 10', gabinete: 'Arma el Gabinete' }

export default function App() {
  const { route, hash } = useRoute()
  // Los ajustes del menú viven aquí para no perderse al ir a un juego y volver.
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    document.title = route.page === 'menu' ? 'Urna' : `${GAME_TITLE[route.page]} · Urna`
    window.scrollTo({ top: 0 })
  }, [hash, route.page])

  return (
    <StatsProvider>
      <Navbar onOpenStats={() => setShowStats(true)} />
      {/* La clave es el hash: otra ruta (o el mismo juego con otros ajustes) empieza una partida nueva. */}
      {route.page === 'menu' && <MenuScreen settings={settings} onSettings={setSettings} />}
      {route.page === 'grid' && <GridApp key={hash} daily={route.daily} settings={route.settings} />}
      {route.page === 'top10' && <Top10App key={hash} daily={route.daily} settings={route.settings} />}
      {route.page === 'gabinete' && <GabineteApp key={hash} daily={route.daily} settings={route.settings} />}
      {showStats && <StatsModal initialGame={route.page === 'menu' ? 'grid' : route.page} onClose={() => setShowStats(false)} />}
    </StatsProvider>
  )
}
