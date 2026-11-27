import { build, d } from '../builder.ts'

// Personas del Movimiento 19 de Abril (Alianza Democrática M-19, «AD M-19») que faltaban en la base: senadores
// y representantes elegidos en 1991 y 1994, y constituyentes de 1991. Salen de las tablas de Wikipedia
// («Elecciones legislativas de Colombia de 1991» y «Elecciones legislativas de Colombia de 1994») y de la lista
// de constituyentes del artículo de Semana «Los constituyentes de 1991» (Plural, 2011).
//
// Criterios:
//   · Solo entran personas con nombre completo en esas fuentes. Donde la fuente da un apellido parcial o no
//     permite identificar a la persona, se omite: ante la duda, se omite. Quedan fuera por eso: Fabio de J.
//     Villa, Otty Patiño, Óscar Hoyos, Germán Toro, Abel Rodríguez, Germán Rojas, Marcos Chalita y Francisco
//     Maturana (elegido pero no asumió); y Augusto Ramírez, que aparece también en otra lista.
//   · Homonimias: no se crean fichas nuevas para Carlos Albornoz Guerrero (ya existe Carlos Salvador Albornoz
//     Guerrero) ni para Samuel Gustavo Moreno Rojas (ya existe Samuel Moreno Rojas). Álvaro Leyva Durán ya
//     estaba como «Álvaro Leyva»: su paso por la AD M-19 y la Constituyente va en `correcciones.ts`.
//   · Género y región no constan en esas fuentes: 'Sin dato'. No se infiere el género por el nombre.
//   · perfil_regional: solo cuentan como respuesta correcta; no generan ni calibran tableros.

function ficha(id: string, nombre: string, extra: Partial<Parameters<typeof build>[0]> = {}) {
  return build({
    id,
    nombre,
    genero: 'Sin dato',
    region: 'Sin dato',
    partidos: ['AD M-19'],
    decadas: d('1990s'),
    perfil_regional: true,
    ...extra,
  })
}

const CONSTITUYENTE = { hitos: ['Constituyente de 1991' as const] }

export const m19 = [
  // Senado, 1991–1994 (la tabla de Wikipedia da el nombre y la lista es de senadores electos por circunscripción nacional).
  ficha('grabe-loewenherz-vera', 'Vera Grabe Loewenherz', { congreso: { senador: true } }),
  ficha('bonnet-locarno-pedro-antonio', 'Pedro Antonio Bonnet Locarno', { congreso: { senador: true } }),
  ficha('gutierrez-zuluaga-bernardo', 'Bernardo Gutiérrez Zuluaga', { congreso: { senador: true } }),
  ficha('laserna-pinzon-mario-alberto', 'Mario Alberto Laserna Pinzón', { congreso: { senador: true } }),
  ficha('chavez-lopez-eduardo', 'Eduardo Chávez López', { congreso: { senador: true } }),
  ficha('palacio-tamayo-anibal', 'Aníbal Palacio Tamayo', { congreso: { senador: true } }),

  // Cámara de Representantes, 1991 (la tabla da la circunscripción; la página no lista los 13 representantes, solo 6).
  ficha('quiceno-acevedo-gloria-elena', 'Gloria Elena Quiceno Acevedo', {
    congreso: { representante_camara: true, departamentos_camara: ['Antioquia'] },
  }),
  ficha('espinosa-castilla-manuel-antonio', 'Manuel Antonio Espinosa Castilla', {
    congreso: { representante_camara: true, departamentos_camara: ['Atlántico'] },
  }),
  ficha('lucio-escobar-ramiro-alberto', 'Ramiro Alberto Lucio Escobar', {
    congreso: { representante_camara: true, departamentos_camara: ['Bogotá'] },
  }),
  ficha('artunduaga-rodriguez-jesus', 'Jesús Artunduaga Rodríguez', {
    congreso: { representante_camara: true, departamentos_camara: ['Bogotá'] },
  }),
  ficha('rincon-lopez-luis-fernando', 'Luis Fernando Rincón López', {
    congreso: { representante_camara: true, departamentos_camara: ['Cesar'] },
  }),

  // Cámara de Representantes, 1994–1998 (la página solo nombra a una persona de la AD M-19).
  ficha('suarez-caballero-yaneth', 'Yaneth Suárez Caballero', {
    congreso: { representante_camara: true, departamentos_camara: ['Atlántico'] },
  }),

  // Constituyentes de 1991, según la lista de Semana (los nombres completos que el artículo o una cita confirman).
  ficha('ossa-escobar-carlos', 'Carlos Ossa Escobar', CONSTITUYENTE),
  ficha('velasco-guerrero-jose-maria', 'José María Velasco Guerrero', CONSTITUYENTE),
  ficha('carranza-maria-mercedes', 'María Mercedes Carranza', CONSTITUYENTE),
  ficha('garces-lloreda-maria-teresa', 'María Teresa Garcés Lloreda', CONSTITUYENTE),
  ficha('pineda-salazar-hector', 'Héctor Pineda Salazar', CONSTITUYENTE),
  ficha('fals-borda-orlando', 'Orlando Fals Borda', CONSTITUYENTE),
  ficha('echeverry-uruburu-alvaro', 'Álvaro Echeverry Uruburu', CONSTITUYENTE),
]
