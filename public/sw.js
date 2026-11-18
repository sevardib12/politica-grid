// Service worker de Política Grid: la red manda y, si no hay conexión, se usa lo guardado.
// Así cada visita trae la versión nueva, y el juego sigue abriendo sin internet.
const CACHE = 'politica-grid-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      try {
        const respuesta = await fetch(request)
        if (respuesta.ok) cache.put(request, respuesta.clone())
        return respuesta
      } catch (error) {
        const guardada = (await cache.match(request)) ?? (request.mode === 'navigate' ? await cache.match(self.registration.scope) : undefined)
        if (guardada) return guardada
        throw error
      }
    })(),
  )
})
