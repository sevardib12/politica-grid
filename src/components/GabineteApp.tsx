import { useCallback, useMemo, useRef, useState } from 'react'
import { dateKey } from '../game/stats.ts'
import { buildPool } from '../gabinete/pool.ts'
import type { ConfigGabinete, Dificultad, EstadoGabinete, Temporizador } from '../gabinete/engine.ts'
import { cargarStats, guardarStats, registrarPartida, type StatsGabinete } from '../gabinete/stats.ts'
import { GabineteGame } from './GabineteGame.tsx'
import { GabineteHome, type AjustesGabinete } from './GabineteHome.tsx'

type Pantalla = { nombre: 'inicio' } | { nombre: 'partida'; config: ConfigGabinete; id: number }

/** «Arma el Gabinete»: pantalla de inicio y partida. */
export function GabineteApp() {
  const pool = useMemo(() => buildPool(), [])
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: 'inicio' })
  const [ajustes, setAjustes] = useState<AjustesGabinete>({ temporizador: 'cronometro', dificultad: 'normal' })
  const [stats, setStats] = useState<StatsGabinete>(() => cargarStats())
  const statsRef = useRef(stats)

  const iniciar = useCallback((config: ConfigGabinete) => {
    setPantalla({ nombre: 'partida', config, id: Date.now() })
  }, [])

  const jugarDiario = () => {
    const key = dateKey()
    iniciar({ daily: true, dateKey: key, temporizador: 'cronometro', dificultad: 'normal' })
  }

  const jugarLibre = () => {
    const temporizador: Temporizador = ajustes.temporizador
    const dificultad: Dificultad = ajustes.dificultad
    iniciar({ daily: false, dateKey: null, temporizador, dificultad })
  }

  const alTerminar = useCallback((estado: EstadoGabinete) => {
    const next = registrarPartida(statsRef.current, estado)
    statsRef.current = next
    guardarStats(next)
    setStats(next)
  }, [])

  if (pantalla.nombre === 'inicio') {
    return (
      <GabineteHome
        ajustes={ajustes}
        onAjustes={setAjustes}
        stats={stats}
        candidatos={pool.porId.size}
        partidos={pool.partidos.length}
        onPlay={jugarLibre}
        onPlayDaily={jugarDiario}
      />
    )
  }

  const { config } = pantalla
  return (
    <GabineteGame
      key={pantalla.id}
      config={config}
      pool={pool}
      onFinish={alTerminar}
      onExit={() => setPantalla({ nombre: 'inicio' })}
      onPlayAgain={() => (config.daily ? iniciar(config) : iniciar({ ...config }))}
    />
  )
}
