---
name: animated-shorts
description: Make viral animated Shorts (2D cartoon characters in a 3D world) entirely in code with three.js + Remotion, a free Kokoro voice and code-made music. Clone the style of ANY animated channel by measuring it, write the story, voice it, build it, check stills, render a 9:16 Short and a 16:9 version, generate high-CTR thumbnails via thumbnails-hooks, and package it. Use when the user says "download their shorts", "measure the style", "turn this into a skill", "give me ideas", "write the script", "make the voice", "build the video", "make it yours", "make the long version", "make thumbnails", "package it", or "something looks off in shot N".
---

# Animated Shorts (free skill)

Everything is made on this computer: no AI video generator, no paid voice, no stock music.
- **Pictures:** three.js worlds + drawn 2D characters, rendered by Remotion (`src/engine/`, including `src/engine/kit.tsx` and `src/engine/CommentCard.tsx`).
- **Voice:** Kokoro (`scripts/voice.mjs`), free, runs locally, Apache-2.0 licence (fine on a monetized channel) — with optional final-pass upgrade to ElevenLabs when credits are available after full validation.
- **Music + sound:** made in code (`scripts/sound.mjs`).
- **Captions:** one or two words at a time, timed to the voice by `voice.mjs` (each word is also spoken alone and matched to the line, so no paid transcription is needed).
- **Measuring:** `scripts/measure.py` uses ffmpeg if you have it, otherwise the copy that comes with Remotion.
- **Thumbnails:** Delegated at Step 10 to `.claude/skills/thumbnails-hooks/SKILL.md` (`scripts/thumbnails.mjs` + `src/thumbnails/ThumbnailSheet.tsx`).

Always work inside this project folder. One episode = `episodes/epN/` + `src/epN/` (or `episodes/epN_en/` + `episodes/epN_es/` sharing `src/epN/` when producing bilingual versions). Start a **new chat for every new video** (one video fills a lot of memory).

## The commands

### 1. "Download their 20 most popular Shorts from <channel link>"
`yt-dlp --flat-playlist -I 1:60 --print "%(view_count)s %(id)s" "<link>/shorts"`, sort by views, take the top 20, then
`yt-dlp -f "bv*[height<=1280][ext=mp4]" --write-auto-subs --sub-format json3 --sub-langs en -o "ref/<channel>/%(id)s.%(ext)s" <ids>` (picture only is enough to measure; the subtitles give the words per second).
These are **only for studying**. Never post them, never use their frames in a video.

### 2. "Measure the style"
Run `python scripts/measure.py ref/<channel>`. Then **look at every contact sheet** in `ref/<channel>/measure/` (30 fps, 60 frames per sheet) and read `numbers.json`. Don't describe the video, measure it:
- **Pacing:** average shot length, cuts per minute, how many seconds before the first cut.
- **Camera:** does it glide (how many frames does a move take), push in, orbit, go low? Count it on the 30 fps sheets.
- **Light + colour:** shadow colour (hue + RGB from numbers.json, never "dark"), highlight colour, saturation, how much pure black (usually almost none).
- **Ink:** are there black outlines on the 3D world, or only on the characters? How thick, relative to the frame width?
- **Characters:** head height as a share of the whole body, limb thickness relative to the head, hats, faces, how they move.
- **Depth:** is the background soft? How soft?
- **Captions:** words at a time, font weight, outline, position (% from the top).
- **Voice + script:** words per second, first line (a paradox, no intro), where the pivot comes ("You see…"), the twist on the last line, tense (present or past).
Write it all into `styles/<channel>.md` with the numbers. Every rule must be a number or a yes/no a picture can be checked against.

### 3. "Turn this into a skill"
Create `.claude/skills/<channel>-style/SKILL.md` that says: use the animated-shorts workflow, with the look in `styles/<channel>.md`, and lists the exact engine settings that produce it (the `Look` values: sun, hemi, fog, exposure, aperture, ink, warm/cool, saturation; caption size and position; voice speed; shot length). Test it by building one still of a sample shot and comparing it with a frame from the channel side by side. Fix the numbers until they match.

### 4. "Give me 10 ideas" (or use the master prompt in claude.ai)
Ten true, strange, visual stories that fit the channel. For each one, **search YouTube** for the topic and write down the biggest Short and long video on it. If a Short already has millions of views on the same story, drop it (someone told it already). Pick one with a clear twist.
- **Sub-Niche Lock — Hidden Engineering in Everyday Objects ("X-Ray of Daily Life"):** Every episode MUST start from a physical object, appliance, or everyday mechanism that the viewer touches or uses weekly (e.g., induction stove, pop-up toaster, microwave, elevator brake, noise-canceling headphones, car airbag, key lock, washing machine damper, thermostat). NEVER pitch abstract history, military hardware, or distant mega-structures unless reframed around an everyday household/personal device. Every idea must feature an invisible millisecond mechanism ideal for a 3D cutaway/X-ray view and a 4X Long-video expansion covering the core engineering principle behind similar everyday machines.
- **Engineering, Tech & Robotics High-RPM Niche Expansion:** When generating or evaluating ideas for engineering, mechanics, electronics, robotics, AI hardware, energy, or aerospace:
  1. **Validate YouTube performance & 4X feasibility:** Check search demand, existing views, and Tier-1 (US/UK/CA) high-RPM potential vs. Spanish-market competition. Explicitly confirm whether the topic works for **4X Production** (a specific Short + a broader generic 6–10 min Long video) or **Shorts only** (if too narrow, propose the broader engineering principle that encompasses it for the Long video). Record the top reference video URL/ID and its title in `episodes/epN/story.md` so Step 10 can audit its thumbnail.
  2. **Include trending niche angles:** Prioritize high-demand topics in the niche (e.g., humanoid robot actuators & balance, solid-state batteries & fast charging, AI data center liquid immersion cooling, reusable rocket landing control, EUV microchip lithography) showing how each splits into a punchy Short and a broader Long deep-dive to maximize subscribers, likes, and RPM.

### 5. "Write the script"
Write `episodes/epN/story.md` in the measured style:
- First line: a paradox or surprising fact, no intro, no "today we'll…".
- Escalate, then pivot with "You see…" to the real reason, then the payoff, then a twist on the last line that loops back to the first.
- Match the channel's measured pace (Ricks Clips: about 3.7 words per second, roughly 200–250 words for a 60-second Short). Set the voice speed so `timing.json` lands on it.
- **Fact check every claim** and put the sources in a table at the bottom of story.md. If a fact is "allegedly", say so or leave it out.
- **Bilingual 4X Scripting & High-Retention Blueprint:** When producing for the engineering/tech niche, write **native adaptations** (never literal translations) for both **English (`epN_en`)** and **Spanish (`epN_es`)** using the **3+1 Open Loop + 10-Step Retention Ladder**:
  1. **3+1 Hook (0:00–0:07):** State **3 concrete technical facts** in line 1 and immediately warn that **a 4th critical element is missing** without which the whole system fails (creates an open loop until step 8).
  2. **Step 1 — Ask a Question:** (*"But why does this happen?"* / *"¿Pero por qué pasa esto?"*).
  3. **Step 2 — State a Problem:** (*"Here is the problem..."* / *"Pero aquí hay un problema..."* — physical limit or failure mode).
  4. **Step 3 — Open a New Curiosity:** (*"Now, here is the interesting part..."* / *"Ahora, aquí viene lo interesante..."*).
  5. **Step 4 — Show the Proof:** (*"Look at what happens..."* / *"Mira lo que pasa..."* — mechanism in action).
  6. **Step 5 — Add a Twist:** (*"But something unexpected happened..."* / *"Pero pasó algo que no esperaba..."* — secondary failure if uncontrolled).
  7. **Step 6 — Show a Viewer Comment:** Never replace the viewer comment with a bare `?` sign. Define a physical in-world viewer comment card raising a skeptical question (*"Look at what someone commented..."* / *"Mira lo que me escribió alguien..."*) by adding a `comment` object (`{"username": "orgalus_", "avatarStyle": "mecha", "seed": 2, "question": "¿Pero por qué no se rompe con tanta presión?"}`) to that shot in `shots.json` (`avatarStyle`: `"person" | "mecha" | "pet" | "tech"`). Do NOT generate a standalone image in Step 5; `<CommentCard />` renders it inside the 3D scene in Step 7.
  8. **Step 7 — Make a Comparison:** Everyday physical analogy (*"Look at the difference between this and this"* / *"Mira la diferencia entre esto y esto"*).
  9. **Step 8 — Reveal the Error / Hidden 4th Fact:** Close the opening loop by revealing the missing 4th element or critical design mistake.
  10. **Step 9 — Show Before & After:** Clear visual contrast (*"Before it was like this. Now look at this."* / *"Antes era así. Ahora mira esto."*).
  11. **Step 10 — Dual-Mode Outro (Short vs. Long Bridge + Like & Follow CTA):** Keep it crisp (3–4 seconds max so retention never drops) and choose the exact ending based on whether a `Long` video exists for this episode:
    - **Case A — Short WITH a companion Long video (`4X` episode):** Deliver the final takeaway twist, promote the full Long video on the YouTube channel, say goodbye, and ask for a like and follow/subscribe (*ES:* *"Si quieres ver cómo funciona este sistema completo por dentro, ya tienes el vídeo largo en mi canal de YouTube. ¡Hasta luego! Dale a me gusta y síguenos para más contenido así."* / *EN:* *"If you want to see the full engineering breakdown, watch the full video on my YouTube channel right now. See you there! Hit like and follow for more."*).
    - **Case B — Standalone Short (NO companion Long video):** Deliver the final takeaway twist, say goodbye briefly, and ask for a like and follow/subscribe (*ES:* *"¡Hasta luego! Si te ha gustado, dale a me gusta y síguenos para descubrir más ingeniería así."* / *EN:* *"See you next time! Hit like and follow if you want more engineering like this."*).
- **Character Voice Casting & Emotion Direction:** Include a casting header in `story.md` defining characters, Kokoro draft IDs, ElevenLabs master IDs, and per-shot emotional tags:
  - *Single Narrator (Documentary/Engineering):* EN Kokoro `am_michael` (`1.05–1.06`) → ElevenLabs `Brian`/`Adam`; ES Kokoro `em_alex` (`1.05–1.06`) → ElevenLabs `David Martin`. Arc: `[intriguing]` → `[curious]` / `[analytical]` → `[serious]` → `[amazed]` / `[enthusiastic]`.
  - *Two Characters (Curious Learner + Expert/Parent):* Learner Kokoro `af_bella` (EN) / `ef_dora` (ES) (`[curious]`, `[gasps]`, `[amazed]`, `[laughs]`); Expert Kokoro `am_michael`/`af_heart` (EN) / `em_alex`/`af_heart` (ES) or ElevenLabs `David Martin` (`[warm]`, `[chuckles]`, `[serious]`, `[proud]`).

Split it into `episodes/epN/shots.json` (and `episodes/epN_en/shots.json` + `episodes/epN_es/shots.json` for bilingual runs): one line of voice per shot (`{"id", "text", "say"?, "speaker"?, "emotion"?, "comment"?: {"username", "avatarStyle"?, "seed"?, "question"}}`; `say` = how numbers are spoken, e.g. "eighteen_seventy-five" for "1875").

### 6. "Make the voice"

**A. Voice bible + emotional arc (before generating audio)**
- Add a casting header in `story.md`: character, age/attitude, pacing, allowed emotions, pronunciation notes, forbidden flat reads.
- Mark every shot in `shots.json`: `{"id","text","say?","sayTts?","voice?","emotion?","model?","speed?","stability?","style?","gap?"}`. `text` stays clean for captions; `say` is phonetic display-safe; `sayTts` is TTS-only expressive text.
- Require an arc, not a flat read: hook=`intrigued/curious`, setup=`analytical`, risk=`serious`, reveal=`amazed/enthusiastic`, close=`warm/proud`. If >3 consecutive shots share emotion+speed, rewrite direction.

**B. Zero-cost Kokoro draft first**
- `node scripts/voice.mjs epN <voice> <speed>` (EN `am_michael 1.05`, ES `em_alex 1.05-1.06`). Writes `public/epN/voice.wav` + `episodes/epN/timing.json`.
- Kokoro has limited acting control: simulate intent with per-shot `speed` (0.98-1.08), short sentences, punctuation/`?`/`!`, and `say` phonetics. Treat as prosodic draft, not final acting.

**C. ElevenLabs master after visual validation**
1. Generate Kokoro for `epN_en`/`epN_es` before visual iteration (zero credits).
2. Only after step 7.2 `stills.mjs` passes 100%, check ElevenLabs credits/subscription.
3. If credits are sufficient, render master with `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <voiceLabel> <baseSpeed> [modelId]`.
  - `eleven_v3`: use audio tags in `sayTts`/emotion (`[whispers]`, `[excited]`, `[serious]` as supported) for high acting range.
  - `eleven_multilingual_v2`: no bracket tags; express emotion via punctuation, sentence shape, and per-shot settings.
4. The script auto-applies emotion presets and sends `previous_text`/`next_text` for continuity; per-shot fields override presets.

| Emotion | stability | similarity_boost | style | speed x |
|---|---:|---:|---:|---:|
| intrigued/curious | 0.30-0.35 | 0.78 | 0.50-0.55 | 1.00-1.02 |
| analytical | 0.55 | 0.82 | 0.25 | 0.98 |
| serious | 0.50 | 0.85 | 0.30 | 0.96 |
| amazed/enthusiastic | 0.25-0.28 | 0.75-0.76 | 0.60-0.65 | 1.03-1.04 |
| warm/proud | 0.42-0.45 | 0.80-0.82 | 0.35-0.40 | 0.98-0.99 |

5. After ElevenLabs pass: overwrite `public/<ep>/voice.wav`, **re-run/keep new `timing.json`**, re-check shot durations/captions, then render. Never touch previous episode audio.

**D. Voice QA gate**
- Listen hook, reveal, outro; confirm audible energy/rhythm change.
- Check no clipping, no mispronounced numbers/names, captions aligned to new timing.
- If one shot is flat, regenerate only that shot with adjusted `emotion/sayTts/speed/stability`, then rebuild timing/audio.

### 7. "Build the video"
1. Write `src/epN/sets.tsx` (the places), `src/epN/cast.ts` (the characters) and `src/epN/shots.tsx` (one entry per shot: look, camera from/to, focus distance, who stands where). Copy `src/ep1/` as the example. Use the kit in `src/engine/kit.tsx` (Box, Cyl, Roof, House, Window, Lamp, Cab, Cart, Fire, Sign, Snow…) and add new pieces there when a story needs them.
  - **3D Physical Viewer Comment Card (`src/engine/CommentCard.tsx`):** Whenever a shot in `shots.json` contains a `comment` object, render `<CommentCard username={shot.comment.username} question={shot.comment.question} avatarStyle={shot.comment.avatarStyle} seed={shot.comment.seed} />` as a physical off-white paper card (`#F4EFEA`) inside the 3D scene (held by a character or angled naturally in front of the camera so it receives scene lighting, soft shadow tinting, and `InkPass` edges — never flat 2D screen text). If `src/engine/CommentCard.tsx` does not exist yet, create it with procedural circular canvas avatars (`person`, `mecha`, `pet`, `tech`), lowercase username, and dark left-aligned sans-serif question text.
  - **Bilingual 3D Reusability:** Keep all other in-world 3D labels strictly numerical/universal (`330 Ω`, `660 t`, `0.030 s`, `-40 %`, `1,000 °C`) so the exact same `sets.tsx`, `cast.ts`, and `shots.tsx` render both the English (`epN_en`) and Spanish (`epN_es`) videos without duplicating 3D geometry (only passing `shots.json`'s localized `comment` text when a comment card shot is active).
2. **Check stills before rendering:** `node scripts/stills.mjs <ids>` and look at every still. Check: is the subject in frame, is a face covered, is the camera inside a wall, is anyone hidden behind someone else, does the shot show what the line says, is it too dark or too yellow. Fix and check again. *(Complete this check before triggering the ElevenLabs audio upgrade in step 6).*
3. Make the sound: write `episodes/epN/sound.json` (ambience per shot + sound effects at the moments things happen), then `node scripts/sound.mjs epN`.
4. Render: `npx remotion render src/index.ts Short episodes/epN/out/episode_N.mp4 --codec=h264 --crf=18` (add `--concurrency=2` if system RAM/CPU needs smooth throttling; render both `Short-EN` and `Short-ES` when doing bilingual 4X).

### 8. "Make it yours"
Copying a channel exactly makes you the 50th copy. Add your own main character to `cast.ts` (describe hat, coat, colours, hair, moustache…). Characters are drawn in code, so they look exactly the same in every shot and every video. Change the palette or the light a little in your style file.

### 9. "Make the long version"
Same characters and sets, 16:9 (`Long` composition). A long video needs a longer story: write a 6–10 minute script with the same formula (several mini-stories or one deeper story), more shots, then render `Long`. Shorts bring people in, long videos earn more per view.
- **Generic Broad-Topic Expansion & Long-Video Dual Outro (Bilingual `Long_EN` + `Long_ES`):** While the Short focuses on one specific hook or case, the `Long` version must cover the underlying technology or engineering principle **broadly and generically** across 5 structured chapters (1. 3+1 Hook & Global Problem, 2. Core Physics from First Principles with everyday analogies, 3. Historical Failures & Evolution, 4. Step-by-Step Internal Mechanics + 4th Master Fact reveal, 5. Real-World Applications & Future) to maximize Watch Time and mid-roll ad revenue in both English and Spanish.
- **Long-Video Closing CTA:** End every `Long` episode with an explicit, warm sign-off asking viewers to **hit like**, **subscribe/follow** for more engineering deep-dives, and watch the next recommended video on the channel (*ES:* *"Si este vídeo te ha ayudado a entender cómo funciona esta ingeniería por dentro, dale a me gusta, suscríbete para no perderte los próximos episodios y mira este otro vídeo del canal. ¡Hasta luego!"* / *EN:* *"If this breakdown helped you see how this engineering works from the inside, hit like, subscribe for more episodes like this, and check out this next video on the channel. See you in the next one!"*).

### 10. "Generate high-CTR thumbnails" (Execute `.claude/skills/thumbnails-hooks/SKILL.md`)
Right after the script, voice, and video (`Short` and/or `Long`) are rendered, **read and execute the dedicated sub-skill located at `.claude/skills/thumbnails-hooks/SKILL.md`** for the current episode (`epN` / `epN_en` / `epN_es`):
- Pass the **episode ID**, the **target format** (`short` 9:16, `long` 16:9, or `both`), and the **reference video URL/ID** recorded in `episodes/epN/story.md`.
- Follow every step inside `.claude/skills/thumbnails-hooks/SKILL.md` to audit the reference video's thumbnail & title (what to keep vs. improve), combine it with 10 current niche trends and your dual visual style (`cream` Editorial + `dark` CAD), generate `shot_short.png` / `shot_long.png`, and export the winning cover (`thumbnail_<mode>_<N>.png`) before moving to Step 11.

### 11. "Package it"
Write `episodes/epN/upload.md`: a curiosity title under 60 characters (no clickbait the video doesn't pay off), a two-line description with the sources, 5 tags, and the winning exported thumbnail (`thumbnail_short_<N>.png` and/or `thumbnail_long_<N>.png`) generated by `.claude/skills/thumbnails-hooks/SKILL.md` in Step 10.
- **Bilingual Channel Separation Rule:** When packaging `epN_en` and `epN_es` (4X deliverables: `Short_EN`, `Short_ES`, `Long_EN`, `Long_ES`), generate separate metadata blocks for **two dedicated language channels** (`EN` and `ES`). Never upload the exact same visual video in two different languages on the same channel on the same day (it tanks CTR/retention and triggers duplicate-content suppression); if using a single YouTube channel, upload only one video file and attach the second language via YouTube's native Multi-Language Audio track.

## Six things that make it look premium (check every shot)
1. **Signs, labels, and viewer comments live in the world** (signs, posters, maps, stamps, and physical `<CommentCard />` boards in the 3D scene — using universal numbers/units like `660 t` or `330 Ω` on set props so 3D sets work in both languages), never flat on top. Ink outlines only where the channel has them: measure it (Ricks Clips: lines on the characters, none on the world, so `ink: 0`).
2. **Shadows are never black.** Tinted to the measured colour (Ricks Clips: blue-violet), from the hemisphere light's ground colour and the grade (`cool`).
3. **The camera never jumps.** Every shot glides from one pose to another (`cam.from` → `cam.to`), with a little sway.
4. **Big round heads, thin limbs:** the head is about a third of the height, arms and legs are thin black lines, hands are small round mittens.
5. **A soft background**, so you only look at the character (`focus` = distance to the subject, `aperture` 0.35–0.6).
6. **Check stills before you render** (step 7.2). It catches a camera stuck in a wall before you waste a render on it, and gates the ElevenLabs credit pass so no paid audio is generated until the visuals are verified.

## If something breaks
- Out of usage: wait for the reset, then type "continue".
- The skill isn't found: you opened Claude Code in the wrong folder.
- A shot looks wrong: say exactly what's wrong ("the tree covers his face in shot 7") and fix only that shot, check its still, render again.
- Red text in the terminal: read it, fix the cause, don't just retry.