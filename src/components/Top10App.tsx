import { useCallback, useState } from 'react'
import { dateKey } from '../game/stats.ts'
import { navigate } from '../routing/route.ts'
import type { Top10Settings } from '../routing/settings.ts'
import { useStats } from '../stats/useStats.ts'
import { dailyChallengeId, randomChallengeId } from '../top10/daily.ts'
import type { Top10Config, Top10State } from '../top10/engine.ts'
import { Top10Game } from './Top10Game.tsx'

interface Run {
  config: Top10Config
  id: number
}

const newRun = (config: Top10Config): Run => ({ config, id: Date.now() })

function dailyConfig(): Top10Config {
  const key = dateKey()
  return { challengeId: dailyChallengeId(key), mode: 'normal', daily: true, dateKey: key }
}

// El duelo no tiene contrarreloj: siempre es sin límite de tiempo.
function freeConfig(settings: Top10Settings, avoid?: string): Top10Config {
  return {
    challengeId: randomChallengeId(settings.category, avoid),
    mode: settings.players === 2 ? 'normal' : settings.mode,
    daily: false,
    dateKey: null,
    players: settings.players,
  }
}

/** Política Top 10: arranca la lista con la configuración de la ruta (el menú elige; una URL directa usa la de por defecto). */
export function Top10App({ daily, settings }: { daily: boolean; settings: Top10Settings }) {
  const { recordTop10 } = useStats()
  const [run, setRun] = useState<Run>(() => newRun(daily ? dailyConfig() : freeConfig(settings)))

  const handleFinish = useCallback(
    (state: Top10State) => {
      // Los duelos no cuentan en las estadísticas personales: son de dos personas.
      if (state.duel) return
      recordTop10(state)
    },
    [recordTop10],
  )

  const { config } = run
  return (
    <Top10Game
      key={run.id}
      config={config}
      onFinish={handleFinish}
      onExit={() => navigate({ page: 'menu' })}
      onPlayAgain={() => setRun(newRun(config.daily ? config : freeConfig(settings, config.challengeId)))}
    />
  )
}
