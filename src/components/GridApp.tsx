import { useCallback, useRef, useState } from 'react'
import { GameScreen } from './GameScreen.tsx'
import { HomeScreen, type Settings } from './HomeScreen.tsx'
import { StatsModal } from './StatsModal.tsx'
import type { GameConfig, GameState } from '../game/engine.ts'
import { dailyConfig, loadStats, recordGame, resetStats, type Stats } from '../game/stats.ts'
import { randomSeed } from '../utils/rng.ts'

type Screen = { name: 'home' } | { name: 'game'; config: GameConfig; id: number }

export function GridApp() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [settings, setSettings] = useState<Settings>({ mode: 'ruleta', timer: 0, difficulty: 'normal' })
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const statsRef = useRef(stats)
  const [showStats, setShowStats] = useState(false)

  const start = useCallback((config: GameConfig) => {
    setScreen({ name: 'game', config, id: Date.now() })
  }, [])

  const playFree = () => start({ ...settings, seed: randomSeed(), daily: false })
  const playDaily = () => start(dailyConfig(settings))

  const handleFinish = useCallback((state: GameState) => {
    const next = recordGame(statsRef.current, state)
    statsRef.current = next
    setStats(next)
  }, [])

  const handleReset = () => {
    const fresh = resetStats()
    statsRef.current = fresh
    setStats(fresh)
  }

  return (
    <>
      {screen.name === 'home' ? (
        <HomeScreen
          settings={settings}
          onSettings={setSettings}
          stats={stats}
          onPlay={playFree}
          onPlayDaily={playDaily}
          onOpenStats={() => setShowStats(true)}
        />
      ) : (
        <GameScreen
          key={screen.id}
          config={screen.config}
          onFinish={handleFinish}
          onExit={() => setScreen({ name: 'home' })}
          onPlayAgain={() =>
            start(screen.config.daily ? screen.config : { ...screen.config, seed: randomSeed() })
          }
        />
      )}
      {showStats && <StatsModal stats={stats} onReset={handleReset} onClose={() => setShowStats(false)} />}
    </>
  )
}
