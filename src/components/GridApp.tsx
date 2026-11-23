import { useState } from 'react'
import { GameScreen } from './GameScreen.tsx'
import type { GameConfig } from '../game/engine.ts'
import { dailyConfig } from '../game/stats.ts'
import { navigate } from '../routing/route.ts'
import type { GridSettings } from '../routing/settings.ts'
import { useStats } from '../stats/useStats.ts'
import { randomSeed } from '../utils/rng.ts'

interface Run {
  config: GameConfig
  id: number
}

const newRun = (config: GameConfig): Run => ({ config, id: Date.now() })

/** Política Grid: arranca la partida con la configuración de la ruta (el menú elige; una URL directa usa la de por defecto). */
export function GridApp({ daily, settings }: { daily: boolean; settings: GridSettings }) {
  const { recordGrid } = useStats()
  const [run, setRun] = useState<Run>(() =>
    newRun(daily ? dailyConfig(settings) : { ...settings, seed: randomSeed(), daily: false }),
  )

  return (
    <GameScreen
      key={run.id}
      config={run.config}
      onFinish={recordGrid}
      onExit={() => navigate({ page: 'menu' })}
      onPlayAgain={() => setRun(newRun(run.config.daily ? run.config : { ...run.config, seed: randomSeed() }))}
    />
  )
}
