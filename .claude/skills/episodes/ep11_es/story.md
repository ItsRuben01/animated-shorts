# ep11_es — Ruedas de avión sin aire (por qué se inflan con nitrógeno)

Short vertical (1080x1920, 30 fps), 12 planos, una voz por plano. Short bilingüe (`episodes/ep11_en` es la adaptación nativa al inglés). Los decorados 3D son comunes a los dos idiomas: etiquetas solo con números, unidades y símbolos (`> 60 t`, `×6`, `N₂`, `78 % N₂`, `21 % O₂`, `1986`, `< 5 % O₂`, `@ ______`).

## Performance brief (de insights/playbook.md, 2026-11-27)
- Duración objetivo: **~45 s** (máx. 55). Real: 46,7 s.
- Gancho: pregunta «¿Por qué NO…?» sobre un objeto tangible, sin jerga (patrón de «¿Por qué NO se sueldan los aviones?», 75 % de retención en YT).
- Tema: vehículos (la familia que mejor rinde: aviones, airbag, submarinos).
- CTA final: «etiqueta a tu amigo que…» + despedida Caso B (sin vídeo largo).
- **Experimento de este episodio (1 variable): H2, duración ~45 s** para ver si TikTok supera el techo de 640–740 vistas. Todo lo demás, igual que los vídeos top.
- Por qué: TikTok 45–56 s → 5–7 % de completados frente a 0,1–0,8 % en vídeos de 77–100 s; ep8–ep10 salieron de 80 a 88 s.
- Estadísticas no refrescadas para este episodio: la revisión es de hoy (2026-11-27) y ep8–ep10 aún no llevan 48 h publicados.

## Validación del tema (2026-11-27, yt-dlp)
- Referencia (paso 10): **«Why Plane Tires Don't Explode On Landing»** (Tech Insider) — https://www.youtube.com/watch?v=_CyXMNHYl70 (5,5 M). ES: «¿Por qué las Ruedas de los Aviones NO Se Inflan con Aire?» — https://www.youtube.com/watch?v=G1i6iEZceCw (3,7 M).
- Shorts: el mayor sobre nitrógeno en ruedas tiene 74 K y habla de coches. Hueco libre en Shorts con demanda probada en largo.
- **Comprobación de demanda en formato corto (hecha después de producir, 2026-11-27):** Shorts sobre nitrógeno en ruedas de avión: máximo 678 visitas (EN) y 47 (ES); ángulo cercano «rueda de avión que explota»: 361 K, 64 K, 50 K (clips reales). TikTok/IG: no medidos. Veredicto: demanda corta sin probar; se apoya la portada en la explosión (#9).
- Formato: Short solo (Caso B). Posible largo genérico futuro: «cómo se fabrica y se cuida una rueda de avión».

## Reparto y dirección emocional
- Narrador único. ES: ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`), `eleven_v4`, etiquetas en `sayTts`, `--tempo=1.2`. Kokoro no disponible en esta sesión (el CDN del modelo está bloqueado por la red), así que no hay respaldo Kokoro.
- Arco: `[mischievously]` gancho → `[curious]` 3+1 → `[thoughtful]` presión → `[chuckles]` guiño («aquí no vale soplar») → `[sarcastic]` comentario → `[thoughtful]` 78/21 → `[dramatic]` frenada → `[gasps]` explosión → `[whispers]` 1986 (sin humor) → `[dramatic]` norma → `[excited]` etiqueta → `[warmly]` despedida.
- Tono en el plano 9: respetuoso; no se muestran víctimas ni el accidente, solo el avión subiendo y un destello.
- Personajes (meme-fusión): mecánico de rampa (chaleco reflectante, gorra azul, cascos) y «tu amigo» (camisa de cuadros roja, cara de esfuerzo `rage` en el plano 11).

## Guion (una voz por plano)

1. ¿Por qué las ruedas de un avión NO se inflan con aire?
2. Más de 60 toneladas, frenos ardiendo… y un gas que lo cambia todo.
3. Cada rueda va a 14 bares: seis veces tu coche.
4. Y aquí no vale soplar: le meten nitrógeno a presión.
5. Alguien me escribió: ¿el aire no es casi todo nitrógeno?
6. Sí: un 78 %. El problema es el otro 21: el oxígeno.
7. Al frenar, la goma se calienta y suelta gases.
8. Con oxígeno, esos gases pueden arder… y la rueda, explotar.
9. En 1986, en México, una rueda con aire explotó en pleno vuelo.
10. Por eso hoy la norma es menos de un 5 % de oxígeno.
11. Etiqueta a tu amigo que todavía infla las ruedas a pulmón.
12. ¡Hasta luego! Dale a me gusta y síguenos.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| En aviones de transporte grandes (> 75 000 lb de MTOW), las ruedas con freno se inflan con nitrógeno seco u otro gas inerte, con ≤ 5 % de oxígeno en volumen | Sí | [14 CFR 25.733(e)](https://www.law.cornell.edu/cfr/text/14/25.733); [FAA AC 20-97B](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC20-97B.pdf) |
| Motivo: al calentarse (frenos), el forro interior de la goma puede soltar gases volátiles que, con oxígeno, pueden autoinflamarse y hacer explotar la rueda | Sí (propuesta de la FAA de 1990: con más de un 5 % de oxígeno se mantiene la reacción) | [FAA AC 20-97B](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC20-97B.pdf); [14 CFR 25.733](https://www.law.cornell.edu/cfr/text/14/25.733) |
| El aire es ~78 % nitrógeno y ~21 % oxígeno | Sí | Composición estándar de la atmósfera (NOAA / cualquier manual de química) |
| Una rueda principal de 737 va a ~200 psi (≈ 14 bar); la de un coche, ~2,2–2,5 bar → unas 6 veces | Sí (195–205 psi según versión) | [Boeing, Aircraft tire data](https://www.boeing.com/resources/boeingdotcom/commercial/airports/faqs/aircrafttiredims.pdf); [The Points Guy, All about aircraft tires](https://thepointsguy.com/airline/all-about-aircraft-tires/) |
| «Más de 60 toneladas» al aterrizar | Sí: peso máximo de aterrizaje del 737-800 ≈ 66 t | [Boeing 737 Airport Planning](https://www.boeing.com/resources/boeingdotcom/commercial/airports/acaps/737.pdf) |
| 1986, México: un 727 de Mexicana (vuelo 940) despegó con una rueda principal inflada con aire comprimido; un freno sobrecalentado la hizo explotar en vuelo | Sí (investigación mexicana + NTSB) | [Wikipedia, Mexicana Flight 940](https://en.wikipedia.org/wiki/Mexicana_de_Aviaci%C3%B3n_Flight_940); [BAAA](https://baaa-acro.com/node/472593) |

## Auditoría de portada de referencia (paso 10)
- Las dos referencias: rueda real gigante como protagonista (Tech Insider añade humo al tocar pista; la ES, un operario para dar escala y texto «RUEDAS DE LOS AVIONES»).
- Mantener: la rueda enorme en primer plano y una persona para la escala.
- Mejorar: ninguna dice el giro (nitrógeno) ni da una cifra. Las nuestras: «SUS RUEDAS NO LLEVAN AIRE», `N₂`, `14 bar`, `< 5 %` y el caso de 1986.
