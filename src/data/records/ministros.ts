import { build } from '../builder.ts'

// Ministros de las listas Top 10 y del gabinete de Abelardo de la Espriella (7 de agosto de 2026) que
// no estaban en la base. Cada ficha cruza cuatro fuentes: la cartera y el periodo de la lista Top 10 (a
// su vez de las tablas de Wikipedia de cada ministerio), la ficha (infobox) del artículo de Wikipedia
// de la persona, el perfil de Congreso Visible (Uniandes) si pasó por el Congreso y el lugar de
// nacimiento del artículo. Los partidos son los que registran esas fuentes; «Defensores de la Patria»
// y otros movimientos sin entrada en el catálogo se omiten. Criterio editorial: ante la duda, se omite.
//
// El gobierno de gabinete de cada cartera sale de la lista Top 10 (periodo y presidente); los cargos
// adicionales de la ficha de Wikipedia usan el año de inicio (2026 se asigna a mano: Petro hasta el
// 7 de agosto, De la Espriella desde esa fecha).

export const ministros = [
  // Wikipedia (es): «Miguel Gómez Martínez» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Hacienda y Crédito Público de Colombia (Wikipedia); Representante a la Cámara de Colombia (Wikipedia); Embajador de Colombia en Francia (Wikipedia); Embajador de Colombia ante la UNESCO (Wikipedia)
  build({ id: 'gomez-martinez-miguel', nombre: "Miguel Gómez Martínez", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido de la U', 'Partido Conservador', 'Salvación Nacional'], congreso: { representante_camara: true }, ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['De la Espriella'], embajador: true }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Germán Ávila Plazas» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Hacienda y Crédito Público de Colombia (Wikipedia)
  build({ id: 'avila-plazas-german', nombre: "Germán Ávila Plazas", genero: 'Masculino', region: 'Bogotá', partidos: ['Colombia Humana'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Diego Guevara Castañeda» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Hacienda y Crédito Público de Colombia (Wikipedia)
  build({ id: 'guevara-castaneda-diego', nombre: "Diego Guevara Castañeda", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Ricardo Bonilla González» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Hacienda y Crédito Público de Colombia (| presidente = Gustavo Petro) (Wikipedia)
  build({ id: 'bonilla-gonzalez-ricardo', nombre: "Ricardo Bonilla González", genero: 'Masculino', region: 'Bogotá', partidos: ['Colombia Humana'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «José Manuel Restrepo Abondano» · nacimiento: Bogotá, Colombia · vicepresidente electo en 2026 en la fórmula de Abelardo de la Espriella
  // completado: Ministro de Hacienda y Crédito Público de Colombia (Wikipedia); Ministro de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'restrepo-abondano-jose', nombre: "José Manuel Restrepo Abondano", genero: 'Masculino', region: 'Bogotá', partidos: [], presidencial: { formula_vicepresidencial: true, vicepresidente: true }, ejecutivo: { ministerios: ['Hacienda', 'Comercio'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Alfonso Prada» · nacimiento: Bogotá (Colombia)
  // completado: Embajador de la República de Colombia ante la República Francesa (Designado) (Wikipedia); Ministro del Interior de Colombia (| inicio2 =) (Wikipedia); Representante a la Cámara de Colombia (Wikipedia); Concejal de Bogotá (Wikipedia)
  build({ id: 'alfonso-prada-alfonso', nombre: "Alfonso Prada", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido de la U', 'Alianza Verde', 'Partido Liberal', 'Nuevo Liberalismo'], congreso: { representante_camara: true }, territorial: { concejal: ['Bogotá'] }, ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Petro'], embajador: true }, decadas: ['1990s', '2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Daniel Palacios» · nacimiento: Bogotá, Colombia
  // completado: Ministro del Interior de Colombia (Wikipedia); Concejal de Bogotá (Wikipedia)
  build({ id: 'daniel-palacios-daniel', nombre: "Daniel Palacios", genero: 'Masculino', region: 'Bogotá', partidos: [], territorial: { concejal: ['Bogotá'] }, ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Alicia Arango» · nacimiento: Cartagena de Indias, Colombia
  // completado: Ministra del Interior de Colombia (Wikipedia); Ministra del Trabajo de Colombia (| inicio4 =) (Wikipedia)
  build({ id: 'alicia-arango-alicia', nombre: "Alicia Arango", genero: 'Femenino', region: 'Caribe', partidos: ['Centro Democrático'], ejecutivo: { ministerios: ['Interior', 'Trabajo'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Guillermo Rivera Flórez» · nacimiento: Mocoa, Putumayo, Colombia · Representante por Putumayo 2002–2014; el cargo de gobernador de Cundinamarca (2015–2016) no se cuenta por ser designado por el presidente
  // completado: Embajador de la República de Colombia ante la República Federativa de Brasil (Wikipedia); Ministro del Interior de Colombia (Wikipedia); Gobernador de Cundinamarca (Wikipedia); Representante a la Cámara de Colombia (Wikipedia)
  build({ id: 'rivera-florez-guillermo', nombre: "Guillermo Rivera Flórez", genero: 'Masculino', region: 'Llanos/Amazonía', partidos: ['Alianza Verde'], congreso: { representante_camara: true, departamentos_camara: ['Putumayo'] }, ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Santos'], embajador: true }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Jorge Eduardo Mora» · nacimiento: Cúcuta (Colombia)
  // completado: Ministro de Defensa Nacional de Colombia (Wikipedia)
  build({ id: 'eduardo-mora-jorge', nombre: "Jorge Eduardo Mora", genero: 'Masculino', region: 'Santanderes', partidos: [], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Pedro Arnulfo Sánchez» · nacimiento: Boavita, Boyacá
  // completado: Ministro de Defensa Nacional de Colombia (| predecesor = Iván Velásquez Gómez) (Wikipedia)
  build({ id: 'arnulfo-sanchez-pedro', nombre: "Pedro Arnulfo Sánchez", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Carlos Holmes Trujillo» · nacimiento: Cartago, Valle del Cauca, Colombia.
  // completado: Ministro de Defensa Nacional de Colombia (| inicio =) (Wikipedia); Ministro de Relaciones Exteriores de Colombia (| inicio2 =) (Wikipedia); Embajador de Colombia en Rusia (Wikipedia); Embajador de Colombia en Austria (Wikipedia); Ministro del Interior de Colombia (Wikipedia); Embajador de Colombia ante la OEA (Wikipedia); Ministro de Educación Nacional de Colombia (Wikipedia); Diputado de la Asamblea Nacional Constituyente de 1991 de Colombia (Wikipedia); Alcalde de Santiago de Cali (Wikipedia)
  build({ id: 'holmes-trujillo-carlos', nombre: "Carlos Holmes Trujillo", genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Partido Liberal', 'Centro Democrático'], territorial: { alcalde: ['Cali'] }, ejecutivo: { ministerios: ['Defensa', 'Relaciones Exteriores', 'Interior', 'Educación'], gobiernos_gabinete: ['Duque', 'Samper', 'Gaviria'], embajador: true }, decadas: ['1980s', '1990s', '2000s', '2010s', '2020s'], hitos: ['Constituyente de 1991'] }),
  // Wikipedia (es): «Guillermo Botero Nieto» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Defensa Nacional de Colombia (Wikipedia)
  build({ id: 'botero-nieto-guillermo', nombre: "Guillermo Botero Nieto", genero: 'Masculino', region: 'Bogotá', partidos: ['Centro Democrático'], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Luis Carlos Villegas» · nacimiento: Pereira, Risaralda, Colombia
  // completado: Ministro de Defensa Nacional de Colombia (Wikipedia); Embajador de Colombia en Estados Unidos (Wikipedia); Gobernador de Risaralda (Wikipedia)
  build({ id: 'carlos-villegas-luis', nombre: "Luis Carlos Villegas", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido Liberal'], territorial: { gobernador: ['Risaralda'] }, ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Santos'], embajador: true }, decadas: ['1980s', '2010s'] }),
  // Wikipedia (es): «Gabriel Silva» · nacimiento: Barranquilla, Colombia
  // completado: Embajador de Colombia en Estados Unidos (Wikipedia); Ministro de Defensa de Colombia (Wikipedia)
  build({ id: 'gabriel-silva-gabriel', nombre: "Gabriel Silva", genero: 'Masculino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Uribe'], embajador: true }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «Omar Bula Escobar» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Relaciones Exteriores de Colombia (Wikipedia)
  build({ id: 'bula-escobar-omar', nombre: "Omar Bula Escobar", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Rosa Villavicencio» · nacimiento: Bogotá
  // completado: Ministra de Relaciones Exteriores de Colombia (| inicio2 = 11 de junio de 2007) (Wikipedia)
  build({ id: 'rosa-villavicencio-rosa', nombre: "Rosa Villavicencio", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Laura Sarabia» · nacimiento: Bogotá
  // completado: Embajadora de Colombia en el Reino Unido de Gran Bretaña e Irlanda del Norte (| inicio2 = 29 de enero de 2025) (Wikipedia); Ministra de Relaciones Exteriores de Colombia (Wikipedia)
  build({ id: 'laura-sarabia-laura', nombre: "Laura Sarabia", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Petro'], embajador: true }, decadas: ['2020s'] }),
  // Wikipedia (es): «Álvaro Leyva» · nacimiento: Bogotá (Colombia)
  // completado: Ministro de Relaciones Exteriores de Colombia (Wikipedia); Diputado de la Asamblea Nacional Constituyente de 1991 (Wikipedia); Ministro de Minas y Energía de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Representante a la Cámara de Colombia (Wikipedia); Diputado a la Asamblea Departamental de Cundinamarca (Wikipedia); Concejal de Bogotá (Wikipedia)
  build({ id: 'alvaro-leyva-alvaro', nombre: "Álvaro Leyva", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], congreso: { senador: true, representante_camara: true }, territorial: { concejal: ['Bogotá'], diputado_asamblea: ['Cundinamarca'] }, ejecutivo: { ministerios: ['Relaciones Exteriores', 'Minas y Energía'], gobiernos_gabinete: ['Petro', 'Betancur'] }, decadas: ['1980s', '1990s', '2020s'], hitos: ['Constituyente de 1991'] }),
  // Wikipedia (es): «María Ángela Holguín» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Relaciones Exteriores de Colombia (Wikipedia); Embajadora y Representante Permanente de Colombia ante las Naciones Unidas (Wikipedia); Embajadora de Colombia en Venezuela (Wikipedia)
  build({ id: 'angela-holguin-maria', nombre: "María Ángela Holguín", genero: 'Femenino', region: 'Bogotá', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Santos'], embajador: true }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «Jaime Bermúdez» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Relaciones Exteriores de Colombia (Wikipedia); Embajador de Colombia en Argentina (Wikipedia)
  build({ id: 'jaime-bermudez-jaime', nombre: "Jaime Bermúdez", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Uribe'], embajador: true }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «Ilva Myriam Hoyos» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'myriam-hoyos-ilva', nombre: "Ilva Myriam Hoyos", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Viviane Morales» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia); Embajadora de Colombia en Francia (Wikipedia); Senadora de la República de Colombia (Wikipedia); 6.ª Fiscal General de la Nación de Colombia (Wikipedia); Representante a la Cámara de Colombia (Wikipedia)
  build({ id: 'viviane-morales-viviane', nombre: "Viviane Morales", genero: 'Femenino', region: 'Bogotá', partidos: ['Partido Liberal'], congreso: { senador: true, representante_camara: true }, ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['De la Espriella'], embajador: true, organos_control: ['Fiscal General'] }, decadas: ['1990s', '2010s', '2020s'] }),
  // Wikipedia (es): «Daniel Rojas Medellín» · nacimiento: Bogotá
  // completado: Ministro de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'rojas-medellin-daniel', nombre: "Daniel Rojas Medellín", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Aurora Vergara» · nacimiento: Cali, Valle del Cauca, Colombia
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'aurora-vergara-aurora', nombre: "Aurora Vergara", genero: 'Femenino', region: 'Valle del Cauca', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «María Victoria Angulo» · nacimiento: Ibagué, Colombia
  // completado: Ministra de Educación Nacional de Colombia (| presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'victoria-angulo-maria', nombre: "María Victoria Angulo", genero: 'Femenino', region: 'Tolima/Huila', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Yaneth Giha» · nacimiento: Barranquilla, Atlántico
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'yaneth-giha-yaneth', nombre: "Yaneth Giha", genero: 'Femenino', region: 'Caribe', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Gina Parody» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia); Senadora de la República de Colombia (Wikipedia); Miembro de la Cámara de Representantes de Colombia (Wikipedia)
  build({ id: 'gina-parody-gina', nombre: "Gina Parody", genero: 'Femenino', region: 'Bogotá', partidos: [], congreso: { senador: true, representante_camara: true }, ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Santos'] }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «María Fernanda Campo» · nacimiento: Buga, Valle del Cauca
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'fernanda-campo-maria', nombre: "María Fernanda Campo", genero: 'Femenino', region: 'Valle del Cauca', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Cecilia María Vélez» · nacimiento: Frontino, Antioquia
  // completado: Ministra de Educación Nacional de Colombia (Wikipedia)
  build({ id: 'maria-velez-cecilia', nombre: "Cecilia María Vélez", genero: 'Femenino', region: 'Antioquia', partidos: [], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «Ana María Vesga»
  // completado: Ministra de Salud y Protección Social de Colombia (Wikipedia)
  build({ id: 'maria-vesga-ana', nombre: "Ana María Vesga", genero: 'Femenino', region: 'Sin dato', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Carolina Corcho» · nacimiento: Medellín, Colombia
  // completado: Senadora de la República de Colombia (Wikipedia); Ministra de Salud y Protección Social de Colombia (Wikipedia); Senadora (Congreso Visible); Ministra de Salud y Protección Social (Congreso Visible); Senador - (Congreso Visible)
  build({ id: 'carolina-corcho-carolina', nombre: "Carolina Corcho", genero: 'Femenino', region: 'Antioquia', partidos: ['Pacto Histórico'], congreso: { senador: true }, ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Fernando Ruiz Gómez» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Salud y Protección Social de Colombia (| presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'ruiz-gomez-fernando', nombre: "Fernando Ruiz Gómez", genero: 'Masculino', region: 'Bogotá', partidos: ['Cambio Radical'], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Juan Pablo Uribe» · nacimiento: Medellín, Colombia
  // completado: Ministro de Salud y Protección Social de Colombia (| presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'pablo-uribe-juan', nombre: "Juan Pablo Uribe", genero: 'Masculino', region: 'Antioquia', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Beatriz Londoño» · nacimiento: Bogotá, Colombia
  build({ id: 'beatriz-londono-beatriz', nombre: "Beatriz Londoño", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Diego Palacio» · nacimiento: Armenia, Colombia
  // completado: Ministro de la Protección Social de Colombia (Wikipedia)
  build({ id: 'diego-palacio-diego', nombre: "Diego Palacio", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s', '2010s'] }),
  // Wikipedia (es): «Juan Luis Londoño» · nacimiento: Bogotá, Colombia
  // completado: Ministro de la Protección Social (Wikipedia)
  build({ id: 'luis-londono-juan', nombre: "Juan Luis Londoño", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s'] }),
  // Wikipedia (es): «Mauricio Gómez Amín» · nacimiento: Barranquilla, Colombia
  // completado: Ministro de Comercio, Industria y Turismo de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Representante a la Cámara de Colombia (Wikipedia); Concejal de Barranquilla (Wikipedia); Ministro de Comercio, Industria y Turismo (Congreso Visible); Senador (Congreso Visible); Senador - (Congreso Visible)
  build({ id: 'gomez-amin-mauricio', nombre: "Mauricio Gómez Amín", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], congreso: { senador: true, representante_camara: true }, territorial: { concejal: ['Barranquilla'] }, ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Diana Marcela Morales» · nacimiento: Arauca, Colombia
  // completado: Ministra de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'marcela-morales-diana', nombre: "Diana Marcela Morales", genero: 'Femenino', region: 'Llanos/Amazonía', partidos: [], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Luis Carlos Reyes» · nacimiento: Bogotá, Colombia
  build({ id: 'carlos-reyes-luis', nombre: "Luis Carlos Reyes", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Germán Umaña» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'german-umana-german', nombre: "Germán Umaña", genero: 'Masculino', region: 'Bogotá', partidos: ['Unión Patriótica'], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «María Ximena Lombana» · nacimiento: Colombia
  // completado: Ministra de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'ximena-lombana-maria', nombre: "María Ximena Lombana", genero: 'Femenino', region: 'Sin dato', partidos: [], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «María Lorena Gutiérrez» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Comercio, Industria y Turismo de Colombia (Wikipedia); Ministra de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'lorena-gutierrez-maria', nombre: "María Lorena Gutiérrez", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Comercio', 'Minas y Energía'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «María Claudia Lacouture» · nacimiento: Santa Marta
  // completado: Ministra de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'claudia-lacouture-maria', nombre: "María Claudia Lacouture", genero: 'Femenino', region: 'Caribe', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Cecilia Álvarez Correa» · nacimiento: Ciénaga, Magdalena, Colombia
  // completado: Ministra de Comercio, Industria y Turismo de Colombia (Wikipedia); Ministra de Transporte de Colombia (Wikipedia)
  build({ id: 'alvarez-correa-cecilia', nombre: "Cecilia Álvarez Correa", genero: 'Femenino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Comercio', 'Transporte'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Santiago Rojas Arroyo» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Comercio, Industria y Turismo de Colombia (Wikipedia)
  build({ id: 'rojas-arroyo-santiago', nombre: "Santiago Rojas Arroyo", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «María Constanza García» · nacimiento: Cúcuta
  // completado: Ministra de Transporte de Colombia (Wikipedia)
  build({ id: 'constanza-garcia-maria', nombre: "María Constanza García", genero: 'Femenino', region: 'Santanderes', partidos: [], ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «William Camargo» · nacimiento: Duitama, Boyacá
  // completado: Ministro de Transporte de Colombia (| presidente = Gustavo Petro) (Wikipedia)
  build({ id: 'william-camargo-william', nombre: "William Camargo", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: [], ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Guillermo Reyes González» · nacimiento: Barrancabermeja, Santander (Colombia)
  // completado: Embajador de Colombia en Suecia (Wikipedia); Ministro de Transporte de Colombia (Wikipedia)
  build({ id: 'reyes-gonzalez-guillermo', nombre: "Guillermo Reyes González", genero: 'Masculino', region: 'Santanderes', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Petro'], embajador: true }, decadas: ['2020s'] }),
  // Wikipedia (es): «Ángela María Orozco» · nacimiento: Barranquilla, Colombia
  // completado: Ministra de Transporte de Colombia (| presidente = Iván Duque Márquez) (Wikipedia); Ministra de Comercio Exterior de Colombia (Wikipedia)
  build({ id: 'maria-orozco-angela', nombre: "Ángela María Orozco", genero: 'Femenino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Transporte', 'Comercio'], gobiernos_gabinete: ['Duque', 'Uribe'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Germán Cardona» · nacimiento: Manizales, Colombia
  // completado: Ministro de Transporte de Colombia (Wikipedia); Alcalde de Manizales (Wikipedia); Gobernador de Caldas (Wikipedia)
  build({ id: 'german-cardona-german', nombre: "Germán Cardona", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], territorial: { gobernador: ['Caldas'], alcalde: ['Manizales'] }, ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Natalia Abello» · nacimiento: Barranquilla, Atlántico, Colombia
  // completado: Embajadora de Colombia en Uruguay (Wikipedia); Ministra de Transporte de la República de Colombia (Wikipedia)
  build({ id: 'natalia-abello-natalia', nombre: "Natalia Abello", genero: 'Femenino', region: 'Caribe', partidos: ['Cambio Radical'], ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Santos'], embajador: true }, decadas: ['2010s'] }),
  // Wikipedia (es): «Fabio Arjona Hincapié» · nacimiento: Montería, Colombia
  // completado: Ministro de Ambiente y Desarrollo Sostenible de Colombia (Wikipedia)
  build({ id: 'arjona-hincapie-fabio', nombre: "Fabio Arjona Hincapié", genero: 'Masculino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Irene Vélez Torres» · nacimiento: Bogotá (Colombia)
  // completado: Ministra de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'velez-torres-irene', nombre: "Irene Vélez Torres", genero: 'Femenino', region: 'Bogotá', partidos: ['Colombia Humana'], ejecutivo: { ministerios: ['Ambiente', 'Minas y Energía'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Lena Estrada» · nacimiento: La Chorrera, Amazonas
  // completado: Ministra de Ambiente y Desarrollo Sostenible de Colombia (| presidente = Gustavo Petro) (Wikipedia)
  build({ id: 'lena-estrada-lena', nombre: "Lena Estrada", genero: 'Femenino', region: 'Llanos/Amazonía', partidos: ['MAIS'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Ricardo Lozano Picón» · nacimiento: Bucaramanga, Santander, Colombia
  // completado: Ministro de Ambiente y Desarrollo Sostenible de Colombia (Wikipedia)
  build({ id: 'lozano-picon-ricardo', nombre: "Ricardo Lozano Picón", genero: 'Masculino', region: 'Santanderes', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Gabriel Vallejo» · nacimiento: Manizales, Caldas
  // completado: Ministro de Ambiente y Desarrollo Sostenible (Wikipedia)
  build({ id: 'gabriel-vallejo-gabriel', nombre: "Gabriel Vallejo", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Luz Helena Sarmiento» · nacimiento: Bucaramanga
  // completado: Ministra de Ambiente y Desarrollo Sostenible (Wikipedia)
  build({ id: 'helena-sarmiento-luz', nombre: "Luz Helena Sarmiento", genero: 'Femenino', region: 'Santanderes', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Juan Gabriel Uribe» · nacimiento: Bogotá, D. C., Colombia
  build({ id: 'gabriel-uribe-juan', nombre: "Juan Gabriel Uribe", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Natalia López Fuentes» · nacimiento: Montería Cordoba
  // completado: Ministra del Trabajo de Colombia (Wikipedia)
  build({ id: 'lopez-fuentes-natalia', nombre: "Natalia López Fuentes", genero: 'Femenino', region: 'Caribe', partidos: ['Creemos'], ejecutivo: { ministerios: ['Trabajo'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Antonio Sanguino» · nacimiento: Ocaña, Norte de Santander, Colombia
  // completado: Ministro del Trabajo de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Concejal de Bogotá (Wikipedia); Ministro de Trabajo (Congreso Visible); Senador (Congreso Visible); Concejal de Bogotá (Congreso Visible); Senador - (Congreso Visible)
  build({ id: 'antonio-sanguino-antonio', nombre: "Antonio Sanguino", genero: 'Masculino', region: 'Santanderes', partidos: ['Alianza Verde', 'Polo Democrático'], congreso: { senador: true }, territorial: { concejal: ['Bogotá'] }, ejecutivo: { ministerios: ['Trabajo'], gobiernos_gabinete: ['Petro'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Gloria Inés Ramírez» · nacimiento: Filadelfia, Colombia · nacimiento: Filadelfia, Caldas
  // completado: Ministra del Trabajo de Colombia (Wikipedia); Senadora de la República de Colombia (Wikipedia)
  build({ id: 'ines-ramirez-gloria', nombre: "Gloria Inés Ramírez", genero: 'Femenino', region: 'Eje Cafetero', partidos: [], congreso: { senador: true }, ejecutivo: { ministerios: ['Trabajo'], gobiernos_gabinete: ['Petro'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Ángel Custodio Cabrera» · nacimiento: Bogotá, Colombia
  // completado: Ministro del Trabajo de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Miembro de la Cámara de Representantes de Colombia (Wikipedia)
  build({ id: 'custodio-cabrera-angel', nombre: "Ángel Custodio Cabrera", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido de la U'], congreso: { senador: true, representante_camara: true }, ejecutivo: { ministerios: ['Trabajo'], gobiernos_gabinete: ['Duque'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «María Nohemí Arboleda» · nacimiento: Planeta Rica, Córdoba, Colombia
  // completado: Ministra de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'nohemi-arboleda-maria', nombre: "María Nohemí Arboleda", genero: 'Femenino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Edwin Palma Egea» · nacimiento: Barrancabermeja
  // completado: Ministro de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'palma-egea-edwin', nombre: "Edwin Palma Egea", genero: 'Masculino', region: 'Santanderes', partidos: ['Pacto Histórico'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Omar Andrés Camacho» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'andres-camacho-omar', nombre: "Omar Andrés Camacho", genero: 'Masculino', region: 'Bogotá', partidos: ['Pacto Histórico'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Diego Mesa Puyo» · nacimiento: Medellín, Colombia
  // completado: Ministro de Minas y Energía de Colombia (|presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'mesa-puyo-diego', nombre: "Diego Mesa Puyo", genero: 'Masculino', region: 'Antioquia', partidos: [], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Iván Cancino González» · nacimiento: Bogotá, Colombia
  build({ id: 'cancino-gonzalez-ivan', nombre: "Iván Cancino González", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Jorge Iván Cuervo» · nacimiento: Armenia, Colombia
  // completado: Ministro de Justicia y del Derecho de Colombia (Wikipedia)
  build({ id: 'ivan-cuervo-jorge', nombre: "Jorge Iván Cuervo", genero: 'Masculino', region: 'Eje Cafetero', partidos: [], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Luis Eduardo Montealegre» · nacimiento: Ibagué, Colombia
  // completado: Ministro de Justicia y del Derecho de Colombia (| inicio = 13 de junio de 2025) (Wikipedia); 7°. Fiscal General de la Nación (Wikipedia)
  build({ id: 'eduardo-montealegre-luis', nombre: "Luis Eduardo Montealegre", genero: 'Masculino', region: 'Tolima/Huila', partidos: [], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Petro'], organos_control: ['Fiscal General'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Ángela María Buitrago» · nacimiento: Bogotá, Colombia
  build({ id: 'maria-buitrago-angela', nombre: "Ángela María Buitrago", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Néstor Osuna» · nacimiento: Bogotá, Colombia
  build({ id: 'nestor-osuna-nestor', nombre: "Néstor Osuna", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Wilson Ruiz Orejuela» · nacimiento: Florida (Valle del Cauca), Colombia
  // completado: Ministro de Justicia y del Derecho de Colombia (| presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'ruiz-orejuela-wilson', nombre: "Wilson Ruiz Orejuela", genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Salvación Nacional'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Gloria María Borrero» · nacimiento: Medellín, Colombia
  // completado: Ministra de Justicia y del Derecho de Colombia (Wikipedia)
  build({ id: 'maria-borrero-gloria', nombre: "Gloria María Borrero", genero: 'Femenino', region: 'Antioquia', partidos: [], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Enrique Gil Botero» · nacimiento: Fredonia, Antioquia, Colombia
  // completado: Ministro de Justicia y del Derecho de Colombia (Wikipedia)
  build({ id: 'gil-botero-enrique', nombre: "Enrique Gil Botero", genero: 'Masculino', region: 'Antioquia', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Jorge Eduardo Londoño» · nacimiento: Puerto Boyacá, Boyacá, Colombia
  // completado: Senador de la República de Colombia (Wikipedia); Ministro de Justicia y del Derecho de Colombia (Wikipedia); Gobernador de Boyacá (Wikipedia); Senador (Congreso Visible); Ministro de Justicia (Congreso Visible); Gobernador de Boyacá (Congreso Visible); Senador - (Congreso Visible)
  build({ id: 'eduardo-londono-jorge', nombre: "Jorge Eduardo Londoño", genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: ['Alianza Verde'], congreso: { senador: true }, territorial: { gobernador: ['Boyacá'] }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Santos'] }, decadas: ['2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Indalecio Dangond» · nacimiento: Urumita, La Guajira, Colombia
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (Wikipedia)
  build({ id: 'indalecio-dangond-indalecio', nombre: "Indalecio Dangond", genero: 'Masculino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Martha Carvajalino» · nacimiento: Colombia
  // completado: Ministra de Agricultura y Desarrollo Rural de Colombia (Wikipedia)
  build({ id: 'martha-carvajalino-martha', nombre: "Martha Carvajalino", genero: 'Femenino', region: 'Sin dato', partidos: [], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Jhenifer Mojica» · nacimiento: Bucaramanga, Departamento de Santander, Colombia
  // completado: Embajadora de Colombia ante la Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO) (Wikipedia); Ministra de Agricultura y Desarrollo Rural de Colombia (Wikipedia)
  build({ id: 'mojica-florez-jhenifer', nombre: "Jhenifer Mojica Flórez", genero: 'Femenino', region: 'Santanderes', partidos: [], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Petro'], embajador: true }, decadas: ['2020s'] }),
  // Wikipedia (es): «Cecilia López Montaño» · nacimiento: Bogotá (Colombia)
  // completado: Ministra de Agricultura y Desarrollo Rural de Colombia (| inicio =) (Wikipedia); Senadora de la República de Colombia (Wikipedia); Ministra del Medio Ambiente de Colombia (Wikipedia); Embajadora de Colombia ante los Países Bajos (Wikipedia)
  build({ id: 'lopez-montano-cecilia', nombre: "Cecilia López Montaño", genero: 'Femenino', region: 'Bogotá', partidos: ['Partido Liberal'], congreso: { senador: true }, ejecutivo: { ministerios: ['Agricultura', 'Ambiente'], gobiernos_gabinete: ['Petro', 'Samper'], embajador: true }, decadas: ['1980s', '1990s', '2000s', '2010s', '2020s'] }),
  // Wikipedia (es): «Rodolfo Enrique Zea» · nacimiento: Montería, Colombia
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (| presidente = Iván Duque Márquez) (Wikipedia)
  build({ id: 'enrique-zea-rodolfo', nombre: "Rodolfo Enrique Zea", genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Andrés Valencia Pinzón» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (Wikipedia)
  build({ id: 'valencia-pinzon-andres', nombre: "Andrés Valencia Pinzón", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Aurelio Iragorri Valencia» · nacimiento: Popayán, Colombia
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (Wikipedia); Ministro del Interior de Colombia (Wikipedia)
  build({ id: 'iragorri-valencia-aurelio', nombre: "Aurelio Iragorri Valencia", genero: 'Masculino', region: 'Cauca/Nariño', partidos: ['Partido Liberal', 'Partido de la U'], ejecutivo: { ministerios: ['Agricultura', 'Interior'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Rubén Darío Lizarralde» · nacimiento: Buga, Valle del Cauca
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (Wikipedia)
  build({ id: 'dario-lizarralde-ruben', nombre: "Rubén Darío Lizarralde", genero: 'Masculino', region: 'Valle del Cauca', partidos: [], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Juan Camilo Restrepo» · nacimiento: Medellín, Antioquia, Colombia
  // completado: Ministro de Agricultura y Desarrollo Rural de Colombia (Wikipedia); Embajador de Colombia en Francia (Wikipedia); Ministro de Hacienda y Crédito Público de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Ministro de Minas y Energía de Colombia (Wikipedia)
  build({ id: 'camilo-restrepo-juan', nombre: "Juan Camilo Restrepo", genero: 'Masculino', region: 'Antioquia', partidos: ['Partido Conservador'], congreso: { senador: true }, ejecutivo: { ministerios: ['Agricultura', 'Hacienda', 'Minas y Energía'], gobiernos_gabinete: ['Santos', 'Pastrana', 'Gaviria'], embajador: true }, decadas: ['1990s', '2000s', '2010s'] }),
  // Wikipedia (es): «Helga Rivas» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Vivienda, Ciudad y Territorio de Colombia (Wikipedia)
  build({ id: 'helga-rivas-helga', nombre: "Helga Rivas", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Catalina Velasco» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Vivienda, Ciudad y Territorio de Colombia (Wikipedia)
  build({ id: 'catalina-velasco-catalina', nombre: "Catalina Velasco", genero: 'Femenino', region: 'Bogotá', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Susana Correa» · nacimiento: Cali, Colombia
  // completado: Ministra de Vivienda, Ciudad y Territorio de Colombia (Wikipedia); Senadora de la República de Colombia (Wikipedia)
  build({ id: 'susana-correa-susana', nombre: "Susana Correa", genero: 'Femenino', region: 'Valle del Cauca', partidos: ['Cambio Radical'], congreso: { senador: true }, ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Jonathan Malagón» · nacimiento: Riohacha, Colombia
  // completado: Ministro de Vivienda, Ciudad y Territorio de Colombia (Wikipedia)
  build({ id: 'jonathan-malagon-jonathan', nombre: "Jonathan Malagón", genero: 'Masculino', region: 'Caribe', partidos: [], ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Camilo Sánchez Ortega» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Vivienda, Ciudad y Territorio de Colombia (Wikipedia); Senador de la República de Colombia (Wikipedia); Miembro de la Cámara de Representantes de Colombia (Wikipedia)
  build({ id: 'sanchez-ortega-camilo', nombre: "Camilo Sánchez Ortega", genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Liberal'], congreso: { senador: true, representante_camara: true }, ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Santos'] }, decadas: ['1990s', '2000s', '2010s'] }),
  // Wikipedia (es): «Luis Felipe Henao» · nacimiento: Medellín, Colombia
  build({ id: 'felipe-henao-luis', nombre: "Luis Felipe Henao", genero: 'Masculino', region: 'Antioquia', partidos: ['Cambio Radical'], ejecutivo: { ministerios: ['Vivienda'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Alexandra Falla Zerrate» · nacimiento: Nueva York, Estados Unidos
  build({ id: 'falla-zerrate-alexandra', nombre: "Alexandra Falla Zerrate", genero: 'Femenino', region: 'Sin dato', partidos: [], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Carina Murcia» · nacimiento: Puerto Asís, Putumayo
  build({ id: 'carina-murcia-carina', nombre: "Carina Murcia", genero: 'Femenino', region: 'Llanos/Amazonía', partidos: [], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Julián Molina»
  // completado: Ministro de Tecnologías de la Información y Comunicaciones de Colombia (Wikipedia)
  build({ id: 'molina-gomez-julian', nombre: "Julián Molina Gómez", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Sandra Urrutia» · nacimiento: Aquitania, Boyacá, Colombia
  // completado: Ministra de Tecnologías de la Información y Comunicaciones de Colombia (Wikipedia)
  build({ id: 'sandra-urrutia-sandra', nombre: "Sandra Urrutia", genero: 'Femenino', region: 'Boyacá/Cundinamarca', partidos: ['Partido de la U'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Petro'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Carmen Ligia Valderrama» · nacimiento: Bogotá, Colombia
  // completado: Ministra de Tecnologías de la Información y Comunicaciones de Colombia (Wikipedia)
  build({ id: 'ligia-valderrama-carmen', nombre: "Carmen Ligia Valderrama", genero: 'Femenino', region: 'Bogotá', partidos: ['Cambio Radical'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Karen Abudinen» · nacimiento: Barranquilla, Colombia
  // completado: Ministra de las Tecnologías de la Información y la Comunicación de Colombia (Wikipedia)
  build({ id: 'karen-abudinen-karen', nombre: "Karen Abudinen", genero: 'Femenino', region: 'Caribe', partidos: ['Cambio Radical'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Duque'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Sylvia Constaín» · nacimiento: Popayán, Colombia
  // completado: Ministra de Tecnologías de la Información y las Comunicaciones de Colombia (Wikipedia)
  build({ id: 'sylvia-constain-sylvia', nombre: "Sylvia Constaín", genero: 'Femenino', region: 'Cauca/Nariño', partidos: ['Centro Democrático'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Duque'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Juan Sebastián Rozo» · nacimiento: Bogotá, Colombia
  // completado: Ministro de Tecnologías de la Información y las Comunicaciones de Colombia (Wikipedia)
  build({ id: 'sebastian-rozo-juan', nombre: "Juan Sebastián Rozo", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Mauricio Santamaría» · nacimiento: Bogotá, Colombia.
  // completado: Ministro de la Protección Social de Colombia (Wikipedia)
  build({ id: 'santamaria-salamanca-mauricio', nombre: "Mauricio Santamaría Salamanca", genero: 'Masculino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Salud'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Juliana Gutiérrez» · nacimiento: Medellín
  build({ id: 'juliana-gutierrez-juliana', nombre: "Juliana Gutiérrez", genero: 'Femenino', region: 'Antioquia', partidos: ['Creemos'], ejecutivo: { gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Claudia Benavides Salazar» · nacimiento: Pasto
  build({ id: 'benavides-salazar-claudia', nombre: "Claudia Benavides Salazar", genero: 'Femenino', region: 'Cauca/Nariño', partidos: [], ejecutivo: { gobiernos_gabinete: ['De la Espriella'] }, decadas: ['2020s'] }),
]
