# Retention rules (measured on two reference Shorts, 2026-11-27)

Source: two 9:16 Spanish Shorts from the same creator (720×1280, 30 fps), studied only, never reused.
- **A** — "Si quieres crear vídeos como estos…": 60.3 s, 207 words, **3.45 words/s**. Compares two of the creator's own Shorts (61 k vs 10.5 M views, uploaded one day apart, same account and voice) and names three differences.
- **B** — "Comenta NEGOCIO…": 59.1 s, 188 words, **3.25 words/s**. Explains the 8-piece script structure while a tower is built floor by floor, one floor per piece.

Every rule below is a number or a yes/no that a still or `timing.json` can be checked against. `SKILL.md` steps 4, 5 and 7 enforce them.

## Topic
| Rule | Target |
|---|---|
| The viewer owns or touches the object today | yes (`proximity: hand` or `home`). A: the phone screen (10.5 M) beat the AirTag (61 k): "not everybody has one, but you are touching your screen right now". |

## First second
| Rule | Target |
|---|---|
| Frame 0 shows the hook's action, subject big in frame | yes. A: a giant finger already pressing the glass (10.5 M) vs. a still pocket (61 k). |
| Something changes state in the first 3 s | yes. B: grey crowd → one figure turns colour when the hook "breaks the pattern". |
| Greeting / intro before the hook | no |

## Explanation
| Rule | Target |
|---|---|
| Mechanism shown, not described with a metaphor the viewer must imagine | yes. A: "your finger takes the electricity and a number drops from 100 to 62" (shown) vs. "a detective in your pocket" (imagined). |
| A number animates on screen for each key claim | yes: view counters `▶ 58,8 mil → 10,5 M`, a sensor row `100 100 100 → 81 62 84`, a ×172 ratio. |
| One visual metaphor carries the whole Short | B: yes (the tower; the last shot shows every floor labelled with "Tú estás aquí" at the top). |
| Progress tracker on screen when N items are promised | A: three gold cards `1 ? 2 ? 3 ?` that turn into ✓ as each one is told, and the three ✓ cards drop into a folder for the CTA. |

## Script structure (B, and A follows it too)
Hook → intro/promise ("what they take away if they stay") → body 1 → **open loop** ("pero eso no es lo más loco") → body 2 → open loop → body 3 → call to action. In B the open loop is called "the piece that really keeps them", more important than the hook.

## Pacing
| Rule | Target |
|---|---|
| Length | 58–60 s |
| Words per second | 3.25–3.45 |
| Picture change | a new element, cut or camera move every 1–2 s; transitions are dissolves/pushes, almost no hard cuts (ffmpeg scene detection at 0.25 finds only 1–4 in a whole video) |

## Captions
| Rule | Target |
|---|---|
| Position | top, ≈ 6–12 % from the top (the subject owns the centre) |
| Words shown | a phrase of 2–6 words, up to 2 lines |
| Spoken vs. upcoming words | spoken words white and bold, upcoming words dimmed grey |
| Current word | boxed (thin highlight outline) |

## Call to action
| Rule | Target |
|---|---|
| Closes the loop with the viewer | yes. B: "¿Te diste cuenta? Este vídeo está armado igual y llegaste hasta aquí." |
| Asks for one concrete action with a reason | yes. B: "Guárdalo para cuando escribas tu próximo guion." A: "la carpeta está en el enlace de mi perfil". Title of B: "Comenta NEGOCIO y te mando…" (comment keyword). |
| Bare "like and follow" as the only CTA | no |

## Viewer comment
A shows a real comment as the flat comment sheet of the social app ("Comentarios", grey avatar, "1 d", "Responder") rising from the bottom over the 3D picture, recognised instantly as "someone commented this".
