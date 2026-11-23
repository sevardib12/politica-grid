import { useMemo, useState } from 'react'
import { dateKey } from '../game/stats.ts'
import type { ConfigGabinete } from '../gabinete/engine.ts'
import { poolCompleto } from '../gabinete/pool.ts'
import { navigate } from '../routing/route.ts'
import type { GabineteSettings } from '../routing/settings.ts'
import { useStats } from '../stats/useStats.ts'
import { GabineteGame } from './GabineteGame.tsx'

interface Run {
  config: ConfigGabinete
  id: number
}

const newRun = (config: ConfigGabinete): Run => ({ config, id: Date.now() })

/** Arma el Gabinete: arranca la partida con la configuración de la ruta (el menú elige; una URL directa usa la de por defecto). */
export function GabineteApp({ daily, settings }: { daily: boolean; settings: GabineteSettings }) {
  const pool = useMemo(() => poolCompleto(), [])
  const { recordGabinete } = useStats()
  const [run, setRun] = useState<Run>(() =>
    newRun(
      daily
        ? { daily: true, dateKey: dateKey(), temporizador: 'cronometro', dificultad: 'normal' }
        : { daily: false, dateKey: null, temporizador: settings.temporizador, dificultad: settings.dificultad },
    ),
  )

  return (
    <GabineteGame
      key={run.id}
      config={run.config}
      pool={pool}
      onFinish={recordGabinete}
      onExit={() => navigate({ page: 'menu' })}
      onPlayAgain={() => setRun(newRun({ ...run.config }))}
    />
  )
}
