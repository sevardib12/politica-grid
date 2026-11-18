// Fichas regionales: gobernadores y alcaldes de capitales de departamento (periodos 2012–2015,
// 2016–2019, 2020–2023 y 2024–2027) y concejales de Bogotá, Medellín, Cali y Barranquilla.
//
// Fuentes (consultadas el 17 de noviembre de 2026):
//   · Wikipedia (es): «Elecciones regionales de Colombia de 2011, 2015, 2019 y 2023» (gobernador y
//     alcalde electos en las elecciones ordinarias; no incluye encargados ni elecciones atípicas).
//   · Wikipedia (es): «Anexo:Composición del Concejo de Bogotá 2020-2023» y «2024-2027»;
//     «Concejo de Medellín» (2024-2027); «Concejo de Barranquilla» (2020-2023) y
//     «Elecciones locales de Barranquilla de 2023» (concejales electos).
//   · Concejo de Santiago de Cali, sitio oficial (concejales 2024-2027).
//
// Criterios de rigor:
//   · partidos: solo si la tabla da UN partido del catálogo; con una coalición de varios, queda vacío.
//   · region (lugar de nacimiento): solo si el artículo de Wikipedia de la persona lo indica; si no, 'Sin dato'.
//   · genero: del artículo cuando existe; si no, del nombre de pila (casos dudosos verificados uno a uno).
//
// Todas llevan `perfil_regional`: valen como respuesta, pero no se usan para generar tableros.

import { build, type PoliticianInput } from '../builder.ts'
import type { Politician } from '../types.ts'

const r = (x: Omit<PoliticianInput, 'perfil_regional'>): Politician => build({ ...x, perfil_regional: true })

export const regional: Politician[] = [
  // gobernador Amazonas 2012–2015
  r({ id: 'rodriguez-celis-carlos', nombre: "Carlos Arturo Rodríguez Celis", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { gobernador: ['Amazonas'] }, decadas: ['2010s'] }),
  // gobernador Arauca 2012–2015; gobernador Arauca 2020–2023 · nacimiento: Cravo Norte, Intendencia de Arauca, República de Colombia
  r({ id: 'castillo-cisneros-jose', nombre: "José Facundo Castillo Cisneros", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Partido de la U'], territorial: { gobernador: ['Arauca'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Atlántico 2012–2015
  r({ id: 'segebre-berardinelli-jose', nombre: "José Antonio Segebre Berardinelli", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Atlántico'] }, decadas: ['2010s'] }),
  // gobernador Bolívar 2012–2015 · nacimiento: Cartagena de Indias, Colombia
  r({ id: 'gossain-roginini-juan', nombre: "Juan Carlos Gossain Roginini", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['Bolívar'] }, decadas: ['2010s'] }),
  // gobernador Boyacá 2012–2015
  r({ id: 'granados-becerra-juan', nombre: "Juan Carlos Granados Becerra", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { gobernador: ['Boyacá'] }, decadas: ['2010s'] }),
  // gobernador Caldas 2012–2015 · nacimiento: Marulanda, Caldas Colombia
  r({ id: 'echeverry-piedrahita-guido', nombre: "Guido Echeverry Piedrahita", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido Conservador'], territorial: { gobernador: ['Caldas'] }, decadas: ['2010s'] }),
  // gobernador Caquetá 2012–2015
  r({ id: 'ramirez-loaiza-victor', nombre: "Víctor Isidro Ramírez Loaiza", genero: 'Masculino', region: 'Sin dato', partidos: ['MIRA'], territorial: { gobernador: ['Caquetá'] }, decadas: ['2010s'] }),
  // gobernador Casanare 2012–2015
  r({ id: 'marino-velandia-nelson', nombre: "Nelson Ricardo Marino Velandia", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Casanare'] }, decadas: ['2010s'] }),
  // gobernador Cauca 2012–2015 · nacimiento: Mercaderes, Cauca, Colombia
  r({ id: 'ortega-narvaez-temistocles', nombre: "Temístocles Ortega Narváez", genero: 'Masculino', region: 'Cauca/Nariño', partidos: ['Alianza Social Independiente'], territorial: { gobernador: ['Cauca'] }, decadas: ['2010s'] }),
  // gobernador Cesar 2012–2015; gobernador Cesar 2020–2023 · nacimiento: Valledupar, Cesar, Colombia
  r({ id: 'monsalvo-gnecco-luis', nombre: "Luis Alberto Monsalvo Gnecco", genero: 'Masculino', region: 'Caribe', partidos: ['Partido de la U'], territorial: { gobernador: ['Cesar'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Córdoba 2012–2015 · nacimiento: Sahagún, Córdoba, Colombia
  r({ id: 'lyons-muskus-alejandro', nombre: "Alejandro José Lyons Muskus", genero: 'Masculino', region: 'Caribe', partidos: ['Partido de la U'], territorial: { gobernador: ['Córdoba'] }, decadas: ['2010s'] }),
  // gobernador Cundinamarca 2012–2015 · nacimiento: San Juan de Rioseco, Cundinamarca, Colombia
  r({ id: 'cruz-vargas-alvaro', nombre: "Álvaro Cruz Vargas", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: ['Partido de la U'], territorial: { gobernador: ['Cundinamarca'] }, decadas: ['2010s'] }),
  // gobernador Guainía 2012–2015
  r({ id: 'rodriguez-sanchez-oscar', nombre: "Oscar Armando Rodríguez Sánchez", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Guainía'] }, decadas: ['2010s'] }),
  // gobernador Guaviare 2012–2015
  r({ id: 'rivera-moncada-jose', nombre: "José Octaviano Rivera Moncada", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { gobernador: ['Guaviare'] }, decadas: ['2010s'] }),
  // gobernador Huila 2012–2015 · nacimiento: Pitalito, Huila (Colombia)
  r({ id: 'gonzalez-villa-cielo', nombre: "Cielo Gonzalez Villa", genero: 'Femenino', region: 'Tolima/Huila', partidos: ['Partido de la U'], territorial: { gobernador: ['Huila'] }, decadas: ['2010s'] }),
  // gobernador La Guajira 2012–2015 · nacimiento: Barrancas, La Guajira
  r({ id: 'gomez-cerchar-juan', nombre: "Juan Francisco Gómez Cerchar", genero: 'Masculino', region: 'Caribe', partidos: ['Cambio Radical'], territorial: { gobernador: ['La Guajira'] }, decadas: ['2010s'] }),
  // gobernador Magdalena 2012–2015 · nacimiento: Santa Marta, Colombia
  r({ id: 'cotes-habeych-luis', nombre: "Luis Miguel Cotes Habeych", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['Magdalena'] }, decadas: ['2010s'] }),
  // gobernador Meta 2012–2015
  r({ id: 'jara-urzola-alan', nombre: "Alan Edmundo Jara Urzola", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Meta'] }, decadas: ['2010s'] }),
  // gobernador Nariño 2012–2015 · nacimiento: —
  r({ id: 'delgado-guerrero-segundo', nombre: "Segundo Raul Delgado Guerrero", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Nariño'] }, decadas: ['2010s'] }),
  // gobernador Norte de Santander 2012–2015
  r({ id: 'diaz-contreras-edgar', nombre: "Edgar Jesús Diaz Contreras", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Norte de Santander'] }, decadas: ['2010s'] }),
  // gobernador Putumayo 2012–2015 · nacimiento: Mocoa, Intendencia del Putumayo, Colombia
  r({ id: 'diaz-burbano-jimmy', nombre: "Jimmy Harold Diaz Burbano", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Partido Conservador'], territorial: { gobernador: ['Putumayo'] }, decadas: ['2010s'] }),
  // gobernador Quindío 2012–2015 · nacimiento: Armenia, Quindío, Colombia
  r({ id: 'hurtado-palacio-sandra', nombre: "Sandra Paola Hurtado Palacio", genero: 'Femenino', region: 'Eje Cafetero', partidos: [], territorial: { gobernador: ['Quindío'] }, decadas: ['2010s'] }),
  // gobernador Risaralda 2012–2015
  r({ id: 'botero-lopez-carlos', nombre: "Carlos Alberto Botero López", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Risaralda'] }, decadas: ['2010s'] }),
  // gobernador San Andrés y Providencia 2012–2015 · nacimiento: San Andrés, Intendencia de San Andrés y Providencia, República de Colombia
  r({ id: 'guerrero-bowie-aury', nombre: "Aury Socorro Guerrero Bowie", genero: 'Femenino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['San Andrés y Providencia'] }, decadas: ['2010s'] }),
  // gobernador Santander 2012–2015 · nacimiento: Tolú, Sucre, Colombia
  r({ id: 'aguilar-villa-richard', nombre: "Richard Alfonso Aguilar Villa", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['Santander'] }, decadas: ['2010s'] }),
  // gobernador Sucre 2012–2015 · nacimiento: 
  r({ id: 'guerra-tulena-julio', nombre: "Julio Cesar Guerra Tulena", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Sucre'] }, decadas: ['2010s'] }),
  // gobernador Tolima 2012–2015 · nacimiento: Venadillo, Colombia
  r({ id: 'delgado-penon-luis', nombre: "Luis Carlos Delgado Peñon", genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Partido Liberal'], territorial: { gobernador: ['Tolima'] }, decadas: ['2010s'] }),
  // gobernador Valle del Cauca 2012–2015
  r({ id: 'useche-cruz-hector', nombre: "Héctor Fabio Useche de La Cruz", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Valle del Cauca'] }, decadas: ['2010s'] }),
  // gobernador Vaupés 2012–2015
  r({ id: 'jaramillo-garcia-roberto', nombre: "Roberto Jaramillo Garcia", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Vaupés'] }, decadas: ['2010s'] }),
  // gobernador Vichada 2012–2015
  r({ id: 'espinosa-florez-sergio', nombre: "Sergio Andrés Espinosa Florez", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { gobernador: ['Vichada'] }, decadas: ['2010s'] }),
  // alcalde Leticia 2012–2015
  r({ id: 'lozano-guzman-jose', nombre: "José Ignacio Lozano Guzmán", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Leticia'] }, decadas: ['2010s'] }),
  // alcalde Arauca 2012–2015
  r({ id: 'tovar-bello-luis', nombre: "Luis Emilio Tovar Bello", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { alcalde: ['Arauca'] }, decadas: ['2010s'] }),
  // alcalde Cartagena 2012–2015 · nacimiento: San Antero, Córdoba, Colombia
  r({ id: 'teran-dix-campo', nombre: "Campo Elías Terán Dix", genero: 'Masculino', region: 'Caribe', partidos: ['Alianza Social Independiente'], territorial: { alcalde: ['Cartagena'] }, decadas: ['2010s'] }),
  // alcalde Tunja 2012–2015
  r({ id: 'florez-espinosa-fernando', nombre: "Fernando Florez Espinosa", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Tunja'] }, decadas: ['2010s'] }),
  // alcalde Manizales 2012–2015; alcalde Manizales 2024–2027 · nacimiento: —
  r({ id: 'rojas-giraldo-jorge', nombre: "Jorge Eduardo Rojas Giraldo", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Manizales'] }, decadas: ['2010s', '2020s'] }),
  // alcalde Florencia 2012–2015
  r({ id: 'portela-lozada-maria', nombre: "María Susana Portela Lozada", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { alcalde: ['Florencia'] }, decadas: ['2010s'] }),
  // alcalde Yopal 2012–2015
  r({ id: 'celemin-caceres-willman', nombre: "Willman Enrique Celemin Cáceres", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Yopal'] }, decadas: ['2010s'] }),
  // alcalde Popayán 2012–2015
  r({ id: 'fuentes-meneses-francisco', nombre: "Francisco Fuentes Meneses", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { alcalde: ['Popayán'] }, decadas: ['2010s'] }),
  // alcalde Valledupar 2012–2015 · nacimiento: Valledupar, Cesar
  r({ id: 'socarras-reales-fredys', nombre: "Fredys Miguel Socarrás Reales", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { alcalde: ['Valledupar'] }, decadas: ['2010s'] }),
  // alcalde Quibdó 2012–2015
  r({ id: 'mena-garcia-zulia', nombre: "Zulia María Mena García", genero: 'Femenino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Quibdó'] }, decadas: ['2010s'] }),
  // alcalde Montería 2012–2015 · nacimiento: Montería, Colombia
  r({ id: 'correa-escaf-carlos', nombre: "Carlos Eduardo Correa Escaf", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], territorial: { alcalde: ['Montería'] }, decadas: ['2010s'] }),
  // alcalde Inírida 2012–2015
  r({ id: 'delvasto-lara-oscar', nombre: "Óscar Gerardo Delvasto Lara", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Inírida'] }, decadas: ['2010s'] }),
  // alcalde San José del Guaviare 2012–2015
  r({ id: 'gomez-criales-geovanny', nombre: "Geovanny Gómez Criales", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['San José del Guaviare'] }, decadas: ['2010s'] }),
  // alcalde Neiva 2012–2015
  r({ id: 'suarez-trujillo-pedro', nombre: "Pedro Hernán Suárez Trujillo", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { alcalde: ['Neiva'] }, decadas: ['2010s'] }),
  // alcalde Riohacha 2012–2015
  r({ id: 'ceballos-sierra-rafael', nombre: "Rafael Ricardo Ceballos Sierra", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Riohacha'] }, decadas: ['2010s'] }),
  // alcalde Villavicencio 2012–2015; gobernador Meta 2020–2023 · nacimiento: San José del Guaviare, Guaviare, Colombia
  r({ id: 'zuluaga-cardona-juan', nombre: "Juan Guillermo Zuluaga Cardona", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Partido de la U'], territorial: { gobernador: ['Meta'], alcalde: ['Villavicencio'] }, decadas: ['2010s', '2020s'] }),
  // alcalde Pasto 2012–2015 · nacimiento: San Juan de Pasto, Colombia
  r({ id: 'guerrero-lopez-harold', nombre: "Harold Guerrero López", genero: 'Masculino', region: 'Cauca/Nariño', partidos: ['Cambio Radical'], territorial: { alcalde: ['Pasto'] }, decadas: ['2010s'] }),
  // alcalde Cúcuta 2012–2015 · nacimiento: Cúcuta, Norte de Santander
  r({ id: 'ramirez-paris-lobo-donamaris', nombre: "Donamaris Ramírez-Paris Lobo", genero: 'Masculino', region: 'Santanderes', partidos: ['Alianza Verde'], territorial: { alcalde: ['Cúcuta'] }, decadas: ['2010s'] }),
  // alcalde Mocoa 2012–2015
  r({ id: 'ceron-chicunque-elver', nombre: "Elver Porfidio Ceron Chicunque", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { alcalde: ['Mocoa'] }, decadas: ['2010s'] }),
  // alcalde Armenia 2012–2015 · nacimiento: Armenia, Colombia
  r({ id: 'valencia-franco-luz', nombre: "Luz Piedad Valencia Franco", genero: 'Femenino', region: 'Eje Cafetero', partidos: ['Partido Liberal'], territorial: { alcalde: ['Armenia'] }, decadas: ['2010s'] }),
  // alcalde Pereira 2012–2015
  r({ id: 'vasquez-zuleta-enrique', nombre: "Enrique Antonio Vasquez Zuleta", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Pereira'] }, decadas: ['2010s'] }),
  // alcalde Bucaramanga 2012–2015
  r({ id: 'bohorquez-pedraza-luis', nombre: "Luis Francisco Bohorquez Pedraza", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Bucaramanga'] }, decadas: ['2010s'] }),
  // alcalde Sincelejo 2012–2015 · nacimiento: Sincelejo, Sucre, Colombia
  r({ id: 'fernandez-quessep-jairo', nombre: "Jairo Alfredo Fernandez Quessep", genero: 'Masculino', region: 'Caribe', partidos: ['Partido de la U'], territorial: { alcalde: ['Sincelejo'] }, decadas: ['2010s'] }),
  // alcalde Ibagué 2012–2015 · nacimiento: Ibagué, Tolima, Colombia
  r({ id: 'rodriguez-ramirez-luis', nombre: "Luis Hernando Rodríguez Ramírez", genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Partido Liberal'], territorial: { alcalde: ['Ibagué'] }, decadas: ['2010s'] }),
  // alcalde Mitú 2012–2015
  r({ id: 'melendez-moreno-carlos', nombre: "Carlos Iván Ramiro Melendez Moreno", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Mitú'] }, decadas: ['2010s'] }),
  // alcalde Puerto Carreño 2012–2015
  r({ id: 'londono-lugo-alvaro', nombre: "Álvaro Mauricio Londoño Lugo", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Puerto Carreño'] }, decadas: ['2010s'] }),
  // gobernador Amazonas 2016–2019
  r({ id: 'carebilla-cuellar-manuel', nombre: "Manuel Antonio Carebilla Cuellar", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { gobernador: ['Amazonas'] }, decadas: ['2010s'] }),
  // gobernador Arauca 2016–2019
  r({ id: 'alvarado-bestene-ricardo', nombre: "Ricardo Alvarado Bestene", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Arauca'] }, decadas: ['2010s'] }),
  // gobernador Atlántico 2016–2019; gobernador Atlántico 2024–2027 · nacimiento: Barranquilla, Colombia
  r({ id: 'verano-rosa-eduardo', nombre: "Eduardo Ignacio Verano De La Rosa", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['Atlántico'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Bolívar 2016–2019; alcalde Cartagena 2024–2027 · nacimiento: El Carmen de Bolívar, Bolívar, Colombia
  r({ id: 'turbay-paz-dumek', nombre: "Dumek José Turbay Paz", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['Bolívar'], alcalde: ['Cartagena'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Caldas 2016–2019
  r({ id: 'echeverri-piedrahita-guido', nombre: "Guido Echeverri Piedrahíta", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Caldas'] }, decadas: ['2010s'] }),
  // gobernador Caquetá 2016–2019
  r({ id: 'pacheco-alvarez-alvaro', nombre: "Álvaro Pacheco Álvarez", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Caquetá'] }, decadas: ['2010s'] }),
  // gobernador Cauca 2016–2019
  r({ id: 'campo-hurtado-oscar', nombre: "Oscar Rodrigo Campo Hurtado", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Cauca'] }, decadas: ['2010s'] }),
  // gobernador Cesar 2016–2019 · nacimiento: Valledupar, Cesar
  r({ id: 'ovalle-angarita-francisco', nombre: "Francisco Fernando Ovalle Angarita", genero: 'Masculino', region: 'Caribe', partidos: ['Partido de la U'], territorial: { gobernador: ['Cesar'] }, decadas: ['2010s'] }),
  // gobernador Chocó 2016–2019
  r({ id: 'palacios-mosquera-jhoany', nombre: "Jhoany Carlos Alberto Palacios Mosquera", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Chocó'] }, decadas: ['2010s'] }),
  // gobernador Córdoba 2016–2019
  r({ id: 'besaile-fayad-edwin', nombre: "Edwin José Besaile Fayad", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Córdoba'] }, decadas: ['2010s'] }),
  // gobernador Cundinamarca 2016–2019; gobernador Cundinamarca 2024–2027 · nacimiento: Funza, Cundinamarca, Colombia
  r({ id: 'rey-angel-jorge', nombre: "Jorge Emilio Rey Ángel", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [], territorial: { gobernador: ['Cundinamarca'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Guainía 2016–2019
  r({ id: 'zapata-parrado-javier', nombre: "Javier Eliecer Zapata Parrado", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Guainía'] }, decadas: ['2010s'] }),
  // gobernador Guaviare 2016–2019
  r({ id: 'echeverry-cadavid-nebio', nombre: "Nebio De Jesús Echeverry Cadavid", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Guaviare'] }, decadas: ['2010s'] }),
  // gobernador Huila 2016–2019 · nacimiento: Bogotá, Colombia
  r({ id: 'gonzalez-villa-carlos', nombre: "Carlos Julio González Villa", genero: 'Masculino', region: 'Bogotá', partidos: ['Cambio Radical'], territorial: { gobernador: ['Huila'] }, decadas: ['2010s'] }),
  // gobernador La Guajira 2016–2019 · nacimiento: Albania, La Guajira, Colombia
  r({ id: 'pinto-perez-oneida', nombre: "Oneida Rayeth Pinto Pérez", genero: 'Femenino', region: 'Caribe', partidos: ['Cambio Radical'], territorial: { gobernador: ['La Guajira'] }, decadas: ['2010s'] }),
  // gobernador Magdalena 2016–2019 · nacimiento: Santa Marta, Magdalena
  r({ id: 'cotes-zuniga-rosa', nombre: "Rosa Cotes de Zúñiga", genero: 'Femenino', region: 'Caribe', partidos: ['Cambio Radical'], territorial: { gobernador: ['Magdalena'] }, decadas: ['2010s'] }),
  // gobernador Meta 2016–2019 · nacimiento: Villavicencio, Meta, Colombia
  r({ id: 'amaya-garcia-claudia', nombre: "Claudia Marcela Amaya García", genero: 'Femenino', region: 'Llanos/Amazonía', partidos: [], territorial: { gobernador: ['Meta'] }, decadas: ['2010s'] }),
  // gobernador Norte de Santander 2016–2019; gobernador Norte de Santander 2024–2027 · nacimiento: Arboledas, Norte de Santander, Colombia
  r({ id: 'villamizar-laguado-william', nombre: "William Villamizar Laguado", genero: 'Masculino', region: 'Santanderes', partidos: [], territorial: { gobernador: ['Norte de Santander'] }, decadas: ['2010s', '2020s'] }),
  // gobernador Putumayo 2016–2019
  r({ id: 'aroca-rodriguez-sorrel', nombre: "Sorrel Parisa Aroca Rodríguez", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Putumayo'] }, decadas: ['2010s'] }),
  // gobernador Quindío 2016–2019
  r({ id: 'osorio-buritica-carlos', nombre: "Carlos Eduardo Osorio Buritica", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Quindío'] }, decadas: ['2010s'] }),
  // gobernador Risaralda 2016–2019
  r({ id: 'salazar-osorio-sigifredo', nombre: "Sigifredo Salazar Osorio", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { gobernador: ['Risaralda'] }, decadas: ['2010s'] }),
  // gobernador San Andrés y Providencia 2016–2019
  r({ id: 'housni-jaller-ronald', nombre: "Ronald Housni Jaller", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['San Andrés y Providencia'] }, decadas: ['2010s'] }),
  // gobernador Santander 2016–2019
  r({ id: 'tavera-amado-didier', nombre: "Didier Alberto Tavera Amado", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Santander'] }, decadas: ['2010s'] }),
  // gobernador Sucre 2016–2019
  r({ id: 'martinez-romero-edgar', nombre: "Edgar Enrique Martínez Romero", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { gobernador: ['Sucre'] }, decadas: ['2010s'] }),
  // gobernador Tolima 2016–2019
  r({ id: 'barreto-quiroga-oscar', nombre: "Óscar Barreto Quiroga", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { gobernador: ['Tolima'] }, decadas: ['2010s'] }),
  // gobernador Vaupés 2016–2019
  r({ id: 'maria-vasquez-jesus', nombre: "Jesús María Vásquez", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { gobernador: ['Vaupés'] }, decadas: ['2010s'] }),
  // gobernador Vichada 2016–2019
  r({ id: 'alvarez-morales-luis', nombre: "Luis Carlos Álvarez Morales", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Vichada'] }, decadas: ['2010s'] }),
  // alcalde Arauca 2016–2019
  r({ id: 'socadagui-cermeno-benjamin', nombre: "Benjamín Socadagui Cermeño", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Arauca'] }, decadas: ['2010s'] }),
  // alcalde Armenia 2016–2019 · nacimiento: Armenia, Colombia
  r({ id: 'alvarez-morales-carlos', nombre: "Carlos Mario Álvarez Morales", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido Liberal'], territorial: { alcalde: ['Armenia'] }, decadas: ['2010s'] }),
  // alcalde Cali 2016–2019 · nacimiento: Cali, Colombia
  r({ id: 'armitage-cadavid-norman', nombre: "Norman Armitage Cadavid", genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Creemos'], territorial: { alcalde: ['Cali'] }, decadas: ['2010s'] }),
  // alcalde Cartagena 2016–2019 · nacimiento: Cartagena de Indias, Colombia
  r({ id: 'vicente-duque-manuel', nombre: "Manuel Vicente Duque", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { alcalde: ['Cartagena'] }, decadas: ['2010s'] }),
  // alcalde Cúcuta 2016–2019
  r({ id: 'rojas-ayala-cesar', nombre: "César Omar Rojas Ayala", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Cúcuta'] }, decadas: ['2010s'] }),
  // alcalde Florencia 2016–2019
  r({ id: 'perdomo-lara-andres', nombre: "Andrés Mauricio Perdomo Lara", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { alcalde: ['Florencia'] }, decadas: ['2010s'] }),
  // alcalde Ibagué 2016–2019 · nacimiento: Líbano, Tolima, Colombia
  r({ id: 'alfonso-jaramillo-guillermo', nombre: "Guillermo Alfonso Jaramillo", genero: 'Masculino', region: 'Tolima/Huila', partidos: ['MAIS'], territorial: { alcalde: ['Ibagué'] }, decadas: ['2010s'] }),
  // alcalde Inírida 2016–2019
  r({ id: 'puentes-garzon-camilo', nombre: "Camilo Andrés Puentes Garzon", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Inírida'] }, decadas: ['2010s'] }),
  // alcalde Leticia 2016–2019
  r({ id: 'araujo-nieto-jose', nombre: "José Huber Araujo Nieto", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { alcalde: ['Leticia'] }, decadas: ['2010s'] }),
  // alcalde Mitú 2016–2019
  r({ id: 'bernal-cordoba-daniel', nombre: "Daniel Bernal Córdoba", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Mitú'] }, decadas: ['2010s'] }),
  // alcalde Mocoa 2016–2019
  r({ id: 'castro-melendez-jose', nombre: "José Antonio Castro Meléndez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Mocoa'] }, decadas: ['2010s'] }),
  // alcalde Neiva 2016–2019 · nacimiento: Neiva, Huila, Colombia
  r({ id: 'lara-sanchez-rodrigo', nombre: "Rodrigo Lara Sánchez", genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Alianza Verde'], territorial: { alcalde: ['Neiva'] }, decadas: ['2010s'] }),
  // alcalde Popayán 2016–2019
  r({ id: 'gomez-castro-cesar', nombre: "César Cristian Gómez Castro", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { alcalde: ['Popayán'] }, decadas: ['2010s'] }),
  // alcalde Puerto Carreño 2016–2019
  r({ id: 'perez-jimenez-marcos', nombre: "Marcos Pérez Jiménez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { alcalde: ['Puerto Carreño'] }, decadas: ['2010s'] }),
  // alcalde Quibdó 2016–2019
  r({ id: 'chala-ibarguen-isaias', nombre: "Isaías Chala Ibarguen", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Quibdó'] }, decadas: ['2010s'] }),
  // alcalde Riohacha 2016–2019
  r({ id: 'velasquez-rivadeneira-fabio', nombre: "Fabio David Velásquez Rivadeneira", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Riohacha'] }, decadas: ['2010s'] }),
  // alcalde Pasto 2016–2019 · nacimiento: San Juan de Pasto, Colombia
  r({ id: 'obando-ordonez-pedro', nombre: "Pedro Vicente Obando Ordóñez", genero: 'Masculino', region: 'Cauca/Nariño', partidos: [], territorial: { alcalde: ['Pasto'] }, decadas: ['2010s'] }),
  // alcalde San José del Guaviare 2016–2019
  r({ id: 'rivera-roldan-efrain', nombre: "Efraín Rivera Roldán", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['San José del Guaviare'] }, decadas: ['2010s'] }),
  // alcalde Santa Marta 2016–2019; gobernador Magdalena 2024–2027 · nacimiento: Guamal, Colombia
  r({ id: 'alejandro-martinez-rafael', nombre: "Rafael Alejandro Martínez", genero: 'Masculino', region: 'Sin dato', partidos: ['Fuerza Ciudadana'], territorial: { gobernador: ['Magdalena'], alcalde: ['Santa Marta'] }, decadas: ['2010s', '2020s'] }),
  // alcalde Sincelejo 2016–2019
  r({ id: 'quessep-espinosa-jacobo', nombre: "Jacobo Quessep Espinosa", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Sincelejo'] }, decadas: ['2010s'] }),
  // alcalde Tunja 2016–2019
  r({ id: 'cepeda-novoa-pablo', nombre: "Pablo Cepeda Novoa", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Tunja'] }, decadas: ['2010s'] }),
  // alcalde Valledupar 2016–2019 · nacimiento: Valledupar, Cesar
  r({ id: 'ramirez-uhia-augusto', nombre: "Augusto Ramírez Uhía", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { alcalde: ['Valledupar'] }, decadas: ['2010s'] }),
  // alcalde Villavicencio 2016–2019
  r({ id: 'barbosa-rozo-wilmar', nombre: "Wilmar Orlando Barbosa Rozo", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['Villavicencio'] }, decadas: ['2010s'] }),
  // alcalde Yopal 2016–2019
  r({ id: 'torres-torres-jhon', nombre: "Jhon Jairo Torres Torres", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Yopal'] }, decadas: ['2010s'] }),
  // gobernador Amazonas 2020–2023 · nacimiento: Leticia, Comisaría del Amazonas, República de Colombia
  r({ id: 'galindo-cedeno-jesus', nombre: "Jesús Galindo Cedeño", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: [], territorial: { gobernador: ['Amazonas'] }, decadas: ['2020s'] }),
  // gobernador Bolívar 2020–2023 · nacimiento: Cartagena de Indias, Colombia
  r({ id: 'blel-scaff-vicente', nombre: "Vicente Antonio Blel Scaff", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['Bolívar'] }, decadas: ['2020s'] }),
  // gobernador Boyacá 2020–2023 · nacimiento: Nobsa, Departamento de Boyacá, República de Colombia
  r({ id: 'barragan-adame-ramiro', nombre: "Ramiro Barragán Adame", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [], territorial: { gobernador: ['Boyacá'] }, decadas: ['2020s'] }),
  // gobernador Caldas 2020–2023
  r({ id: 'velasquez-cardona-luis', nombre: "Luis Carlos Velásquez Cardona", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Caldas'] }, decadas: ['2020s'] }),
  // gobernador Caquetá 2020–2023 · nacimiento: Puerto Milán, Caquetá, Colombia
  r({ id: 'gasca-trujillo-arnulfo', nombre: "Arnulfo Gasca Trujillo", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Partido Conservador'], territorial: { gobernador: ['Caquetá'] }, decadas: ['2020s'] }),
  // gobernador Casanare 2020–2023 · nacimiento: Aguazul, Intendencia del Casanare, República de Colombia
  r({ id: 'sanabria-chacon-salomon', nombre: "Salomón Andrés Sanabria Chacón", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Centro Democrático'], territorial: { gobernador: ['Casanare'] }, decadas: ['2020s'] }),
  // gobernador Cauca 2020–2023 · nacimiento: Buenos Aires, Cauca, Colombia
  r({ id: 'larrahondo-carabali-elias', nombre: "Elías Larrahondo Carabalí", genero: 'Masculino', region: 'Cauca/Nariño', partidos: [], territorial: { gobernador: ['Cauca'] }, decadas: ['2020s'] }),
  // gobernador Chocó 2020–2023 · nacimiento: Bojayá, Departamento de Chocó, República de Colombia
  r({ id: 'palacios-calderon-ariel', nombre: "Ariel Palacios Calderón", genero: 'Masculino', region: 'Pacífico/Chocó', partidos: [], territorial: { gobernador: ['Chocó'] }, decadas: ['2020s'] }),
  // gobernador Córdoba 2020–2023 · nacimiento: Valencia, Córdoba, Colombia
  r({ id: 'benitez-mora-orlando', nombre: "Orlando David Benítez Mora", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['Córdoba'] }, decadas: ['2020s'] }),
  // gobernador Cundinamarca 2020–2023 · nacimiento: Mosquera, Cundinamarca, Colombia
  r({ id: 'garcia-bustos-nicolas', nombre: "Nicolás García Bustos", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [], territorial: { gobernador: ['Cundinamarca'] }, decadas: ['2020s'] }),
  // gobernador Guainía 2020–2023 · nacimiento: Puerto López, Departamento de Meta, República de Colombia
  r({ id: 'iral-gomez-juan', nombre: "Juan Carlos Iral Gómez", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Partido de la U'], territorial: { gobernador: ['Guainía'] }, decadas: ['2020s'] }),
  // gobernador Guaviare 2020–2023 · nacimiento: El Retorno, Comisaría del Guaviare, República de Colombia
  r({ id: 'palacio-salazar-heydeer', nombre: "Heydeer Yovanny Palacio Salazar", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: [], territorial: { gobernador: ['Guaviare'] }, decadas: ['2020s'] }),
  // gobernador Huila 2020–2023 · nacimiento: Campoalegre, Departamento de Huila, República de Colombia
  r({ id: 'dussan-lopez-luis', nombre: "Luis Enrique Dussán López", genero: 'Masculino', region: 'Tolima/Huila', partidos: [], territorial: { gobernador: ['Huila'] }, decadas: ['2020s'] }),
  // gobernador La Guajira 2020–2023 · nacimiento: Riohacha, La Guajira, Colombia
  r({ id: 'roys-garzon-nemesio', nombre: "Nemesio Raúl Roys Garzón", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['La Guajira'] }, decadas: ['2020s'] }),
  // gobernador Nariño 2020–2023
  r({ id: 'alexander-rojas-jhon', nombre: "Jhon Alexander Rojas", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Nariño'] }, decadas: ['2020s'] }),
  // gobernador Norte de Santander 2020–2023 · nacimiento: Villa Caro, Departamento de Norte de Santander, República de Colombia
  r({ id: 'serrano-guerrero-silvano', nombre: "Silvano Serrano Guerrero", genero: 'Masculino', region: 'Santanderes', partidos: [], territorial: { gobernador: ['Norte de Santander'] }, decadas: ['2020s'] }),
  // gobernador Putumayo 2020–2023 · nacimiento: Puerto Caicedo, Intendencia del Putumayo, República de Colombia
  r({ id: 'rosero-buanerges', nombre: "Buanerges Rosero", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: [], territorial: { gobernador: ['Putumayo'] }, decadas: ['2020s'] }),
  // gobernador Quindío 2020–2023 · nacimiento: Armenia, Quindio, Colombia
  r({ id: 'jaramillo-cardenas-roberto', nombre: "Roberto Jairo Jaramillo Cárdenas", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], territorial: { gobernador: ['Quindío'] }, decadas: ['2020s'] }),
  // gobernador Risaralda 2020–2023 · nacimiento: Santa Rosa de Cabal, Departamento del Viejo Caldas, República de Colombia
  r({ id: 'manuel-tamayo-victor', nombre: "Víctor Manuel Tamayo", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], territorial: { gobernador: ['Risaralda'] }, decadas: ['2020s'] }),
  // gobernador San Andrés y Providencia 2020–2023 · nacimiento: San Andrés, Intendencia de San Andrés y Providencia, República de Colombia
  r({ id: 'hawkins-sjogreen-everth', nombre: "Everth Julío Hawkins Sjogreen", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['San Andrés y Providencia'] }, decadas: ['2020s'] }),
  // gobernador Santander 2020–2023 · nacimiento: Bogotá, Colombia
  r({ id: 'aguilar-hurtado-nerthink', nombre: "Nerthink Mauricio Aguilar Hurtado", genero: 'Masculino', region: 'Bogotá', partidos: [], territorial: { gobernador: ['Santander'] }, decadas: ['2020s'] }),
  // gobernador Sucre 2020–2023 · nacimiento: Sincé, Sucre, Colombia
  r({ id: 'olimpo-espinosa-hector', nombre: "Héctor Olimpo Espinosa", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], territorial: { gobernador: ['Sucre'] }, decadas: ['2020s'] }),
  // gobernador Tolima 2020–2023 · nacimiento: Ibagué, Tolima, Colombia
  r({ id: 'orozco-valero-jose', nombre: "José Ricardo Orozco Valero", genero: 'Masculino', region: 'Tolima/Huila', partidos: [], territorial: { gobernador: ['Tolima'] }, decadas: ['2020s'] }),
  // gobernador Valle del Cauca 2020–2023 · nacimiento: Medellín, Colombia
  r({ id: 'luz-roldan-clara', nombre: "Clara Luz Roldán", genero: 'Femenino', region: 'Antioquia', partidos: [], territorial: { gobernador: ['Valle del Cauca'] }, decadas: ['2020s'] }),
  // gobernador Vaupés 2020–2023 · nacimiento: Pereira, Viejo Caldas, República de Colombia
  r({ id: 'perez-eliecer', nombre: "Eliécer Pérez", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Centro Democrático'], territorial: { gobernador: ['Vaupés'] }, decadas: ['2020s'] }),
  // gobernador Vichada 2020–2023 · nacimiento: Cumaribo, Comisaría del Vichada, República de Colombia
  r({ id: 'arley-leon-alvaro', nombre: "Álvaro Arley León", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: [], territorial: { gobernador: ['Vichada'] }, decadas: ['2020s'] }),
  // alcalde Leticia 2020–2023
  r({ id: 'mendoza-munoz-jorge', nombre: "Jorge Luis Mendoza Muñoz", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { alcalde: ['Leticia'] }, decadas: ['2020s'] }),
  // alcalde Arauca 2020–2023
  r({ id: 'tovar-pedraza-edgar', nombre: "Edgar Fernando Tovar Pedraza", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { alcalde: ['Arauca'] }, decadas: ['2020s'] }),
  // alcalde Barranquilla 2020–2023 · nacimiento: Barranquilla, Colombia
  r({ id: 'pumarejo-heins-jaime', nombre: "Jaime Alberto Pumarejo Heins", genero: 'Masculino', region: 'Caribe', partidos: ['Cambio Radical'], territorial: { alcalde: ['Barranquilla'] }, decadas: ['2020s'] }),
  // alcalde Cartagena 2020–2023 · nacimiento: Cartagena, Colombia
  r({ id: 'dau-chamat-william', nombre: "William Jorge Dau Chamat", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { alcalde: ['Cartagena'] }, decadas: ['2020s'] }),
  // alcalde Tunja 2020–2023
  r({ id: 'funeme-gonzalez-luis', nombre: "Luis Alejandro Fúneme González", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Tunja'] }, decadas: ['2020s'] }),
  // alcalde Manizales 2020–2023
  r({ id: 'marin-correa-carlos', nombre: "Carlos Mario Marín Correa", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Manizales'] }, decadas: ['2020s'] }),
  // alcalde Florencia 2020–2023
  r({ id: 'ruiz-cicery-luis', nombre: "Luis Antonio Ruiz Cicery", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Florencia'] }, decadas: ['2020s'] }),
  // alcalde Yopal 2020–2023
  r({ id: 'eduardo-castro-luis', nombre: "Luis Eduardo Castro", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { alcalde: ['Yopal'] }, decadas: ['2020s'] }),
  // alcalde Popayán 2020–2023
  r({ id: 'lopez-castrillon-juan', nombre: "Juan Carlos López Castrillón", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Popayán'] }, decadas: ['2020s'] }),
  // alcalde Valledupar 2020–2023 · nacimiento: Valledupar, Cesar
  r({ id: 'castro-gonzalez-mello', nombre: "Mello Castro González", genero: 'Masculino', region: 'Caribe', partidos: ['Partido de la U'], territorial: { alcalde: ['Valledupar'] }, decadas: ['2020s'] }),
  // alcalde Quibdó 2020–2023
  r({ id: 'sanchez-valencia-martin', nombre: "Martín Emilio Sánchez Valencia", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Quibdó'] }, decadas: ['2020s'] }),
  // alcalde Montería 2020–2023
  r({ id: 'ordosgoitia-sanin-carlos', nombre: "Carlos Alberto Ordosgoitia Sanin", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Montería'] }, decadas: ['2020s'] }),
  // alcalde Inírida 2020–2023
  r({ id: 'acosta-yuvabe-pablo', nombre: "Pablo Willan Acosta Yuvabe", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Inírida'] }, decadas: ['2020s'] }),
  // alcalde San José del Guaviare 2020–2023
  r({ id: 'guevara-gomez-ramon', nombre: "Ramón Guevara Gómez", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { alcalde: ['San José del Guaviare'] }, decadas: ['2020s'] }),
  // alcalde Neiva 2020–2023
  r({ id: 'munoz-calderon-gorky', nombre: "Gorky Muñoz Calderón", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Neiva'] }, decadas: ['2020s'] }),
  // alcalde Riohacha 2020–2023
  r({ id: 'bermudez-cotes-jose', nombre: "José Ramiro Bermúdez Cotes", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Riohacha'] }, decadas: ['2020s'] }),
  // alcalde Santa Marta 2020–2023 · nacimiento: Santa Marta, Colombia
  r({ id: 'johnson-salcedo-virna', nombre: "Virna Lizi Johnson Salcedo", genero: 'Femenino', region: 'Caribe', partidos: ['Fuerza Ciudadana'], territorial: { alcalde: ['Santa Marta'] }, decadas: ['2020s'] }),
  // alcalde Villavicencio 2020–2023
  r({ id: 'harman-ortiz-juan', nombre: "Juan Felipe Harman Ortiz", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Villavicencio'] }, decadas: ['2020s'] }),
  // alcalde Pasto 2020–2023
  r({ id: 'chamorro-rosa-german', nombre: "Germán Chamorro de la Rosa", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Pasto'] }, decadas: ['2020s'] }),
  // alcalde Cúcuta 2020–2023
  r({ id: 'yanez-rodriguez-jairo', nombre: "Jairo Tomas Yáñez Rodríguez", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Cúcuta'] }, decadas: ['2020s'] }),
  // alcalde Mocoa 2020–2023
  r({ id: 'imbachi-lopez-jhon', nombre: "Jhon Jairo Imbachi López", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Mocoa'] }, decadas: ['2020s'] }),
  // alcalde Armenia 2020–2023 · nacimiento: Armenia, Colombia
  r({ id: 'rios-morales-jose', nombre: "José Manuel Ríos Morales", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['MAIS'], territorial: { alcalde: ['Armenia'] }, decadas: ['2020s'] }),
  // alcalde Pereira 2020–2023 · nacimiento: Pereira, Colombia
  r({ id: 'maya-lopez-carlos', nombre: "Carlos Alberto Maya López", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], territorial: { alcalde: ['Pereira'] }, decadas: ['2020s'] }),
  // alcalde Bucaramanga 2020–2023 · nacimiento: 
  r({ id: 'cardenas-rey-juan', nombre: "Juan Carlos Cárdenas Rey", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Bucaramanga'] }, decadas: ['2020s'] }),
  // alcalde Sincelejo 2020–2023
  r({ id: 'gomez-martinez-andres', nombre: "Andrés Eduardo Gómez Martínez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Sincelejo'] }, decadas: ['2020s'] }),
  // alcalde Ibagué 2020–2023
  r({ id: 'hurtado-barrera-andres', nombre: "Andrés Fabián Hurtado Barrera", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { alcalde: ['Ibagué'] }, decadas: ['2020s'] }),
  // alcalde Mitú 2020–2023
  r({ id: 'penagos-celis-carlos', nombre: "Carlos Enrique Penagos Celis", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Mitú'] }, decadas: ['2020s'] }),
  // alcalde Puerto Carreño 2020–2023
  r({ id: 'beltran-hinojosa-jair', nombre: "Jair Esteban Beltrán Hinojosa", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Puerto Carreño'] }, decadas: ['2020s'] }),
  // gobernador Amazonas 2024–2027
  r({ id: 'sanchez-guerrero-oscar', nombre: "Oscar Enrique Sánchez Guerrero", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Amazonas'] }, decadas: ['2020s'] }),
  // gobernador Antioquia 2024–2027 · nacimiento: Rionegro, Antioquia, Colombia
  r({ id: 'rendon-cardona-andres', nombre: "Andrés Julián Rendón Cardona", genero: 'Masculino', region: 'Antioquia', partidos: [], territorial: { gobernador: ['Antioquia'] }, decadas: ['2020s'] }),
  // gobernador Arauca 2024–2027
  r({ id: 'martinez-prada-renson', nombre: "Renson Jesús Martínez Prada", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Arauca'] }, decadas: ['2020s'] }),
  // gobernador Bolívar 2024–2027
  r({ id: 'arana-padaui-yamil', nombre: "Yamil Hernando Arana Padaui", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Bolívar'] }, decadas: ['2020s'] }),
  // gobernador Caldas 2024–2027
  r({ id: 'gutierrez-angel-henry', nombre: "Henry Gutiérrez Ángel", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Caldas'] }, decadas: ['2020s'] }),
  // gobernador Caquetá 2024–2027
  r({ id: 'ruiz-aguilar-luis', nombre: "Luis Francisco Ruiz Aguilar", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Caquetá'] }, decadas: ['2020s'] }),
  // gobernador Casanare 2024–2027
  r({ id: 'ortiz-zorro-cesar', nombre: "Cesar Augusto Ortiz Zorro", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Casanare'] }, decadas: ['2020s'] }),
  // gobernador Cauca 2024–2027 · nacimiento: La Vega, Cauca, Colombia
  r({ id: 'guzman-gutierrez-jorge', nombre: "Jorge Octavio Guzmán Gutiérrez", genero: 'Masculino', region: 'Cauca/Nariño', partidos: [], territorial: { gobernador: ['Cauca'] }, decadas: ['2020s'] }),
  // gobernador Cesar 2024–2027
  r({ id: 'sanjuan-davila-elvia', nombre: "Elvia Milena Sanjuan Dávila", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Cesar'] }, decadas: ['2020s'] }),
  // gobernador Chocó 2024–2027
  r({ id: 'cordoba-curi-nubia', nombre: "Nubia Carolina Córdoba Curí", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Chocó'] }, decadas: ['2020s'] }),
  // gobernador Córdoba 2024–2027 · nacimiento: Montería, Córdoba, Colombia
  r({ id: 'zuleta-bechara-erasmo', nombre: "Erasmo Elías Zuleta Bechara", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['Córdoba'] }, decadas: ['2020s'] }),
  // gobernador Guainía 2024–2027
  r({ id: 'rivera-naranjo-arnulfo', nombre: "Arnulfo Rivera Naranjo", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Guainía'] }, decadas: ['2020s'] }),
  // gobernador Guaviare 2024–2027
  r({ id: 'rojas-martinez-yeison', nombre: "Yeison Ferney Rojas Martínez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Guaviare'] }, decadas: ['2020s'] }),
  // gobernador Huila 2024–2027 · nacimiento: Rivera, Huila, Colombia
  r({ id: 'villalba-mosquera-rodrigo', nombre: "Rodrigo Villalba Mosquera", genero: 'Masculino', region: 'Tolima/Huila', partidos: [], territorial: { gobernador: ['Huila'] }, decadas: ['2020s'] }),
  // gobernador La Guajira 2024–2027 · nacimiento: Riohacha, La Guajira, Colombia
  r({ id: 'aguilar-deluque-jairo', nombre: "Jairo Alfonso Aguilar Deluque", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { gobernador: ['La Guajira'] }, decadas: ['2020s'] }),
  // gobernador Meta 2024–2027
  r({ id: 'cortes-zambrano-rafaela', nombre: "Rafaela Cortes Zambrano", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Meta'] }, decadas: ['2020s'] }),
  // gobernador Nariño 2024–2027
  r({ id: 'escobar-jaramillo-luis', nombre: "Luis Alfonso Escobar Jaramillo", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { gobernador: ['Nariño'] }, decadas: ['2020s'] }),
  // gobernador Putumayo 2024–2027
  r({ id: 'marroquin-luna-carlos', nombre: "Carlos Andrés Marroquín Luna", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Putumayo'] }, decadas: ['2020s'] }),
  // gobernador Quindío 2024–2027 · nacimiento: Armenia, Quindío, Colombia
  r({ id: 'galvis-bedoya-juan', nombre: "Juan Miguel Galvis Bedoya", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Creemos'], territorial: { gobernador: ['Quindío'] }, decadas: ['2020s'] }),
  // gobernador Risaralda 2024–2027
  r({ id: 'patino-ochoa-juan', nombre: "Juan Diego Patiño Ochoa", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { gobernador: ['Risaralda'] }, decadas: ['2020s'] }),
  // gobernador San Andrés y Providencia 2024–2027
  r({ id: 'gallardo-vasquez-nicolas', nombre: "Nicolas Iván Gallardo Vásquez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['San Andrés y Providencia'] }, decadas: ['2020s'] }),
  // gobernador Santander 2024–2027
  r({ id: 'diaz-mateus-juvenal', nombre: "Juvenal Díaz Mateus", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Santander'] }, decadas: ['2020s'] }),
  // gobernador Sucre 2024–2027
  r({ id: 'garcia-montes-lucy', nombre: "Lucy Inés García Montes", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Sucre'] }, decadas: ['2020s'] }),
  // gobernador Tolima 2024–2027 · nacimiento: —
  r({ id: 'matiz-vargas-adriana', nombre: "Adriana Magali Matiz Vargas", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Tolima'] }, decadas: ['2020s'] }),
  // gobernador Vaupés 2024–2027
  r({ id: 'gutierrez-garcia-luis', nombre: "Luis Alfredo Gutiérrez García", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { gobernador: ['Vaupés'] }, decadas: ['2020s'] }),
  // gobernador Vichada 2024–2027
  r({ id: 'benito-castro-hecson', nombre: "Hecson Alexys Benito Castro", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { gobernador: ['Vichada'] }, decadas: ['2020s'] }),
  // alcalde Leticia 2024–2027
  r({ id: 'uni-heredia-elkin', nombre: "Elkín Jadrian Uni Heredia", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Leticia'] }, decadas: ['2020s'] }),
  // alcalde Arauca 2024–2027
  r({ id: 'quenza-ramos-juan', nombre: "Juan Alfredo Quenza Ramos", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Arauca'] }, decadas: ['2020s'] }),
  // alcalde Tunja 2024–2027
  r({ id: 'krasnov-mikhail', nombre: "Mikhail Krasnov", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Tunja'] }, decadas: ['2020s'] }),
  // alcalde Florencia 2024–2027
  r({ id: 'monsalve-ascanioe-marlon', nombre: "Marlon Monsalve Ascanioe", genero: 'Masculino', region: 'Sin dato', partidos: ['Nuevo Liberalismo'], territorial: { alcalde: ['Florencia'] }, decadas: ['2020s'] }),
  // alcalde Yopal 2024–2027 · nacimiento: Ventaquemada, Boyacá, Colombia
  r({ id: 'ruiz-riano-marco', nombre: "Marco Tulio Ruiz Riaño", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: ['Cambio Radical'], territorial: { alcalde: ['Yopal'] }, decadas: ['2020s'] }),
  // alcalde Popayán 2024–2027
  r({ id: 'munoz-bravo-juan', nombre: "Juan Carlos Muñoz Bravo", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Popayán'] }, decadas: ['2020s'] }),
  // alcalde Valledupar 2024–2027
  r({ id: 'orozco-duran-ernesto', nombre: "Ernesto Miguel Orozco Durán", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Valledupar'] }, decadas: ['2020s'] }),
  // alcalde Quibdó 2024–2027
  r({ id: 'bolanos-pino-rafael', nombre: "Rafael Andrés Bolaños Pino", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Quibdó'] }, decadas: ['2020s'] }),
  // alcalde Montería 2024–2027
  r({ id: 'kerguelen-garcia-hugo', nombre: "Hugo Fernando Kerguelen García", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Montería'] }, decadas: ['2020s'] }),
  // alcalde Inírida 2024–2027
  r({ id: 'sanchez-arturo', nombre: "Arturo Sánchez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Inírida'] }, decadas: ['2020s'] }),
  // alcalde San José del Guaviare 2024–2027
  r({ id: 'alejandro-rodriguez-willy', nombre: "Willy Alejandro Rodríguez", genero: 'Masculino', region: 'Sin dato', partidos: ['Nuevo Liberalismo'], territorial: { alcalde: ['San José del Guaviare'] }, decadas: ['2020s'] }),
  // alcalde Neiva 2024–2027
  r({ id: 'casagua-bonilla-german', nombre: "Germán Casagua Bonilla", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Neiva'] }, decadas: ['2020s'] }),
  // alcalde Riohacha 2024–2027
  r({ id: 'david-redondo-genaro', nombre: "Genaro David Redondo", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Riohacha'] }, decadas: ['2020s'] }),
  // alcalde Santa Marta 2024–2027
  r({ id: 'pinedo-cuello-carlos', nombre: "Carlos Pinedo Cuello", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Santa Marta'] }, decadas: ['2020s'] }),
  // alcalde Villavicencio 2024–2027
  r({ id: 'baquero-sanabria-alexander', nombre: "Alexander Baquero Sanabria", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Villavicencio'] }, decadas: ['2020s'] }),
  // alcalde Pasto 2024–2027
  r({ id: 'toro-nicolas', nombre: "Nicolás Toro", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Pasto'] }, decadas: ['2020s'] }),
  // alcalde Cúcuta 2024–2027
  r({ id: 'acevedo-penaloza-jorge', nombre: "Jorge Enrique Acevedo Peñaloza", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Cúcuta'] }, decadas: ['2020s'] }),
  // alcalde Mocoa 2024–2027
  r({ id: 'pedrahita-perez-carlos', nombre: "Carlos Hugo Pedrahita Pérez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Mocoa'] }, decadas: ['2020s'] }),
  // alcalde Armenia 2024–2027 · nacimiento: Armenia, Colombia
  r({ id: 'padilla-garcia-james', nombre: "James Padilla García", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], territorial: { alcalde: ['Armenia'] }, decadas: ['2020s'] }),
  // alcalde Pereira 2024–2027 · nacimiento: —
  r({ id: 'salazar-pelaez-mauricio', nombre: "Mauricio Salazar Peláez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Pereira'] }, decadas: ['2020s'] }),
  // alcalde Bucaramanga 2024–2027 · nacimiento: Bucaramanga
  r({ id: 'andres-beltran-jaime', nombre: "Jaime Andrés Beltrán", genero: 'Masculino', region: 'Santanderes', partidos: [], territorial: { alcalde: ['Bucaramanga'] }, decadas: ['2020s'] }),
  // alcalde Sincelejo 2024–2027
  r({ id: 'acuna-cardales-yahir', nombre: "Yahir Fernando Acuña Cardales", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Sincelejo'] }, decadas: ['2020s'] }),
  // alcalde Ibagué 2024–2027 · nacimiento: Ibagué, Tolima, Colombia
  r({ id: 'aranda-rivera-johana', nombre: "Johana Ximena Aranda Rivera", genero: 'Femenino', region: 'Tolima/Huila', partidos: [], territorial: { alcalde: ['Ibagué'] }, decadas: ['2020s'] }),
  // alcalde Cali 2024–2027 · nacimiento: Washington D.C., Estados Unidos
  r({ id: 'eder-alejandro', nombre: "Alejandro Eder", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { alcalde: ['Cali'] }, decadas: ['2020s'] }),
  // alcalde Mitú 2024–2027
  r({ id: 'porras-perez-marco', nombre: "Marco Alirio Porras Pérez", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { alcalde: ['Mitú'] }, decadas: ['2020s'] }),
  // alcalde Puerto Carreño 2024–2027
  r({ id: 'rodriguez-guzman-jaime', nombre: "Jaime Ariel Rodríguez Guzmán", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { alcalde: ['Puerto Carreño'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'triana-vargas-julian', nombre: "Julian Felipe Triana Vargas", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'arias-rubio-edward', nombre: "Edward Aníbal Arias Rubio", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'garcia-vargas-andres', nombre: "Andrés Ernesto García Vargas", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'rodriguez-sastoque-julian', nombre: "Julián David Rodríguez Sastoque", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027 · nacimiento: Toledo (Norte de Santander)
  r({ id: 'castellanos-serrano-andres', nombre: "Andres Leandro Castellanos Serrano", genero: 'Masculino', region: 'Santanderes', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'name-ramirez-maria', nombre: "María Clara Name Ramírez", genero: 'Femenino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'onzaga-nino-andres', nombre: "Andrés Darío Onzaga Niño", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'espinosa-ortiz-julian', nombre: "Julián Espinosa Ortiz", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'baena-merlano-juan', nombre: "Juan Javier Baena Merlano", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'diaz-martinez-juan', nombre: "Juan Manuel Díaz Martínez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'araque-mejia-jesus', nombre: "Jesús David Araque Mejía", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'correa-mojica-ricardo', nombre: "Ricardo Andrés Correa Mojica", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'calderon-restrepo-cristina', nombre: "Cristina Calderón Restrepo", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'quintero-rubio-juan', nombre: "Juan David Quintero Rubio", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'lopez-gutierrez-fernando', nombre: "Fernando López Gutiérrez", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'saavedra-murcia-david', nombre: "David Hernando Saavedra Murcia", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023 · nacimiento: Bogotá, Colombia
  r({ id: 'sanchez-barreto-heidy', nombre: "Heidy Lorena Sánchez Barreto", genero: 'Femenino', region: 'Bogotá', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'bernal-montanez-ana', nombre: "Ana Teresa Bernal Montañez", genero: 'Femenino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'dussan-perez-rocio', nombre: "Rocío Dussan Pérez", genero: 'Femenino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'bastidas-jacanamijoy-oscar', nombre: "Oscar Fernando Bastidas Jacanamijoy", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'cuesta-novoa-jose', nombre: "José del Carmén Cuesta Novoa", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'ribadeneira-mino-quena', nombre: "Quena María Ribadeneira Miño", genero: 'Femenino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027 · nacimiento: Sofía, Bulgaria
  r({ id: 'atanassova-lakimova-donka', nombre: "Donka Atanassova lakimova", genero: 'Femenino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'briceno-montes-daniel', nombre: "Daniel Felipe Briceño Montes", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'forero-ramirez-sandra', nombre: "Sandra Consuelo Forero Ramírez", genero: 'Femenino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'diago-guaqueta-diana', nombre: "Diana Marcela Diago Guaqueta", genero: 'Femenino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'ramirez-vahos-oscar', nombre: "Oscar Jaime Ramírez Vahos", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'uscategui-pastrana-julian', nombre: "Julián Uscategui Pastrana", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'amin-martelo-humberto', nombre: "Humberto Rafael Amín Martelo", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'barrios-bernal-andres', nombre: "Andrés Giovanni Barrios Bernal", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'abisambra-vesga-samir', nombre: "Samir José Abisambra Vesga", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'garcia-maya-german', nombre: "Germán Augusto García Maya", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'sandoval-moreno-clara', nombre: "Clara Lucía Sandoval Moreno", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'vargas-silva-maria', nombre: "María Victoria Vargas Silva", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'cepeda-pena-dario', nombre: "Darío Fernando Cepeda Peña", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023 · nacimiento: —
  r({ id: 'gutierrez-gonzalez-armando', nombre: "Armando de los Milagros Gutiérrez González", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'gonzalez-garcia-rolando', nombre: "Rolando Alberto González García", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023 · nacimiento: Ibagué, Colombia
  r({ id: 'puentes-sierra-fabian', nombre: "Fabián Andrés Puentes Sierra", genero: 'Masculino', region: 'Tolima/Huila', partidos: ['MIRA'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'bedoya-piraquive-samir', nombre: "Samir Bedoya Piraquive", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'torrado-pacheco-ruben', nombre: "Rubén Darío Torrado Pacheco", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'forero-castelblanco-edison', nombre: "Edison Julián Forero Castelblanco", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027
  r({ id: 'schiavenato-rivadeneira-angelo', nombre: "Angelo Schiavenato Rivadeneira", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'acosta-rico-marco', nombre: "Marco Fidel Acosta Rico", genero: 'Masculino', region: 'Sin dato', partidos: ['Colombia Justa Libres'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2024–2027; concejal Bogotá 2020–2023
  r({ id: 'rojas-castillo-emel', nombre: "Emel Rojas Castillo", genero: 'Masculino', region: 'Sin dato', partidos: ['Colombia Justa Libres'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'cancino-martinez-diego', nombre: "Diego Andrés Cancino Martínez", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'asprilla-lara-libardo', nombre: "Libardo Asprilla Lara", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'laserna-arias-diego', nombre: "Diego Guillermo Laserna Arias", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'rivera-alzate-martin', nombre: "Martín Rivera Alzate", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023 · nacimiento: Villavicencio, Colombia
  r({ id: 'rojas-mantilla-maria', nombre: "María Fernanda Rojas Mantilla", genero: 'Femenino', region: 'Llanos/Amazonía', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'leal-angarita-luis', nombre: "Luís Carlos Leal Angarita", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'bastidas-ubate-dora', nombre: "Dora Lucía Bastidas Ubaté", genero: 'Femenino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023 · nacimiento: Bogotá, Colombia.
  r({ id: 'silva-gomez-venus', nombre: "Venus Albeiro Silva Gómez", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'gordillo-salinas-luz', nombre: "Luz Marina Gordillo Salinas", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'acevedo-leguizamon-alvaro', nombre: "Álvaro Acevedo Leguizamón", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'ospina-rodriguez-javier', nombre: "Javier Alejandro Ospina Rodríguez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'colmenares-escobar-jorge', nombre: "Jorge Luís Colmenares Escobar", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'garcia-vargas-cesar', nombre: "Cesar Alfonso García Vargas", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'lopez-sierra-pedro', nombre: "Pedro Julián Lopéz Sierra", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023 · nacimiento: San Juan Nepomuceno, Bolívar, Colombia
  r({ id: 'arrieta-vuelvas-samuel', nombre: "Samuel Benjamín Arrieta Vuelvas", genero: 'Masculino', region: 'Caribe', partidos: ['Cambio Radical'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'carrillo-arenas-carlos', nombre: "Carlos Alberto Carrillo Arenas", genero: 'Masculino', region: 'Sin dato', partidos: ['Polo Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'sarmiento-arguello-manuel', nombre: "Manuel José Sarmiento Arguello", genero: 'Masculino', region: 'Sin dato', partidos: ['Polo Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'nieves-herrera-segundo', nombre: "Segundo Celio Nieves Herrera", genero: 'Masculino', region: 'Sin dato', partidos: ['Polo Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'argote-munoz-alvaro', nombre: "Álvaro José Argote Muñoz", genero: 'Masculino', region: 'Sin dato', partidos: ['Polo Democrático'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023 · nacimiento: Sierra Nevada de Santa Marta, Colombia
  r({ id: 'quigua-izquierdo-ati', nombre: "Ati Seygundiba Quigua Izquierdo", genero: 'Femenino', region: 'Caribe', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'gomez-giraldo-marisol', nombre: "Marisol Gómez Giraldo", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'grillo-carrasco-juan', nombre: "Juan Felipe Grillo Carrasco", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'diaz-martinez-gloria', nombre: "Gloria Elsy Díaz Martínez", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Bogotá 2020–2023
  r({ id: 'cubides-salazar-nelson', nombre: "Nelson Cubides Salazar", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Bogotá'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'marin-mora-jose', nombre: "José Luis Marín Mora", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'macias-betancur-farley', nombre: "Farley Jhaír Macías Betancur", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'gutierrez-bustamante-carlos', nombre: "Carlos Alberto Gutiérrez Bustamante", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'tobon-villada-andres', nombre: "Andrés Felipe Tobón Villada", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'suarez-roldan-maria', nombre: "María Paulina Suárez Roldán", genero: 'Femenino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'perdomo-montoya-santiago', nombre: "Santiago Perdomo Montoya", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'bedout-arango-alejandro', nombre: "Alejandro de Bedout Arango", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'cuesta-galvis-juan', nombre: "Juan Carlos de la Cuesta Galvis", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'perez-arroyave-damian', nombre: "Damián Pérez Arroyave", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'narvaez-lombana-santiago', nombre: "Santiago Narváez Lombana", genero: 'Masculino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'gaviria-barreneche-camila', nombre: "Camila Gaviria Barreneche", genero: 'Femenino', region: 'Sin dato', partidos: ['Creemos'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'vasco-restrepo-milton', nombre: "Milton Darío Vasco Restrepo", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'osorio-gomez-jorge', nombre: "Jorge Julián Osorio Gómez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'velez-alvarez-luis', nombre: "Luis Guillermo de Jesús Vélez Álvarez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'rodriguez-puerta-andres', nombre: "Andrés Felipe Rodríguez Puerta", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'orrego-perez-leticia', nombre: "Leticia Orrego Pérez", genero: 'Femenino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'jimenez-lara-juan', nombre: "Juan Ramón Jiménez Lara", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'arenas-suaza-brisvani', nombre: "Brisvani Alexis Arenas Suaza", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'iguaran-osorio-miguel', nombre: "Miguel Ángel Iguarán Osorio", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'hurtado-betancur-janeth', nombre: "Janeth Hurtado Betancur", genero: 'Femenino', region: 'Sin dato', partidos: ['Alianza Social Independiente'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Medellín 2024–2027
  r({ id: 'arias-garcia-alejandro', nombre: "Alejandro Arias García", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Medellín'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'radi-chemas-samir', nombre: "Samir Eduardo Radi Chemas", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'correa-maloof-rachid', nombre: "Rachid Correa Maloof", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'gutierrez-perez-estefanel', nombre: "Estefanel Gutiérrez Pérez", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'abisambra-carbonell-juan', nombre: "Juan David Abisambra Carbonell", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'trocha-gomez-jose', nombre: "José Francisco Trocha Gómez", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'arias-fernandez-santiago', nombre: "Santiago Miguel Arias Férnandez", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'henriquez-quintero-maria', nombre: "María Auxiliadora Henríquez Quintero", genero: 'Femenino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'perez-acosta-cinthya', nombre: "Cinthya Pérez Acosta", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'vergara-diaz-juan', nombre: "Juan José Vergara Díaz", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'fuentes-pumarejo-juan', nombre: "Juan Camilo Fuentes Pumarejo", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'ortiz-hernandez-andres', nombre: "Andrés Felipe Ortiz Hernández", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'camilo-jimenez-alexis', nombre: "Alexis Jesús Camilo Jiménez", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'baron-orozco-freddy', nombre: "Freddy de Jesús Barón Orozco", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'villafanez-jabba-mauricio', nombre: "Mauricio Javier Villafañez Jabba", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'galan-escalante-carlos', nombre: "Carlos Alberto Galán Escalante", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'ballesteros-sanchez-andres', nombre: "Andrés Felipe Ballesteros Sánchez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'chapman-patino-frank', nombre: "Frank Antonio Chapman Patiño", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'perez-torres-recer', nombre: "Recer Lee Pérez Torres", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico', 'Polo Democrático'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'bohorquez-collazos-antonio', nombre: "Antonio Eduardo Bohórquez Collazos", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico', 'Polo Democrático'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027; concejal Barranquilla 2020–2023
  r({ id: 'barrera-vergara-heidy', nombre: "Heidy María Barrera Vergara", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2024–2027
  r({ id: 'acuna-diaz-edgardo', nombre: "Edgardo Augusto Acuña Díaz", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'benavides-moreno-zamir', nombre: "Zamir Benavides Moreno", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'diaz-insignares-oswaldo', nombre: "Oswaldo Antonio Díaz Insignares", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'barrios-torres-leyton', nombre: "Leyton Daniel Barrios Torres", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'marino-angulo-samuel', nombre: "Samuel Elías Marino Angulo", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'hernandez-barraza-richard', nombre: "Richard Hernández Barraza", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'galan-escalante-oscar', nombre: "Oscar David Galán Escalante", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'ospino-acuna-juan', nombre: "Juan Ospino Acuña", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'crissien-ernesto', nombre: "Ernesto Crissien", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023
  r({ id: 'rengifo-lemus-andres', nombre: "Andrés Rengifo Lemus", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Barranquilla 2020–2023 · nacimiento: León, España
  r({ id: 'cesar-alvarez-julio', nombre: "Julio César Álvarez", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Barranquilla'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'arias-rueda-carlos', nombre: "Carlos Andrés Arias Rueda", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'toro-echavarria-audry', nombre: "Audry María Toro Echavarría", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'pelaez-cifuentes-henry', nombre: "Henry Peláez Cifuentes", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'fernandez-sanchez-tania', nombre: "Tania Fernández Sánchez", genero: 'Femenino', region: 'Sin dato', partidos: ['Partido de la U'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'agudelo-arevalo-james', nombre: "James Junior Agudelo Arévalo", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'pinilla-malo-carlos', nombre: "Carlos Hernando Pinilla Malo", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'arroyave-botero-fabio', nombre: "Fabio Alonso Arroyave Botero", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'andres-cubillos-marlon', nombre: "Marlon Andrés Cubillos", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Conservador'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'rojas-torres-flower', nombre: "Flower Enrique Rojas Torres", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'patino-moya-carlos', nombre: "Carlos Ariel Patiño Moya", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'salazar-sarmiento-rodrigo', nombre: "Rodrigo Salazar Sarmiento", genero: 'Masculino', region: 'Sin dato', partidos: ['Alianza Verde'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'hernandez-cedeno-alexandra', nombre: "Alexandra Hernández Cedeño", genero: 'Femenino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'lucumi-lucumi-edison', nombre: "Edison Lucumí Lucumí", genero: 'Masculino', region: 'Sin dato', partidos: ['Cambio Radical'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'salazar-guapacha-luis', nombre: "Luis Fernando Salazar Guapacha", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'carmen-londono-maria', nombre: "María del Carmen Londoño", genero: 'Femenino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'zamora-betancur-sergio', nombre: "Sergio Mauricio Zamora Betancur", genero: 'Masculino', region: 'Sin dato', partidos: ['Pacto Histórico'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'giraldo-hoyos-edison', nombre: "Edison Alberto Giraldo Hoyos", genero: 'Masculino', region: 'Sin dato', partidos: ['Dignidad y Compromiso'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'andres-escobar-rafael', nombre: "Rafael Andrés Escobar", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'felipe-murgueitio-juan', nombre: "Juan Felipe Murgueitio", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'ortiz-uruena-roberto', nombre: "Roberto Ortiz Urueña", genero: 'Masculino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
  // concejal Cali 2024–2027
  r({ id: 'plaza-saldarriaga-daniella', nombre: "Daniella Plaza Saldarriaga", genero: 'Femenino', region: 'Sin dato', partidos: [], territorial: { concejal: ['Cali'] }, decadas: ['2020s'] }),
]
