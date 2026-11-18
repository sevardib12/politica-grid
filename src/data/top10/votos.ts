import type { Top10Challenge } from '../top10Types.ts'
import { lista } from './builder.ts'

// Listas por votación: Senado (congreso) y alcaldías de Bogotá.
//
// Qué NO está y por qué: no hay listas de la Cámara por departamento ni de concejales. Los votos por
// candidato de esas elecciones solo están completos en el sitio de la Registraduría (que no se puede
// consultar de forma automática) y las fuentes secundarias mezclan preconteo y escrutinio, así que
// no se pudo verificar un ranking completo de diez nombres. Ver README.

const WP = 'Wikipedia (es), consultada el 17 de noviembre de 2026'

export const VOTOS_CONGRESO: Top10Challenge[] = [
  lista({
    id: 'senado-2022',
    titulo: 'SENADO 2022 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Votos de preferencia en listas abiertas. Ordenados del más votado (1) al quinto.',
    categoria: 'congreso',
    fuente: 'Noticias RCN, «Estos fueron los candidatos más votados durante las elecciones legislativas 2022» (preconteo del 13 de marzo de 2022).',
    nota: 'Cifras del preconteo; el escrutinio puede variar levemente. La lista del Pacto Histórico fue cerrada, por eso no tiene votos individuales. Solo hay cinco filas verificadas: Top 5 y no Top 10.',
    items: [
      ['Miguel Uribe Turbay', ['Miguel Uribe', 'Uribe Turbay'], 'Centro Democrático', '223.167 votos', 'El senador más votado de 2022, por el Centro Democrático.'],
      ['María Fernanda Cabal', ['Cabal', 'Maria Fernanda Cabal'], 'Centro Democrático', '196.865 votos', 'Segunda más votada, también por el Centro Democrático.'],
      ['Jonathan Pulido', ['Pulido', 'Jonathan Ferney Pulido', 'Jonatan Pulido', 'Jota Pe Hernández', 'Jota Pe Hernandez'], 'Alianza Verde', '189.291 votos', 'Encabezó la lista de la coalición Centro Esperanza (Alianza Verde).'],
      ['Humberto de la Calle', ['De la Calle', 'Humberto de la Calle Lombana'], null, '187.307 votos', 'Por Centro Esperanza. Fue vicepresidente (1994–1996) y candidato presidencial liberal en 2018.'],
      ['Nadia Blel', ['Blel', 'Nadya Blel', 'Nadia Georgette Blel'], 'Partido Conservador', '165.754 votos', 'La senadora más votada del Partido Conservador en 2022.'],
    ],
  }),

  lista({
    id: 'senado-2018',
    titulo: 'SENADO 2018 - TOP 10 MÁS VOTADOS',
    subtitulo: 'Votos de preferencia. Ordenados del más votado (1) al décimo.',
    categoria: 'congreso',
    fuente: `${WP}: Elecciones legislativas de Colombia de 2018, tabla «Senadores electos» (escrutinio); primeros cinco puestos contrastados con Noticias RCN (preconteo).`,
    nota: 'Las cifras de Wikipedia son más altas que las del preconteo (p. ej., Uribe: 875.554 en el preconteo y 891.964 en el escrutinio); el orden es el mismo.',
    items: [
      ['Álvaro Uribe Vélez', ['Uribe', 'Álvaro Uribe', 'Alvaro Uribe'], 'Centro Democrático', '891.964 votos', 'Encabezó la lista del Centro Democrático. Había sido presidente de Colombia (2002–2010).'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], 'Alianza Verde', '549.734 votos', 'Segundo más votado. Fue dos veces alcalde de Bogotá y candidato presidencial en 2006 y 2010.'],
      ['Jorge Enrique Robledo', ['Robledo', 'Jorge Robledo'], 'Polo Democrático', '229.276 votos', 'Senador del Polo Democrático Alternativo.'],
      ['David Barguil', ['Barguil', 'David Alejandro Barguil', 'David Barguil Assis'], 'Partido Conservador', '146.095 votos', 'Senador del Partido Conservador.'],
      ['Arturo Char', ['Char', 'Arturo Char Chaljub'], 'Cambio Radical', '136.108 votos', 'Presidió el Senado en 2020–2021.'],
      ['Efraín Cepeda', ['Cepeda', 'Efraín José Cepeda', 'Efrain Cepeda'], 'Partido Conservador', '124.465 votos', 'Presidió el Senado en 2017–2018 y de nuevo en 2024–2025.'],
      ['Gustavo Bolívar', ['Bolívar', 'Gustavo Bolivar', 'Gustavo Bolívar Moreno'], 'Colombia Humana', '122.132 votos', 'Elegido por la Lista de la Decencia (Colombia Humana–UP).'],
      ['Lidio García Turbay', ['García Turbay', 'Lidio García', 'Lidio Garcia'], 'Partido Liberal', '121.781 votos', 'Presidió el Senado en 2019–2020 y en 2025–2026.'],
      ['Luis Eduardo Díaz Granados', ['Díaz Granados', 'Luis Eduardo Diaz Granados', 'Diaz Granados'], 'Cambio Radical', '117.938 votos', 'Senador de Cambio Radical.'],
      ['Roy Barreras', ['Barreras', 'Roy Leonardo Barreras', 'Roy Barreras Montealegre'], 'Partido de la U', '112.695 votos', 'Senador por el Partido de la U. Presidió el Senado en 2012–2013 y en 2022–2023.'],
    ],
  }),

  lista({
    id: 'senado-2014',
    titulo: 'SENADO 2014 - TOP 10 MÁS VOTADOS',
    subtitulo: 'Votación de cada senador electo. Ordenados del más votado (1) al décimo.',
    categoria: 'congreso',
    fuente: `${WP}: Elecciones legislativas de Colombia de 2014, tabla «Senadores electos».`,
    nota: 'La cifra de Álvaro Uribe es la de la lista cerrada del Centro Democrático que él encabezó (2.045.564 votos), no un voto de preferencia: no es comparable con las demás.',
    items: [
      ['Álvaro Uribe Vélez', ['Uribe', 'Álvaro Uribe', 'Alvaro Uribe'], 'Centro Democrático', '2.045.564 votos', 'Votación de la lista cerrada del Centro Democrático, que él encabezó en su debut como partido.'],
      ['Jorge Enrique Robledo', ['Robledo', 'Jorge Robledo'], 'Polo Democrático', '191.910 votos', 'Senador del Polo Democrático Alternativo.'],
      ['Musa Besaile', ['Besaile', 'Musa Abraham Besaile', 'Musa Besaile Fayad'], 'Partido de la U', '145.402 votos', 'Senador del Partido de la U por Córdoba.'],
      ['Bernardo Elías', ['Elías', 'Bernardo Miguel Elías', 'Bernardo Elias Vidal'], 'Partido de la U', '140.143 votos', 'Senador del Partido de la U.'],
      ['Horacio Serpa', ['Serpa', 'Horacio Serpa Uribe'], 'Partido Liberal', '129.974 votos', 'Fue candidato presidencial en 1998, 2002 y 2006.'],
      ['Arturo Char', ['Char', 'Arturo Char Chaljub'], 'Cambio Radical', '108.454 votos', 'Presidió el Senado en 2020–2021.'],
      ['José David Name', ['Name', 'José David Name Cardozo', 'Jose David Name'], 'Partido de la U', '103.215 votos', 'Presidió el Senado en 2014–2015.'],
      ['Roosvelt Rodríguez', ['Rodríguez', 'Roosvelt Rodríguez Rengifo', 'Roosevelt Rodriguez'], 'Partido de la U', '100.229 votos', 'Senador del Partido de la U.'],
      ['Nerthink Aguilar', ['Aguilar', 'Nerthink Mauricio Aguilar', 'Nerthink Aguilar Hurtado'], null, '100.159 votos', 'Senador por Opción Ciudadana.'],
      ['Efraín Cepeda', ['Cepeda', 'Efraín José Cepeda', 'Efrain Cepeda'], 'Partido Conservador', '98.588 votos', 'Presidió el Senado en 2017–2018 y de nuevo en 2024–2025.'],
    ],
  }),
]

export const VOTOS_ALCALDIAS: Top10Challenge[] = [
  lista({
    id: 'bogota-votos',
    titulo: 'ALCALDES DE BOGOTÁ - TOP 5 CON MAYOR VOTACIÓN HISTÓRICA',
    subtitulo: 'Votos con los que fueron elegidos; cada alcalde cuenta una vez, con su mejor elección.',
    categoria: 'alcaldias',
    fuente: 'El Tiempo, «Así han sido las contiendas por la Alcaldía de Bogotá en su historia» (cifras de cada elección).',
    nota: 'Las cifras varían levemente entre preconteo y escrutinio según la fuente (p. ej., Samuel Moreno: 915.769 o 920.013). El orden no cambia.',
    items: [
      ['Carlos Fernando Galán Pachón', ['Carlos Fernando Galán', 'Galán', 'Carlos Fernando Galan', 'Galan', 'Carlos Galán'], 'Nuevo Liberalismo', '1.497.596 votos · 2023', 'El 49,02 % de los votos; el alcalde más votado de la historia de Bogotá.'],
      ['Claudia López', ['López', 'Claudia Lopez', 'Claudia López Hernández'], 'Alianza Verde', '1.108.541 votos · 2019', 'El 35,21 % de los votos. Primera mujer elegida alcaldesa de Bogotá.'],
      ['Samuel Moreno', ['Moreno', 'Samuel Moreno Rojas'], 'Polo Democrático', '920.013 votos · 2007', 'El 43,94 % de los votos.'],
      ['Enrique Peñalosa', ['Peñalosa', 'Enrique Peñalosa Londoño', 'Penalosa'], null, '906.058 votos · 2015', 'El 33,18 % de los votos en 2015; en 1997 había ganado con 619.086 votos.'],
      ['Luis Eduardo Garzón', ['Lucho Garzón', 'Garzón', 'Luis Garzón', 'Lucho'], 'Polo Democrático', '797.466 votos · 2003', 'El 46,29 % de los votos, por el Polo Democrático Independiente.'],
    ],
  }),

  lista({
    id: 'bogota-porcentaje',
    titulo: 'ALCALDES DE BOGOTÁ - TOP 5 CON MAYOR PORCENTAJE DE VOTOS',
    subtitulo: 'Porcentaje con el que fueron elegidos; cada alcalde cuenta una vez, con su mejor elección.',
    categoria: 'alcaldias',
    fuente: 'El Tiempo, «Así han sido las contiendas por la Alcaldía de Bogotá en su historia» (cifras de cada elección).',
    items: [
      ['Juan Martín Caicedo Ferrer', ['Caicedo', 'Juan Martín Caicedo', 'Caicedo Ferrer', 'Juan Martin Caicedo'], 'Partido Liberal', '65 % · 1990', 'Ganó con 597.295 votos, la mayor proporción de la historia.'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], null, '64,51 % · 1994', 'Ganó con 492.389 votos en 1994 por el Movimiento Cívico y fue reelegido en 2000.'],
      ['Carlos Fernando Galán Pachón', ['Carlos Fernando Galán', 'Galán', 'Carlos Fernando Galan', 'Galan', 'Carlos Galán'], 'Nuevo Liberalismo', '49,02 % · 2023', 'Ganó con 1.497.596 votos en primera vuelta, la votación más alta de la historia.'],
      ['Enrique Peñalosa', ['Peñalosa', 'Enrique Peñalosa Londoño', 'Penalosa'], null, '48,82 % · 1997', 'Ganó con 619.086 votos en 1997; fue reelegido en 2015.'],
      ['Jaime Castro', ['Castro', 'Jaime Castro Castro'], 'Partido Liberal', '48,17 % · 1992', 'Ganó con 310.654 votos en 1992.'],
    ],
  }),
]
