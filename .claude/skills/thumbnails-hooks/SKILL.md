---
name: thumbnail-hooks
description: Analyze any built episode (epN), evaluate the highest-CTR visual hooks for engineering/tech/robotics videos, capture key 3D frames from the episode, and generate 10 distinct high-retention thumbnail/cover variations in contact sheets (`shot_short.png` in 9:16, `shot_long.png` in 16:9, or BOTH) plus standalone export of winning covers. Use when the user says "make thumbnails", "generate covers", "create shot.png", "portadas para epN", "miniatura para short", "miniatura para video largo", or "ambas portadas".
---

# Thumbnail Hooks Generator (Engineering & Tech Style — 9:16, 16:9, or Both)

Generate 10 high-CTR cover variations in contact sheets built entirely in code with Remotion + the episode's own 3D scene (`src/epN/` or `src/videos/<slug>/`), supporting **vertical Shorts/Reels/TikTok (`9:16`)**, **horizontal YouTube Long (`16:9`)**, or **both formats simultaneously**.

## Format Modes (Short, Long, or Both)

Whenever the user requests thumbnails/covers for an episode, check which format they want (defaulting to **both** if they are running a bilingual/4X episode with both `Short` and `Long` compositions):
1. **`short` (`9:16` vertical — `1080x1920` per cover):**
   - Captures 3D hero frames from `Short` / `Short-EN` / `Short-ES`.
   - Generates `episodes/<epN>/out/shot_short.png` (`5616x3948` 5×2 grid of 10 vertical covers).
   - Exports chosen cover via `ThumbSingle` (`1080x1920`) -> `episodes/<epN>/out/thumbnail_short_<N>.png`.
2. **`long` (`16:9` horizontal — `1280x720` per cover):**
   - Captures 3D hero frames from `Long` / `Long-EN` / `Long-ES` (or `Short16x9`).
   - Adapts copy for YouTube browse/suggested feed (broader curiosity framing, larger side-by-side or focal-object layout readable at small mobile thumbnail size).
   - Generates `episodes/<epN>/out/shot_long.png` (`6616x1548` 5×2 grid of 10 horizontal covers).
   - Exports chosen cover via `ThumbSingle16x9` (`1280x720`) -> `episodes/<epN>/out/thumbnail_long_<N>.png`.
3. **`both` (`9:16` + `16:9` together):**
   - Runs both pipelines sequentially so the user gets **10 vertical options (`shot_short.png`)** AND **10 horizontal options (`shot_long.png`)** in one pass.

## Visual Design System (Strict Rules)

Every thumbnail must follow one of two alternating high-contrast editorial-tech palettes:

1. **Theme A — Warm Editorial Cream (`cream`):**
   - **Background:** Warm cream radial gradient (`#F5EDE0` center to `#E6D9C3` edges) with subtle paper grain.
   - **Typography:** Heavy geometric sans-serif (`Inter` / `Montserrat` 900, tight tracking `-0.03em`) in deep ink navy (`#0D1321`), paired with **one key action/contrast word in vibrant orange (`#F97316`) italic serif** (`Playfair Display` / `Georgia` italic).
   - **Badges & Accents:** Top dark pill (`#0D1321`) for category tags (`INGENIERÍA REAL`, `PRUEBA LÍMITE`), vibrant orange rounded pills (`#F97316`, white bold text) or tilted stickers (`-3deg`) for key numbers (`330 Ω`, `660 t`, `0.030 s`), bold diagonal slash lines (`#F97316` / `#EF4444`) over myths/failures, and the 2D character reacting (shocked, pointing, amazed) next to the 3D render.

2. **Theme B — Dark Blueprint / CAD (`dark`):**
   - **Background:** Deep obsidian (`#0B0D12` to `#131722`) with subtle faint engineering grid lines (`rgba(255,255,255,0.045)`) and a soft radial glow behind the centerpiece.
   - **Typography:** Crisp white (`#FFFFFF`) extra-bold sans-serif headline + key phrase framed inside a **CAD/editor selection bounding box** (1.5px solid border with 4 corner square handles in neon lime `#C4F529` or vibrant orange `#F97316`) containing italic serif text.
   - **Badges & Accents:** Translucent top pill (`rgba(255,255,255,0.06)`) with a glowing square dot + uppercase tracked label, technical spec cards (`ID 0001`, status meters, before/after comparison cards), tilted red/orange rubber-stamp overlays (`FALLO`, `IMPOSIBLE`, `SIN SENSORES`), and a tilted handwritten-style footer hook in `#F97316` or `#EF4444`.

## The 10 Mandatory Hook Archetypes (for `shot_short.png` & `shot_long.png`)

1. **The Impossible Paradox (`cream`):** Bold 2-line statement + orange italic serif verb + clean 3D hero cutaway with a bold orange diagonal slash (`/`).
2. **Big Number Centerpiece (`cream`):** Top dual pills + massive orange outlined numeral (`30 ms`, `660 t`, `1,500,000`) + 3D mechanism card below.
3. **CAD Selection Box Mystery (`dark`):** Obsidian grid + white headline + neon lime (`#C4F529`) corner-handle bounding box around italic serif hook + technical ID card with red stamp (`FALLO` / `CRÍTICO`).
4. **Stop Paying / Stop Doing X (`cream`):** `"Deja de [error común]"` with orange highlight box + white/red crossed-out failure visual + character reacting.
5. **Before vs. After / Myth vs. Reality (`dark`):** Split comparison cards (`ANTES` / `DESPUÉS` or `MITO` vs `REALIDAD`) with green checkmark vs. red `FALLO` badge.
6. **1-Line / 1-Piece Secret (`cream`):** Giant orange number/word (`1 PIEZA`, `0.001 A`) + character pointing amazed at a tilted orange phone/screen card (`¿SABÍAS QUE...?`).
7. **The Price / Scale Shock (`dark`):** Top question + huge white metric (`2.000 °C`, `4.000 t`, `0,030 s`) + subtle red-tinted failure diagram below.
8. **Time-Limit Challenge (`dark`):** Glowing circular gauge / timer (`0:30` or `60 s`) + tilted yellow/lime tag (`EN 30 SEGUNDOS`) + 3D mechanism preview.
9. **Hidden Error / What Went Wrong (`cream`):** Top badge `EXPERIMENTO REAL` + tilted red stamp `DESTRUIDO` / `ERROR` over the 3D cross-section + sticky-note callout.
10. **The 4th Missing Piece (`dark`):** Giant glowing question mark (`?`) or locked mystery block (`[?][?][?][🔒]`) teasing the 4th hidden engineering factor from the script's open loop.

## Workflow Commands

### 1. "Make thumbnails for <epN> [short | long | both]"
1. **Audit the Episode:** Read `episodes/<epN>/story.md` + `shots.json` (or `src/videos/<slug>/story.ts`). Identify the core engineering paradox, the 3+1 open-loop metrics, and the 3 best camera frames (`heroFrames`) for `short` (9:16), `long` (16:9), or `both`.
2. **Capture 3D Hero Stills:**
   - `node scripts/thumbnails.mjs capture <epN> <f1,f2,f3> short` (captures 9:16 refs into `public/thumb_refs/<epN>/short_ref_*.png`)
   - `node scripts/thumbnails.mjs capture <epN> <f1,f2,f3> long` (captures 16:9 refs into `public/thumb_refs/<epN>/long_ref_*.png`)
   - Or `node scripts/thumbnails.mjs capture <epN> <f1,f2,f3> both`
3. **Write Hook Configs:** Create `episodes/<epN>/thumbnails_short.json` (`cardWidth: 1080, cardHeight: 1920`) and/or `episodes/<epN>/thumbnails_long.json` (`cardWidth: 1280, cardHeight: 720`) with the 10 hook configurations.
4. **Render Contact Sheets:**
   - `node scripts/thumbnails.mjs sheet <epN> short` -> `episodes/<epN>/out/shot_short.png`
   - `node scripts/thumbnails.mjs sheet <epN> long` -> `episodes/<epN>/out/shot_long.png`
   - `node scripts/thumbnails.mjs sheet <epN> both` -> renders both `shot_short.png` and `shot_long.png`.
5. **Inspect & Recommend:** Inspect the generated `shot_*.png` image(s) and recommend the top 2 highest-CTR covers for Short and/or Long.

### 2. "Export thumbnail <N> for <epN> [short | long | both]"
Run `node scripts/thumbnails.mjs export <epN> <N> <short|long|both>` to render the selected cover (`1`–`10`) at full native resolution (`thumbnail_short_<N>.png` at `1080x1920` and/or `thumbnail_long_<N>.png` at `1280x720`).