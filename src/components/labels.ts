import type { Mode, TimerSeconds } from '../game/engine.ts'
import type { Difficulty } from '../utils/gridGenerator.ts'

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
  legend: 'Leyenda',
}

export const DIFFICULTY_HINT: Record<Difficulty, string> = {
  easy: '7+ respuestas por casilla',
  normal: '4 a 8 respuestas',
  hard: 'Casillas de 2 o 3 respuestas',
  legend: '1 o 2 respuestas',
}

export const MODE_LABEL: Record<Mode, string> = {
  libre: 'Búsqueda libre',
}

export const TIMER_LABEL: Record<TimerSeconds, string> = {
  0: 'Sin tiempo',
  90: '90 s',
  60: '60 s',
  40: '40 s',
}
