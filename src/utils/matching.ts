/**
 * Emparejamiento bipartito (algoritmo de Kuhn con caminos de aumento).
 *
 * `candidates[i]` lista los políticos (por índice) que sirven para la casilla
 * `i`. Devuelve un arreglo `asignado[i] = político` con políticos DISTINTOS
 * para todas las casillas, o `null` si no existe tal asignación.
 */
export function findAssignment(candidates: readonly (readonly number[])[]): number[] | null {
  const cells = candidates.length
  const cellOfPolitician = new Map<number, number>()
  const assigned: number[] = new Array(cells).fill(-1)

  const augment = (cell: number, seen: Set<number>): boolean => {
    for (const pol of candidates[cell]) {
      if (seen.has(pol)) continue
      seen.add(pol)
      const holder = cellOfPolitician.get(pol)
      if (holder === undefined || augment(holder, seen)) {
        cellOfPolitician.set(pol, cell)
        assigned[cell] = pol
        return true
      }
    }
    return false
  }

  for (let cell = 0; cell < cells; cell++) {
    if (!augment(cell, new Set())) return null
  }
  return assigned
}

export function hasAssignment(candidates: readonly (readonly number[])[]): boolean {
  return findAssignment(candidates) !== null
}
