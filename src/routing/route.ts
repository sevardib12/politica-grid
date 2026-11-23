import { useEffect, useMemo, useState } from 'react'
import type { TimerSeconds } from '../game/engine.ts'
import type { Dificultad, Temporizador } from '../gabinete/engine.ts'
import type { CategoryChoice } from '../top10/daily.ts'
import type { Top10Mode } from '../top10/engine.ts'
import { DIFFICULTIES } from '../utils/gridGenerator.ts'
import { DEFAULT_SETTINGS, type GabineteSettings, type GridSettings, type Top10Settings } from './settings.ts'

// La ruta vive en el hash, sin servidor ni router:
//   #/                                              menú principal
//   #/grid?tiempo=60&dificultad=normal              Política Grid (partida libre)
//   #/grid?reto=diario&tiempo=60                    Política Grid (reto diario)
//   #/top10?categoria=congreso&modo=normal&jugadores=1
//   #/gabinete?temporizador=turno&dificultad=dificil
// Cada juego arranca la partida directamente con lo que diga la ruta. Un parámetro ausente o inválido
// se reemplaza por el valor por defecto, así que cualquier URL abre algo jugable.

export type GameId = 'grid' | 'top10' | 'gabinete'

export type Route =
  | { page: 'menu' }
  | { page: 'grid'; daily: boolean; settings: GridSettings }
  | { page: 'top10'; daily: boolean; settings: Top10Settings }
  | { page: 'gabinete'; daily: boolean; settings: GabineteSettings }

const TIMERS: readonly TimerSeconds[] = [0, 90, 60, 40]
const CATEGORIES: readonly CategoryChoice[] = ['aleatoria', 'cargos', 'congreso', 'alcaldias', 'presidenciales']
const TOP10_MODES: readonly Top10Mode[] = ['normal', 'contrarreloj']
const PLAYERS: readonly (1 | 2)[] = [1, 2]
const TEMPORIZADORES: readonly Temporizador[] = ['cronometro', 'turno', 'contrarreloj']
const DIFICULTADES: readonly Dificultad[] = ['normal', 'dificil']

/** El valor del parámetro si está en la lista (se compara como texto); si no, el de respaldo. */
function pick<T extends string | number>(params: URLSearchParams, name: string, valid: readonly T[], fallback: T): T {
  const raw = params.get(name)
  return valid.find((v) => String(v) === raw) ?? fallback
}

export function parseHash(hash: string): Route {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const [path, query = ''] = raw.split('?')
  const params = new URLSearchParams(query)
  const daily = params.get('reto') === 'diario'
  const d = DEFAULT_SETTINGS

  switch (path.replace(/^\/+|\/+$/g, '')) {
    case 'grid':
      return {
        page: 'grid',
        daily,
        settings: {
          mode: d.grid.mode,
          timer: pick(params, 'tiempo', TIMERS, d.grid.timer),
          difficulty: pick(params, 'dificultad', DIFFICULTIES, d.grid.difficulty),
        },
      }
    case 'top10':
      return {
        page: 'top10',
        daily,
        settings: {
          category: pick(params, 'categoria', CATEGORIES, d.top10.category),
          mode: pick(params, 'modo', TOP10_MODES, d.top10.mode),
          players: pick(params, 'jugadores', PLAYERS, d.top10.players),
        },
      }
    case 'gabinete':
      return {
        page: 'gabinete',
        daily,
        settings: {
          temporizador: pick(params, 'temporizador', TEMPORIZADORES, d.gabinete.temporizador),
          dificultad: pick(params, 'dificultad', DIFICULTADES, d.gabinete.dificultad),
        },
      }
    default:
      return { page: 'menu' }
  }
}

/** El hash de una ruta (con `#`). En el reto diario solo viajan los ajustes que le aplican. */
export function routeHash(route: Route): string {
  if (route.page === 'menu') return '#/'
  const p = new URLSearchParams()
  if (route.daily) p.set('reto', 'diario')
  if (route.page === 'grid') {
    p.set('tiempo', String(route.settings.timer))
    if (!route.daily) p.set('dificultad', route.settings.difficulty)
  } else if (route.page === 'top10') {
    if (!route.daily) {
      p.set('categoria', route.settings.category)
      p.set('modo', route.settings.mode)
      p.set('jugadores', String(route.settings.players))
    }
  } else if (!route.daily) {
    p.set('temporizador', route.settings.temporizador)
    p.set('dificultad', route.settings.dificultad)
  }
  const query = p.toString()
  return `#/${route.page}${query ? `?${query}` : ''}`
}

export function navigate(route: Route): void {
  window.location.hash = routeHash(route)
}

/** La ruta actual y su hash (sirve de `key` para reiniciar la partida cuando cambia la ruta). */
export function useRoute(): { route: Route; hash: string } {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const route = useMemo(() => parseHash(hash), [hash])
  return { route, hash }
}
