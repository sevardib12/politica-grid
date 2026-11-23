import type { Mode, TimerSeconds } from '../game/engine.ts'
import type { Dificultad, Temporizador } from '../gabinete/engine.ts'
import type { CategoryChoice } from '../top10/daily.ts'
import type { Top10Mode, Top10Players } from '../top10/engine.ts'
import type { Difficulty } from '../utils/gridGenerator.ts'

// Ajustes de «Partida libre» de cada juego: lo que el jugador elige en el menú principal y viaja en la
// ruta (#/grid?tiempo=60…) hasta el tablero. El reto diario usa solo la parte que le aplica.

export interface GridSettings {
  mode: Mode
  timer: TimerSeconds
  difficulty: Difficulty
}

export interface Top10Settings {
  category: CategoryChoice
  mode: Top10Mode
  players: Top10Players
}

export interface GabineteSettings {
  temporizador: Temporizador
  dificultad: Dificultad
}

export interface AllSettings {
  grid: GridSettings
  top10: Top10Settings
  gabinete: GabineteSettings
}

/** Configuración válida de cada juego: la del menú al abrir la app y la de quien entra por una ruta sin parámetros. */
export const DEFAULT_SETTINGS: AllSettings = {
  grid: { mode: 'libre', timer: 0, difficulty: 'normal' },
  top10: { category: 'aleatoria', mode: 'normal', players: 1 },
  gabinete: { temporizador: 'cronometro', dificultad: 'normal' },
}
