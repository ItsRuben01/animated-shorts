# ep15_es — Bollos rellenos: la crema se inyecta

Short vertical (1080x1920, 30 fps), 15 planos, **primer episodio con el flujo de retención de 8 piezas** (`styles/retention-rules.md`, paso 5 del skill), subtítulos karaoke, HUD (`<Counter>`, `<ProgressCards>`) y CTA de palabra clave (`<CommentCTA>`). Bilingüe (`episodes/ep15_en` es la adaptación nativa).

## Performance brief (de insights/playbook.md, 2026-11-27)
- Duración: ≤ 60 s (nuevo límite del skill; referencias 58–60 s). Real: 58,3 s, 177 palabras, 3,03 palabras/s.
- Gancho: curiosidad útil con un guiño («se la inyectan, literal»), objeto en la mano.
- Tema: comida / objetos de casa.
- CTA final: cerrar el bucle («¿Te diste cuenta?…») + **Comenta «CREMA»** → DM + seguir.
- **Experimento (1 variable): el flujo de retención completo** (8 piezas + CTA de comentario) frente a la estructura anterior (ep11–ep14). Comparar comentarios por 1.000 vistas y % visto.

## Puntuación de la idea (3/3)
- **Proximidad:** `hand` (el bollo relleno se compra y se come; el espectador puede comprobarlo en el suyo).
- **Fotograma 0:** el bollo cortado por la mitad con la aguja ya dentro y la crema empezando a llenar el hueco.
- **Mecanismo visible:** la aguja entra, el pistón baja y el contador sube `0 → 15 g`; el puntito de la aguja brilla en el bollo.
- **Metáfora única:** el bollo, que se va llenando de crema a lo largo del Short (planos 1 → 13).

## Validación del tema (2026-11-27, comprobación de demanda corta)
- Shorts (≤ 70 s): «Jam Filled Donuts» — https://www.youtube.com/watch?v=-649RrLTZIw (426 K, ángulo cercano: rellenar dónuts); «Bespacker paste filling machine cream filler» — https://www.youtube.com/watch?v=8nLATp5YtGQ (58 K); «Strawberry Twinkies commercial» (72 K).
- TikTok / Instagram: **no comprobados**.
- Veredicto: supera 100 K por el ángulo cercano (426 K). Nadie explica en corto por qué se inyecta después del horno → hueco.

## Mapa de las 8 piezas

| Plano | Pieza | En pantalla | Número que se mueve |
|---|---|---|---|
| 1 | 1 Gancho | Fotograma 0: bollo en corte con la aguja ya dentro; la crema florece (vacío → lleno) | — (cambio de estado: hueco → crema) |
| 2 | 1 Gancho | La aguja sale de un bollo entero; queda un puntito que brilla | — |
| 3 | 2 Promesa | Obrador + 3 tarjetas `? ? ?` (cómo · por qué después del horno · cómo pillarlo) | tarjetas 1-2-3 |
| 4 | 3 Cuerpo 1 | Masa que sube en el horno; en el corte aparecen los huecos de aire | — |
| 5 | 3 Cuerpo 1 | La aguja de acero entra en el bollo en corte | — |
| 6 | 3 Cuerpo 1 | Pistón dosificador bajando | `0 → 15 g`; tarjeta 1 ✓ |
| 7 | 4 Bucle 1 | Empuje de cámara al horno incandescente | — |
| 8 | 5 Cuerpo 2 | Una bola de crema se derrite delante del horno | — |
| 9 | 5 Cuerpo 2 | Bollos enfriándose (el vapor desaparece) y entra la aguja | tarjeta 2 ✓ |
| 10 | 6 Bucle 2 | El panadero se inclina con sonrisa troll | — |
| 11 | 7 Cuerpo 3 | Bollo entero: el puntito de la aguja se ilumina | — |
| 12 | 7 Cuerpo 3 | Bollo alargado en corte: 3 pinchazos y la crema se une | tarjeta 3 ✓ |
| 13 | 8 CTA | El bollo lleno (metáfora terminada) + panadero + amigo | 3 ✓ |
| 14 | 8 CTA | Teléfono en el obrador: «Comenta «CREMA»» → enviar → llega el DM | — |
| 15 | 8 CTA | Despedida | — |

## Reparto y dirección emocional
- Narrador único. ES: ElevenLabs **`Nebu`** (`rHTtFjgYAGnQOQw7Alsk`), `--target=58` → atempo 1,125. Etiquetas en `sayTts`.
- Arco: `[mischievously]` gancho → `[chuckles]` «literal» → `[playfully]` promesa → `[curious]`/`[dramatic]`/`[amazed]` cuerpo 1 → `[excited]` bucle 1 → `[thoughtful]`/`[dramatic]` cuerpo 2 → `[amazed]` bucle 2 → `[curious]`/`[chuckles]` cuerpo 3 → `[warmly]` cierre → `[excited]` palabra clave → `[warmly]` seguir.
- Personajes: panadero (gorra blanca, bata, corbata rosa, bigote) y «tu amigo» (el de ep11–ep14).
- Gancho alternativo más suave si «se la inyectan» limita en TikTok/Reels: «La crema entra con aguja. De verdad.»

## Guion (pieza entre paréntesis)

1. (1) Este bollo no tiene ni un corte… ¿y cómo le meten la crema?
2. (1) Se la inyectan. Literal.
3. (2) En un minuto sabrás cómo, por qué no lo rellenan antes del horno y cómo pillarlo en tu bollo.
4. (3) Al hornearse, la masa sube y por dentro queda llena de huecos de aire.
5. (3) Ahí entra la aguja: un tubo de acero que pincha el bollo sin romperlo.
6. (3) Detrás, un pistón mide cada chorro al gramo: 15 gramos, siempre iguales.
7. (4) Pero eso no es lo más curioso.
8. (5) ¿Por qué no la meten antes? Porque la crema no sobrevive al horno: se derretiría y se quemaría.
9. (5) Por eso esperan a que el bollo se enfríe… y solo entonces lo pinchan.
10. (6) Y aquí viene el truco.
11. (7) Coge tu bollo y búscale un puntito: es por donde entró la aguja.
12. (7) Si ves varios, lo pincharon varias veces para que la crema llegue a todo.
13. (8) ¿Te diste cuenta? Ya nunca vas a mirar un bollo igual.
14. (8) Comenta «CREMA» y te mando por privado cómo rellenarlos en casa.
15. (8) Y síguenos para entender lo que te comes.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| Al hornear, la masa sube y por dentro queda con huecos de aire (miga alveolada) | Sí | Conocimiento estándar de panadería (fermentación + expansión del gas en el horno) |
| Los bollos y dónuts rellenos se inyectan con boquillas/agujas de acero (inyectoras de 4–6 puntas o lateral) | Sí | [Bake Magazine, Producing filled donuts on a larger scale](https://www.bakemag.com/articles/13297-producing-filled-donuts-on-a-larger-scale); [Belshaw AutoFiller](https://donut-supplies.com/products/autofiller-donut-injector) |
| Un pistón dosifica cada chorro (p. ej. 15 g, siempre iguales) | Sí: dosificadores de pistón ajustables de 0 a 15 g | [Schneider donut filler, single piston](https://www.essentialutensil.au/collections/schneider/products/schneider-donut-filler-single-piston-with-bowl) |
| La crema se mete después de hornear y con el bollo frío: en el horno se derretiría/quemaría | Sí (práctica estándar; las recetas industriales y caseras rellenan tras enfriar) | [Bake Magazine](https://www.bakemag.com/articles/13297-producing-filled-donuts-on-a-larger-scale); [Taste of Home / recetas de copia de Twinkie](https://topsecretrecipes.com/hostess-twinkie-copycat-recipe.html) |
| El puntito del bollo es por donde entró la aguja; los bollos largos llevan varios pinchazos para repartir la crema | Sí | [Top Secret Recipes, Twinkie copycat (3 pinchazos)](https://topsecretrecipes.com/hostess-twinkie-copycat-recipe.html) |
| (No usado en el guion) «Los Twinkies tienen 3 agujeros de fábrica» | **No verificado** con fuente oficial: no se afirma | — |
