# ep6_es — La batería que se cortocircuita sola

Short vertical (1080x1920, 30 fps), 30 planos, una voz por plano. Adaptación nativa al español del guion de `episodes/ep6_en`; no es una traducción literal. Los mismos decorados y personajes 3D sirven para los dos idiomas: las etiquetas del mundo son solo números y unidades (`3860 mAh/g`, `372 mAh/g`, `600 MPa`, `10×`).

## Reparto y dirección emocional

- **Narrador (ingeniero / experto), voz única** — Máster final ES: ElevenLabs `David Martin` a `1.1` (100,139 s); respaldo Kokoro `em_alex` en `public/ep6_es/voice_kokoro.wav`. Máster final EN: ElevenLabs `Brian` a `1.2` (73,109 s); respaldo Kokoro `am_michael` en `public/ep6_en/voice_kokoro.wav`.
- Arco por pasos: `[intriguing]` en el gancho → `[curious]` pasos 1–3 → `[analytical]` pasos 4–5 → `[serious]` pasos 6–8 → `[amazed]` paso 9 → `[warm]` cierre. Sin diálogo entre personajes: el canal medido usa solo narración.

## Mapa de la escalera de retención

| Plano | Paso | Función |
|---|---|---|
| 1–5 | Gancho 3+1 | Tres datos concretos + cuarto elemento ausente + consecuencia |
| 6 | 1 | Pregunta |
| 7–9 | 2 | Plantea el problema |
| 10–12 | 3 | Abre una curiosidad nueva |
| 13–16 | 4 | Muestra la prueba |
| 17–19 | 5 | Añade el giro |
| 20–21 | 6 | Comentario de un espectador |
| 22–23 | 7 | Analogía cotidiana |
| 24–26 | 8 | Revela el cuarto dato oculto |
| 27–28 | 9 | Antes / después |
| 29–30 | 10 | Cierre seco + CTA |

## Guion (una voz por plano)

1. Ánodo de litio metálico, pared cerámica, cero líquido inflamable:
2. tres datos que hacen imbatible esta batería.
3. El ánodo guarda tres mil ochocientos sesenta miliamperios hora por gramo,
4. diez veces el grafito. Pero falta un cuarto elemento,
5. y sin él la celda se cortocircuita por dentro.
6. ¿Por qué falla una cerámica tan dura?
7. Aquí hay un problema: el litio no vuelve en capa lisa.
8. Se deposita en puntitos.
9. Cada punto concentra la corriente como el agua por un agujero en una presa.
10. Ahora, aquí viene lo interesante:
11. en cerámica de granate no hay corrosión química.
12. Es litio blando abriendo cerámica dura.
13. Mira dentro de una celda al microscopio:
14. el litio entra en un poro bajo la superficie.
15. Al cargar más, la presión llega a seiscientos megapascascales.
16. La cerámica se abre, el litio la rellena y la grieta sigue.
17. Pero pasó algo inesperado:
18. la cerámica más dura no era la más segura.
19. El filamento gana empujando, no cortando.
20. Mira lo que me escribió alguien:
21. Si la cerámica es más dura, ¿cómo la atraviesa?
22. Mira la diferencia entre esto y esto:
23. un cuchillo corta por el filo; esto empuja como un gato hidráulico.
24. Y el cuarto dato que faltaba: la presión de apilamiento.
25. Muy poca deja huecos; demasiada acelera la grieta.
26. Hay que acertar en una ventana estrecha, no apretar más.
27. Antes: poro, punto, grieta, corte.
28. Ahora: una interfaz limpia deja el litio en capa plana.
29. Sólido no es seguro: el fallo se esconde.
30. Síguenos para ver más ingeniería a simple vista.

## Verificación de datos

| Afirmación del guion | Verificada como | Fuente |
|---|---|---|
| Ánodo de litio metálico = 3860 mAh/g frente a 372 mAh/g del grafito (≈10×) | Sí; capacidades específicas teóricas | [Wiley, *Towards Next Generation Energy Storage Technologies*, cap. 3 (2024)](https://doi.org/10.1002/9783527845316.ch3); [ACS Nano](https://pubs.acs.org/doi/10.1021/acsnano.7b05874) |
| El electrolito sólido sustituye al líquido inflamable, pero los dendritos siguen cortocircuitando celdas | Sí | [Nature (2026), penetración mecánica de dendritos de Li en granate](https://www.nature.com/articles/s41586-026-10415-9); [Nature (2023), iniciación y propagación](https://www.nature.com/articles/s41586-023-05970-4) |
| En el granate estudiado, la falla es mecánica, no corrosión química | Sí: el litio llena la punta de la grieta y no aparece litio por delante | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9) |
| La iniciación ocurre en poros y microgrietas subsuperficiales; la presión aumenta y la grieta avanza | Sí | [Nature (2023)](https://www.nature.com/articles/s41586-023-05970-4) |
| La presión dentro de un dendrito confinado puede alcanzar ≈600 MPa | Sí, por simulación de campo de fase | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9) |
| La corriente se concentra en defectos y bordes de grano, que son vías más blandas | Sí | [APL Energy (2025)](https://pubs.aip.org/aip/ape/article/3/3/031501/); [Nature Energy (2023)](https://www.nature.com/articles/s41560-022-01186-4) |
| La presión de apilamiento tiene una ventana estrecha: poca deja huecos; demasiada acelera la grieta | Sí | [Nature (2023)](https://www.nature.com/articles/s41586-023-05970-4); [RSC EES Batteries (2025)](https://pubs.rsc.org/eb/article/1/4/692/891031/) |
| Una interfaz limpia y controlada deposita el litio en capa plana | Respaldado como vía de mitigación (ingeniería de defectos y de interfaz) | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9); [MDPI Batteries (2025)](https://www.mdpi.com/2313-0105/11/8/304) |

La frase «la cerámica más dura no era la más segura» se refiere a las celdas de granate estudiadas, no a todos los electrolitos sólidos.
