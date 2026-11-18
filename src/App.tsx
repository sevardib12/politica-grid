import { useCallback, useEffect, useState } from 'react'
import { GabineteApp } from './components/GabineteApp.tsx'
import { GridApp } from './components/GridApp.tsx'
import { Navbar, type GameId } from './components/Navbar.tsx'
import { Top10App } from './components/Top10App.tsx'

// Hub con tres juegos. La ruta vive en el hash (#/grid, #/top10, #/gabinete): sirve para enlazar,
// recarga y el botón «atrás» sin necesitar servidor ni un router. Cambiar de juego desmonta el anterior.

function readGame(): GameId {
  const h = window.location.hash
  if (h.startsWith('#/top10')) return 'top10'
  if (h.startsWith('#/gabinete')) return 'gabinete'
  return 'grid'
}

const TITLE: Record<GameId, string> = { grid: 'Política Grid', top10: 'Política Top 10', gabinete: 'Arma el Gabinete' }

export default function App() {
  const [game, setGame] = useState<GameId>(readGame)

  useEffect(() => {
    const onHash = () => setGame(readGame())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.title = `${TITLE[game]} · Urna`
    window.scrollTo({ top: 0 })
  }, [game])

  const change = useCallback((next: GameId) => {
    window.location.hash = `/${next}`
  }, [])

  return (
    <>
      <Navbar game={game} onChange={change} />
      {game === 'top10' ? <Top10App /> : game === 'gabinete' ? <GabineteApp /> : <GridApp />}
    </>
  )
}
