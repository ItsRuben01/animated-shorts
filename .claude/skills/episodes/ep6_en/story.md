# ep6_en — The battery that short-circuits itself

Short vertical (1080x1920, 30 fps), 30 shots, one voice per shot. Native English script for the 4X run; `episodes/ep6_es` is a native Spanish adaptation, not a translation. Same 3D sets and cast render both languages: all in-world labels are numbers/units only (`3860 mAh/g`, `372 mAh/g`, `600 MPa`, `10×`).

## Casting + emotion direction

- **Narrator (engineer / expert), single voice** — Final EN master: ElevenLabs `Brian` at speed `1.2` (73.109 s); Kokoro `am_michael` backup kept in `public/ep6_en/voice_kokoro.wav`. Final ES master: ElevenLabs `David Martin` at speed `1.1` (100.139 s); Kokoro `em_alex` backup kept in `public/ep6_es/voice_kokoro.wav`.
- Arc by step: `[intriguing]` hook → `[curious]` steps 1–3 → `[analytical]` steps 4–5 → `[serious]` steps 6–8 → `[amazed]` step 9 → `[warm]` close. No dialogue between characters (measured channel style: narration only).

## Retention ladder map

| Shot | Step | Beat |
|---|---|---|
| 1–5 | 3+1 Hook | Three concrete facts + missing fourth element + consequence |
| 6 | 1 | Ask the question |
| 7–9 | 2 | State the problem |
| 10–12 | 3 | Open a new curiosity |
| 13–16 | 4 | Show the proof |
| 17–19 | 5 | Add the twist |
| 20–21 | 6 | Viewer comment |
| 22–23 | 7 | Everyday comparison |
| 24–26 | 8 | Reveal the hidden fourth fact |
| 27–28 | 9 | Before / after |
| 29–30 | 10 | Sharp close + CTA |

## Script (one voice per shot)

1. Lithium metal, a ceramic wall, no flammable liquid:
2. three facts that make this battery sound unbeatable.
3. The anode holds three thousand eight hundred sixty milliamp hours per gram,
4. ten times graphite. But one fourth element is missing,
5. and without it the cell short-circuits from inside.
6. But why would hard ceramic ever fail?
7. Here is the problem: lithium does not return as a smooth coat.
8. It plates back as tiny points.
9. Each point focuses current like water through one hole in a dam.
10. Now here is the interesting part:
11. in garnet ceramic, this is not chemical corrosion.
12. It is soft lithium splitting hard ceramic.
13. Look inside a cell under an electron microscope:
14. lithium enters a pore just beneath the surface.
15. More charging builds pressure toward six hundred megapascals.
16. The ceramic cracks, lithium fills it, and the crack runs onward.
17. But something unexpected happened:
18. the hardest ceramic was not the safest.
19. The filament wins by pushing, not cutting.
20. Look at what someone commented:
21. "If ceramic is harder, how does lithium pass through?"
22. Look at the difference between this and this:
23. a knife cuts with an edge; this pushes like a hydraulic jack.
24. And the missing fourth element: stack pressure.
25. Too little leaves voids; too much drives the crack.
26. Engineers must hit a narrow window, not squeeze harder.
27. Before: a pore, a point, a crack, a short.
28. Now: a clean interface plates lithium back flat.
29. Solid does not mean safe. It means the failure hides.
30. Follow for more engineering in plain sight.

## Fact check

| Claim in script | Verified as | Source |
|---|---|---|
| Li-metal anode = 3860 mAh/g vs graphite 372 mAh/g (≈10×) | Yes; theoretical specific capacities | [Wiley, *Towards Next Generation Energy Storage Technologies*, ch. 3 (2024)](https://doi.org/10.1002/9783527845316.ch3); [ACS Nano](https://pubs.acs.org/doi/10.1021/acsnano.7b05874) |
| Solid electrolyte replaces flammable liquid; dendrite penetration still short-circuits cells | Yes | [Nature (2026), mechanically driven Li dendrite penetration in garnet](https://www.nature.com/articles/s41586-026-10415-9); [Nature (2023), dendrite initiation and propagation](https://www.nature.com/articles/s41586-023-05970-4) |
| In garnet, failure is mechanical, not chemical corrosion | Yes for the garnet LLZTO system studied: dendrites fill crack tips, no Li enrichment ahead of the tip | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9) |
| Initiation in subsurface pores / microcracks; pressure builds; crack propagates | Yes | [Nature (2023)](https://www.nature.com/articles/s41586-023-05970-4) |
| Pressure can reach ≈600 MPa inside a confined Li dendrite | Yes, from phase-field simulation | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9) |
| Current focuses at defects / grain boundaries; they are softer paths | Yes | [APL Energy (2025)](https://pubs.aip.org/aip/ape/article/3/3/031501/); [Nature Energy (2023)](https://www.nature.com/articles/s41560-022-01186-4) |
| Stack pressure has a narrow window: too little leaves voids, too much accelerates propagation | Yes | [Nature (2023)](https://www.nature.com/articles/s41586-023-05970-4); [RSC EES Batteries (2025)](https://pubs.rsc.org/eb/article/1/4/692/891031/) |
| A clean, defect-controlled interface plates lithium flat | Supported as a mitigation route (defect/void engineering, interface engineering) | [Nature (2026)](https://www.nature.com/articles/s41586-026-10415-9); [MDPI Batteries (2025)](https://www.mdpi.com/2313-0105/11/8/304) |

Keep the line "the hardest ceramic was not the safest" as a statement about the studied garnet cells, not a universal claim about every solid electrolyte.
