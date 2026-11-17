import type { Top10Challenge } from '../top10Types.ts'
import { lista } from './builder.ts'

// Elecciones presidenciales. Votos de las páginas de Wikipedia de cada elección (escrutinio):
// 1994, 1998, 2002, 2006 y 2010 de la edición en inglés (RNEC / Nohlen); 2014, 2018, 2022 y 2026 de la
// edición en español. Se muestran los votos válidos por candidato, sin votos en blanco.

const ES = 'Wikipedia (es), consultada el 17 de noviembre de 2026'
const EN = 'Wikipedia (en), consultada el 17 de noviembre de 2026'

export const PRESIDENCIALES: Top10Challenge[] = [
  lista({
    id: 'derrotados-segunda-vuelta',
    titulo: 'ÚLTIMOS 5 CANDIDATOS DERROTADOS EN SEGUNDA VUELTA PRESIDENCIAL',
    subtitulo: 'Del más reciente (1, 2026) al más antiguo (5, 2010).',
    categoria: 'presidenciales',
    fuente: `${ES} y ${EN}: páginas de cada elección presidencial.`,
    nota: 'Desde que existe la segunda vuelta (1994) solo hubo siete: 1994, 1998, 2010, 2014, 2018, 2022 y 2026. Por eso es un Top 5 y no un Top 10.',
    items: [
      ['Iván Cepeda', ['Cepeda', 'Ivan Cepeda', 'Iván Cepeda Castro'], 'Pacto Histórico', '2026', 'Perdió la segunda vuelta con 12.708.312 votos (48,70 %), frente a Abelardo de la Espriella. Su fórmula fue Aida Quilcué.'],
      ['Rodolfo Hernández', ['Hernández', 'Rodolfo', 'Rodolfo Hernández Suárez'], 'Liga de Gobernantes Anticorrupción', '2022', 'Perdió con 10.580.412 votos (47,31 %), frente a Gustavo Petro.'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Colombia Humana', '2018', 'Perdió con 8.040.449 votos (41,77 %), frente a Iván Duque. Cuatro años después ganó la presidencia.'],
      ['Óscar Iván Zuluaga', ['Zuluaga', 'Oscar Ivan Zuluaga', 'Óscar Iván Zuluaga Escobar'], 'Centro Democrático', '2014', 'Ganó la primera vuelta, pero perdió la segunda con 6.917.001 votos (45,00 %), frente a Juan Manuel Santos.'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], 'Alianza Verde', '2010', 'Perdió con 3.587.975 votos (27,47 %), frente a Juan Manuel Santos. Su fórmula fue Sergio Fajardo.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2026',
    titulo: 'PRIMERA VUELTA 2026 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 31 de mayo de 2026.',
    categoria: 'presidenciales',
    fuente: `${ES}: Elecciones presidenciales de Colombia de 2026.`,
    items: [
      ['Abelardo de la Espriella', ['De la Espriella', 'Abelardo'], 'Defensores de la Patria', '10.361.499 votos', 'Ganó la segunda vuelta (12.960.166 votos, 49,66 %). Su fórmula fue José Manuel Restrepo.'],
      ['Iván Cepeda', ['Cepeda', 'Ivan Cepeda', 'Iván Cepeda Castro'], 'Pacto Histórico', '9.688.361 votos', 'Perdió la segunda vuelta (12.708.312 votos, 48,70 %). Su fórmula fue Aida Quilcué.'],
      ['Paloma Valencia', ['Valencia', 'Paloma Valencia Laserna'], 'Centro Democrático', '1.639.685 votos', 'Candidata del Centro Democrático; su fórmula fue Juan Daniel Oviedo.'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Dignidad y Compromiso', '1.009.073 votos', 'Candidato de Dignidad & Compromiso; su fórmula fue Edna Bonilla.'],
      ['Claudia López', ['López', 'Claudia Lopez', 'Claudia López Hernández'], null, '225.517 votos', 'Candidata con «Con Claudia, imparables» (fórmula: Leonardo Huerta). Había sido alcaldesa de Bogotá (2020–2023).'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2022',
    titulo: 'PRIMERA VUELTA 2022 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 29 de mayo de 2022.',
    categoria: 'presidenciales',
    fuente: `${ES}: Elecciones presidenciales de Colombia de 2022 (cuatro primeros) y ${EN}: 2022 Colombian presidential election (quinto).`,
    nota: 'La cifra del quinto puesto es de la edición en inglés (preconteo); las otras cuatro son del escrutinio de la edición en español.',
    items: [
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Colombia Humana', '8.527.768 votos', 'Candidato de Colombia Humana y el Pacto Histórico (fórmula: Francia Márquez). Ganó la segunda vuelta con 11.281.013 votos.'],
      ['Rodolfo Hernández', ['Hernández', 'Rodolfo', 'Rodolfo Hernández Suárez'], 'Liga de Gobernantes Anticorrupción', '5.953.209 votos', 'Candidato de la Liga de Gobernantes Anticorrupción. Perdió la segunda vuelta (10.580.412 votos).'],
      ['Federico Gutiérrez', ['Fico', 'Fico Gutiérrez', 'Federico Gutierrez', 'Gutiérrez'], 'Creemos', '5.058.010 votos', 'Candidato de la coalición Equipo por Colombia; quedó tercero. En 2024 volvió a ser alcalde de Medellín.'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Alianza Social Independiente', '888.585 votos', 'Candidato de la coalición Centro Esperanza (fórmula: Luis Gilberto Murillo).'],
      ['John Milton Rodríguez', ['Rodríguez', 'John Milton', 'John Milton Rodriguez'], 'Colombia Justa Libres', '271.386 votos', 'Pastor y político; candidato de Colombia Justa Libres.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2018',
    titulo: 'PRIMERA VUELTA 2018 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 27 de mayo de 2018.',
    categoria: 'presidenciales',
    fuente: `${ES}: Elecciones presidenciales de Colombia de 2018.`,
    items: [
      ['Iván Duque', ['Duque', 'Ivan Duque', 'Iván Duque Márquez'], 'Centro Democrático', '7.616.857 votos', 'Ganó la segunda vuelta con 10.398.689 votos (54,03 %).'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Colombia Humana', '4.855.069 votos', 'Perdió la segunda vuelta con 8.040.449 votos (41,77 %).'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Compromiso Ciudadano', '4.602.916 votos', 'Quedó tercero a menos de 253.000 votos de Petro y no pasó a segunda vuelta.'],
      ['Germán Vargas Lleras', ['Vargas Lleras', 'Vargas', 'German Vargas Lleras'], 'Cambio Radical', '1.412.392 votos', 'Había sido vicepresidente de Santos (2014–2017).'],
      ['Humberto de la Calle', ['De la Calle', 'Humberto de la Calle Lombana'], 'Partido Liberal', '396.151 votos', 'Fue jefe negociador del Gobierno en el acuerdo de paz con las FARC.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2014',
    titulo: 'PRIMERA VUELTA 2014 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 25 de mayo de 2014.',
    categoria: 'presidenciales',
    fuente: `${ES}: Elecciones presidenciales de Colombia de 2014 (escrutinio).`,
    items: [
      ['Óscar Iván Zuluaga', ['Zuluaga', 'Oscar Ivan Zuluaga', 'Óscar Iván Zuluaga Escobar'], 'Centro Democrático', '3.769.005 votos', 'Ganó la primera vuelta, pero perdió la segunda (6.917.001 votos, 45,00 %).'],
      ['Juan Manuel Santos', ['Santos', 'Juan Manuel Santos Calderón'], 'Partido de la U', '3.310.794 votos', 'Fue reelegido en la segunda vuelta con 7.839.342 votos (50,99 %).'],
      ['Marta Lucía Ramírez', ['Ramírez', 'Marta Lucía', 'Marta Lucia Ramirez'], 'Partido Conservador', '1.997.980 votos', 'Candidata del Partido Conservador. Fue vicepresidenta entre 2018 y 2022.'],
      ['Clara López', ['López', 'Clara Lopez', 'Clara López Obregón'], 'Polo Democrático', '1.958.518 votos', 'Candidata del Polo Democrático y la Unión Patriótica. Fue alcaldesa (e) de Bogotá en 2011.'],
      ['Enrique Peñalosa', ['Peñalosa', 'Enrique Peñalosa Londoño', 'Penalosa'], 'Alianza Verde', '1.064.758 votos', 'Candidato de la Alianza Verde. Fue alcalde de Bogotá en 1998–2000 y 2016–2019.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2010',
    titulo: 'PRIMERA VUELTA 2010 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 30 de mayo de 2010.',
    categoria: 'presidenciales',
    fuente: `${EN}: 2010 Colombian presidential election.`,
    items: [
      ['Juan Manuel Santos', ['Santos', 'Juan Manuel Santos Calderón'], 'Partido de la U', '6.802.043 votos', 'Ganó la segunda vuelta con 9.028.943 votos (69,13 %).'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], 'Alianza Verde', '3.134.222 votos', 'Candidato del Partido Verde; su fórmula fue Sergio Fajardo. Perdió la segunda vuelta.'],
      ['Germán Vargas Lleras', ['Vargas Lleras', 'Vargas', 'German Vargas Lleras'], 'Cambio Radical', '1.473.627 votos', 'Candidato de Cambio Radical. Fue vicepresidente de Santos entre 2014 y 2017.'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Polo Democrático', '1.331.267 votos', 'Candidato del Polo Democrático Alternativo. Fue presidente de Colombia entre 2022 y 2026.'],
      ['Noemí Sanín', ['Sanín', 'Noemi Sanin', 'Noemí Sanín Posada'], 'Partido Conservador', '893.819 votos', 'Candidata del Partido Conservador; en 1998 había sido tercera con 2.845.750 votos.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2006',
    titulo: 'PRIMERA VUELTA 2006 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 28 de mayo de 2006 (no hubo segunda vuelta).',
    categoria: 'presidenciales',
    fuente: `${EN}: 2006 Colombian presidential election.`,
    items: [
      ['Álvaro Uribe Vélez', ['Uribe', 'Álvaro Uribe', 'Alvaro Uribe'], 'Primero Colombia', '7.397.835 votos', 'Fue reelegido en primera vuelta con el 62,35 % de los votos; su fórmula fue Francisco Santos.'],
      ['Carlos Gaviria Díaz', ['Gaviria', 'Carlos Gaviria', 'Carlos Gaviria Diaz'], 'Polo Democrático', '2.613.157 votos', 'Candidato del Polo Democrático Alternativo; quedó segundo con el 22,03 %.'],
      ['Horacio Serpa', ['Serpa', 'Horacio Serpa Uribe'], 'Partido Liberal', '1.404.235 votos', 'Candidato liberal; también había sido candidato en 1998 y 2002.'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], 'Alianza Social Independiente', '146.583 votos', 'Candidato de la Alianza Social Independiente; en 2010 volvió a competir por el Partido Verde.'],
      ['Enrique Parejo González', ['Parejo', 'Enrique Parejo', 'Enrique Parejo Gonzalez'], null, '42.652 votos', 'Candidato de Reconstrucción Democrática Nacional.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-2002',
    titulo: 'PRIMERA VUELTA 2002 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 26 de mayo de 2002 (no hubo segunda vuelta).',
    categoria: 'presidenciales',
    fuente: `${EN}: 2002 Colombian presidential election.`,
    items: [
      ['Álvaro Uribe Vélez', ['Uribe', 'Álvaro Uribe', 'Alvaro Uribe'], 'Primero Colombia', '5.862.655 votos', 'Ganó en primera vuelta con el 53,05 % de los votos.'],
      ['Horacio Serpa', ['Serpa', 'Horacio Serpa Uribe'], 'Partido Liberal', '3.514.779 votos', 'Candidato liberal; había perdido la segunda vuelta de 1998.'],
      ['Luis Eduardo Garzón', ['Lucho Garzón', 'Garzón', 'Luis Garzón', 'Lucho'], 'Polo Democrático', '680.245 votos', 'Candidato del Polo Democrático Independiente. Fue alcalde de Bogotá (2004–2007).'],
      ['Noemí Sanín', ['Sanín', 'Noemi Sanin', 'Noemí Sanín Posada'], 'Sí Colombia', '641.884 votos', 'Candidata de Sí Colombia; en 1998 había obtenido 2.845.750 votos.'],
      ['Íngrid Betancourt', ['Betancourt', 'Ingrid Betancourt'], 'Verde Oxígeno', '53.922 votos', 'Candidata del Partido Verde Oxígeno; fue secuestrada por las FARC el 23 de febrero de 2002.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-1998',
    titulo: 'PRIMERA VUELTA 1998 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 31 de mayo de 1998.',
    categoria: 'presidenciales',
    fuente: `${EN}: 1998 Colombian presidential election.`,
    items: [
      ['Horacio Serpa', ['Serpa', 'Horacio Serpa Uribe'], 'Partido Liberal', '3.696.334 votos', 'Ganó la primera vuelta por 43.286 votos, pero perdió la segunda (5.658.518 votos, 46,58 %).'],
      ['Andrés Pastrana', ['Pastrana', 'Andrés Pastrana Arango'], 'Partido Conservador', '3.653.048 votos', 'Ganó la segunda vuelta con 6.114.752 votos (50,34 %).'],
      ['Noemí Sanín', ['Sanín', 'Noemi Sanin', 'Noemí Sanín Posada'], 'Sí Colombia', '2.845.750 votos', 'Candidata de Sí Colombia; tercera con el 26,77 %, la mayor votación de una mujer en una elección presidencial.'],
      ['Harold Bedoya', ['Bedoya', 'Harold Bedoya Pizarro'], null, '193.037 votos', 'General (r) y excomandante del Ejército; candidato de Fuerza Colombia.'],
      ['Beatriz Cuéllar', ['Cuéllar', 'Beatriz Cuellar'], null, '30.832 votos', 'Candidata del Movimiento Unión Cristiana.'],
    ],
  }),

  lista({
    id: 'primera-vuelta-1994',
    titulo: 'PRIMERA VUELTA 1994 - TOP 5 MÁS VOTADOS',
    subtitulo: 'Elecciones presidenciales del 29 de mayo de 1994: la primera con segunda vuelta.',
    categoria: 'presidenciales',
    fuente: `${EN}: 1994 Colombian presidential election.`,
    items: [
      ['Ernesto Samper', ['Samper', 'Ernesto Samper Pizano'], 'Partido Liberal', '2.623.210 votos', 'Ganó la segunda vuelta con 3.733.336 votos (50,57 %).'],
      ['Andrés Pastrana', ['Pastrana', 'Andrés Pastrana Arango'], 'Partido Conservador', '2.604.771 votos', 'Perdió la segunda vuelta por 156.555 votos; cuatro años después ganó la presidencia.'],
      ['Antonio Navarro Wolff', ['Navarro', 'Antonio Navarro', 'Navarro Wolff'], 'AD M-19', '219.241 votos', 'Excomandante del M-19 y copresidente de la Asamblea Constituyente de 1991.'],
      ['Regina Betancur', ['Regina', 'Regina 11', 'Regina Betancur de Liska'], null, '64.131 votos', 'Candidata del Movimiento Unitario Metapolítico, conocida como «Regina 11».'],
      ['Miguel Maza Márquez', ['Maza Márquez', 'Maza', 'Miguel Alfredo Maza Márquez', 'Miguel Maza Marquez'], null, '55.190 votos', 'General (r) y exdirector del DAS; candidato de Convergencia Popular Cívica.'],
    ],
  }),

  lista({
    id: 'mujeres-presidenciales',
    titulo: 'MUJERES CON MAYOR VOTACIÓN EN ELECCIONES PRESIDENCIALES - TOP 5',
    subtitulo: 'Primera vuelta; cada candidata cuenta una vez, con su mejor resultado.',
    categoria: 'presidenciales',
    fuente: `${EN} y ${ES}: páginas de cada elección presidencial (1994 a 2026).`,
    nota: 'Noemí Sanín compitió dos veces (1998 y 2010); cuenta con su mejor resultado. Ninguna mujer ha ganado la presidencia.',
    items: [
      ['Noemí Sanín', ['Sanín', 'Noemi Sanin', 'Noemí Sanín Posada'], 'Sí Colombia', '2.845.750 votos · 1998', 'Tercera en 1998 con el 26,77 %. En 2010 volvió a competir por el Partido Conservador (893.819 votos).'],
      ['Marta Lucía Ramírez', ['Ramírez', 'Marta Lucía', 'Marta Lucia Ramirez'], 'Partido Conservador', '1.997.980 votos · 2014', 'Tercera en 2014 con el 15,52 %. Fue vicepresidenta entre 2018 y 2022.'],
      ['Clara López', ['Clara Lopez', 'Clara López Obregón'], 'Polo Democrático', '1.958.518 votos · 2014', 'Cuarta en 2014 con el 15,22 %, por el Polo Democrático y la Unión Patriótica.'],
      ['Paloma Valencia', ['Valencia', 'Paloma Valencia Laserna'], 'Centro Democrático', '1.639.685 votos · 2026', 'Tercera en 2026 con el 6,92 %, por el Centro Democrático.'],
      ['Claudia López', ['Claudia Lopez', 'Claudia López Hernández'], null, '225.517 votos · 2026', 'Quinta en 2026 con el 0,95 %. Había sido alcaldesa de Bogotá (2020–2023).'],
    ],
  }),

  lista({
    id: 'top10-segunda-vuelta',
    titulo: 'MAYOR VOTACIÓN EN UNA SEGUNDA VUELTA PRESIDENCIAL - TOP 10',
    subtitulo: 'Votos por candidato en una segunda vuelta; cada persona cuenta una vez, con su mejor resultado.',
    categoria: 'presidenciales',
    fuente: `${ES} y ${EN}: páginas de cada segunda vuelta (1994, 1998, 2010, 2014, 2018, 2022 y 2026).`,
    nota: 'Quedan fuera las segundas votaciones repetidas de Santos (2014: 7.839.342) y Petro (2018: 8.040.449).',
    items: [
      ['Abelardo de la Espriella', ['De la Espriella', 'Abelardo'], 'Defensores de la Patria', '12.960.166 votos · 2026', 'Ganó la presidencia con el 49,66 %.'],
      ['Iván Cepeda', ['Cepeda', 'Ivan Cepeda', 'Iván Cepeda Castro'], 'Pacto Histórico', '12.708.312 votos · 2026', 'Perdió con el 48,70 %: la mayor votación de un candidato derrotado.'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Pacto Histórico', '11.281.013 votos · 2022', 'Ganó la presidencia con el 50,44 %.'],
      ['Rodolfo Hernández', ['Hernández', 'Rodolfo', 'Rodolfo Hernández Suárez'], 'Liga de Gobernantes Anticorrupción', '10.580.412 votos · 2022', 'Perdió con el 47,31 %.'],
      ['Iván Duque', ['Duque', 'Ivan Duque', 'Iván Duque Márquez'], 'Centro Democrático', '10.398.689 votos · 2018', 'Ganó la presidencia con el 54,03 %.'],
      ['Juan Manuel Santos', ['Santos', 'Juan Manuel Santos Calderón'], 'Partido de la U', '9.028.943 votos · 2010', 'Ganó con el 69,13 %, el mayor porcentaje de una segunda vuelta.'],
      ['Óscar Iván Zuluaga', ['Zuluaga', 'Oscar Ivan Zuluaga', 'Óscar Iván Zuluaga Escobar'], 'Centro Democrático', '6.917.001 votos · 2014', 'Perdió con el 45,00 %.'],
      ['Andrés Pastrana', ['Pastrana', 'Andrés Pastrana Arango'], 'Partido Conservador', '6.114.752 votos · 1998', 'Ganó la presidencia con el 50,34 %.'],
      ['Horacio Serpa', ['Serpa', 'Horacio Serpa Uribe'], 'Partido Liberal', '5.658.518 votos · 1998', 'Perdió con el 46,58 %.'],
      ['Ernesto Samper', ['Samper', 'Ernesto Samper Pizano'], 'Partido Liberal', '3.733.336 votos · 1994', 'Ganó la presidencia con el 50,57 %.'],
    ],
  }),

  lista({
    id: 'top10-primera-vuelta',
    titulo: 'MAYOR VOTACIÓN EN UNA PRIMERA VUELTA PRESIDENCIAL - TOP 10',
    subtitulo: 'Votos por candidato en una primera vuelta; cada persona cuenta una vez, con su mejor resultado.',
    categoria: 'presidenciales',
    fuente: `${ES} y ${EN}: páginas de cada primera vuelta (1994 a 2026).`,
    nota: 'Cifras de 2026, 2022, 2018 y 2014 del escrutinio de la edición en español; las de 2010 y 2006, de la edición en inglés.',
    items: [
      ['Abelardo de la Espriella', ['De la Espriella', 'Abelardo'], 'Defensores de la Patria', '10.361.499 votos · 2026', 'Ganó la primera vuelta con el 43,7 % y la segunda con el 49,66 %.'],
      ['Iván Cepeda', ['Cepeda', 'Ivan Cepeda', 'Iván Cepeda Castro'], 'Pacto Histórico', '9.688.361 votos · 2026', 'Segundo en 2026 con el 40,9 %; perdió la segunda vuelta.'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], 'Colombia Humana', '8.527.768 votos · 2022', 'Ganó la primera vuelta de 2022 con el 40,34 % y la presidencia en la segunda.'],
      ['Iván Duque', ['Duque', 'Ivan Duque', 'Iván Duque Márquez'], 'Centro Democrático', '7.616.857 votos · 2018', 'Ganó la primera vuelta de 2018 con el 39,36 % y la presidencia en la segunda.'],
      ['Álvaro Uribe Vélez', ['Uribe', 'Álvaro Uribe', 'Alvaro Uribe'], 'Primero Colombia', '7.397.835 votos · 2006', 'Se reeligió en primera vuelta con el 62,35 %.'],
      ['Juan Manuel Santos', ['Santos', 'Juan Manuel Santos Calderón'], 'Partido de la U', '6.802.043 votos · 2010', 'Ganó la primera vuelta de 2010 con el 46,68 %.'],
      ['Rodolfo Hernández', ['Hernández', 'Rodolfo', 'Rodolfo Hernández Suárez'], 'Liga de Gobernantes Anticorrupción', '5.953.209 votos · 2022', 'Segundo en 2022 con el 28,17 %; perdió la segunda vuelta.'],
      ['Federico Gutiérrez', ['Fico', 'Fico Gutiérrez', 'Federico Gutierrez', 'Gutiérrez'], 'Creemos', '5.058.010 votos · 2022', 'Tercero en 2022 con el 23,94 %.'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Compromiso Ciudadano', '4.602.916 votos · 2018', 'Tercero en 2018 con el 23,78 %, a menos de 253.000 votos de pasar a segunda vuelta.'],
      ['Óscar Iván Zuluaga', ['Zuluaga', 'Oscar Ivan Zuluaga', 'Óscar Iván Zuluaga Escobar'], 'Centro Democrático', '3.769.005 votos · 2014', 'Ganó la primera vuelta de 2014 con el 29,28 %, pero perdió la segunda.'],
    ],
  }),
]
