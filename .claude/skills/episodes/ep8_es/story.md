# ep8_es — La salchicha desnuda (por qué le quitan la piel)

Short vertical (1080x1920, 30 fps), 21 planos, una voz por plano. Short bilingüe; `episodes/ep8_en` es una adaptación nativa al inglés. Los mismos decorados 3D sirven para los dos idiomas: etiquetas del mundo solo con números y unidades (`0 °C`, `Ø mm`, `68 °C · 155 °F`, `1920s`).

## Validación del tema (2026-11-25, yt-dlp)

- Vídeo largo de referencia (paso 10): **«How It's Actually Made - Hot Dogs»** — https://www.youtube.com/watch?v=Z-zR1SgrM-w (10,5 M visitas). En español: **«COMO se HACEN las SALCHICHAS de Frankfurt🌭 | Así se FABRICAN millones de SALCHICHAS en las FÁBRICAS»** — https://www.youtube.com/watch?v=n82Nqfih9vE (1,8 M).
- Shorts sobre el giro (pelar la tripa de celulosa): el mayor es «How to Remove a Sausage Casing» (142 K, cocina casera); ninguno cuenta la peladora industrial. Hueco libre.
- Formato: **4X viable** (Short ES + EN ahora; Long genérico «cómo se fabrican los embutidos cocidos» con demanda de 10 M+). Este Short cierra con el **Caso B** hasta que exista el Long; al publicar el Long, cambiar el plano 21 al Caso A.

## Reparto y dirección emocional

- **Narrador documental serio, voz única.** ES: borrador Kokoro `em_alex` a `1.24` (64,4 s, 3,67 palabras/s); máster ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`, `eleven_multilingual_v2`, velocidad base 1.15 + ajuste por emoción, silencios recortados y acelerado ×1,1 con ffmpeg: 75,1 s; tiempos sin acelerar en `timing_eleven_raw.json`). EN: Kokoro `am_michael` a `1.27` (66,0 s, 3,55 palabras/s); máster ElevenLabs `Brian` (73,8 s). Respaldo Kokoro en `public/ep8_*/voice_kokoro.wav`. El chiste es el contraste: el gancho nunca se lee con risa.
- Arco: `[intriguing]` gancho → `[analytical]` definición → `[serious]` pasos → `[chuckles]` guiños (presión, tamaño, móvil) → `[amazed]` peladora y Freund → `[enthusiastic]` etiqueta a tu amigo → `[warm]` despedida.
- Pronunciación: «Freund» se dice «Froind»; «68» y «155» siempre en letra en `say`.
- Prohibido: encadenar el gancho con el plano 2 sin la pausa de 0,4 s.
- Personajes (meme-fusión, estilo por defecto): guía de fábrica con bata, casco y gafas (`face: smirk`), y el fan de las salchichas con camisa de cuadros (`face: troll`/`happy`).

## Mapa de la escalera de retención

| Plano | Paso | Función |
|---|---|---|
| 1–2 | Gancho | Doble sentido («la desnudan») + giro documental |
| 3 | Gancho 3+1 | Hielo, piel que no es carne, 68 °C… y un cuarto paso secreto |
| 4–5 | 1 | Definición literal y pregunta |
| 6–7 | 2 | Picado con hielo; giro: la grasa caliente arruina el lote |
| 8–10 | 3 | Embutido a presión (guiño del tamaño) y eslabones |
| 11 | 4 | Horno a 68 °C + ducha fría (termómetro en rayos X) |
| 12–14 | 6 | Comentario de un espectador y respuesta |
| 15 | 8 | Cuarto paso: la peladora |
| 16 | 7 | Analogía: el plástico del móvil nuevo |
| 17–18 | 5 | Prueba (corte: la proteína cuaja en piel) + Freund |
| 19–20 | 9 | Antes / después + etiqueta a tu amigo |
| 21 | 10 | Despedida Caso B |

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| La carne se pica con hielo picado para mantener la pasta fría | Sí | [meatsandsausages.com, embutidos emulsionados](https://meatsandsausages.com/sausage-types/emulsified-sausage); [Ohio State, Meat Emulsions](https://meatsci.osu.edu/node/130) |
| La grasa entra la última y fría; si se calienta se «embarra» y la salchicha suelta grasa al cocerse | Sí (picar hasta ~7 °C / 45 °F y luego añadir la grasa) | [meatsandsausages.com](https://meatsandsausages.com/sausage-types/emulsified-sausage); [Ohio State](https://meatsci.osu.edu/node/130) |
| Se embute a presión en tripa de celulosa; el calibre lo marca la tripa (14,5–45 mm) | Sí | [Patente US9717268](https://patents.google.com/patent/US9717268); [Wikipedia, Sausage casing](https://en.wikipedia.org/wiki/Sausage_casing) |
| La tripa de celulosa no se come | Sí; las tripas de celulosa se retiran antes de vender | [Wikipedia, Sausage casing](https://en.wikipedia.org/wiki/Sausage_casing) |
| Cocción hasta ~68 °C (155 °F) en el centro y ducha de agua fría | Sí como límite habitual de proceso (no es una norma federal única) | [SOP de ahumadero, 155 °F / 15 s](https://1library.net/article/smokehouse-operations-standard-operating-procedures.z1lwlepq); [Ohio State HACCP](https://meatsci.osu.edu/sites/meatsci/files/imce/FullyCookedHACCP12.20%20%285%29.pdf) |
| Pelado: vapor, cuchilla que abre la tripa a lo largo y chorro de aire comprimido | Sí | [Patente US4118828A](https://patents.google.com/patent/US4118828A/en); [Patente US5246395A](https://patents.google.com/patent/US5246395) |
| Sin tripa la salchicha conserva la forma: Erwin O. Freund (Visking) lo descubrió por casualidad en los años 20 | Sí (empresa fundada en 1925; patente presentada en 1926) | [Wikipedia, Viskase](https://en.wikipedia.org/wiki/Viskase); [Patente US1631723A](https://patents.google.com/patent/US1631723) |

## Guion (una voz por plano)

1. ¿Sabías que a la salchicha que te comes la desnudan justo antes de llegar a tu boca?
2. No te preocupes: hoy te enseño por qué.
3. Hielo picado, una piel que no es carne, un horno a 68 grados… y un cuarto paso secreto.
4. Una salchicha es carne picadísima, larga y tierna, perfecta para el pan.
5. Pero, ¿qué pasa hasta llegar a tu casa?
6. Paso uno: carne triturada con hielo, hasta hacerse pasta.
7. La grasa entra la última y bien fría: si se calienta, la salchicha suda grasa.
8. Paso dos: la pasta entra a presión en una funda de celulosa.
9. Y aquí el tamaño sí importa: el grosor lo decide la funda.
10. Una máquina la retuerce, y salen los eslabones.
11. Paso tres: horno hasta 68 grados por dentro, y ducha fría.
12. Mira lo que me escribió alguien:
13. ¿Y esa piel se come o qué?
14. Pues no: la celulosa no se digiere. Por eso, el cuarto paso.
15. Vapor, una cuchilla la abre, y un chorro de aire se la arranca.
16. Como quitarle el plástico a un móvil nuevo.
17. Al cocerse, la carne de fuera cuaja y hace su propia piel.
18. Lo descubrió Erwin Freund en los años veinte… por accidente.
19. Antes, pasta con hielo; ahora, una salchicha desnuda con el nombre de tu amigo.
20. Etiqueta o pasa este vídeo a tu amigo obsesionado con las salchichas.
21. ¡Hasta luego! Si te ha gustado, dale a me gusta y síguenos.
