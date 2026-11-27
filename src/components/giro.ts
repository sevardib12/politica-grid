import { useEffect, useState } from 'react'
import type { Partido } from '../data/types.ts'

/** Lo que dura cada giro de la ruleta, en milisegundos. Mientras gira, el partido que sale no se muestra. */
export const DURACION_GIRO_MS = 2000

/**
 * Cuándo se revela el partido. Cada vez que cambia `giro` (sale un partido nuevo, o se vuelve a sortear) la
 * ruleta gira y `girando` queda en true durante DURACION_GIRO_MS; el partido no se muestra hasta que para.
 */
export function useGiro(partido: Partido | null, giro: number): { girando: boolean; mostrado: Partido | null } {
  const [visto, setVisto] = useState<{ giro: number; girando: boolean; mostrado: Partido | null }>({
    giro,
    girando: true,
    mostrado: null,
  })
  let actual = visto
  if (visto.giro !== giro) {
    // Un giro nuevo empieza al cambiar la clave, sin esperar a un efecto.
    actual = { giro, girando: true, mostrado: null }
    setVisto(actual)
  }
  const girando = actual.girando

  useEffect(() => {
    if (!girando) return
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => setVisto({ giro, girando: false, mostrado: partido }), reducir ? 0 : DURACION_GIRO_MS)
    return () => window.clearTimeout(id)
  }, [giro, partido, girando])

  return actual
}
