import type { Top10Challenge } from '../top10Types.ts'
import { lista, ORDEN_RECIENTE } from './builder.ts'

// Alcaldes de las cuatro grandes ciudades (elección popular desde 1988) y gobernadores de Antioquia
// (elección popular desde 1992). Fuente: Wikipedia (es), anexos de alcaldes y gobernadores.

const WP = 'Wikipedia (es), consultada el 17 de noviembre de 2026'
const SUB = `${ORDEN_RECIENTE} Se cuentan los alcaldes elegidos por voto popular desde 1988.`

export const CARGOS_TERRITORIAL: Top10Challenge[] = [
  lista({
    id: 'alcaldes-bogota',
    titulo: 'ÚLTIMOS 10 ALCALDES ELEGIDOS DE BOGOTÁ',
    subtitulo: SUB,
    categoria: 'cargos',
    fuente: `${WP}: Anexo:Alcaldes de Bogotá; votos de El Tiempo («Así han sido las contiendas por la Alcaldía de Bogotá»).`,
    nota: 'Los alcaldes encargados (Sonia Durán, Paul Bromberg, María Fernanda Campo, Clara López, Rafael Pardo y Mercedes Maldonado) no cuentan.',
    items: [
      ['Carlos Fernando Galán Pachón', ['Carlos Fernando Galán', 'Galán', 'Carlos Fernando Galan', 'Galan', 'Carlos Galán'], 'Nuevo Liberalismo', '2024–2027', 'Elegido en 2023 con 1.497.596 votos (49,02 %), en su tercer intento.'],
      ['Claudia López', ['López', 'Claudia Lopez', 'Claudia López Hernández'], 'Alianza Verde', '2020–2023', 'Primera mujer elegida alcaldesa de Bogotá: 1.108.541 votos (35,21 %) en 2019.'],
      ['Enrique Peñalosa', ['Peñalosa', 'Enrique Peñalosa Londoño', 'Penalosa'], null, '2016–2019', 'Elegido en 2015 con 906.058 votos (33,18 %). Ya había sido alcalde en 1998–2000.'],
      ['Gustavo Petro', ['Petro', 'Gustavo Petro Urrego'], null, '2012–2015', 'Elegido en 2011 con 723.157 votos (33,36 %) por el movimiento Progresistas. Fue destituido en 2014 y reintegrado el 23 de abril de ese año.'],
      ['Samuel Moreno', ['Moreno', 'Samuel Moreno Rojas'], 'Polo Democrático', '2008–2011', 'Elegido en 2007 con 920.013 votos (43,94 %). Dejó el cargo el 3 de mayo de 2011.'],
      ['Luis Eduardo Garzón', ['Lucho Garzón', 'Garzón', 'Luis Garzón', 'Lucho'], 'Polo Democrático', '2004–2007', 'Elegido en 2003 con 797.466 votos (46,29 %) por el Polo Democrático Independiente.'],
      ['Antanas Mockus', ['Mockus', 'Antanas Mockus Sivickas'], 'Alianza Social Independiente', '2001–2003', 'Elegido en 2000 con 681.017 votos (43,72 %). Ya había sido alcalde en 1995–1997.'],
      ['Jaime Castro', ['Castro', 'Jaime Castro Castro'], 'Partido Liberal', '1992–1994', 'Elegido en 1992 con 310.654 votos (48,17 %).'],
      ['Juan Martín Caicedo Ferrer', ['Caicedo', 'Juan Martín Caicedo', 'Caicedo Ferrer', 'Juan Martin Caicedo'], 'Partido Liberal', '1990–1992', 'Elegido en 1990 con 597.295 votos (65 %).'],
      ['Andrés Pastrana', ['Pastrana', 'Andrés Pastrana Arango'], 'Partido Conservador', '1988–1990', 'Primer alcalde de Bogotá elegido por voto popular: 328.657 votos (34,93 %). Fue presidente de Colombia (1998–2002).'],
    ],
  }),

  lista({
    id: 'alcaldes-medellin',
    titulo: 'ÚLTIMOS 10 ALCALDES ELEGIDOS DE MEDELLÍN',
    subtitulo: SUB,
    categoria: 'cargos',
    fuente: `${WP}: Anexo:Alcaldes de Medellín.`,
    nota: 'Quedan fuera los encargados Juan Camilo Restrepo, Jennifer Andree Uribe y Óscar Hurtado.',
    items: [
      ['Federico Gutiérrez', ['Fico', 'Fico Gutiérrez', 'Federico Gutierrez'], 'Creemos', '2024–2027', 'También fue alcalde en 2016–2019. En 2022 fue candidato presidencial: 5.058.010 votos en primera vuelta (23,94 %).'],
      ['Daniel Quintero', ['Quintero', 'Daniel Quintero Calle'], null, '2020–2023', 'Alcalde desde el 1 de enero de 2020; fue suspendido en 2022 y renunció el 30 de septiembre de 2023.'],
      ['Aníbal Gaviria', ['Gaviria', 'Aníbal Gaviria Correa', 'Anibal Gaviria'], 'Partido Liberal', '2012–2015', 'Fue gobernador de Antioquia en 2004–2007 y de nuevo en 2020–2023.'],
      ['Alonso Salazar', ['Salazar', 'Alonso Salazar Jaramillo'], 'Alianza Social Independiente', '2008–2011', 'Sucedió a Sergio Fajardo en la Alcaldía de Medellín.'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Alianza Social Independiente', '2004–2007', 'Fue gobernador de Antioquia (2012–2015) y candidato presidencial en 2018 (4.602.916 votos), 2022 y 2026.'],
      ['Luis Pérez Gutiérrez', ['Pérez', 'Luis Pérez', 'Luis Perez'], 'Partido Liberal', '2001–2003', 'Después fue gobernador de Antioquia (2016–2019).'],
      ['Juan Gómez Martínez', ['Gómez Martínez', 'Juan Gómez', 'Juan Gomez Martinez'], 'Partido Conservador', '1998–2000', 'También fue alcalde en 1988–1990, en el primer periodo de elección popular.'],
      ['Sergio Naranjo', ['Naranjo', 'Sergio Gabriel Naranjo'], 'Partido Conservador', '1995–1997', 'Alcalde de Medellín entre el 1 de enero de 1995 y 1997.'],
      ['Luis Alfredo Ramos', ['Ramos', 'Luis Alfredo Ramos Botero'], 'Partido Conservador', '1992–1994', 'Después fue presidente del Senado (2002–2003) y gobernador de Antioquia (2008–2011).'],
      ['Omar Flórez', ['Flórez', 'Omar Flórez Vélez', 'Omar Florez'], 'Partido Liberal', '1990–1992', 'Alcalde de Medellín entre 1990 y 1992.'],
    ],
  }),

  lista({
    id: 'alcaldes-cali',
    titulo: 'ÚLTIMOS 10 ALCALDES ELEGIDOS DE CALI',
    subtitulo: SUB,
    categoria: 'cargos',
    fuente: `${WP}: Anexo:Alcaldes de Cali.`,
    nota: 'Quedan fuera los interinos Julio César Martínez Payán y Hernán Sandoval, y el alcalde designado Sabas Tafur.',
    items: [
      ['Alejandro Eder', ['Eder', 'Alejandro Eder Garcés'], null, '2024–2027', 'Elegido en 2023, inscrito por el movimiento ReVivamos Cali.'],
      ['Jorge Iván Ospina', ['Ospina', 'Jorge Ospina', 'Jorge Ivan Ospina'], 'Alianza Verde', '2020–2023', 'También fue alcalde en 2008–2011.'],
      ['Maurice Armitage', ['Armitage'], null, '2016–2019', 'Elegido en 2015 como independiente, inscrito por Creemos con Armitage.'],
      ['Rodrigo Guerrero', ['Guerrero', 'Rodrigo Guerrero Velasco'], null, '2012–2015', 'También fue alcalde entre 1992 y 1995.'],
      ['Apolinar Salcedo', ['Salcedo', 'Apolinar Salcedo Caicedo'], 'Partido Liberal', '2004–2007', 'Destituido en mayo de 2007 por irregularidades en la contratación del recaudo de impuestos.'],
      ['John Maro Rodríguez', ['Rodríguez Flórez', 'John Maro', 'John Maro Rodriguez', 'John Maro Rodríguez Flórez'], 'Partido Liberal', '2001–2003', 'Alcalde de Cali entre 2001 y 2003.'],
      ['Ricardo Cobo', ['Cobo', 'Ricardo Cobo Lloreda', 'Ricardo Hernando Cobo'], 'Partido Conservador', '1998–2000', 'Alcalde de Cali entre 1998 y 2001.'],
      ['Mauricio Guzmán', ['Guzmán Cuevas', 'Mauricio Guzmán Cuevas'], 'Partido Liberal', '1995–1997', 'Destituido en agosto de 1997 por vínculos con el narcotráfico.'],
      ['Germán Villegas', ['Villegas', 'Germán Villegas Villegas'], 'Partido Conservador', '1990–1992', 'Alcalde de Cali entre 1990 y 1992.'],
      ['Carlos Holmes Trujillo', ['Holmes Trujillo', 'Carlos Holmes', 'Carlos Holmes Trujillo García'], 'Partido Liberal', '1988–1990', 'Primer alcalde de Cali elegido por voto popular. Fue canciller (2018–2019) y ministro de Defensa (2019–2021).'],
    ],
  }),

  lista({
    id: 'alcaldes-barranquilla',
    titulo: 'ÚLTIMOS 10 ALCALDES DE BARRANQUILLA',
    subtitulo: SUB,
    categoria: 'cargos',
    fuente: `${WP}: Anexo:Alcaldes de Barranquilla; elección de 1988 contrastada con El Heraldo.`,
    nota: 'En 1988 ganó Jaime Pumarejo Certain, pero el Consejo de Estado anuló mesas y declaró ganador a Gustavo Certain Duncan (su primo), que asumió en 1989. El encargado Juan Alberto García Estrada no cuenta.',
    items: [
      ['Alejandro Char', ['Char', 'Alex Char', 'Alejandro Char Chaljub'], 'Cambio Radical', '2024–2027', 'Alcalde en tres periodos: 2008–2011, 2016–2019 y desde 2024.'],
      ['Jaime Pumarejo Heins', ['Pumarejo Heins', 'Jaime Alberto Pumarejo Heins'], 'Cambio Radical', '2020–2023', 'Sucedió a Alejandro Char en 2020.'],
      ['Elsa Noguera', ['Noguera', 'Elsa Margarita Noguera', 'Elsa Noguera de la Espriella'], 'Cambio Radical', '2012–2015', 'En 2026 fue nombrada ministra de Transporte.'],
      ['Guillermo Hoenigsberg', ['Hoenigsberg', 'Guillermo Hoenigsberg Bornacelly'], null, '2004–2006', 'Destituido por corrupción el 19 de diciembre de 2006.'],
      ['Humberto Caiaffa', ['Caiaffa', 'Humberto Caiaffa Rivas', 'Humberto de Jesús Caiaffa'], null, '2001–2003', 'Alcalde de Barranquilla entre 2001 y 2003.'],
      ['Bernardo Hoyos', ['Hoyos', 'Bernardo Hoyos Montoya'], null, '1998–2000', 'También fue alcalde en 1992–1994, el primero elegido bajo la Constitución de 1991.'],
      ['Edgard George', ['George', 'Edgard George González', 'Edgar George'], 'Partido Liberal', '1995–1997', 'Alcalde de Barranquilla entre 1995 y 1997.'],
      ['Miguel Bolívar', ['Bolívar', 'Miguel Bolívar Acuña', 'Miguel Bolivar'], 'Partido Liberal', '1990–1992', 'En su periodo se creó la empresa de servicios públicos Triple A (17 de julio de 1991).'],
      ['Gustavo Certain', ['Certain Duncan', 'Gustavo Certain Duncan'], 'Partido Liberal', '1989–1990', 'Asumió en 1989 después de que el Consejo de Estado lo declarara ganador de las elecciones de 1988.'],
      ['Jaime Pumarejo Certain', ['Pumarejo Certain', 'Jaime Pumarejo Certain'], 'Partido Conservador', '1988–1989', 'Ganó la primera elección popular de alcaldes (13 de marzo de 1988), pero el Consejo de Estado lo desplazó en 1989.'],
    ],
  }),

  lista({
    id: 'gobernadores-antioquia',
    titulo: 'ÚLTIMOS 5 GOBERNADORES DE ANTIOQUIA',
    subtitulo: 'Del actual (1) al más antiguo. Cada persona cuenta una vez; no se cuentan encargados.',
    categoria: 'cargos',
    fuente: `${WP}: Anexo:Gobernadores de Antioquia; votos de 2023 de la página de las elecciones regionales.`,
    items: [
      ['Andrés Julián Rendón', ['Rendón', 'Andrés Rendón', 'Andres Julian Rendon', 'Andrés Julián Rendón Cardona'], 'Centro Democrático', '2024–2027', 'Elegido en 2023 con 953.448 votos (37,31 %), frente a Luis Pérez (599.353 votos).'],
      ['Aníbal Gaviria', ['Gaviria', 'Aníbal Gaviria Correa', 'Anibal Gaviria'], null, '2020–2023', 'Ya había sido gobernador en 2004–2007 y alcalde de Medellín (2012–2015). Su periodo tuvo dos interinidades en 2020 y 2021.'],
      ['Luis Pérez Gutiérrez', ['Pérez', 'Luis Pérez', 'Luis Perez', 'Luis Emilio Pérez'], 'Partido Liberal', '2016–2019', 'Había sido alcalde de Medellín (2001–2003).'],
      ['Sergio Fajardo', ['Fajardo', 'Sergio Fajardo Valderrama'], 'Alianza Verde', '2012–2015', 'Había sido alcalde de Medellín (2004–2007).'],
      ['Luis Alfredo Ramos', ['Ramos', 'Luis Alfredo Ramos Botero'], null, '2008–2011', 'Había sido alcalde de Medellín (1992–1994) y presidente del Senado (2002–2003).'],
    ],
  }),
]
