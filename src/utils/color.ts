/** Luminancia relativa WCAG de un color `#RRGGBB`. */
function luminance(hex: string): number {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  const channel = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

/** Razón de contraste WCAG entre dos colores (1 a 21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** El primer candidato con contraste suficiente sobre `bg`; si ninguno llega, el de mayor contraste. */
export function readableOn(bg: string, candidates: readonly string[], min = 4.5): string {
  let best = candidates[0]
  let bestRatio = 0
  for (const c of candidates) {
    const r = contrast(bg, c)
    if (r >= min) return c
    if (r > bestRatio) {
      best = c
      bestRatio = r
    }
  }
  return best
}
