import { build, d } from '../builder.ts'

// Ministros de 1978 a 2018 que faltaban en la base y que tienen una militancia documentada: Hacienda,
// Gobierno/Interior y, al final, las otras 13 carteras.
//
//   · Hacienda: la tabla de ministros del artículo «Ministerio de Hacienda y Crédito Público de Colombia»
//     (Wikipedia en español), que trae el partido de cada ministro desde 1982. Ese partido no es el del
//     gobierno: Santos figura como liberal siendo ministro del conservador Pastrana. El género no consta en
//     la tabla: 'Sin dato'.
//   · Gobierno/Interior: el «Anexo:Ministros del Interior de Colombia» da nombre, periodo y presidente, pero no
//     el partido; el partido sale de la ficha (infobox) o del texto del artículo de cada persona. El género,
//     del mismo artículo («político», «ministro»).
//   · Otras 13 carteras: la tabla de cada ministerio da nombre, periodo y presidente (algunas, también el
//     partido); la ficha del artículo de cada persona da el partido, el lugar de nacimiento (de ahí la región)
//     y otros cargos (Congreso, gobernaciones, alcaldías, embajadas, órganos de control). El género sale de la
//     primera frase («es un economista», «es una política»). Carteras antecesoras: Comunicaciones cuenta como
//     TIC, Obras Públicas como Transporte, Comercio Exterior y Desarrollo Económico como Comercio, Protección
//     Social como Salud y Ambiente, Vivienda y Desarrollo Territorial (2003–2011) como Ambiente y Vivienda.
//     Interior y de Justicia (2003–2011) solo cuenta como Interior.
//
// Criterios: solo entra quien tiene un partido documentado (regla de militancia); los encargados e interinos
// no cuentan (Héctor Riveros); se omite a quien no tiene artículo (Rosa Yolanda Villavicencio) o cuyo artículo
// no da partido (María Fernanda Suárez, y casi todos los militares que fueron ministros de Defensa). Son fichas de
// respuesta (`perfil_regional`): no generan tableros.

const fuenteDe = { perfil_regional: true, region: 'Sin dato' } as const

export const ministrosTablas = [
  // ── Hacienda (tabla con columna de partido) ──
  build({ ...fuenteDe, id: 'gutierrez-castro-edgar', nombre: 'Edgar Gutiérrez Castro', genero: 'Sin dato', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Betancur'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'junguito-bonnet-roberto', nombre: 'Roberto Junguito Bonnet', genero: 'Sin dato', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Agricultura', 'Hacienda'], gobiernos_gabinete: ['Betancur', 'Uribe'] }, decadas: d('1980s', '2000s') }),
  build({ ...fuenteDe, id: 'palacios-mejia-hugo', nombre: 'Hugo Palacios Mejía', genero: 'Sin dato', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Betancur'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'alarcon-luis-fernando', nombre: 'Luis Fernando Alarcón', genero: 'Sin dato', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Barco'] }, decadas: d('1980s-1990s') }),
  build({ ...fuenteDe, id: 'perry-rubio-guillermo', nombre: 'Guillermo Perry Rubio', genero: 'Sin dato', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Minas y Energía', 'Hacienda'], gobiernos_gabinete: ['Barco', 'Samper'] }, decadas: d('1980s-1990s') }),
  build({ ...fuenteDe, id: 'urdinola-uribe-antonio-jose', nombre: 'Antonio José Urdinola Uribe', genero: 'Sin dato', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Hacienda'], gobiernos_gabinete: ['Samper'] }, decadas: d('1990s') }),

  // ── Gobierno / Interior (partido del artículo de cada persona) ──
  build({ ...fuenteDe, id: 'zea-hernandez-german', nombre: 'Germán Zea Hernández', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Turbay'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'mosquera-chaux-victor', nombre: 'Víctor Mosquera Chaux', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Turbay'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'eastman-velez-jorge-mario', nombre: 'Jorge Mario Eastman Vélez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Turbay'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'escobar-navia-rodrigo', nombre: 'Rodrigo Escobar Navia', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior', 'Educación'], gobiernos_gabinete: ['Betancur'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'gomez-gomez-alfonso', nombre: 'Alfonso Gómez Gómez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Betancur'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'cepeda-ulloa-fernando', nombre: 'Fernando Cepeda Ulloa', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Barco'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'orejuela-bueno-raul', nombre: 'Raúl Orejuela Bueno', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Barco'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'vasquez-velasquez-orlando', nombre: 'Orlando Vásquez Velásquez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Barco'] }, decadas: d('1980s') }),
  build({ ...fuenteDe, id: 'sanchez-garcia-julio-cesar', nombre: 'Julio César Sánchez García', genero: 'Masculino', partidos: ['Partido Liberal'], territorial: { alcalde: ['Bogotá'] }, ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Gaviria'] }, decadas: d('1990s') }),
  build({ ...fuenteDe, id: 'villegas-ramirez-fabio', nombre: 'Fabio Villegas Ramírez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Gaviria'] }, decadas: d('1990s') }),
  build({ ...fuenteDe, id: 'lopez-caballero-alfonso', nombre: 'Alfonso López Caballero', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Agricultura', 'Interior'], gobiernos_gabinete: ['Gaviria', 'Samper'] }, decadas: d('1990s') }),
  build({ ...fuenteDe, id: 'estrada-villa-armando', nombre: 'Armando Estrada Villa', genero: 'Masculino', partidos: ['Partido Liberal'], congreso: { senador: true }, ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Pastrana'] }, decadas: d('2000s') }),
  build({ ...fuenteDe, id: 'londono-hoyos-fernando', nombre: 'Fernando Londoño Hoyos', genero: 'Masculino', partidos: ['Centro Democrático'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Uribe'] }, decadas: d('2000s') }),
  build({ ...fuenteDe, id: 'pretelt-de-la-vega-sabas', nombre: 'Sabas Pretelt de la Vega', genero: 'Masculino', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Interior'], gobiernos_gabinete: ['Uribe'] }, decadas: d('2000s') }),
  build({ ...fuenteDe, id: 'renjifo-velez-federico', nombre: 'Federico Renjifo Vélez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Interior', 'Minas y Energía'], gobiernos_gabinete: ['Santos'] }, decadas: d('2010s') }),
  // Su artículo dice que fue jefe de Juventudes del Nuevo Liberalismo (movimiento, hoy partido del catálogo).
  build({ ...fuenteDe, id: 'carrillo-florez-fernando', nombre: 'Fernando Carrillo Flórez', genero: 'Masculino', partidos: ['Nuevo Liberalismo'], ejecutivo: { ministerios: ['Justicia', 'Interior'], gobiernos_gabinete: ['Gaviria', 'Santos'] }, decadas: d('1990s', '2010s') }),

  // ── Otras 13 carteras, 1978–2018 (Defensa, Relaciones Exteriores, Justicia, Educación, Trabajo, Minas y Energía,
  //    Agricultura, Ambiente, TIC, Vivienda, Transporte, Salud y Comercio) ──
  // Cartera, periodo y presidente: la tabla de ministros de cada cartera en Wikipedia. Partido, género, lugar de
  // nacimiento y otros cargos: la ficha (infobox) y la primera frase del artículo de cada persona, leídos con la
  // API de Wikipedia. Cada comentario dice el artículo y lo que su ficha registra.
  // «Alberto Vásquez Restrepo»: partido Partido Conservador Colombiano · nació en 9 de marzo de 1922 / Medellín, Antioquia, República de Colombia · Gobernación (Antioquia)
  build({ ...fuenteDe, id: 'vasquez-restrepo-alberto', nombre: 'Alberto Vásquez Restrepo', genero: 'Masculino', region: 'Antioquia', partidos: ['Partido Conservador'], territorial: { gobernador: ['Antioquia'] }, ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Turbay'] }, decadas: ['1980s'] }),
  // «Diego Uribe Vargas»: partido 20px Partido Liberal Colombiano · nació en {{fecha|1|11|1931}} / Bogotá, Colombia
  build({ ...fuenteDe, id: 'uribe-vargas-diego', nombre: 'Diego Uribe Vargas', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Turbay'] }, decadas: ['1980s'] }),
  // «Hugo Escobar Sierra»: partido Partido Conservador · nació en {{fecha|22|6|1927}} / Plato, Magdalena, Colombia · Embajada
  build({ ...fuenteDe, id: 'escobar-sierra-hugo', nombre: 'Hugo Escobar Sierra', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Turbay'], embajador: true }, decadas: ['1980s'] }),
  // «Rodrigo Lloreda Caicedo»: partido 20px Partido Conservador Colombiano · nació en 2 de septiembre de 1942 / Cali, Colombia · Senado, Gobernación (Valle del Cauca)
  build({ ...fuenteDe, id: 'lloreda-caicedo-rodrigo', nombre: 'Rodrigo Lloreda Caicedo', genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Partido Conservador'], congreso: { senador: true }, territorial: { gobernador: ['Valle del Cauca'] }, ejecutivo: { ministerios: ['Defensa', 'Relaciones Exteriores', 'Educación'], gobiernos_gabinete: ['Pastrana', 'Betancur', 'Turbay'] }, decadas: ['1980s', '1990s'] }),
  // «Felio Andrade»: partido Partido Conservador Colombiano · nació en Tello, Huila, Colombia · Senado, Gobernación (Huila)
  build({ ...fuenteDe, id: 'andrade-manrique-felio', nombre: 'Felio Andrade Manrique', genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Partido Conservador'], congreso: { senador: true }, territorial: { gobernador: ['Huila'] }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Turbay'] }, decadas: ['1980s'] }),
  // «Carlos Albán Holguín»: partido Partido Conservador Colombiano / C Azul · nació en 21 de octubre de 1930 / Cali, Colombia · Embajada, Alcaldía (Bogotá)
  build({ ...fuenteDe, id: 'alban-holguin-carlos', nombre: 'Carlos Albán Holguín', genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Partido Conservador'], territorial: { alcalde: ['Bogotá'] }, ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Turbay'], embajador: true }, decadas: ['1980s'] }),
  // «Carlos Rodado Noriega»: partido 20px Partido Conservador Colombiano · nació en {{Fecha de inicio|20|septiembre|1943|edad}} / Sabanalarga, Atlántico, Colombia · Embajada, Embajada, Gobernación (Atlántico), Cámara
  build({ ...fuenteDe, id: 'rodado-noriega-carlos', nombre: 'Carlos Rodado Noriega', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], congreso: { representante_camara: true }, territorial: { gobernador: ['Atlántico'] }, ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Turbay', 'Santos'], embajador: true }, decadas: ['1980s', '2010s'] }),
  // «Bernardo Gaitán Mahecha»: partido Partido Liberal Colombiano · nació en — · Alcaldía (Bogotá)
  build({ ...fuenteDe, id: 'gaitan-mahecha-bernardo', nombre: 'Bernardo Gaitán Mahecha', genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: ['Partido Liberal'], territorial: { alcalde: ['Bogotá'] }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Betancur'] }, decadas: ['1980s'] }),
  // «Carlos Martínez Simahan»: partido Partido Conservador Colombiano · nació en 1938 / Galeras, Bolívar Grande, Colombia
  build({ ...fuenteDe, id: 'martinez-simahan-carlos', nombre: 'Carlos Martínez Simahan', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Betancur'] }, decadas: ['1980s'] }),
  // «Fernando Landazábal»: partido Partido Conservador Colombiano · nació en 13 de julio de 1922 / Pamplona (Colombia), Norte de Santander, Colombia · Embajada
  build({ ...fuenteDe, id: 'landazabal-reyes-fernando', nombre: 'Fernando Landazábal Reyes', genero: 'Masculino', region: 'Santanderes', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Betancur'], embajador: true }, decadas: ['1980s'] }),
  // «Jaime Arias Ramírez»: partido Partido Conservador Colombiano · nació en —
  build({ ...fuenteDe, id: 'arias-ramirez-jaime', nombre: 'Jaime Arias Ramírez', genero: 'Masculino', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Betancur'] }, decadas: ['1980s'] }),
  // «Rodrigo Lara Bonilla»: partido 20px Movimiento Revolucionario Liberal (1960-1967) / 20px Partido Liberal Colombiano (1967-1979) / Nuevo Liberalismo (1979-1984) · nació en {{Fecha|11|08|1946}} / Neiva (Colombia) · Senado, Cámara, Asamblea (Huila), Concejo (Neiva), Alcaldía (Neiva)
  build({ ...fuenteDe, id: 'lara-bonilla-rodrigo', nombre: 'Rodrigo Lara Bonilla', genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Nuevo Liberalismo', 'Partido Liberal'], congreso: { senador: true, representante_camara: true }, territorial: { diputado_asamblea: ['Huila'], concejal: ['Neiva'], alcalde: ['Neiva'] }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Betancur'] }, decadas: ['1980s'] }),
  // «Augusto Ramírez Ocampo»: partido Partido Conservador · nació en 21 de septiembre de 1934 / , Bogotá · Alcaldía (Bogotá)
  build({ ...fuenteDe, id: 'ramirez-ocampo-augusto', nombre: 'Augusto Ramírez Ocampo', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], territorial: { alcalde: ['Bogotá'] }, ejecutivo: { ministerios: ['Relaciones Exteriores', 'Comercio'], gobiernos_gabinete: ['Betancur', 'Pastrana'] }, decadas: ['1980s', '2000s'] }),
  // «Enrique Parejo González»: partido Nuevo Liberalismo / Partido Liberal Colombiano · nació en {{fecha|13|8|1930|edad}} / Ciénaga, Magdalena, Colombia
  build({ ...fuenteDe, id: 'parejo-gonzalez-enrique', nombre: 'Enrique Parejo González', genero: 'Masculino', region: 'Caribe', partidos: ['Nuevo Liberalismo', 'Partido Liberal'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Betancur'] }, decadas: ['1980s'] }),
  // «Iván Duque Escobar»: partido 20px Partido Liberal Colombiano · nació en {{fecha|20|5|1937}} / Gómez Plata, Antioquia, Colombia · Registrador, Gobernación (Antioquia)
  build({ ...fuenteDe, id: 'duque-escobar-ivan', nombre: 'Iván Duque Escobar', genero: 'Masculino', region: 'Antioquia', partidos: ['Partido Liberal'], territorial: { gobernador: ['Antioquia'] }, ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Betancur'], organos_control: ['Registrador'] }, decadas: ['1980s'] }),
  // «José Manuel Arias Carrizosa»: partido Partido Liberal Colombiano · nació en {{fecha|17|8|1933}} / Charalá, Santander, Colombia
  build({ ...fuenteDe, id: 'arias-carrizosa-jose-manuel', nombre: 'José Manuel Arias Carrizosa', genero: 'Masculino', region: 'Santanderes', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Barco'] }, decadas: ['1980s'] }),
  // «Edmundo López»: partido Partido Liberal Colombiano · nació en {{fecha|8|3|1924}} / San Andrés de Sotavento, Córdoba, Colombia
  build({ ...fuenteDe, id: 'lopez-gomez-edmundo', nombre: 'Edmundo López Gómez', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Barco'] }, decadas: ['1980s'] }),
  // «Enrique Low Murtra»: partido Liberal · nació en {{Fecha|23|03|1939}} / Bogotá, Colombia
  build({ ...fuenteDe, id: 'low-murtra-enrique', nombre: 'Enrique Low Murtra', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Barco'] }, decadas: ['1980s'] }),
  // «Jaime Giraldo Ángel»: partido Partido Conservador Colombiano · nació en {{Fecha|15|9|1929}} / Anserma, Caldas, Colombia
  build({ ...fuenteDe, id: 'giraldo-angel-jaime', nombre: 'Jaime Giraldo Ángel', genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Gaviria'] }, decadas: ['1990s'] }),
  // «Luis Fernando Jaramillo»: partido Partido Liberal Colombiano · nació en {{Fecha|24|julio|1935}} / Barranquilla, Colombia
  build({ ...fuenteDe, id: 'fernando-jaramillo-luis', nombre: 'Luis Fernando Jaramillo', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Relaciones Exteriores'], gobiernos_gabinete: ['Gaviria'] }, decadas: ['1990s'] }),
  // «Guido Nule Amín»: partido Partido Liberal Colombiano · nació en 1943{{fact}} / Tolú, Sucre, Colombia
  build({ ...fuenteDe, id: 'nule-amin-guido', nombre: 'Guido Nule Amín', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Gaviria'] }, decadas: ['1990s'] }),
  // «Antonio Hernández Gamarra»: partido Partido Liberal Colombiano · nació en {{Fecha|4|1|1944|edad}} / San Luis de Sincé, Sucre, Colombia · Contralor
  build({ ...fuenteDe, id: 'hernandez-gamarra-antonio', nombre: 'Antonio Hernández Gamarra', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Samper'], organos_control: ['Contralor'] }, decadas: ['1990s'] }),
  // «Daniel Mazuera»: partido Partido Conservador Colombiano · nació en {{Fecha|12|12|1945|edad}} / Bogotá, Colombia · Embajada, Senado, Cámara, Concejo (Bogotá)
  build({ ...fuenteDe, id: 'mazuera-gomez-daniel', nombre: 'Daniel Mazuera Gómez', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], congreso: { senador: true, representante_camara: true }, territorial: { concejal: ['Bogotá'] }, ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Samper'], embajador: true }, decadas: ['1990s'] }),
  // «Rodrigo Marín Bernal»: partido Partido Conservador · nació en {{fecha|28|12|1931}}{{fact}} / Chinchiná,{{fact}} Caldas, Colombia
  build({ ...fuenteDe, id: 'marin-bernal-rodrigo', nombre: 'Rodrigo Marín Bernal', genero: 'Masculino', region: 'Eje Cafetero', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Transporte', 'Comercio'], gobiernos_gabinete: ['Samper'] }, decadas: ['1990s'] }),
  // «Olga Duque de Ospina»: partido Partido Conservador Colombiano · nació en Olga Duque Palma Gómez Silva / {{fecha|14|7|1930}} / Neiva, Huila, Colombia · Embajada, Senado, Concejo (Neiva), Gobernación (Huila), Cámara
  build({ ...fuenteDe, id: 'duque-de-ospina-olga', nombre: 'Olga Duque de Ospina', genero: 'Femenino', region: 'Tolima/Huila', partidos: ['Partido Conservador'], congreso: { senador: true, representante_camara: true }, territorial: { concejal: ['Neiva'], gobernador: ['Huila'] }, ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Samper'], embajador: true }, decadas: ['1990s'] }),
  // «Orlando Cabrales Martínez»: partido Partido Conservador · nació en {{fecha|19|8|1939}} / Cartagena de Indias, Colombia
  build({ ...fuenteDe, id: 'cabrales-martinez-orlando', nombre: 'Orlando Cabrales Martínez', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Minas y Energía', 'Comercio'], gobiernos_gabinete: ['Samper'] }, decadas: ['1990s'] }),
  // «Guillermo González Mosquera»: partido Partido Liberal Colombiano · nació en 12 de febrero de 1941 / Popayán, Colombia · Gobernación (Cauca), Senado, Cámara, Alcaldía (Popayán)
  build({ ...fuenteDe, id: 'gonzalez-mosquera-guillermo', nombre: 'Guillermo González Mosquera', genero: 'Masculino', region: 'Cauca/Nariño', partidos: ['Partido Liberal'], congreso: { senador: true, representante_camara: true }, territorial: { gobernador: ['Cauca'], alcalde: ['Popayán'] }, ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Samper'] }, decadas: ['1990s'] }),
  // «Jaime Niño Díez»: partido Partido Liberal Colombiano · nació en 1942 / Colombia
  build({ ...fuenteDe, id: 'nino-diez-jaime', nombre: 'Jaime Niño Díez', genero: 'Masculino', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Samper'] }, decadas: ['1990s'] }),
  // «José Rizo Pombo»: partido Partido Conservador Colombiano · nació en 23 de noviembre de 1934 / Cartagena de Indias, Bolívar, Colombia · Alcaldía (Cartagena)
  build({ ...fuenteDe, id: 'rizo-pombo-jose', nombre: 'José Rizo Pombo', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], territorial: { alcalde: ['Cartagena'] }, ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Samper'] }, decadas: ['1990s'] }),
  // «Fernando Araújo Perdomo»: partido Partido Conservador Colombiano · nació en {{Fecha|27|6|1955|edad}} / Cartagena de Indias, Colombia
  build({ ...fuenteDe, id: 'araujo-perdomo-fernando', nombre: 'Fernando Araújo Perdomo', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Relaciones Exteriores', 'Comercio'], gobiernos_gabinete: ['Uribe', 'Pastrana'] }, decadas: ['1990s', '2000s'] }),
  // «Jaime Alberto Cabal»: partido Partido Conservador Colombiano · nació en 25 de mayo de 1959 / Buga, Departamento de Valle del Cauca, República de Colombia
  build({ ...fuenteDe, id: 'cabal-sanclemente-jaime-alberto', nombre: 'Jaime Alberto Cabal Sanclemente', genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Pastrana'] }, decadas: ['1990s', '2000s'] }),
  // «Rómulo González Trujillo»: partido Partido Conservador Colombiano · nació en 1938 / Garzón, Huila, Colombia · Senado
  build({ ...fuenteDe, id: 'gonzalez-trujillo-romulo', nombre: 'Rómulo González Trujillo', genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Partido Conservador'], congreso: { senador: true }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Pastrana'] }, decadas: ['1990s', '2000s'] }),
  // «Francisco José Lloreda»: partido 20px Partido Conservador Colombiano · tabla: Partido Conservador · nació en {{fecha|13|11|1965|edad}} / Cali, Colombia · Embajada
  build({ ...fuenteDe, id: 'jose-lloreda-francisco', nombre: 'Francisco José Lloreda', genero: 'Masculino', region: 'Valle del Cauca', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Educación'], gobiernos_gabinete: ['Pastrana'], embajador: true }, decadas: ['2000s'] }),
  // «Eduardo Pizano de Narváez»: partido Partido Conservador Colombiano · nació en {{Fecha|6|5|1957|edad}} / Bogotá, República de Colombia · Senado, Asamblea (Cundinamarca)
  build({ ...fuenteDe, id: 'pizano-de-narvaez-eduardo', nombre: 'Eduardo Pizano de Narváez', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], congreso: { senador: true }, territorial: { diputado_asamblea: ['Cundinamarca'] }, ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Pastrana'] }, decadas: ['2000s'] }),
  // «Luisa Fernanda Lafaurie»: partido Partido Conservador Colombiano · nació en {{Siglo|XX||s}}
  build({ ...fuenteDe, id: 'lafaurie-rivera-luisa-fernanda', nombre: 'Luisa Fernanda Lafaurie Rivera', genero: 'Femenino', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Pastrana'] }, decadas: ['2000s'] }),
  // «Andrés Uriel Gallego»: partido Partido Liberal Colombiano · nació en {{fecha|1|4|1950}} / Marinilla, Antioquia, Colombia
  build({ ...fuenteDe, id: 'uriel-gallego-andres', nombre: 'Andrés Uriel Gallego', genero: 'Masculino', region: 'Antioquia', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['Transporte'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s', '2010s'] }),
  // «Carlos Gustavo Cano»: partido Centro Democrático}} Carlos Gustavo Cano Sanz (Ibagué, Tolima, 5 de septiembre de 1946) es un economista y político colombiano. Fue ministro de agricultura durante el gobierno de Álvaro Uribe Vélez desde 2002 a 2005. == Biografía == Graduado de la Universidad de los Andes en 1970, con posgrados en Economía de la Universidad de Lancaster (1972), en Gobierno y en 
  build({ ...fuenteDe, id: 'gustavo-cano-carlos', nombre: 'Carlos Gustavo Cano', genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Centro Democrático'], ejecutivo: { ministerios: ['Agricultura'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s'] }),
  // «Cecilia Rodríguez González-Rubio»: partido — · tabla: Partido Conservador · nació en Barranquilla, Colombia
  build({ ...fuenteDe, id: 'gonzalez-rubio-cecilia-rodriguez', nombre: 'Cecilia Rodríguez González-Rubio', genero: 'Femenino', region: 'Caribe', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Ambiente'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s'] }),
  // «Camilo Ospina»: partido 20px Partido Conservador Colombiano · nació en 23 de diciembre de 1959 / Bogotá, Colombia · Embajada
  build({ ...fuenteDe, id: 'ospina-bernal-camilo', nombre: 'Camilo Ospina Bernal', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Defensa'], gobiernos_gabinete: ['Uribe'], embajador: true }, decadas: ['2000s'] }),
  // «Carlos Costa Posada»: partido — · tabla: Primero Colombia · nació en 1968 / Barranquilla, Colombia
  build({ ...fuenteDe, id: 'costa-posada-carlos', nombre: 'Carlos Costa Posada', genero: 'Masculino', region: 'Caribe', partidos: ['Primero Colombia'], ejecutivo: { ministerios: ['Ambiente', 'Vivienda'], gobiernos_gabinete: ['Uribe'] }, decadas: ['2000s', '2010s'] }),
  // «Beatriz Uribe»: partido Partido Conservador Colombiano · tabla: Partido Conservador, Partido Conservador · nació en {{fecha|2|12|1978|edad}} / Pereira, Colombia
  build({ ...fuenteDe, id: 'uribe-beatriz', nombre: 'Beatriz Uribe', genero: 'Femenino', region: 'Eje Cafetero', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Ambiente', 'Vivienda'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // «Diego Molano Vega»: partido — · tabla: Partido Liberal · nació en {{fecha|6|10|1967|edad}} / Tunja, Boyacá, Colombia
  build({ ...fuenteDe, id: 'molano-vega-diego', nombre: 'Diego Molano Vega', genero: 'Masculino', region: 'Boyacá/Cundinamarca', partidos: ['Partido Liberal'], ejecutivo: { ministerios: ['TIC'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // «Sergio Díaz-Granados»: partido Partido Liberal / (1994-2006) / Partido de la U · tabla: Partido de la U · nació en {{Fecha|3|10|1968|edad}} / Santa Marta, Colombia · Cámara, Asamblea (Magdalena), Concejo (Santa Marta)
  build({ ...fuenteDe, id: 'granados-guida-sergio-diaz', nombre: 'Sergio Díaz-Granados Guida', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal', 'Partido de la U'], congreso: { representante_camara: true }, territorial: { diputado_asamblea: ['Magdalena'], concejal: ['Santa Marta'] }, ejecutivo: { ministerios: ['Comercio'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // «Alfonso Gómez Méndez»: partido Partido Liberal Colombiano · nació en {{Fecha|16|8|1949|edad}} / Chaparral, Tolima, Colombia · Fiscal General, Procurador, Cámara, Embajada
  build({ ...fuenteDe, id: 'gomez-mendez-alfonso', nombre: 'Alfonso Gómez Méndez', genero: 'Masculino', region: 'Tolima/Huila', partidos: ['Partido Liberal'], congreso: { representante_camara: true }, ejecutivo: { ministerios: ['Justicia'], gobiernos_gabinete: ['Santos'], organos_control: ['Fiscal General', 'Procurador'], embajador: true }, decadas: ['2010s'] }),
  // «Amilkar Acosta»: partido Partido Liberal · nació en 1 de noviembre de 1950 / Riohacha / {{COL|LAG}} / Colombia / Amilkar David Acosta Medina · Senado
  build({ ...fuenteDe, id: 'acosta-medina-amylkar', nombre: 'Amylkar Acosta Medina', genero: 'Masculino', region: 'Caribe', partidos: ['Partido Liberal'], congreso: { senador: true }, ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
  // «Tomás González Estrada»: partido 20px Partido Conservador Colombiano · nació en —
  build({ ...fuenteDe, id: 'gonzalez-estrada-tomas', nombre: 'Tomás González Estrada', genero: 'Masculino', region: 'Bogotá', partidos: ['Partido Conservador'], ejecutivo: { ministerios: ['Minas y Energía'], gobiernos_gabinete: ['Santos'] }, decadas: ['2010s'] }),
]
