import { useCallback, useEffect, useState } from 'react'
import { GridApp } from './components/GridApp.tsx'
import { Navbar, type GameId } from './components/Navbar.tsx'
import { Top10App } from './components/Top10App.tsx'

// Hub con dos juegos. La ruta vive en el hash (#/grid, #/top10): sirve para enlazar, recarga y el
// botón «atrás» sin necesitar servidor ni un router. Cambiar de juego desmonta el anterior.

function readGame(): GameId {
  return window.location.hash.startsWith('#/top10') ? 'top10' : 'grid'
}

const TITLE: Record<GameId, string> = { grid: 'Política Grid', top10: 'Política Top 10' }

export default function App() {
  const [game, setGame] = useState<GameId>(readGame)

  useEffect(() => {
    const onHash = () => setGame(readGame())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.title = TITLE[game]
    window.scrollTo({ top: 0 })
  }, [game])

  const change = useCallback((next: GameId) => {
    window.location.hash = `/${next}`
  }, [])

  return (
    <>
      <Navbar game={game} onChange={change} />
      {game === 'top10' ? <Top10App /> : <GridApp />}
    </>
  )
}
