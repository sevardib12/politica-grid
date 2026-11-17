import { useCallback, useRef, useState } from 'react'
import { dateKey } from '../game/stats.ts'
import { dailyChallengeId, randomChallengeId } from '../top10/daily.ts'
import type { Top10Config, Top10State } from '../top10/engine.ts'
import { loadTop10Stats, recordTop10Game, type Top10Stats } from '../top10/stats.ts'
import { Top10Game } from './Top10Game.tsx'
import { Top10Home, type Top10Settings } from './Top10Home.tsx'

type Screen = { name: 'home' } | { name: 'game'; config: Top10Config; id: number }

/** Política Top 10: pantalla de inicio y partida. */
export function Top10App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [settings, setSettings] = useState<Top10Settings>({ category: 'aleatoria', mode: 'normal' })
  const [stats, setStats] = useState<Top10Stats>(() => loadTop10Stats())
  const statsRef = useRef(stats)

  const start = useCallback((config: Top10Config) => {
    setScreen({ name: 'game', config, id: Date.now() })
  }, [])

  const playDaily = () => {
    const key = dateKey()
    start({ challengeId: dailyChallengeId(key), mode: 'normal', daily: true, dateKey: key })
  }

  const playFree = (avoid?: string) =>
    start({ challengeId: randomChallengeId(settings.category, avoid), mode: settings.mode, daily: false, dateKey: null })

  const handleFinish = useCallback((state: Top10State) => {
    const next = recordTop10Game(statsRef.current, state)
    statsRef.current = next
    setStats(next)
  }, [])

  if (screen.name === 'home') {
    return <Top10Home settings={settings} onSettings={setSettings} stats={stats} onPlay={() => playFree()} onPlayDaily={playDaily} />
  }

  const { config } = screen
  return (
    <Top10Game
      key={screen.id}
      config={config}
      onFinish={handleFinish}
      onExit={() => setScreen({ name: 'home' })}
      onPlayAgain={() => (config.daily ? start(config) : playFree(config.challengeId))}
    />
  )
}
