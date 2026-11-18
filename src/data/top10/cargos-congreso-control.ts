import type { Top10Challenge } from '../top10Types.ts'
import { lista, ORDEN_RECIENTE } from './builder.ts'

// Presidencias del Congreso y órganos de control. Fuente: Wikipedia (en y es) a 17 de noviembre de 2026.

const WP = 'Wikipedia, consultada el 17 de noviembre de 2026'

export const CARGOS_CONGRESO_CONTROL: Top10Challenge[] = [
  lista({
    id: 'presidentes-senado',
    titulo: 'ÚLTIMOS 10 PRESIDENTES DEL SENADO DE LA REPÚBLICA',
    subtitulo: ORDEN_RECIENTE,
    categoria: 'cargos',
    fuente: `${WP}: List of presidents of the Senate of Colombia (en) y Anexo:Presidentes del Senado (es).`,
    nota: 'El periodo del Senado va del 20 de julio al 20 de julio. La elección de Roy Barreras fue anulada por el Consejo de Estado el 4 de mayo de 2023.',
    items: [
      ['Honorio Henríquez', ['Henríquez', 'Honorio Miguel Henríquez', 'Henriquez'], 'Centro Democrático', '2026–2027', 'Presidente del Senado desde el 20 de julio de 2026.'],
      ['Lidio García Turbay', ['García Turbay', 'Lidio García', 'Lidio Garcia'], 'Partido Liberal', '2025–2026', 'Ya había presidido el Senado en 2019–2020.'],
      ['Efraín Cepeda', ['Cepeda', 'Efraín José Cepeda Sarabia', 'Efrain Cepeda'], 'Partido Conservador', '2024–2025', 'Ya había presidido el Senado en 2017–2018.'],
      ['Iván Name', ['Name', 'Iván Name Vásquez', 'Ivan Name'], 'Alianza Verde', '2023–2024', 'Presidió el Senado del 20 de julio de 2023 al 20 de julio de 2024.'],
      ['Alexander López Maya', ['López Maya', 'Alexander López', 'Alexander Lopez'], 'Polo Democrático', '2023', 'Presidió el Senado solo del 6 de junio al 20 de julio de 2023, tras la anulación de la elección de Roy Barreras.'],
      ['Roy Barreras', ['Barreras', 'Roy Leonardo Barreras', 'Roy Barreras Montealegre'], null, '2022–2023', 'Presidió el Senado del 20 de julio de 2022 al 4 de mayo de 2023. Ya lo había presidido en 2012–2013.'],
      ['Juan Diego Gómez', ['Gómez Jiménez', 'Juan Diego Gómez Jiménez', 'Juan Diego Gomez'], 'Partido Conservador', '2021–2022', 'Presidió el Senado entre el 20 de julio de 2021 y el 20 de julio de 2022.'],
      ['Arturo Char', ['Char', 'Arturo Char Chaljub'], 'Cambio Radical', '2020–2021', 'Hermano del alcalde de Barranquilla Alejandro Char.'],
      ['Ernesto Macías', ['Macías', 'Ernesto Macías Tovar', 'Ernesto Macias'], 'Centro Democrático', '2018–2019', 'Le impuso la banda presidencial a Iván Duque el 7 de agosto de 2018.'],
      ['Mauricio Lizcano', ['Lizcano', 'Óscar Mauricio Lizcano', 'Mauricio Lizcano Arango'], 'Partido de la U', '2016–2017', 'Presidió el Senado entre el 20 de julio de 2016 y el 20 de julio de 2017.'],
    ],
  }),

  lista({
    id: 'presidentes-camara',
    titulo: 'ÚLTIMOS 10 PRESIDENTES DE LA CÁMARA DE REPRESENTANTES',
    subtitulo: ORDEN_RECIENTE,
    categoria: 'cargos',
    fuente: `${WP}: List of presidents of the Chamber of Representatives of Colombia (en).`,
    nota: 'El periodo de la Cámara va del 20 de julio al 20 de julio.',
    items: [
      ['Nicolás Barguil', ['Barguil', 'Nicolas Barguil'], 'Partido Conservador', '2026–2027', 'Presidente de la Cámara desde el 20 de julio de 2026.'],
      ['Julián David López', ['López', 'Julián López', 'Julián López Sánchez', 'Julian Lopez'], 'Partido de la U', '2025–2026', 'Presidió la Cámara entre el 20 de julio de 2025 y el 20 de julio de 2026.'],
      ['Jaime Salamanca', ['Salamanca', 'Jaime Raúl Salamanca'], 'Alianza Verde', '2024–2025', 'Presidió la Cámara entre el 20 de julio de 2024 y el 20 de julio de 2025.'],
      ['Andrés Calle', ['Calle', 'Andrés David Calle', 'Andres Calle'], 'Partido Liberal', '2023–2024', 'Presidió la Cámara entre el 20 de julio de 2023 y el 20 de julio de 2024.'],
      ['David Racero', ['Racero', 'David Ricardo Racero'], 'Colombia Humana', '2022–2023', 'Presidió la Cámara en el primer año del gobierno de Gustavo Petro.'],
      ['Jennifer Arias', ['Arias', 'Jennifer Kristin Arias'], 'Centro Democrático', '2021–2022', 'Presidió la Cámara entre el 20 de julio de 2021 y el 20 de julio de 2022.'],
      ['Germán Blanco', ['Blanco', 'Germán Blanco Álvarez', 'German Blanco'], 'Partido Conservador', '2020–2021', 'Presidió la Cámara entre el 20 de julio de 2020 y el 20 de julio de 2021.'],
      ['Carlos Cuenca', ['Cuenca', 'Carlos Cuenca Chaux'], 'Cambio Radical', '2019–2020', 'Presidió la Cámara entre el 20 de julio de 2019 y el 20 de julio de 2020.'],
      ['Alejandro Carlos Chacón', ['Chacón', 'Alejandro Chacón', 'Carlos Chacón', 'Alejandro Chacon'], 'Centro Democrático', '2018–2019', 'Presidió la Cámara en el primer año del gobierno de Iván Duque.'],
      ['Rodrigo Lara Restrepo', ['Lara Restrepo', 'Rodrigo Lara', 'Lara'], 'Cambio Radical', '2017–2018', 'En 2026 fue ministro del Interior de Abelardo de la Espriella entre agosto y octubre.'],
    ],
  }),

  lista({
    id: 'procuradores',
    titulo: 'ÚLTIMOS 5 PROCURADORES GENERALES DE LA NACIÓN',
    subtitulo: 'Del actual (1) al más antiguo.',
    categoria: 'cargos',
    fuente: 'Wikipedia (es): Procuraduría General de la Nación (Colombia), tabla «Procuradores».',
    items: [
      ['Gregorio Eljach', ['Eljach', 'Gregorio Eljach Pacheco'], null, '2025–2029', 'Procurador General para el periodo 2025–2029.'],
      ['Margarita Cabello', ['Cabello', 'Margarita Cabello Blanco'], null, '2021–2025', 'Primera mujer elegida Procuradora General de la Nación.'],
      ['Fernando Carrillo', ['Carrillo', 'Fernando Carrillo Flórez'], null, '2017–2021', 'Antes fue ministro del Interior de Santos (2012–2013).'],
      ['Alejandro Ordóñez', ['Ordóñez', 'Alejandro Ordóñez Maldonado', 'Ordonez'], null, '2009–2016', 'Fue reelegido para un segundo periodo. En 2026 es ministro del Interior.'],
      ['Edgardo Maya Villazón', ['Maya', 'Edgardo Maya', 'Edgardo Maya Villazon'], null, '2001–2009', 'Después fue Contralor General de la República (2014–2018).'],
    ],
  }),

  lista({
    id: 'contralores',
    titulo: 'ÚLTIMOS 5 CONTRALORES GENERALES DE LA REPÚBLICA',
    subtitulo: 'Del actual (1) al más antiguo. Cada persona cuenta una vez.',
    categoria: 'cargos',
    fuente: 'Wikipedia (es): Contraloría General de la República (Colombia); elección de 2026 contrastada con prensa.',
    items: [
      ['Jorge Eliécer Laverde', ['Laverde', 'Jorge Laverde', 'Jorge Eliécer Laverde Vargas'], null, '2026–2030', 'Elegido por el Congreso el 12 de agosto de 2026 con 269 votos.'],
      ['Carlos Hernán Rodríguez', ['Rodríguez', 'Carlos Rodríguez', 'Carlos Hernán Rodríguez Becerra'], null, '2022–2026', 'Ocupó el cargo en dos tramos (2022–2023 y 2024–2026); en medio figura Carlos Zuluaga Pardo (2023–2024).'],
      ['Carlos Felipe Córdoba', ['Córdoba', 'Felipe Córdoba', 'Carlos Felipe Córdoba Larrarte'], null, '2018–2022', 'Contralor General de la República entre 2018 y 2022.'],
      ['Edgardo Maya Villazón', ['Maya', 'Edgardo Maya', 'Edgardo Maya Villazon'], null, '2014–2018', 'Antes fue Procurador General de la Nación (2001–2009).'],
      ['Sandra Morelli', ['Morelli', 'Sandra Morelli Rico'], null, '2010–2014', 'Primera mujer Contralora General de la República.'],
    ],
  }),

  lista({
    id: 'fiscales',
    titulo: 'ÚLTIMOS 5 FISCALES GENERALES DE LA NACIÓN',
    subtitulo: 'Del actual (1) al más antiguo; no se cuentan fiscales encargados.',
    categoria: 'cargos',
    fuente: 'Wikipedia (es): Fiscalía General de la Nación (Colombia).',
    items: [
      ['Luz Adriana Camargo', ['Camargo', 'Luz Adriana Camargo Garzón'], null, '2024–hoy', 'Se posesionó el 22 de marzo de 2024.'],
      ['Francisco Barbosa', ['Barbosa', 'Francisco Barbosa Delgado'], null, '2020–2024', 'Fiscal General entre el 13 de febrero de 2020 y el 13 de febrero de 2024.'],
      ['Néstor Humberto Martínez', ['Martínez Neira', 'Néstor Humberto Martínez Neira', 'Nestor Humberto Martinez', 'Humberto Martínez'], null, '2016–2019', 'Renunció el 15 de mayo de 2019. Había sido ministro del Interior de Pastrana (1998–2000).'],
      ['Eduardo Montealegre', ['Montealegre', 'Luis Eduardo Montealegre', 'Luis Eduardo Montealegre Lynett'], null, '2012–2016', 'Fiscal General entre el 29 de marzo de 2012 y el 28 de marzo de 2016.'],
      ['Viviane Morales', ['Morales', 'Viviane Morales Hoyos'], null, '2011–2012', 'Primera mujer Fiscal General de la Nación; el Consejo de Estado anuló su elección. En 2026 fue brevemente ministra de Educación.'],
    ],
  }),
]
