/** Enlaces hacia fuera del juego. Solo llevan el nombre de la persona o el texto del dato, nunca datos del jugador. */

const REPO_ISSUES = 'https://github.com/sevardib12/politica-grid/issues/new'

/**
 * Búsqueda en Wikipedia (es). Con `go` abre el artículo si el nombre coincide exactamente;
 * si no, muestra los resultados. Así no hace falta guardar un título por persona.
 */
export function wikipediaUrl(nombre: string): string {
  return `https://es.wikipedia.org/w/index.php?search=${encodeURIComponent(nombre)}&title=Especial%3ABuscar&go=Ir`
}

/** Abre un aviso prellenado en GitHub para corregir un dato. */
export function reportarUrl(titulo: string, detalle: string): string {
  const title = encodeURIComponent(`Dato a revisar: ${titulo}`)
  const body = encodeURIComponent(`${detalle}\n\nQué dato está mal y qué fuente lo confirma:\n`)
  return `${REPO_ISSUES}?title=${title}&body=${body}`
}
