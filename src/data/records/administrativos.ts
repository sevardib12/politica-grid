import { build } from '../builder.ts'

// Directores de los departamentos administrativos (DAPRE, DNP, DANE y Prosperidad Social) y un
// vicepresidente que no estaban en la base. Cada ficha sale de su artículo de Wikipedia (infobox y
// texto) y de la tabla de directores de su departamento. Las fechas son las de la tabla de directores;
// los gobiernos de cada periodo salen de sus años. Ante la duda, se omite: quien no tuvo artículo
// verificable no entra. Ver README, «Fichas de directores».

export const administrativos = [
  // Wikipedia (es): «Piedad Urdinola»; tabla de directores de DANE · nacimiento: Bogotá, Colombia
  build({ id: 'urdinola-piedad', nombre: "Beatriz Piedad Urdinola Contreras", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['DANE'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Cielo Rusinque»; tabla de directores de Prosperidad Social · nacimiento: Bogotá, Colombia
  build({ id: 'rusinque-cielo', nombre: "Cielo Rusinque", genero: 'Femenino', region: 'Bogotá', partidos: ['Colombia Humana'], ejecutivo: { ministerios: ['Justicia', 'Comercio'], gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['Prosperidad Social'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Jorge Iván González»; tabla de directores de DNP
  build({ id: 'gonzalez-borrero-jorge-ivan', nombre: "Jorge Iván González Borrero", genero: 'Masculino', region: 'Sin dato', partidos: [], ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['DNP'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Luis Alberto Rodríguez»; tabla de directores de DNP · nacimiento: Valledupar, Colombia
  build({ id: 'rodriguez-ospino-luis-alberto', nombre: "Luis Alberto Rodríguez Ospino", genero: 'Masculino', region: 'Caribe', partidos: [], ejecutivo: { gobiernos_gabinete: ['Duque'], departamentos_administrativos: ['DNP'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Carlos Ramón González»; tabla de directores de DAPRE · nacimiento: Puente Nacional, Santander Colombia
  build({ id: 'gonzalez-carlos-ramon', nombre: "Carlos Ramón González", genero: 'Masculino', region: 'Santanderes', partidos: ['Alianza Verde'], congreso: { representante_camara: true }, territorial: { concejal: ['Bucaramanga'] }, ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['DAPRE'] }, decadas: ['1990s', '2000s', '2020s'] }),
  // Wikipedia (es): «Tatyana Orozco»; tabla de directores de DNP, Prosperidad Social · nacimiento: Barranquilla, Atlántico, Colombia
  build({ id: 'orozco-tatyana', nombre: "Tatyana Orozco de la Cruz", genero: 'Femenino', region: 'Caribe', partidos: [], ejecutivo: { gobiernos_gabinete: ['Santos'], departamentos_administrativos: ['DNP', 'Prosperidad Social'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Alejandra Botero Barco»; tabla de directores de DNP · nacimiento: Caracas, Venezuela
  build({ id: 'botero-barco-alejandra', nombre: "Alejandra Botero Barco", genero: 'Femenino', region: 'Sin dato', partidos: [], ejecutivo: { gobiernos_gabinete: ['Duque', 'Petro'], departamentos_administrativos: ['DNP'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «Bruce Mac Master»; tabla de directores de Prosperidad Social · nacimiento: Cartagena, Bolívar, Colombia
  build({ id: 'mac-master-bruce', nombre: "Bruce Mac Master", genero: 'Masculino', region: 'Caribe', partidos: [], territorial: { alcalde: ['Cartagena'] }, ejecutivo: { gobiernos_gabinete: ['Santos'], departamentos_administrativos: ['Prosperidad Social'] }, decadas: ['2010s'] }),
  // Wikipedia (es): «Juan Carlos Ramírez Jaramillo»; tabla de directores de DNP
  build({ id: 'ramirez-jaramillo-juan-carlos', nombre: "Juan Carlos Ramírez Jaramillo", genero: 'Masculino', region: 'Sin dato', partidos: [], ejecutivo: { gobiernos_gabinete: ['Samper'], departamentos_administrativos: ['DNP'] }, decadas: ['1990s'] }),
  // Wikipedia (es): «Sandra Suárez»; tabla de directores de Prosperidad Social · nacimiento: Medellín, Colombia
  build({ id: 'suarez-perez-sandra', nombre: "Sandra Suárez Pérez", genero: 'Femenino', region: 'Antioquia', partidos: [], ejecutivo: { ministerios: ['Ambiente', 'Vivienda'], gobiernos_gabinete: ['Uribe', 'De la Espriella'], departamentos_administrativos: ['Prosperidad Social'] }, decadas: ['2000s', '2020s'] }),
  // Wikipedia (es): «Pierre García»; tabla de directores de Prosperidad Social · nacimiento: Vancouver, Columbia Británica, Canadá
  build({ id: 'garcia-pierre', nombre: "Pierre García", genero: 'Masculino', region: 'Sin dato', partidos: ['Centro Democrático'], congreso: { representante_camara: true }, ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['Prosperidad Social'] }, decadas: ['2010s', '2020s'] }),
  // Wikipedia (es): «Angie Rodríguez»; tabla de directores de DAPRE · nacimiento: Bogotá, Colombia
  build({ id: 'rodriguez-fajardo-angie', nombre: "Angie Lizeth Rodríguez Fajardo", genero: 'Femenino', region: 'Bogotá', partidos: ['Pacto Histórico'], ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['DAPRE'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «María Mercedes Cuéllar»; tabla de directores de DNP · nacimiento: Bogotá, Colombia
  build({ id: 'cuellar-maria-mercedes', nombre: "María Mercedes Cuéllar López", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Barco'], departamentos_administrativos: ['DNP'] }, decadas: ['1980s', '1990s'] }),
  // Wikipedia (es): «Eduardo Wiesner Durán»; tabla de directores de DNP
  build({ id: 'wiesner-eduardo', nombre: "Eduardo Wiesner Durán", genero: 'Masculino', region: 'Sin dato', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Turbay'], departamentos_administrativos: ['DNP'] }, decadas: ['1980s'] }),
  // Wikipedia (es): «Carlos Lemos Simmonds» · nacimiento: Popayán, Colombia
  build({ id: 'lemos-simmonds-carlos', nombre: "Carlos Lemos Simmonds", genero: 'Masculino', region: 'Cauca/Nariño', partidos: [], congreso: { representante_camara: true }, territorial: { gobernador: ['Cauca'], concejal: ['Bogotá'] }, presidencial: { vicepresidente: true }, ejecutivo: { ministerios: ['Interior', 'TIC', 'Relaciones Exteriores'], gobiernos_gabinete: ['Turbay', 'Barco'], embajador: true }, decadas: ['1980s', '1990s'] }),
  // Wikipedia (es): «Jorge Rojas (político)»; tabla de directores de DAPRE · nacimiento: Pereira
  build({ id: 'rojas-rodriguez-jorge-enrique', nombre: "Jorge Enrique Rojas Rodríguez", genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Colombia Humana'], ejecutivo: { gobiernos_gabinete: ['Petro'], departamentos_administrativos: ['DAPRE'] }, decadas: ['2020s'] }),
  // Wikipedia (es): «María Luisa Chiappe»; tabla de directores de DANE · nacimiento: Bogotá, Colombia
  build({ id: 'chiappe-maria-luisa', nombre: "María Luisa Chiappe Pulido", genero: 'Femenino', region: 'Bogotá', partidos: [], ejecutivo: { gobiernos_gabinete: ['Samper'], departamentos_administrativos: ['DANE'] }, decadas: ['1990s'] }),
]
