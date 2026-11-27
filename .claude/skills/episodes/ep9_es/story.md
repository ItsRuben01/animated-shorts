# ep9_es — Bolas perfectas a golpes (cómo se hace una bola de rodamiento)

Short vertical (1080x1920, 30 fps), 21 planos, una voz por plano. Short bilingüe; `episodes/ep9_en` es una adaptación nativa al inglés. Los mismos decorados 3D sirven para los dos idiomas: etiquetas del mundo solo con números y unidades (`20 t`, `840 °C`, `80 nm`, `G3`, `×10⁶`).

## Validación del tema (2026-11-26, yt-dlp)

- Vídeo de referencia (paso 10): **«Process of Making Ball Bearing with Modern Technology. Bearing Factory in Korea»** — https://www.youtube.com/watch?v=T53zdMvOPmE (14,4 M visitas). Otros: «THE MAKING (314) The Making of Steel Balls» — https://www.youtube.com/watch?v=19duYMdiXi0 (7,6 M); «How It's Made - Ball Bearings (NTN)» — https://www.youtube.com/watch?v=b6svVy1lYOA (1,7 M).
- Shorts (<70 s): el mayor es «Burning paper with steel ball-bearings» (54 K) y no cuenta el proceso; el mayor sobre fabricación tiene 3,8 K. Hueco libre.
- Formato: **4X viable** (Short ES + EN ahora; Long genérico «cómo se fabrica un rodamiento de bolas»: bolas, aros, jaula y montaje, con demanda de 14 M+). Este Short cierra con el **Caso B** hasta que exista el Long; al publicar el Long, cambiar el plano 21 al Caso A.
- Propuestas descartadas y alternativas: `episodes/ep9_ideas.md`.

## Reparto y dirección emocional

- **Narrador cómplice y expresivo, voz única** (actualizado 2026-11-26: el máster plano anterior aburría). ES: máster ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`, `eleven_v4`, etiquetas de emoción por plano en `sayTts`, atempo ×1,2 local: 87,7 s). EN: máster `Brian` (`nPczCjzI2devNBz1zQrb`, mismo método: 83.5 s). Comando: `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <label> 1.0 --tempo=1.2`. Respaldo Kokoro en `public/ep9_*/voice_kokoro.wav`. El narrador disfruta el doble sentido: sonrisa en el gancho, pausa antes del chiste y risa después.
- Arco: `[intriguing]` gancho → `[analytical]` definición → `[serious]` pasos → `[chuckles]` guiños («un par… o cien», «cuanto más las frotan, más duras») → `[amazed]` Saturno, lapeado, 80 nm y la Tierra → `[enthusiastic]` etiqueta a tu amigo → `[warm]` despedida.
- Pronunciación: «840» y «20» siempre en letra en `say`; «nanómetros» sin prisa.
- Prohibido: encadenar el gancho con el plano 2 sin la pausa de 0,4 s; leer el plano 9 con risa (el guiño funciona seco).
- Personajes (meme-fusión, estilo por defecto): guía de fábrica con casco, gafas y bata (`face: smirk`); el fan de la mecánica con mono vaquero y gorra (`face: troll`/`happy`), que es también «tu amigo» del final.

## Mapa de la escalera de retención

| Plano | Paso | Función |
|---|---|---|
| 1–2 | Gancho | Doble sentido («bolas… a golpes») + giro documental |
| 3 | Gancho 3+1 | 20 t, 840 °C… y un cuarto paso que falta |
| 4–5 | 1 | Definición literal y pregunta |
| 6–7 | 2 | Estampado en frío: la bola sale con anillo (Saturno) |
| 8–9 | 3 | Placas con surcos quitan el anillo; guiño: el acero se endurece al trabajarlo |
| 10–11 | 5 | Temple a 840 °C + aceite; giro: si falla, el rodamiento se gasta |
| 12–14 | 6 | Comentario de un espectador y respuesta (vibración) |
| 15–16 | 4 / 8 | Cuarto paso: lapeado; prueba en lupa: 80 nm |
| 17 | 7 | Comparación: la bola del tamaño de la Tierra |
| 18 | 8 | Clasificado por tamaño: todas gemelas |
| 19–20 | 9 | Antes / después + etiqueta a tu amigo |
| 21 | 10 | Despedida Caso B |

## Guion (una voz por plano)

1. ¿Sabías que las bolas más perfectas del mundo se hacen a golpes?
2. No te preocupes: hoy te enseño cómo.
3. Un golpe de 20 toneladas, un horno a 840 grados… y un cuarto paso que las deja casi perfectas.
4. Una bola de rodamiento es acero duro, redondo y brillante. Y todo lo que gira necesita un par… o cien.
5. Pero, ¿cómo las dejan tan redondas?
6. Paso uno: trocitos de alambre, aplastados entre dos copas.
7. Hasta 20 toneladas por golpe. Y sale con un anillo, como Saturno.
8. Paso dos: ruedan entre placas con surcos, hasta que el anillo desaparece.
9. Y sí: cuanto más las frotan, más duras se ponen.
10. Paso tres: horno a 840 grados, y baño de aceite.
11. Si el temple falla, queda blanda, y el rodamiento se gasta en nada.
12. Mira lo que me escribió alguien:
13. ¿Y para qué tan perfectas, si nadie las ve?
14. Porque giran miles de veces por minuto: un bulto, y todo vibra.
15. Por eso, el cuarto paso: el lapeado, con placas blandas y pasta abrasiva.
16. Al final, se desvían de la esfera perfecta solo 80 nanómetros.
17. Si una bola de un centímetro fuera como la Tierra, su montaña más alta mediría 100 metros.
18. Luego se separan por tamaño: en un rodamiento, todas gemelas.
19. Antes, un trozo de alambre; ahora, una bola perfecta con el nombre de tu amigo.
20. Etiqueta o pasa este vídeo a tu amigo que presume de tenerlas perfectas.
21. ¡Hasta luego! Si te ha gustado, dale a me gusta y síguenos.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| Se corta alambre en trocitos («slugs») con algo más de volumen que la bola final | Sí | [GlobalSpec, How are bearing balls made?](https://insights.globalspec.com/article/12349/how-are-bearing-balls-made); [Wikipedia, Ball (bearing)](https://en.wikipedia.org/wiki/Ball_(bearing)) |
| Se estampan en frío entre dos matrices semiesféricas, con 10–20 toneladas | Sí («hasta 20 t» en el guion) | [Acorn Industrial, How are the balls in ball bearings made?](https://www.acorn-ind.co.uk/insight/how-are-the-balls-in-ball-bearings-made/); [HowStuffWorks](https://www.howstuffworks.com/question513.htm) |
| Sale con un anillo de rebaba alrededor («flash») | Sí | [Acorn Industrial](https://www.acorn-ind.co.uk/insight/how-are-the-balls-in-ball-bearings-made/); [Wikipedia](https://en.wikipedia.org/wiki/Ball_(bearing)) |
| Se quita rodando entre dos placas con surcos (una fija, otra girando) | Sí (rill plates) | [Wikipedia](https://en.wikipedia.org/wiki/Ball_(bearing)) |
| La presión de las placas endurece el acero (acritud / trabajo en frío) | Sí | [HowStuffWorks](https://www.howstuffworks.com/question513.htm) |
| Temple: austenizado a ~840 °C y enfriado en aceite (acero AISI 52100) | Sí | [Universidad de Cambridge, guía de aceros de rodamientos](https://www.phase-trans.msm.cam.ac.uk/2026/SG-bearings.html); [Gear Solutions, temple del 52100](https://gearsolutions.com/?p=27805) |
| Si la bola no llega a la dureza (≥ 58 HRC), el rodamiento dura mucho menos | Sí | [ASM International, AM&P sept. 2023](https://static.asminternational.org/amp/202309/50/) |
| Lapeado: placas más blandas, menos presión y abrasivo | Sí | [Wikipedia](https://en.wikipedia.org/wiki/Ball_(bearing)); [GlobalSpec](https://insights.globalspec.com/article/12349/how-are-bearing-balls-made) |
| Grado 3: desviación de la esfera ≤ 0,08 µm (80 nm) | Sí (3 millonésimas de pulgada) | [Wikipedia, tabla de grados](https://en.wikipedia.org/wiki/Ball_(bearing)); [NHBB, Ball grades](https://www.nhbb.com/knowledge-center/engineering-reference/ball-roller-bearings/ball-grades) |
| Bola de 1 cm escalada a la Tierra → montaña de ~100 m | Cálculo propio: 12 742 km × 80 nm / 1 cm = 102 m | — |
| Se clasifican por diámetro en lotes; un rodamiento lleva bolas del mismo lote | Sí (variación de diámetro del lote) | [Wikipedia](https://en.wikipedia.org/wiki/Ball_(bearing)); [EIS, Bud's Take 15](https://www.eis-inc.com/knowledge-center/buds-take/buds-take-15) |
| Giran miles de veces por minuto | Sí (motor eléctrico típico: 1500–3600 rpm) | [EIS](https://www.eis-inc.com/knowledge-center/buds-take/buds-take-15) |

Nota: el grado 3 es de los más precisos del mercado; las bolas de un rodamiento corriente (grado 10–25) son algo menos perfectas. El guion habla del máximo que se consigue, sin decir que todas sean así.
