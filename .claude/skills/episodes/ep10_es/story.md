# ep10_es — Goma de rueda en la boca (cómo se hace un chicle)

Short vertical (1080x1920, 30 fps), 23 planos, una voz por plano. Short bilingüe; `episodes/ep10_en` es una adaptación nativa al inglés. Los mismos decorados 3D sirven para los dos idiomas: etiquetas del mundo solo con números, unidades y símbolos (`≈`, `IIR`, `50 °C`, `5–15 min`, `7`, `< 3 d`, `< 8 %`, `≈ 33 %`).

## Validación del tema (2026-11-27, yt-dlp)

- Vídeo de referencia (paso 10): **«BUBBLEGUM | How It's Made»** — https://www.youtube.com/watch?v=2kttVyakHN4 (25,6 M visitas). Otro largo: «How Bubblegum Is Made!» — https://www.youtube.com/watch?v=8kWrN2bgvSA (61,6 M).
- Shorts (≤ 70 s): el mayor sobre la goma base es «gumbase» (45 K) y no cuenta el proceso. Hueco libre.
- Formato: **4X viable** (Short ES + EN ahora; Long genérico «la química de los polímeros que comes»: chicle, gominolas, recubrimientos). Este Short cierra con el **Caso B** hasta que exista el Long; al publicarlo, cambiar el plano 23 al Caso A.
- Las 10 propuestas y la elección: `episodes/ep10_ideas.md`.

## Reparto y dirección emocional

- **Narrador cómplice y expresivo, voz única.** ES: máster ElevenLabs `David Martin` (`y6WtESLj18d0diFRruBs`, `eleven_v4`, etiquetas por plano en `sayTts`, atempo ×1,2 local: 83.2 s, 2.89 palabras/s). EN: máster `Brian` (`nPczCjzI2devNBz1zQrb`, mismo método: 82.3 s, 3.00 palabras/s). Comando: `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <label> 1.0 --tempo=1.2`. Respaldo Kokoro (`em_alex` 1.20 / `am_michael` 1.30) en `public/ep10_*/voice_kokoro.wav` + `timing_kokoro.json`.
- Arco: `[mischievously]` gancho («casi la misma goma que una rueda») → `[playfully]` / `[curious]` planteamiento → `[thoughtful]` mayas → `[amazed]` caucho butilo → `[dramatic]` pasos 1 y 2 → `[chuckles]` guiños («le pone la funda», «entran duras… y salen blanditas») → `[sarcastic]` / `[laughs]` comentario y mito → `[excited]` grageado → `[whispers]` humedad → `[gasps]` un tercio → `[excited]` etiqueta a tu amigo → `[warmly]` despedida.
- Pronunciación: «50» y «8 %» siempre en letra en `say`; «chicozapote» y «caucho butilo» sin prisa.
- Prohibido: leer plano el gancho; encadenar el gancho con el plano 2 sin la pausa de 0,4 s; reírse en el plano 19 (la tensión va en susurro).
- Personajes (meme-fusión, estilo por defecto): guía de fábrica con casco blanco, gafas, bata y corbata rosa (`face: smirk`); el fan del chicle con camisa de cuadros rosa y gorra (`face: troll`/`proud`), que es también «tu amigo» del final.

## Mapa de la escalera de retención

| Plano | Paso | Función |
|---|---|---|
| 1–2 | Gancho | Doble sentido («goma» de rueda en la boca) + giro |
| 3 | Gancho 3+1 | Goma de rueda, amasadora, 50 °C… y un cuarto paso («la funda») |
| 4–5 | 1 | Definición literal y pregunta |
| 6–7 | 2 | Origen: savia del chicozapote → hoy caucho butilo (cámaras de rueda) |
| 8 | 4 | Prueba en rayos X: cadenas enredadas como espaguetis |
| 9–11 | 2 / 3 | Paso 1: goma base fundida + amasadora 5–15 min; guiño «entran duras, salen blanditas» |
| 12–13 | 3 | Paso 2: extrusora a ~50 °C y rodillos; paso 3: corte y enfriado |
| 14–16 | 6 | Comentario del espectador (mito de los 7 años) y respuesta |
| 17 | 8 | Cuarto paso: grageado capa a capa |
| 18 | 7 | Comparación: pintar una pared con capas finas |
| 19 | 5 | Giro: con > 8 % de humedad la funda se pega |
| 20 | 8 | Revelación: la funda pesa un tercio |
| 21–22 | 9 | Antes / después + etiqueta a tu amigo |
| 23 | 10 | Despedida Caso B |

## Guion (una voz por plano)

1. ¿Sabías que llevas toda la vida mascando casi la misma goma que una rueda?
2. Tranquilo: hoy te enseño cómo se hace.
3. Goma de rueda, una amasadora, 50 grados… y un cuarto paso que le pone la funda.
4. Un chicle es goma que se masca, pero no se traga.
5. Pero, ¿de qué está hecha?
6. Los mayas mascaban la savia de un árbol: el chicozapote.
7. Hoy es caucho butilo, como el de las cámaras de rueda.
8. Sus cadenas se enredan como espaguetis: por eso estira.
9. Paso uno: la goma base se funde en la amasadora.
10. Azúcar, jarabe y sabor: de cinco a quince minutos amasando.
11. Es de las pocas cosas que entran duras… y salen blanditas.
12. Paso dos: la extrusora la saca a unos 50 grados, y los rodillos la aplanan.
13. Paso tres: la cortan y la dejan enfriar.
14. Mira lo que me escribió alguien:
15. ¿Y si me lo trago, se queda siete años dentro?
16. Mito: sale en pocos días, casi entero.
17. Cuarto paso: el grageado. Bombos que giran con jarabe, capa a capa.
18. Como pintar una pared: muchas capas finas.
19. Ojo: si el aire supera el 8 % de humedad, la funda se pega.
20. Al final, la funda pesa un tercio del chicle.
21. Antes, savia de árbol; ahora, una gragea con el nombre de tu amigo.
22. Etiqueta o pasa este vídeo a tu amigo que nunca suelta la goma.
23. ¡Hasta luego! Si te ha gustado, dale a me gusta y síguenos.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| La goma base moderna es sintética y usa caucho butilo (isobutileno-isopreno) y poliisobutileno | Sí | [Wikipedia, Butyl rubber](https://en.wikipedia.org/wiki/Butyl_rubber); [Stern Rubber, Butyl rubber: from tires to chewing gum](https://sternrubber.com/blog/butyl-rubber-tires-or-bubble-gum/); patente US 6 004 589 |
| El caucho butilo se usa en las cámaras de aire y el forro interior de los neumáticos | Sí | [Britannica, butyl rubber](https://www.britannica.com/technology/butyl-rubber); [Wikipedia, Butyl rubber](https://en.wikipedia.org/wiki/Butyl_rubber) |
| «Casi la misma goma que una rueda» | Sí, con matiz: mismo polímero (familia butilo), pero de grado alimentario y mezclado con resinas, ceras y cargas | Ídem |
| Los mayas mascaban el chicle, látex del chicozapote (*Manilkara zapota*) | Sí | [Smithsonian, A brief history of chewing gum](https://www.smithsonianmag.com/arts-culture/a-brief-history-of-chewing-gum-61020195/); [Britannica, chewing gum](https://www.britannica.com/topic/chewing-gum) |
| Desde los años 60 casi todo el chicle usa goma sintética | Sí | [Smithsonian](https://www.smithsonianmag.com/arts-culture/a-brief-history-of-chewing-gum-61020195/) |
| Es un polímero de cadenas largas enredadas (elastómero): por eso estira y no se disuelve en saliva | Sí (la goma base es insoluble en agua) | [Wikipedia, Gum base](https://en.wikipedia.org/wiki/Gum_base); [Wikipedia, Chewing gum](https://en.wikipedia.org/wiki/Chewing_gum) |
| La goma base se funde y entra en la amasadora; luego colorantes, glicerina, azúcar y aroma; la mezcla dura de 5 a 15 min | Sí | Patentes de fabricación de chicle (Wrigley, p. ej. US 5 436 013; US 6 017 566) |
| La amasadora es de palas en Z («sigma») | Sí | Patente US 6 238 710 (fabricación continua de goma base) |
| Sale de la extrusora a unos 50 °C y se lamina con rodillos | Sí | Patente US 5 436 013 (cinta a ~50 °C); [Roquette, How to produce chewing gum](https://www.roquette.com/food-nutrition/resources/how-to-produce-chewing-gum) |
| Se corta y se deja enfriar/reposar para que endurezca (atemperado) | Sí | [Roquette](https://www.roquette.com/food-nutrition/resources/how-to-produce-chewing-gum) |
| El grageado aplica jarabe en muchas dosis sucesivas en bombos giratorios | Sí | Patentes de grageado de chicle: US 5 980 955, US 5 665 406, US 7 115 288 (dosis sucesivas de jarabe) |
| El aire de secado del grageado va por debajo de ~8 % de humedad relativa | Sí | Patentes de grageado de chicle: US 5 980 955, US 5 665 406, US 7 115 288 (aire de secado < 8 % HR) |
| La funda es aproximadamente un tercio del peso del chicle grageado | Sí (30–38 %, preferente 32–36 %) | Patentes de grageado de chicle: US 5 980 955, US 5 665 406, US 7 115 288 |
| Tragarse un chicle no lo deja 7 años dentro: sale en pocos días, casi entero | Sí (mito) | [Mayo Clinic](https://newsnetwork.mayoclinic.org/discussion/mayo-clinic-minute-does-gum-get-stuck-in-your-stomach/); [Duke Health](https://dukehealth.org/blog/myth-or-fact-it-takes-seven-years-digest-chewing-gum); [Scientific American](https://www.scientificamerican.com/article/fact-or-fiction-chewing-gum-takes-seven-years-to-digest/) |

Nota: tragar muchos chicles a menudo puede obstruir el intestino en niños (casos raros); el guion dice «sale en pocos días», que es lo habitual, sin animar a tragarlos.

## Auditoría de portada de referencia (paso 10)

- «BUBBLEGUM | How It's Made» (2kttVyakHN4) y «How Bubblegum Is Made!» (8kWrN2bgvSA) usan la misma imagen: cintas de chicle rosa saturado saliendo de la extrusora, sin texto; la de 61,6 M añade una cara de sorpresa a la derecha.
- Mantener: masa rosa saturada como protagonista y un personaje reaccionando (sorpresa).
- Mejorar: ninguna dice nada. Las nuestras añaden el gancho escrito («MASCAS GOMA DE RUEDA»), una cifra (`33 %`, `50 °C`) y el contraste rueda + chicle, que no tiene nadie.
