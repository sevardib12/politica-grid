import { build, d, type PoliticianInput } from '../builder.ts'

// Figuras históricas de la Unión Patriótica (UP) y del Partido Comunista Colombiano (PCC) que faltaban en
// la base, más uno de Progresistas. Muchas fueron asesinadas en el exterminio de la UP (1985–2002).
//
// Fuente de cada ficha: el artículo de la persona en Wikipedia en español (ficha e introducción), leído el
// 25-11-2026; el artículo de la UP en Wikipedia (es y en) para quien no tiene artículo propio. Criterios:
//   · Partidos: solo los que el artículo atribuye con una frase («miembro de la UP», «dirigente del PCC»…).
//     También entra quien el artículo llama aliado de la UP (Gilberto Vieira): el pedido incluye a quienes
//     se asocian con el partido aunque no militaran en él. La Juventud Comunista cuenta como el PCC solo
//     si el artículo nombra también al partido.
//   · Género: el del artículo («fue un político…», «es una activista…»); si no hay artículo, 'Sin dato'.
//   · Región: la de nacimiento según el artículo; 'Sin dato' si no hay artículo o el lugar es dudoso.
//   · Cargos: solo los que caben en el esquema. Una candidatura presidencial cuenta si la persona llegó
//     a la primera vuelta (Pardo Leal, 1986); Jaramillo Ossa fue asesinado antes de la de 1990.
//   · Décadas: las de su actividad política desde 1980, la primera que maneja el juego.
// Son fichas de respuesta (`perfil_regional`): valen en el buscador y en Arma el Gabinete, no arman tableros.
//
// Omitidos por falta de fuente: Pedro Nel Jiménez y Octavio Vargas Cuéllar (congresistas asesinados; sin
// artículo, y la página de la UP no dice de qué cámara eran), Hernán Motta (sin artículo), Iván Márquez
// (no se leyó su artículo) y las víctimas que solo aparecen en la parte de la página de la UP que no se
// pudo leer textualmente (Carlos Kovacs, Tirso Vélez, Alejandro Cárdenas Villa, entre otros).

const UP = 'Unión Patriótica'
const PCC = 'Partido Comunista Colombiano'

const ficha = (p: PoliticianInput) => build({ ...p, perfil_regional: true })

export const up = [
  // «fue un político colombiano»; Manizales. Senador por Antioquia 1986–1990 (ficha); el texto dice que
  // antes fue representante por Antioquia. Militante del PCC (1981–1985) y de la UP desde su fundación;
  // presidente de la UP tras Pardo Leal y su candidato presidencial para 1990. Asesinado el 22-03-1990.
  ficha({ id: 'jaramillo-ossa-bernardo', nombre: 'Bernardo Jaramillo Ossa', genero: 'Masculino', region: 'Eje Cafetero', partidos: [UP, PCC], congreso: { senador: true, representante_camara: true, departamentos_camara: ['Antioquia'] }, decadas: d('1980s-1990s') }),
  // «fue un abogado y político colombiano»; Ubaque (Cundinamarca). Comité Central del PCC; impulsor de la UP
  // y su primer candidato presidencial: tercero en 1986. Asesinado el 11-10-1987.
  ficha({ id: 'pardo-leal-jaime', nombre: 'Jaime Pardo Leal', genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [UP, PCC], presidencial: { candidato_primera_vuelta: true }, decadas: d('1980s') }),
  // «fue un abogado, periodista y político colombiano»; Armenia. Representante por Bogotá 1991–1994 y
  // senador desde 1994 (el único que eligió la UP ese año). «miembro del Partido Comunista Colombiano y de
  // la Unión Patriótica». Asesinado el 9-08-1994.
  ficha({ id: 'cepeda-vargas-manuel', nombre: 'Manuel Cepeda Vargas', genero: 'Masculino', region: 'Eje Cafetero', partidos: [UP, PCC], congreso: { senador: true, representante_camara: true, departamentos_camara: ['Bogotá'] }, decadas: d('1980s-1990s') }),
  // «fue un docente, político y líder social colombiano»; Bogotá. Concejal de Barrancabermeja; representante
  // por Santander en 1986 en la bancada de la UP. Asesinado el 30-08-1986.
  ficha({ id: 'posada-pedraza-leonardo', nombre: 'Leonardo Posada Pedraza', genero: 'Masculino', region: 'Bogotá', partidos: [UP], congreso: { representante_camara: true, departamentos_camara: ['Santander'] }, territorial: { concejal: ['Barrancabermeja'] }, decadas: d('1980s') }),
  // «fue un médico y político colombiano»; Medellín. Representante por Antioquia; dirigente del PCC y
  // miembro de la UP. Asesinado el 14-08-1987.
  ficha({ id: 'valencia-giraldo-pedro-luis', nombre: 'Pedro Luis Valencia Giraldo', genero: 'Masculino', region: 'Antioquia', partidos: [UP, PCC], congreso: { representante_camara: true, departamentos_camara: ['Antioquia'] }, decadas: d('1980s') }),
  // «fue un político colombiano. Miembro de la Unión Patriótica»; Palmira. Cofundador de la UP en Caquetá,
  // representante por Caquetá 1986–1990 y diputado; integró el Comité Central del PCC. Asesinado en 1993.
  ficha({ id: 'millan-gonzalez-henry', nombre: 'Henry Millán González', genero: 'Masculino', region: 'Valle del Cauca', partidos: [UP, PCC], congreso: { representante_camara: true, departamentos_camara: ['Caquetá'] }, territorial: { diputado_asamblea: ['Caquetá'] }, decadas: d('1980s-1990s') }),
  // «fue un abogado, activista de derechos humanos y político comunista colombiano, miembro del partido de
  // izquierda Unión Patriótica»; Barranquilla. Dirigente nacional de la UP y secretario de organización del
  // PCC. Asesinado el 3-03-1989.
  ficha({ id: 'antequera-jose', nombre: 'José Antequera Antequera', genero: 'Masculino', region: 'Caribe', partidos: [UP, PCC], decadas: d('1980s') }),
  // «fue un político y guerrillero colombiano» de las FARC-EP; Betania (Antioquia). Participó en la creación
  // de la UP en 1984 y fue representante para 1986–1990 como suplente de Gilberto Vieira; volvió a las FARC.
  ficha({ id: 'herrera-braulio', nombre: 'Braulio Herrera', genero: 'Masculino', region: 'Antioquia', partidos: [UP], congreso: { representante_camara: true }, decadas: d('1980s') }),
  // «fue un abogado y político colombiano»; Bogotá. Concejal (1934) y alcalde de Bogotá (1935); liberal, luego
  // del PCC (1964–1969), de la UP (1987–1990, por la que fue representante) y de la AD M-19.
  ficha({ id: 'montana-cuellar-diego', nombre: 'Diego Montaña Cuéllar', genero: 'Masculino', region: 'Bogotá', partidos: [UP, 'Partido Liberal', PCC, 'AD M-19'], congreso: { representante_camara: true }, territorial: { concejal: ['Bogotá'], alcalde: ['Bogotá'] }, decadas: d('1980s-1990s') }),
  // «fue un académico, escritor, periodista y político colombiano»; Medellín. Secretario general del PCC
  // 1947–1991, senador por Cundinamarca (1945–1947), representante por Cundinamarca y concejal de Bogotá.
  // El artículo dice que «se convirtió en aliado de la Unión Patriótica».
  ficha({ id: 'vieira-white-gilberto', nombre: 'Gilberto Vieira White', genero: 'Masculino', region: 'Antioquia', partidos: [PCC, UP], congreso: { senador: true, representante_camara: true, departamentos_camara: ['Cundinamarca'] }, territorial: { concejal: ['Bogotá'] }, decadas: d('1980s-1990s') }),
  // «fue un abogado ... político, activista y diplomático»; nacimiento discutido (París o Bogotá): 'Sin dato'.
  // Conservador: canciller 1970–1974, embajador, diputado y representante por Cundinamarca. Constituyente de
  // 1991 por la lista de la UP. El gobierno de Misael Pastrana no está en el juego: el cargo va sin gobierno.
  ficha({ id: 'vazquez-carrizosa-alfredo', nombre: 'Alfredo Vázquez Carrizosa', genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador', UP], congreso: { representante_camara: true, departamentos_camara: ['Cundinamarca'] }, territorial: { diputado_asamblea: ['Cundinamarca'] }, ejecutivo: { ministerios: ['Relaciones Exteriores'], embajador: true }, hitos: ['Constituyente de 1991'], decadas: d('1990s') }),
  // «es un antropólogo y político colombiano»; Cali. Secretario general del PCC (1994–2022) y su presidente
  // (2022–2025); impulsor de la UP; dirección nacional del Polo, por el que fue concejal de Bogotá 2008–2011.
  // El PCC se fusionó en el Pacto Histórico en 2025 (Wikipedia: «Partido Comunista Colombiano»).
  ficha({ id: 'caycedo-turriago-jaime', nombre: 'Jaime Caycedo Turriago', genero: 'Masculino', region: 'Valle del Cauca', partidos: [PCC, UP, 'Polo Democrático', 'Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: d('1980s-2020s') }),
  // «es una artista plástica, poetisa, dramaturga, actriz y activista colombiana»; Vélez (Santander).
  // «una de los miembros fundadores del partido Unión Patriótica». Ministra de Cultura de Petro (2022–2023):
  // esa cartera no está en el juego, así que solo consta el gobierno.
  ficha({ id: 'ariza-patricia', nombre: 'Patricia Ariza', genero: 'Femenino', region: 'Santanderes', partidos: [UP], ejecutivo: { gobiernos_gabinete: ['Petro'] }, decadas: d('1980s', '2020s') }),
  // Sin artículo propio. Página de la UP: «concejal de Valledupar por la UP, Antonio Quiroz Rivero»,
  // asesinado el 11-04-1987.
  ficha({ id: 'quiroz-rivero-antonio', nombre: 'Antonio Quiroz Rivero', genero: 'Sin dato', region: 'Sin dato', partidos: [UP], territorial: { concejal: ['Valledupar'] }, decadas: d('1980s') }),

  // ── Progresistas ──
  // «es un periodista, productor, director de televisión, escritor y político colombiano»; Bogotá. Concejal de
  // Bogotá 2016–2019 «por el Movimiento Progresistas»; ficha: Progresistas, Colombia Humana, Fuerza Ciudadana.
  ficha({ id: 'morris-hollman', nombre: 'Hollman Morris', genero: 'Masculino', region: 'Bogotá', partidos: ['Progresistas', 'Colombia Humana', 'Fuerza Ciudadana'], territorial: { concejal: ['Bogotá'] }, decadas: d('2010s-2020s') }),
]
