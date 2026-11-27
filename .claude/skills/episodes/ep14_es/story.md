# ep14_es — Latas de refresco: tan finas como un folio

Short vertical (1080x1920, 30 fps), 12 planos. Bilingüe (`episodes/ep14_en` es la adaptación nativa). Etiquetas 3D universales: `1/10 mm`, `2000 / min`, `4`, `CO₂`, `@ ______`.

## Performance brief (de insights/playbook.md, 2026-11-27)
- Duración objetivo: 45–55 s. Real: 49,1 s.
- Gancho: objeto cotidiano + paradoja («tan fina como un folio… y no revienta»).
- Tema: objetos de casa / fábricas.
- CTA final: «etiqueta a tu amigo que…» + despedida Caso B.
- **Experimento: ninguno (episodio de control).** El calendario pedía repetir la mejor variable entre H1 y H2, pero aún no hay datos (ep11 se publica el lunes 30/11). Se usa el formato que mejor ha funcionado, sin variables nuevas, para tener una referencia limpia.
- Cambio de tema: el papel higiénico previsto se descartó en la comprobación de demanda (máximo 23 K en Shorts) y, con el OK del usuario, se cambió por latas de refresco.

## Validación del tema (2026-11-27, comprobación de demanda corta)
- Shorts (≤ 70 s): «How Cans Are Sealed» — https://www.youtube.com/watch?v=yMgSGgiUO4A (186 K); «How its made: aerosol can» — https://www.youtube.com/watch?v=ctMkHyMvrcI (130 K).
- Ángulo cercano: el sellado de la tapa (lo que más se ve) → es el cuarto paso del guion.
- TikTok / Instagram: **no comprobados**.
- Veredicto: supera 100 K (186 K).
- Descartado: papel higiénico (Shorts ≤ 23 K, aunque hay largos de 8 M y 5,8 M en español).

## Reparto y dirección emocional
- Narrador único. ES: ElevenLabs **`Nebu`** (`rHTtFjgYAGnQOQw7Alsk`), `eleven_v4`, etiquetas en `sayTts`, `--tempo=1.2`.
- Arco: `[mischievously]` gancho → `[playfully]` → `[curious]` 3+1 → `[thoughtful]` disco → `[dramatic]` anillos → `[thoughtful]` cúpula → `[amazed]` barniz → `[sarcastic]` comentario → `[chuckles]` «no lo está» → `[excited]` cuarto paso → `[excited]` etiqueta → `[warmly]` despedida.
- Personajes: operaria/o de planta con casco rojo, gafas, cascos y bata; «tu amigo» (el de ep11–ep13) agitando la lata.

## Guion

1. Tu lata de refresco es tan fina como un folio… y aun así no revienta.
2. Tranquilo: hoy te enseño cómo la hacen.
3. Un disco, un estirón, 2.000 por minuto… y un cuarto paso que la cierra con el refresco dentro.
4. Empieza como un disco plano de aluminio: lo prensan y sale un vasito.
5. Luego lo empujan por unos anillos que lo estiran: la pared queda en una décima de milímetro.
6. El fondo, en cúpula: aguanta la presión como un arco.
7. Y por dentro, un barniz: tu refresco nunca toca el aluminio.
8. Alguien me preguntó: ¿y cómo meten el refresco si ya está cerrada?
9. No lo está: primero la llenan, y luego le engatillan la tapa en un instante.
10. Ese es el cuarto paso: el gas empuja desde dentro y la deja dura como una piedra.
11. Etiqueta a tu amigo que siempre agita la lata antes de dártela.
12. ¡Hasta luego! Dale a me gusta y síguenos.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| La lata empieza como un disco plano de aluminio que se embute en un vaso («cupper») | Sí | Patentes de embutición y planchado (US 10 807 140; US 5 394 727) |
| Se estira (planchado) a través de anillos y la pared queda en ~0,1 mm en su punto más fino | Sí (100 µm / 0,004 in; chapa de partida ~0,25 mm) | [The Fabricator, sheet aluminum alloys for cans](https://www.thefabricator.com/thefabricator/article/metalsmaterials/sheet-aluminum-alloys-for-cans-and-cars); [Machine Design, Aluminum cans](https://machinedesign.com/materials/metals/article/21832055/aluminum-cans-a-lesson-in-product-development) |
| «Tan fina como un folio»: un folio de 80 g/m² mide ~0,1 mm | Sí (comparación de orden de magnitud) | Gramaje estándar del papel de oficina |
| ~2.000 latas por minuto | Sí: las formadoras hacen 1.500–2.700/min; las líneas completas, hasta ~5.000/min | [P2 InfoHouse, Aluminum can manufacturing](https://p2infohouse.org/ref/45/44123/text/manuf.htm); [Packaging World](https://www.packworld.com/machinery/primary-packaging/article/13345642/aluminum-bottle-bound-for-mainstream-beverage-use) |
| El fondo en cúpula aguanta la presión de las bebidas con gas | Sí | Patentes de fondo de lata (US 6 132 155; US 7 980 413, «dome reversal pressure») |
| Por dentro lleva un barniz (epoxi) para que la bebida no toque el aluminio | Sí | [ASME, The comeback of the aluminum can](https://www.asme.org/topics-resources/content/comeback-aluminum-can-part-2); [P2 InfoHouse](https://p2infohouse.org/ref/45/44123/text/manuf.htm) |
| Primero se llena y luego se cierra la tapa con doble engatillado | Sí | Patentes de cierre de tapa (US 6 561 004; US 7 673 768) |
| El gas empuja desde dentro y deja la lata rígida | Sí (explicación física: la presión interna tensa la pared fina; vacía se aplasta con la mano) | Patentes de presión interna (US 10 807 140: «internal pressure… from gas entrained in the liquid») |
