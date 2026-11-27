# ep8 — Por qué el último 20 % carga tan lento

Short vertical (1080×1920, 30 fps), 16 planos, una voz por plano, 59,7 s. Primer episodio hecho con la estructura de 8 piezas, el HUD (`src/engine/Hud.tsx`) y los subtítulos karaoke (`styles/retention-rules.md`). Short en español sin vídeo largo (cierre caso B).

## Puntuación de la idea (paso 4)

| Criterio | Resultado |
|---|---|
| Cercanía | `hand`: el móvil que el espectador tiene en la mano mientras lo ve. |
| Fotograma 0 | El conector USB‑C ya entrando en el puerto, grande en pantalla; chispa a los 0,3 s y el % empieza a correr. |
| Mecanismo visible | Iones que cruzan y se aparcan en las capas de grafito; contador `0 → 80 %` rápido, `80 → 84 %` lento, corriente `3,0 → 0,5 A`. |
| Metáfora única | La batería es un parking de iones; el plano final la enseña completa dentro del móvil. |
| Seguimiento | Dos cartas `? ?` (la promesa: «por qué» + «qué hace a escondidas») que pasan a ✓ en los planos 10 y 14. |
| Ángulo del gancho | Curiosidad útil (sin doble sentido). |

- Vídeo de referencia para la miniatura (paso 10): **pendiente**. Buscar en YouTube «por qué el móvil carga lento al final» / «why phone charging slows after 80», elegir el de más visitas y anotar aquí su URL y título.

## Reparto y voz

- Narrador único. Borrador Kokoro `em_alex` a `1.15` (59,9 s, 3,29 palabras/s) → `public/ep8/voice_kokoro.wav` + `timing_kokoro.json`.
- Máster ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`, `eleven_multilingual_v2`), velocidad base `1.15`, pausas de 0,08 s (0,35 s tras el gancho), 9 palabras recortadas y `node scripts/tempo.mjs ep8 1.05` → 59,7 s, 3,22 palabras/s.
- Arco: `[intriguing]` gancho → `[analytical]` promesa → `[curious]`/`[serious]` cuerpos → `[amazed]` bucles → `[warm]` cierre.

## Mapa de las 8 piezas

| Plano | Pieza | En pantalla | Número que se mueve |
|---|---|---|---|
| 1 | 1 Gancho | Conector entrando + chispa, la batería del móvil se llena | `0 → 80 %` en 2,3 s |
| 2 | 1 Gancho | El móvil enchufado, la barra apenas avanza | `80 → 83 %` lento |
| 3 | 2 Promesa | La cámara se acerca al móvil; aparecen 2 cartas `?` | — |
| 4–5 | 3 Cuerpo 1 | Dentro: iones (cian) cruzan del cátodo y aparcan en el grafito | (el parking se llena) |
| 6 | 3 Cuerpo 1 | Parking casi vacío llenándose rápido | `40 → 80 %` |
| 7 | 4 Bucle abierto | Empuje de cámara hacia la entrada casi llena | — |
| 8 | 5 Cuerpo 2 | Cola de iones en la entrada | `80 → 84 %` lento |
| 9 | 5 Cuerpo 2 | Crece litio metálico (costra plateada) en la entrada | — |
| 10 | 5 Cuerpo 2 | La carga se calma; carta 1 → ✓ | `3,0 → 0,5 A` (ilustrativo) |
| 11 | 6 Bucle abierto | Corte al dormitorio de noche | — |
| 12 | 7 Cuerpo 3 | Móvil en la mesilla, reloj 23:00 → 06:55 | `80 → 100 %` al final |
| 13 | 7 Cuerpo 3 | Barra al 100 % en naranja; comentario nativo «¿Y en Android?» | — |
| 14 | 7 Cuerpo 3 | Respuesta; carta 2 → ✓ | — |
| 15–16 | 8 Llamada a la acción | El parking completo dentro del móvil, dos ✓; alejamiento final | — |

## Guion (una voz por plano)

1. Tu móvil carga del 0 al 80 % volando…
2. y el último 20 % parece no acabar nunca.
3. En un minuto sabrás por qué, y qué hace tu móvil a escondidas para cuidar la batería.
4. Dentro de la batería viajan iones de litio…
5. y se aparcan entre capas de grafito, como coches en un parking.
6. Con el parking vacío, el cargador empuja a tope.
7. Pero eso no es lo más curioso.
8. Cuanto más lleno está, más le cuesta a cada ion encontrar sitio.
9. Si siguiera empujando igual, el litio se pegaría a la entrada como metal y la batería perdería capacidad.
10. Por eso, hacia el 80 %, el cargador baja la corriente. Por eso va lento.
11. Y aquí viene el truco.
12. Si lo cargas de noche, aprende tu horario: se para en el 80 % y acaba justo antes de que despiertes.
13. Pasar horas al 100 % desgasta la batería. En iPhone se llama carga optimizada. *(comentario nativo: lau.techh — «¿Y en Android? 👀»)*
14. En Android, carga adaptativa o protección de batería.
15. ¿Te diste cuenta? Tu móvil está ahora en algún porcentaje. Guárdalo y mira esta noche si la tienes activada.
16. Sígueme para entender lo que tienes en la mano.

## Verificación de datos

| Afirmación | Verificada como | Fuente |
|---|---|---|
| La carga va rápida hasta ~80 % y luego se frena | Sí: carga CC‑CV; corriente constante hasta que la celda llega a su voltaje máximo (en torno al 80 %), y luego voltaje constante con la corriente bajando | [SlashGear](https://www.slashgear.com/2125532/why-battery-charge-slower-last-20-percent); [Engadget](https://engadget.com/2307731/why-ev-fast-charging-slows-after-80-percent) |
| Los iones de litio se guardan entre capas de grafito | Sí (intercalación en el ánodo de grafito) | [NREL, fast charging and Li plating (2023)](https://nrel.gov/docs/fy23osti/82021.pdf) |
| Empujar fuerte con la batería llena deposita litio metálico y se pierde capacidad | Sí (*lithium plating*; el riesgo aumenta con carga rápida y estado de carga alto) | [NREL](https://nrel.gov/docs/fy23osti/82021.pdf); [PMC10449918](https://pmc.ncbi.nlm.nih.gov/articles/PMC10449918) |
| `3,0 → 0,5 A` en el plano 10 | **Ilustrativo**: la forma (corriente que baja) es real, las cifras exactas dependen del móvil y del cargador | — |
| El iPhone aprende tu rutina, se queda en el 80 % y termina antes de que lo uses; viene activado por defecto | Sí (Carga optimizada; necesita ~14 días y lugares habituales) | [Apple, Carga optimizada](https://support.apple.com/108055) |
| Pasar mucho tiempo al 100 % desgasta la batería | Sí (Apple: desactivar la optimización aumenta el desgaste) | [Apple](https://support.apple.com/108055) |
| Android: «carga adaptativa» (Pixel) o «protección de batería» (Samsung y otros), según la marca | Sí para Pixel (carga adaptativa termina justo antes de desenchufar); el nombre cambia por fabricante | [Google Pixel Help](https://support.google.com/pixelphone/answer/6090612) |

Antes de publicar: confirmar el nombre exacto en español del ajuste en Samsung («Protección de batería») en un móvil real.
