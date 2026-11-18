# Política Grid y Política Top 10

Dos juegos de trivia sobre la política colombiana en una sola aplicación, con una barra superior para alternar entre ellos (la ruta vive en el hash: `#/grid` y `#/top10`):

- **Política Grid**: cuadrícula 3×3 de los años 80 a 2026, inspirada en *Futbol 11 Grid* e *Immaculate Grid*.
- **Política Top 10**: listas de 10 o 5 filas (los últimos presidentes, los más votados, los ministros…), inspirada en *Futbol 11 Top 10* / *Football Tenable*. Ver [Política Top 10](#política-top-10).

Todo corre en el cliente: sin backend, con estadísticas y racha diaria en `localStorage`.

**Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4 (modo oscuro) + `lucide-react`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run validate   # valida la base de datos y el generador de tableros (Grid)
npm run simulate   # simula partidas contra el motor del juego (Grid)
npm run validate:top10  # valida las 53 listas de Top 10 y prueba la coincidencia de nombres
npm run fotos      # descarga retratos de los políticos a public/politicians/
npm run logos      # descarga logos de partidos a public/parties/
```

## Política Grid: cómo se juega

Cada casilla cruza el criterio de su fila con el de su columna (p. ej. *Senador/a* × *Partido Liberal*). Hay que ubicar un político distinto que cumpla ambos en cada una de las 9 casillas.

| Opción | Valores |
| --- | --- |
| **Modo** | **Búsqueda libre**: 9 casillas abiertas, buscador con autocompletado (debounce, sin tildes) y 9 intentos en total. |
| **Temporizador** | Sin tiempo, 90 s, 60 s, 40 s **por turno**. Si se acaba, termina la partida. |
| **Dificultad** | **Fácil**: ≥ 7 políticos válidos por casilla. **Normal**: 4 a 8. **Difícil**: criterios de nicho (circunscripción de Cámara, comisiones, asambleas, década exacta) con varias casillas de 2 o 3 opciones. **Leyenda**: 1 o 2 respuestas por casilla en toda la base de datos. |
| **Reto diario** | Mismo tablero para todos cada día (semilla = fecha). La dificultad depende del día de la semana; solo cuenta el primer intento. |

Al terminar (victoria, tiempo, errores o intentos) se puede tocar cualquier casilla para ver el **solucionario**: todos los políticos que cumplían el cruce y qué cargos o partidos los validaban.

Decisiones de diseño donde el enunciado dejaba margen:

- Un político repetido en la búsqueda libre no gasta intento.
- La racha diaria cuenta días consecutivos con el reto diario **ganado**.

## Estructura

```
src/
  data/
    types.ts            interfaz Politician y vocabularios cerrados (partidos, ministerios…)
    builder.ts          build() y d(): fichas compactas → Politician completo y estricto
    records/*.ts        los políticos, por grupo (presidencia, congreso, mesas, territorial, gabinete, regional)
    politicians.ts      POLITICIANS (508 políticos), POLITICOS_TABLERO (154) y comprobación de ids únicos
    parties.ts          catálogo de partidos: id, nombre oficial, sigla, colores y logo
    partyLogos.ts       GENERADO por `npm run logos` (no editar a mano)
    partyColors.ts      color del partido principal para los bordes de los avatares
    photos.ts           GENERADO por `npm run fotos` (no editar a mano)
    top10Types.ts       Top10Challenge / Top10Item
    top10Lists.ts       TOP10_LISTS: reúne las listas de top10/
    top10/*.ts          las listas por grupo (cargos-*, votos, presidenciales)
  top10/                motor de Política Top 10 (match, engine, daily, stats, share, people)
  utils/
    criteria.ts         catálogo de criterios (fila/columna) y redundancias
    gridGenerator.ts    generador de tableros + validación de solución
    matching.ts         emparejamiento bipartito (algoritmo de Kuhn)
    rng.ts, text.ts, search.ts, color.ts
  game/
    engine.ts           reducer puro de Búsqueda libre
    useGame.ts          hook (temporizador, ubicación automática, avisos)
    stats.ts, share.ts  estadísticas, racha diaria, texto compartible
  components/           pantallas y piezas de interfaz
scripts/
  validate.ts           comprueba la base de datos y 300 tableros por dificultad
  simulate.ts           simula partidas completas contra el motor
  validate-top10.ts     comprueba las listas de Top 10 (estructura, orden, aliases) y el motor de nombres
  fetch-official-photos.mjs   descarga retratos a public/politicians/ (npm run fotos)
  fetch-party-logos.mjs       descarga logos a public/parties/ (npm run logos)
public/
  politicians/          retratos locales ({id}.jpg|png)
  parties/              logos locales ({id}.png)
```

## Motor de tableros

`generateBoard(dificultad, semilla)` elige 3 criterios de fila y 3 de columna con un muestreo constructivo sobre una matriz precalculada de intersecciones, y **solo devuelve un tablero si existe una asignación de 9 políticos distintos que llene las 9 casillas** (emparejamiento bipartito). Nunca hay tableros sin solución.

- Evita cruces redundantes: un criterio que implica a otro (*Senador/a* ↔ *Presidente/a del Senado*, *Alcalde/sa de Cali* ↔ *Alcalde/sa*, …) no se cruza con él.
- Varía los tableros: al menos 3 categorías distintas, sin tres décadas en un mismo eje, sin más de dos décadas en total.
- `npm run validate` genera 300 tableros por dificultad y comprueba rangos de respuestas, existencia de solución y que la solución guardada sea válida; todo corre en menos de 1 ms por tablero.

## Datos

La base tiene **508 políticos**: 154 «de tablero», con ficha completa, y 354 regionales (ver [Fichas regionales](#fichas-regionales)). Las 154 de tablero siguen el esquema multidimensional pedido (identificación, partidos, Congreso, poder territorial, carrera presidencial, ejecutivo/diplomacia/control, décadas e hitos), más `presidente` y `vicepresidente` en la carrera presidencial.

Cobertura de los criterios de nicho (políticos por criterio):

| Criterio | Políticos |
| --- | --- |
| Presidentes de comisión | I: 7 · II: 4 · III: 4 · IV: 2 · V: 7 · VI: 2 · VII: 3 · Acusaciones: 2 |
| Vicepresidentes de la mesa directiva | 13 (Senado 2020-2026, Cámara 2014-2019 y 2022-2023, según la ficha) |
| Presidentes del Senado / de la Cámara | 25 / 18 (Senado completo desde 2001 salvo Valencia Cossio y Pinedo Vidal) |
| Circunscripción de Cámara | Bogotá 18 · Antioquia 8 · Valle 6 · Cundinamarca 5 · Norte de Santander 3 · Córdoba 3 · Caldas 3 · el resto 1-2 |

Cómo se compilaron y qué esperar:

- Se escribieron a partir de conocimiento general y se **contrastaron con Wikipedia** (fichas individuales, listas de presidentes del Senado y de la Cámara y las elecciones de 2026) en noviembre de 2026. En esa pasada se corrigieron varios datos (lugares de nacimiento, cargos, partidos). La ampliación de noviembre de 2026 (`records/mesas.ts`) añadió presidentes de comisión, vicepresidentes y representantes con su circunscripción a partir de las fichas y de notas de prensa sobre la instalación de las comisiones.
- **Criterio editorial: ante la duda, el dato se omite.** El juego prefiere dejar fuera una respuesta correcta antes que validar una falsa. Por eso algunas fichas son parciales y algunos criterios de nicho tienen pocos políticos.
- `region_origen` es la región del **lugar de nacimiento** según la ficha (p. ej. Roy Barreras nació en Bogotá aunque su carrera sea vallecaucana). Cuando la ficha no lo consigna vale `'Sin dato'`: esa ficha no entra en ningún criterio de origen.
- Las presidencias de comisión se tomaron de la elección de la mesa directiva de cada legislatura; no se cubrieron todos los años (hay datos de 2013-14, 2018-19, 2020-2026).
- «Militó en 3 o más partidos» se deriva automáticamente de `partidos`; el primer partido de la lista es el principal (color del avatar).
- «Gabinete de X» incluye ministros y altos consejeros o directores de departamento administrativo cuando la ficha lo indica. Desarrollo Económico y Comercio Exterior cuentan como `Comercio`; Comunicaciones, como `TIC`; Gobierno, como `Interior`.
- Pendientes conocidos: los presidentes de comisión de 2026-2027 de las Comisiones III y IV del Senado (Sara Castellanos, Liliana Benavides), VI (Carlos Guevara) y varias de la Cámara (Uscátegui, Jay-Pang, Cuello, Bermúdez, Salazar) no se agregaron porque no hallé fichas verificables; tampoco los presidentes de la Cámara Carlos Cuenca (2019-20), Augusto Posada y Carlos Alberto Zuluaga, ni los del Senado Fabio Valencia Cossio y Miguel Pinedo Vidal.
- Ocho fichas de representantes (`'Sin dato'`) tienen solo circunscripción, partido y comisión: faltan su lugar de nacimiento y su trayectoria previa.

### Fichas regionales

`records/regional.ts` agrega **354 personas** con `perfil_regional: true`:

| Cargo | Alcance | Fuente |
| --- | --- | --- |
| Gobernadores | Los 32 departamentos, elegidos en 2011, 2015, 2019 y 2023 (periodos 2012–2027) | Wikipedia (es): «Elecciones regionales de Colombia de 2011/2015/2019/2023» |
| Alcaldes de capitales | Las 30 capitales con alcalde propio y Bogotá, mismas elecciones | Ídem (en San Andrés el gobernador hace de alcalde) |
| Concejales | Bogotá 2020–2023 y 2024–2027 · Medellín 2024–2027 · Barranquilla 2020–2023 y 2024–2027 · Cali 2024–2027 | Anexos del Concejo de Bogotá, «Concejo de Medellín», «Concejo de Barranquilla» y elecciones locales de Barranquilla 2023 (Wikipedia); sitio oficial del Concejo de Cali |

Por qué «regionales»: son casi todas figuras poco conocidas fuera de su región. **Valen como respuesta correcta**, salen en el buscador y al final del solucionario, pero **no se usan para generar ni calibrar tableros** (`POLITICOS_TABLERO` las excluye). Así un tablero «Fácil» sigue siendo fácil con políticos conocidos, y las regionales solo suman respuestas aceptadas: unas 21 por tablero fácil, 8 por normal o difícil y casi 2 por leyenda (`npm run validate`).

Criterios de rigor:

- **Partido**: solo si la tabla de resultados da un único partido del catálogo; si fue una coalición de varios partidos, queda vacío (no se sabe a cuál pertenece la persona, y no debe activar «Militó en 3 o más partidos»). 222 de 354 tienen partido.
- **Origen** (lugar de nacimiento): solo si el artículo de Wikipedia de la persona lo da. 87 lo tienen; el resto es `'Sin dato'`.
- **Género**: del artículo cuando existe; si no, del nombre de pila, con los casos dudosos verificados uno a uno.
- Dos fichas existentes se completaron: Elsa Noguera (gobernadora del Atlántico 2020–2023) y José Octavio Cardona (alcalde de Manizales 2016–2019).
- Erratas de Wikipedia corregidas con otra fuente: «Freddy de Jesús Varón Orozco» (Barranquilla 2020–2023) es Barón Orozco, como en la lista de 2024 con votos de la Registraduría.

No incluye: encargados ni gobernadores o alcaldes de elecciones atípicas; alcaldes de municipios que no son capital; concejales de Medellín y Cali 2020–2023 (Wikipedia solo da el más votado de cada partido).

### Agregar un político

Edita el archivo de `src/data/records/` que corresponda:

```ts
build({
  id: 'apellido-nombre',
  nombre: 'Nombre Apellido',
  genero: 'Masculino',
  region: 'Antioquia',
  partidos: ['Partido Liberal'],            // el primero es el principal
  congreso: { senador: true },              // solo lo que es verdadero
  territorial: { alcalde: ['Medellín'] },
  decadas: d('1990s-2000s'),
})
```

Los vocabularios están tipados (`types.ts`): una errata en un partido, departamento o ciudad falla en `npm run build`. Si necesitas un valor nuevo, añádelo allí; el criterio correspondiente aparece solo en los tableros en cuanto haya al menos un político que lo cumpla. Después corre `npm run validate`.

## Política Top 10

Cada reto es una lista de **10 o 5 filas** numeradas. De cada fila se ve, antes de acertar, el número, el logo del partido (`<PartyLogo />`) y una pista (años en el cargo, votos…); el nombre está oculto. Se escribe en una caja única al pie y, al acertar, la fila se rellena en verde con el nombre, la foto (si el político está en la base de Política Grid) y un dato extra.

| Opción | Valores |
| --- | --- |
| **Fallos** | 3 vidas. Un nombre que no está en la lista cuesta una; un intento vago o ambiguo no. |
| **Rendirse** | Botón de bandera (pide confirmar): revela las filas que faltan con su `dato_extra`. |
| **Modo de tiempo** | **Normal** (sin límite) o **Contrarreloj 2 min** (120 s en cuenta regresiva; al llegar a 0 termina la partida). |
| **Reto diario** | La misma lista para todos cada día: recorre las 53 listas en un orden fijo y mezclado, sin repetir hasta agotarlas. Solo cuenta el primer intento. La **racha** cuenta los días en que se aciertan **todas** las filas. |
| **Partida libre** | Categoría (o «Aleatoria») + modo de tiempo. |
| **Compartir** | Texto con emojis: `1️⃣🟩 2️⃣🟩 3️⃣🟥 …`, vidas y modo. |

**Coincidencia de nombres** (`src/top10/match.ts`): sin tildes ni mayúsculas, se acepta el nombre completo, un alias o cualquier tramo del nombre que incluya un apellido (`Galán`, `Carlos Fernando Galán`, `Lucho Garzón`, `Fico`, `de la Espriella`). Un nombre de pila suelto (`Gustavo`) no cuenta. Se perdona una errata (dos si el texto tiene 9 o más letras). Si lo escrito sirve para dos filas (los dos *Jaime Pumarejo* de Barranquilla) o es demasiado vago, el juego avisa sin quitar vida y, entre homónimos, se asigna la fila que falta. El autocompletado sugiere nombres de **todo** el juego (no solo de la lista actual), para no delatar las respuestas, y se puede apagar.

### Las listas

`src/data/top10Lists.ts` reúne **53 listas** (30 de 10 filas y 23 de 5), 415 filas y 288 personas, con el esquema `Top10Challenge` → `Top10Item { posicion, nombre, aliases, partido, pista_visible, dato_extra }` más `fuente` y `nota` por lista (se muestran al terminar). `partido` es un `Partido` del catálogo o `null` (independiente o movimiento sin entrada): con `null` se pinta un marcador neutro.

| Categoría | Listas |
| --- | --- |
| **Últimos en el cargo** (23) | Presidentes · vicepresidentes · alcaldes de Bogotá, Medellín, Cali y Barranquilla · gobernadores de Antioquia (5) · presidentes del Senado y de la Cámara · ministros de Hacienda, Interior, Defensa, Educación, Salud, Comercio, Transporte y Ambiente · cancilleres · ministros de Trabajo y de Minas (5) · procuradores, contralores y fiscales (5) |
| **Más votados en Congreso** (3) | Senado 2022 (5), 2018 y 2014 |
| **Gobernaciones, alcaldías y concejos** (14) | Alcaldes de Bogotá por votación total y por porcentaje (5) · gobernadores más votados de 2011, 2015, 2019 y 2023 · alcaldes de capitales más votados de esas mismas elecciones · gobernadores 2023 con mayor porcentaje (5) · gobernadoras y alcaldesas de capitales más votadas 2011–2023 (5) · concejales electos de Barranquilla 2023 más votados |
| **Presidenciales e hitos** (13) | Primera vuelta de 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022 y 2026 (5) · últimos 5 derrotados en segunda vuelta · 5 mujeres más votadas · top 10 de votos en una segunda y en una primera vuelta |

Reglas de las listas «Últimos…»: la fila 1 es la más reciente; **cada persona cuenta una vez**, por su periodo más reciente (Peñalosa, Mockus o Char aparecen una sola vez aunque hayan repetido), y **no se cuentan interinos ni encargados**.

### De dónde salen los datos y qué quedó fuera

Todos los datos se contrastaron en noviembre de 2026 con Wikipedia (es/en: anexos de presidentes, alcaldes, ministerios, órganos de control y páginas de cada elección) y, en los hechos de 2026 más recientes (contralor Laverde, ministro Ordóñez), con prensa. Cada lista guarda su `fuente` y, si hace falta, una `nota`.

- **Cifras de votos**: Wikipedia da el escrutinio en unas elecciones y el preconteo en otras, y a veces las dos con diferencias pequeñas (p. ej., Petro en 2022: 11.281.013 o 11.292.758 votos en la segunda vuelta). Se usa una sola fuente por lista y se avisa en `nota`; el orden de las filas no cambia entre fuentes. Las cifras de Senado 2022 son del preconteo; las de Senado 2014 y 2018, de la tabla de senadores electos de Wikipedia. **El 5.º puesto de la primera vuelta de 2022 (John Milton Rodríguez, 271.386) viene de la edición en inglés**; los otros cuatro, de la edición en español.
- **Pedido que no se pudo cumplir tal cual**:
  - *Cámara por Bogotá, Antioquia, Valle y Atlántico (2022)* y *concejales de Bogotá (2019 y 2023) y de Medellín (2023)*: faltan. Los votos **por candidato** solo están completos en el sitio de la Registraduría (no consultable de forma automática); Wikipedia solo trae votos por partido y las notas de prensa mezclan preconteo y escrutinio y no alcanzan para un ranking de diez nombres. Se prefirió no publicarlas antes que inventar o adivinar.
  - *Senado 2022 (Top 10)* quedó en **Top 5**: solo hay cinco filas verificadas.
  - *Últimos 10 derrotados en segunda vuelta (1994–2022)* quedó en **Top 5**: solo ha habido siete segundas vueltas (1994, 1998, 2010, 2014, 2018, 2022 y 2026).
  - *Top 5 gobernadores de Antioquia más votados* y *constituyentes de 1991*: no se hallaron votos por candidato; en su lugar, «Últimos 5 gobernadores de Antioquia».
  - *«Presidentes desde Betancur hasta Petro»* son 9 nombres; con Abelardo de la Espriella (posesionado el 7 de agosto de 2026) son 10.
- Los alcaldes de 1988–1990 de Barranquilla son un caso especial: ganó Jaime Pumarejo Certain, pero el Consejo de Estado anuló mesas y declaró ganador a su primo Gustavo Certain Duncan.

- **Listas regionales** (`top10/regionales.ts`): votos y porcentajes de los ganadores según las tablas de Wikipedia de las elecciones regionales de 2011, 2015, 2019 y 2023, las mismas de las fichas regionales. Pueden diferir un poco del escrutinio oficial (Galán 2023: 1.499.734 aquí y 1.497.596 en El Tiempo). Tres filas de la fuente estaban incompletas: Pasto 2023 sin votos (no entra en el top: unos 74.000 según la prensa), Santa Marta 2023 sin porcentaje y Riohacha 2023 con una errata («35;67%»). Por eso no hay lista de alcaldes por porcentaje. La de concejales de Barranquilla solo incluye a los elegidos.

Para agregar una lista, escribe una entrada con `lista({...})` en el archivo de `src/data/top10/` que corresponda (cada fila es `[nombre, aliases, partido, pista, extra]`) y corre `npm run validate:top10`: comprueba posiciones, que el nombre y cada alias lleven a su fila, que los votos bajen (o los años retrocedan) fila a fila y los avisos de aliases ambiguos.

## Logos de partidos

`src/data/parties.ts` es el catálogo de los 30 partidos del vocabulario: `id` (slug), nombre oficial, `sigla`, `color_primario` y `color_secundario` (tomados mirando cada logo; no hay manuales de marca oficiales) y `logo_url`. `npm run logos` (`scripts/fetch-party-logos.mjs`) busca la página del partido en Wikipedia, lee el parámetro `logo` de su ficha, baja la miniatura de 250 px desde Wikimedia (los SVG llegan como PNG) y comprueba que sea una imagen real de más de 1 KB. Guarda autor y licencia (`logo_licencia`) y rechaza un mismo archivo para dos partidos.

`<PartyLogo />` muestra el logo sobre un recuadro claro (`bg-white/95`, `object-contain`); si no hay imagen, o falla, dibuja un **escudo con la sigla** en los colores del partido. Se usa en los encabezados del tablero, en la esquina de los avatares, en el solucionario y en cada fila de Top 10.

**27 de 30 con logo.** Los de *Centro Democrático* (el emblema del hombre con la mano al corazón) y *Alianza Verde* (el logo «Partido Verde» con el girasol) los aportó el usuario; `HINTS.manual` en el script impide que `npm run logos` los sobrescriba. Quedan como escudo con sigla *Sí Colombia*, *Colombia Democrática* y *Colombianas y Colombianos por la Paz*: Wikipedia solo enlaza para ellos el logo de «Somos» (su sucesor) o el de otro partido, y no hay logo propio en Commons. Los logos son emblemas de cada organización, usados aquí solo para identificarla; la licencia de cada archivo está en `partyLogos.ts`.

## Retratos

`npm run fotos` (`scripts/fetch-official-photos.mjs`) descarga retratos a `public/politicians/` con una cascada: portales oficiales `.gov.co` (Senado, Cámara; Presidencia y ministerios solo con URLs indicadas a mano) → Congreso Visible (Uniandes) → Wikipedia/Wikimedia (agente `PoliticaGridApp/1.0`). Tolera certificados intermedios incompletos **solo** en `.gov.co`. Valida `image/*`, más de 5 KB y proporciones de retrato, y escribe `src/data/photos.ts` (`foto_url`, `foto_fuente`, `foto_origen`). Opciones: `--force`, `--only=id,id`, `--no-wiki`, `--dry`, `--verbose`. La interfaz muestra «Foto: fuente» en el solucionario y cae a las iniciales si no hay foto o falla la carga.

Limitaciones: Wikimedia limita (HTTP 429) las descargas de miniaturas, así que el script espera y reintenta, y una pasada completa tarda; las búsquedas en Presidencia y en buscadores no se automatizan (no se eluden bloqueos anti-bot).
