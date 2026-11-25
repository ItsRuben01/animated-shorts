# ep7_es — Pepinos de desconocidos (cómo se hace un pepinillo)

Short vertical (1080x1920, 30 fps), 20 planos (recortado a ~60 s el 2026-11-25), una voz por plano. Short bilingüe sin vídeo largo (Caso B en el cierre). Guion base del usuario (2026-11-24), adaptado a la escalera de retención y con los datos verificados. `episodes/ep7_en` es una adaptación nativa al inglés, no una traducción. Los mismos decorados 3D sirven para los dos idiomas: las etiquetas del mundo son solo números y unidades (`Ø 2,5–5 cm`, `6 % NaCl`, `74 °C`, `15 min`, `pH 4,6`).

## Validación del tema (2026-11-24)

- La búsqueda web no encontró ningún Short de fábrica de pepinillos con visitas verificables; sí abundan los vídeos largos tipo «Mega Pickle Factory | Farming Documentary» y los reportajes de fábrica (Sechler's, McClure's, Hausbeck). El tema tiene demanda, pero nadie lo cuenta con este ángulo de humor.
- Vídeo de referencia para la miniatura (paso 10): **pendiente**. Buscar en YouTube «how pickles are made factory», elegir el de más visitas y anotar aquí su URL y título.
- Formato: Short bilingüe (ES + EN), sin vídeo largo.

## Reparto y dirección emocional

- **Narrador documental serio, voz única.** Borrador Kokoro `em_alex` a `1.30` (65,4 s, 3,61 palabras/s); máster ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`, `eleven_multilingual_v2`, velocidad base `1.15` + ajuste por emoción, silencios recortados y acelerado ×1,1 con ffmpeg: 77,7 s, 3,04 palabras/s); respaldo Kokoro en `public/ep7_es/voice_kokoro.wav`. El contraste entre la voz seria y el doble sentido es el chiste: nunca leer el gancho con risa.
- Arco: `[intriguing]` gancho → `[analytical]` definición literal → `[serious]` pasos industriales → `[chuckles]` guiños → `[amazed]` prueba y cuarto paso → `[enthusiastic]` etiqueta a tu amigo → `[warm]` despedida.
- Pronunciación: «muuuy» se alarga a propósito; «pH» se dice «pe hache»; «NaCl» no se dice nunca.
- Prohibido: leer seguido sin pausas tras el gancho (plano 1 necesita un silencio de ~0,4 s antes del plano 2).

## Mapa de la escalera de retención

| Plano | Paso | Función |
|---|---|---|
| 1–2 | Gancho | Doble sentido + giro documental |
| 3 | Gancho 3+1 | Tres pasos concretos + un cuarto que falta |
| 4–5 | 1 | Definición literal y pregunta |
| 6–7 | 2 | Lavado a presión y calibrado (guiño del tamaño) |
| 8–9 | 3–4 | Salmuera y prueba por dentro (corte en rayos X: el ácido llega al centro) |
| 10–11 | 5 | Giro: el gas que deja el pepinillo hueco y el nitrógeno |
| 12–13 | 6 | Comentario de un espectador |
| 14 | 7 | Analogía cotidiana (refresco agitado) |
| 15–17 | 8 | Corte, frasco y cuarto paso: 74 °C y pH 4,6 |
| 18–19 | 9 | Antes / después + etiqueta a tu amigo |
| 20 | 10 | Despedida + me gusta y síguenos (Caso B) |

## Guion (una voz por plano)

1. ¿Te encanta meterte pepinos de desconocidos en la boca?
2. No te preocupes: hoy te traigo la solución para disfrutarlos aún más.
3. Agua a presión, un 6 % de sal, semanas en un tanque… y un cuarto paso que evita que sea peligroso.
4. Un pepino es un alimento muuuy largo y verde, que a la gente le encanta meterse entero en la boca.
5. Pero, ¿qué pasa de verdad hasta llegar a tu casa?
6. Paso uno: chorros de agua a presión y cepillos.
7. Luego se separan por grosor. Dicen que el tamaño no importa… aquí sí: los pequeños se pagan más.
8. Paso dos: salmuera con un 6 % de sal, en tanques gigantes.
9. Durante semanas, unas bacterias convierten su azúcar en ácido, hasta el centro.
10. Pero también sueltan gas, y el pepinillo puede quedarse hueco por dentro.
11. Por eso meten burbujas de nitrógeno, que arrastran el gas fuera.
12. Mira lo que me escribió alguien: *(tarjeta de comentario)*
13. ¿Entonces los pequeños ganan? *(tarjeta de comentario)*
14. Pues sí: los grandes se hinchan más. Como un refresco agitado.
15. Paso tres: rodajitas, frasco y vinagre.
16. Y el cuarto: el frasco cerrado, a 74 °C durante 15 minutos.
17. Con un pH por debajo de 4,6, el botulismo no puede crecer.
18. Antes, un pepino del campo; ahora, un frasco sellado con el nombre de tu amigo.
19. Etiqueta o pasa este vídeo a tu amigo obsesionado con los pepinillos.
20. ¡Hasta luego! Si te ha gustado, dale a me gusta y síguenos.

## Cambios respecto al guion original

- «La salmuera pasa el pepino a pepinillo» no es exacto: el pepinillo de fábrica es una variedad de pepino para encurtir que se cosecha pequeña; la salmuera lo fermenta y lo acidifica, no lo encoge. El guiño del tamaño se ha movido al calibrado, donde sí es verdad (los pequeños valen más y los grandes se estropean más).
- Se añaden los pasos reales que faltaban: calibrado por grosor, fermentación, control del gas y pasteurización (el cuarto paso del bucle abierto).
- El gancho del plano 1 se mantiene tal cual lo escribió el usuario. Es un doble sentido claro: si TikTok lo limita, la alternativa más suave es «¿Te encanta meterte pepinos enteros en la boca?».

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| Se lavan con chorros de agua a presión y cepillos suaves | Sí (sin cifra de bar publicada; por eso el guion no da presión) | [FAO / guía de procesado de pepino, vía ProAgri](https://www.proagrimedia.com/?p=3127) |
| Se calibran por diámetro, de ~2,5 a 5 cm | Sí; grados de ejemplo <2,5 / 2,5–3,8 / 3,8–5 cm | [ProAgri](https://www.proagrimedia.com/?p=3127); [USDA AMS, normas del pepino para encurtir](https://www.ams.usda.gov/grades-standards/pickling-cucumbers-grades-and-standards) |
| Los pequeños se pagan más | Sí; al agricultor se le paga por calibre y el calibre pequeño es el más caro | [MSU Extension, producción de pepinillo en Michigan (2013)](https://www.canr.msu.edu/resources/michigan-pickle-production-results-from-2013-discussions-growers-and-processers) — **confirmar la tabla de precios antes de publicar** |
| La fermentación comercial usa salmuera con ~6 % de sal en tanques | Sí | [USDA ARS, p415](https://ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p415.pdf); [Sechler's](https://sechlerspickles.com/pages/how-do-we-make-our-pickles) |
| Las bacterias lácticas convierten el azúcar en ácido durante semanas | Sí | [USDA ARS / Breidt et al. 2010](https://site.extension.uga.edu/foodscienceandtechnology/files/2023/07/Breidt-et-al-2010-Below-4.1.pdf) |
| El CO₂ de la fermentación hincha el pepinillo y lo deja hueco («bloater») | Sí | [USDA ARS, p415](https://ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p415.pdf) |
| Se purga la salmuera con nitrógeno para sacar el CO₂ | Sí; el nitrógeno es lo ideal (el aire mete oxígeno) | [USDA ARS, p415](https://ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p415.pdf); [tesis MSU](https://d.lib.msu.edu/etd/42291/FULL_TEXT/view) |
| Los pepinos grandes sufren más el hinchado | Sí | [USDA ARS, p415](https://ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p415.pdf) |
| Pasteurización comercial: 74 °C (165 °F) durante 15 min | Sí; estándar de la industria (en el centro del producto) | [USDA ARS, AgResearch Magazine (2014)](https://agresearchmag.ars.usda.gov/2014/jul/pickle) |
| Por debajo de pH 4,6 el *C. botulinum* no germina ni produce toxina | Sí | [USDA ARS, p333](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p333.pdf); [Breidt et al. 2010](https://site.extension.uga.edu/foodscienceandtechnology/files/2023/07/Breidt-et-al-2010-Below-4.1.pdf) |

Nota: el lavado, la salmuera y la pasteurización corresponden a dos rutas industriales que se combinan en el guion (fermentado en tanque y envasado con vinagre); ambas terminan en frasco con vinagre y suelen pasteurizarse.
