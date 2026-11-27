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

**Score every idea before pitching it** (measured on two reference Shorts, 60 k vs 10.5 M views, same account and voice; see `styles/retention-rules.md`). An idea needs **3 of 3** to be pitched:
1. **In your hand right now (proximity).** Does the viewer own, touch or use the object *today*? (phone screen, charger, keys, coffee, fridge, toilet, sneakers → yes; AirTag, a factory machine they never see → weaker). Write `proximity: hand | home | street | far`. Only `hand` and `home` pass for a Short.
2. **Frame-0 action.** Can the first frame show the object *already doing something*, big and close (a giant finger hitting the glass, a cable plugging in with a spark, salt hitting water)? Write the frame-0 image in one sentence. A static establishing shot ("a pocket", "a factory") fails.
3. **Visible mechanism.** Can the key fact be *shown* as a physical change plus a number that moves on screen (finger steals the charge and a number drops `100 → 62`)? If the explanation needs a metaphor the viewer has to imagine ("a detective in your pocket"), it fails.

**Hook angle (choose one; humour is optional, not mandatory):**
- **Useful curiosity (default):** a surprising, true observation about the object the viewer is holding ("Your phone charges 0→80 % in half an hour… and then the last 20 % takes forever").
- **Mischievous double-entendre ("Humor Travieso Filtrado")**, only when it fits the object: a cheeky, platform-safe double meaning with 100 % clean literal words, then a deadpan pivot into the real process. Never let it be the only reason to watch: the frame-0 image and the promise must work without it. If a line could be limited by TikTok/Reels, write the softer alternative in `story.md`.

**YouTube Validation & 4X Feasibility:**
1. Check search demand, existing views, and Tier-1 (US/UK/CA) high-RPM potential vs. Spanish-market competition. Explicitly confirm whether the topic works for **4X Production** (a specific Short + a broader generic 6–10 min Long video) or **Shorts only**. Record the top reference video URL/ID and its title in `episodes/epN/story.md` so Step 10 can audit its thumbnail.
2. When pitching ideas, always provide: (a) the hook line, (b) the frame-0 image, (c) the visible mechanism + the number that moves, (d) the proximity score, (e) the one-world visual metaphor that will carry the whole Short (see step 5), (f) the broader 6–10 min Long video topic, and (g) the **comment keyword** + what the viewer gets by DM (see "Comment-Keyword CTA" in step 5).

### 5. "Write the script"
Write `episodes/epN/story.md` in the measured style, using the **8-piece retention structure** (always in this order). The reference Shorts that reach 10 M views follow it exactly:

| # | Piece | Share of the Short | What it does |
|---|---|---|---|
| 1 | **Hook** | 0–3 s | Breaks the pattern of what they were watching and makes them stop. Frame 0 shows the action, the line names the surprise. No greeting, no "today I'll tell you". |
| 2 | **Intro / promise** | 3–8 s | Tells them in one sentence **what they take away if they stay** ("In 50 seconds you'll know why, and the trick your phone already uses"). Never a literal definition of the object. |
| 3 | **Body 1** | ~8–22 s | Something useful they didn't know. One idea, shown, with one number that moves. |
| 4 | **Open loop 1** | 1 line | A sentence that leaves a question in the air *("Pero eso no es lo más loco." / "But that's not the crazy part.")*. Never the same wording twice in one Short. |
| 5 | **Body 2** | ~24–36 s | The deeper mechanism (the "why"). Pays off loop 1. |
| 6 | **Open loop 2** | 1 line | A second, different loop *("Y aquí viene el truco." / "And here's the trick.")*. |
| 7 | **Body 3** | ~38–50 s | The twist or the practical payoff the promise in piece 2 announced. |
| 8 | **Call to action** | last 5–8 s | Closes the loop with the viewer (*"¿Te diste cuenta? …"*) and asks for **one concrete next step with a reason**: always the **Comment-Keyword CTA** (below: comment «PALABRA» → the extra arrives by DM); saving it or checking something on their own phone may go with it. "Like and follow" may follow it, never replace it. |

**Hard limits (gate before the voice step):**
- **Length:** ≤ 60 s for a Short (references: 58–60 s). Script 170–205 words (ES) / 160–190 words (EN). If the voice comes out longer, **cut words**, do not speed the voice past `1.15`.
- **Pace:** 3.3–3.6 words/s (references: 3.25 and 3.45). Measure it in `timing.json` (`words / total`).
- **Shots:** 10–16 shots, one voice line each, average 3.5–5 s. The picture must change (cut, camera move or a new element appearing) at least every 2 s.
- **Frame 0:** shot 1 starts *in motion*: the subject is already big in frame and doing the action of the hook on frame 0 (no fade-in, no establishing glide). Check it with `node scripts/stills.mjs 1 --frame=0`.
- **Show, don't tell:** every claim in bodies 1–3 has (a) a visible physical change on screen and (b) a number that animates (`<Counter>`, see step 7). If a line asks the viewer to imagine something, rewrite it or show it.
- **One world, one metaphor:** pick one visual metaphor that carries the whole Short (the reference builds a tower floor by floor, one floor per piece). Every shot happens in that world, and the last shot shows the whole metaphor finished.
- **Visible progress:** when the hook promises N things (3 reasons, 3+1 steps…), show the tracker on screen (`<ProgressCards>`: `?` cards that turn into ✓ as each one is told). When it doesn't, the metaphor itself is the tracker (the battery fills, the tower grows).
- **Pattern interrupt in the hook:** something changes state in the first 3 s (grey → colour, still → moving, full → empty).
- **Fact check every claim** and put the sources in a table at the bottom of `story.md`.

**`story.md` must contain:** the 8-piece map (shot → piece → what is on screen → number that moves), the proximity score, the frame-0 image, the metaphor, the hook alternative if the hook is risky, the casting header (below) and the fact-check table.

**Viewer comment (optional, inside body 2 or 3):** if a real or plausible viewer question helps (*"Mira lo que me escribió alguien…"*), add a `comment` object to that shot in `shots.json` (`{"username", "avatarStyle"?, "seed"?, "question", "native"?}`). `native: true` renders it as the flat social-app comment sheet (`<NativeComment>`, recognisable at a glance as "someone commented this"); otherwise it is the physical paper `<CommentCard />` in the 3D scene. Never replace the comment with a bare `?`.

**Bilingual scripting:** when producing `epN_en` + `epN_es`, write **native adaptations** (never literal translations, adapting idioms and open-loop phrases) with the same 8 pieces and the same shot count, so both languages share `sets.tsx`, `cast.ts` and `shots.tsx`.

**Outro rule (piece 8) — Short vs. Long:**
- **Case A — Short WITH a companion Long video (`4X`):** close the loop, then send them to the Long with a reason (*ES:* *"Si quieres ver la fábrica entera por dentro, el vídeo largo está en mi canal."* / *EN:* *"The full factory tour is the long video on my channel."*).
- **Case B — Standalone Short:** close the loop and give one concrete action (*ES:* *"Guárdalo para la próxima vez que lo cargues, y sígueme para entender lo que tienes en la mano."* / *EN:* *"Save this for the next time you plug it in, and follow for more things you're holding right now."*).
- **Both cases:** piece 8 includes the mandatory **Comment-Keyword CTA** shot (below). Never end a Short without it.

#### Comment-Keyword CTA (mandatory on every Short and Long from now on)
Every video asks viewers to **comment one keyword** and promises an automatic reply by DM (references: `styles/cta/ref_comenta_palabra.png`, `styles/cta/ref_respuesta_dm.png`; engine check: `styles/cta/check_typed.png`, `styles/cta/check_reply.png` — a phone in the set: comments sheet, the keyword typed on the keyboard with the key lighting up orange, send, then a DM notification "*<channel> · mensaje* — ¡Aquí lo tienes: …!" with a video preview). Comments are the strongest ranking signal on Shorts/Reels/TikTok and the DM moves the viewer to the Long video.
- **Keyword:** ONE word, UPPERCASE, tied to the episode's object or process (`PEPINILLO`, `AUTOMÁTICO`, `SALMUERA`; EN `PICKLE`, `AUTOMATIC`). Max 12 letters so it fits the input field. Use a native word per language — never translate literally if the EN word is weak.
- **Promise (must be real):** what arrives by DM is the Long video (Case A) or a concrete extra (the full process "por dentro", the source table, the next part). Never promise something that doesn't exist; `upload.md` must say what the auto-reply sends.
- **Voice line (2.5–4 s, emotion `enthusiastic`), placed in piece 8, right after the loop-closing line and before "follow" / goodbye (it *is* the "one concrete action with a reason" of piece 8):**
  - *ES:* *"Comenta «PEPINILLO» y te mando por privado cómo funciona toda la fábrica por dentro."* / short form *"Comenta «PEPINILLO» y te lo enseño por dentro todo."*
  - *EN:* *"Comment «PICKLE» and I'll DM you the whole factory, step by step."*
  - The hook may tease it too (*"…y al final te digo qué comentar para verlo entero"*) — optional, only if it doesn't slow the first 3 s.
- **`shots.json`:** add a `cta` object to that shot: `{"id": 19, "text": "Comenta «PEPINILLO» y te lo enseño todo por dentro.", "emotion": "enthusiastic", "cta": {"keyword": "PEPINILLO", "reply": "¡Aquí lo tienes: el pepinillo por dentro!", "channel": "nebuu3d", "mode": "both"}}`. `mode`: `"both"` (type + send + DM reply in one shot, ≥ 2.8 s), or split over two shots: `"type"` on the "Comenta «X»" line and `"reply"` on the following line (as in the two references). `reply` ≤ 45 characters (2 lines). Optional `headline` overrides "Comenta"/"Comment".
- **Captions:** the caption for the keyword must show it with the guillemets (`«PEPINILLO»`) so the word is readable on screen even with sound off.

**Character Voice Casting & Emotion Direction:** include a casting header in `story.md` defining characters, Kokoro draft IDs, ElevenLabs master IDs, and per-shot emotional tags. Default narrator: one clear, confident documentary voice (`em_alex` / `David Martin` in ES; `am_michael` / `Brian` in EN).
- Arc: `[intriguing]` (hook) → `[confident]`/`[analytical]` (promise) → `[curious]`/`[serious]` (bodies) → `[amazed]` (each open loop, a little faster) → `[warm]` (CTA).

Split it into `episodes/epN/shots.json` (and `episodes/epN_en/shots.json` + `episodes/epN_es/shots.json` for bilingual runs): one line of voice per shot (`{"id", "piece", "text", "say"?, "speaker"?, "emotion"?, "comment"?: {...}, "cta"?: {"keyword", "reply", "channel"?, "mode"?, "headline"?}}`; `piece` = 1–8 from the table above; `say` = how numbers are spoken, e.g. "eighteen_seventy-five" for "1875").

### 6. "Make the voice"

**A. Voice bible + emotional arc (before generating audio)**
- Add a casting header in `story.md`: character, age/attitude, pacing, allowed emotions, pronunciation notes, forbidden flat reads.
- Mark every shot in `shots.json`: `{"id","text","say?","sayTts?","voice?","emotion?","model?","speed?","stability?","style?","gap?"}`. `text` stays clean for captions; `say` is phonetic display-safe; `sayTts` is TTS-only expressive text.
- Require an arc, not a flat read: hook=`intrigued/curious`, promise=`confident/analytical`, bodies=`serious/curious`, open loops=`amazed` (slightly faster), CTA=`warm`. If >3 consecutive shots share emotion+speed, rewrite direction.

**B. Zero-cost Kokoro draft first**
- `node scripts/voice.mjs epN <voice> <speed>` (EN `am_michael 1.05`, ES `em_alex 1.05-1.06`). Writes `public/epN/voice.wav` + `episodes/epN/timing.json`.
- Kokoro has limited acting control: simulate intent with per-shot `speed` (0.98-1.08), short sentences, punctuation/`?`/`!`, and `say` phonetics. Treat as prosodic draft, not final acting.

**C. ElevenLabs master after visual validation**
1. Generate Kokoro for `epN_en`/`epN_es` before visual iteration (zero credits).
2. Only after step 7.2 `stills.mjs` passes 100%, check ElevenLabs credits/subscription.
3. If credits are sufficient, render master with `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <voiceLabel> <baseSpeed> [modelId]`.
  - `eleven_v3`: use audio tags in `sayTts`/emotion (`[whispers]`, `[chuckles]`, `[excited]`, `[serious]` as supported) for high acting range.
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
- **Length gate:** `timing.json` `total` ≤ 60 s and 3.3–3.6 words/s (step 5 limits). ElevenLabs is usually slower than Kokoro (ep7_es went from 65 s to 78 s): if the master is over 60 s, in this order: (1) trim gaps (`gap` 0.08 s, 0.3–0.4 s only after the hook); (2) cut words in the longest lines; (3) only then speed the finished narration with `node scripts/tempo.mjs <ep> <factor>` (pitch-safe ffmpeg `atempo`, rewrites `timing.json`; max `1.10`). Never push the ElevenLabs base speed above `1.15`. Keep the Kokoro draft as `public/<ep>/voice_kokoro.wav` + `timing_kokoro.json`. (ep8: Kokoro 59.9 s → ElevenLabs 68.4 s → speed 1.15 66.8 s → gaps + 9 words cut 62.6 s → `tempo.mjs 1.05` 59.7 s.)
- If one shot is flat, regenerate only that shot with adjusted `emotion/sayTts/speed/stability`, then rebuild timing/audio.

### 7. "Build the video"
1. Write `src/epN/sets.tsx` (the places), `src/epN/cast.ts` (the characters) and `src/epN/shots.tsx` (one entry per shot: look, camera from/to, focus distance, who stands where). Copy `src/ep1/` as the example. Use the kit in `src/engine/kit.tsx` (Box, Cyl, Roof, House, Window, Lamp, Cab, Cart, Fire, Sign, Snow…) and add new pieces there when a story needs them.
  - **3D Physical Viewer Comment Card (`src/engine/CommentCard.tsx`):** Whenever a shot in `shots.json` contains a `comment` object, render `<CommentCard username={shot.comment.username} question={shot.comment.question} avatarStyle={shot.comment.avatarStyle} seed={shot.comment.seed} />` as a physical off-white paper card (`#F4EFEA`) inside the 3D scene (held by a character or angled naturally in front of the camera so it receives scene lighting, soft shadow tinting, and `InkPass` edges — never flat 2D screen text). If `src/engine/CommentCard.tsx` does not exist yet, create it with procedural circular canvas avatars (`person`, `mecha`, `pet`, `tech`), lowercase username, and dark left-aligned sans-serif question text.
  - **Screen HUD (`src/engine/Hud.tsx`, the only things allowed flat on top of the picture):**
    - `<Counter from to start end format? prefix? suffix? pos? size? accent?>`: an animated number pill (▶ `10,5 M`, `100 → 62`, `0 % → 80 %`). Use one in every body shot whose line contains a number (step 5 "show, don't tell"). Format decimals per language (`fmt: "es" | "en"`).
    - `<ProgressCards total done active? pos?>`: the `1 ? 2 ? 3 ?` cards that flip to ✓ as each promised item is told. Use it whenever the hook promises N items.
    - `<NativeComment username question avatarStyle? seed? lang?>`: the flat social-app comment sheet, for shots whose `comment.native` is `true`.
    - Captions: new episodes use `<Captions words={words} mode="karaoke" />` (phrase of up to ~5 words at ~10 % from the top, spoken words bright, the current word boxed). Old episodes keep the default one-word mode, so they re-render unchanged.
  - **Frame 0 check:** `node scripts/stills.mjs 1 --frame=0` must already show the hook's action (big subject, in motion).
  - **3D Comment-Keyword CTA (`src/engine/CommentCTA.tsx`):** On the shot whose `shots.json` entry has a `cta` object, render `<CommentCTA keyword={cta.keyword} reply={cta.reply} channel={cta.channel} mode={cta.mode} lang={lang} position={...} />` (use `ctaFor(shotsJson)` to read it). It is a physical phone on a small stand inside the set (dark bezel, `ink` silhouette, screen lit by an emissive canvas) with the in-world headline «Comenta «KEYWORD»» above it; the screen animates by itself (typing at 9 letters/s from 0.35 s, key highlight, send, DM slide-in). Frame it so phone + headline fill ~70% of the height (phone 2.2 units tall: camera ≈ 5.5–6.5 units away, fov 40, look at the phone centre + 0.3). A character may stand beside it pointing (`armR: "point"`). Check the look on the model sheet first: `npx remotion still src/index.ts CtaPreview out/stills/cta.png --frame=45` (frames 15/45/75/105 = typing / typed / reply / settled).
  - **Bilingual 3D Reusability:** Keep all other in-world 3D labels strictly numerical/universal (`25 cm`, `4 bar`, `5 mm`, `-40 %`, `1,000 °C`) so the exact same `sets.tsx`, `cast.ts`, and `shots.tsx` render both the English (`epN_en`) and Spanish (`epN_es`) videos without duplicating 3D geometry (only passing `shots.json`'s localized `comment` text when a comment card shot is active).
2. **Check stills before rendering:** `node scripts/stills.mjs <ids>` and look at every still. Check: is the subject in frame, is a face covered, is the camera inside a wall, is anyone hidden behind someone else, does the shot show what the line says, is it too dark or too yellow. Fix and check again. *(Complete this check before triggering the ElevenLabs audio upgrade in step 6).*
3. Make the sound: write `episodes/epN/sound.json` (ambience per shot + sound effects at the moments things happen), then `node scripts/sound.mjs epN`. On the CTA shot: one `tick` per typed letter (from 0.35 s, every 0.11 s), a `pop` on send, a `coin` when the DM reply lands (`ctaTimeline(keyword, mode)` in `CommentCTA.tsx` gives the exact times).
4. Render: `npx remotion render src/index.ts Short episodes/epN/out/episode_N.mp4 --codec=h264 --crf=18` (add `--concurrency=2` if system RAM/CPU needs smooth throttling; render both `Short-EN` and `Short-ES` when doing bilingual 4X).

### 8. "Make it yours"
Copying a channel exactly makes you the 50th copy. Add your own main character to `cast.ts` (describe hat, coat, colours, hair, moustache…). Characters are drawn in code, so they look exactly the same in every shot and every video. Change the palette or the light a little in your style file.

### Character style: Meme-Fusion (channel default, `ref/personajes_meme.jpg`)
Every new episode uses the meme-fusion characters (`style` defaults to `"meme"` in `src/engine/draw.ts`). Episodes 1–7 are pinned to `style: "classic"` so they re-render unchanged; never remove that pin from an old cast.
- **Anatomy (measured on the reference):** round white head ≈ 42% of the height with a grey cel crescent on the left edge, pill torso ≈ 29% (width ≈ 0.66 × head Ø), filled trouser legs ≈ 27% with black oval shoes, thick black stick arms with a slight elbow bend, black mitten hands with a thumb. Outline `11 px` at full height (≈ 0.033 × head Ø), interior lines ≈ 40% of it, `lineCap/lineJoin = "round"`. Shading = flat colour + a darker band on the left edge of head, hats, clothes and props. `headScale` adjusts the head if a story needs it (1 = reference).
- **`face` (spec default) / `pose.face` (per shot):** `neutral`, `smirk`, `troll`, `lol`, `laugh` (lol + tears), `rage` (FFFUUU: V brows, clenched teeth, flush, vein), `scream`, `poker`, `derp`, `high`, `skeptical`, `suspicious`, `happy`, `proud`. All are drawn inside the head with the same ink — never paste meme images. `talk: true` animates the mouth of every face. Priority: `pose.face` > `pose.eyes/mouth` > `spec.face`; the old `eyes`/`mouth` values still work.
- **`outfit`:** `shirt`, `plaid`, `polo` (badge), `labcoat` (white coat, light-blue shirt `shirt`, tie `tie`, dark trousers), `overalls` (denim `denim`, undershirt = `coat`), `hivis` (orange `vest` + reflective stripes over the `coat` shirt). `plaid: "<line colour>"` makes any shirt or undershirt checked. Also `pants`, `tie`, `badge`, `toolbelt`, `gloves`.
- **Head gear:** `hat: "hardhat" | "cap" | "visor"` (plus the classic hats), `hatColor`, `goggles: true` (clear light-blue safety goggles), `headphones: true` (technician ear defenders), `hair` + `hairline: "mop" | "side" | "brush" | "curly" | "tufts"`, `moustache`, `beard`, `glasses`, `freckles`.
- **Hand props:** `prop: "wrench" | "blueprint" | "gear" | "walkie" | "clipboard"` (plus the classic props). Use `armR: "show"` (forearm raised beside the body, like the reference) or `"hold"` for the clipboard; `propHand: "L"` for the left hand.
- **Arms:** `down`, `hips`, `wave`, `point`, `hold`, `up`, `cross`, `shrug`, `drink`, `warm`, `show`. Also `walk`, `sit`, `look`, `shiver`.
- **Ready-made cast:** `MEME_CAST` in `src/engine/CastSheet.tsx` (inspector, scientist, mechanic, foreman, safety, welder, tech, surveyor…). Copy one into `src/epN/cast.ts`, e.g.
  `export const guide: ToonSpec = { hat: "hardhat", goggles: true, outfit: "labcoat", coat: "#f4f4f2", tie: "#2f4e8a", face: "smirk" };`
- **Check the model sheet** after changing a character or `draw.ts`: `npx remotion still src/index.ts CastSheet out/stills/cast.png --props='{"sheet":"cast"}'` (also `"faces"` and `"poses"`), and compare it with `ref/personajes_meme.jpg` before checking the shot stills.

### 9. "Make the long version"
Same characters and sets, 16:9 (`Long` composition). A long video needs a longer story: write a 6–10 minute script with the same formula (several mini-stories or one deeper story), more shots, then render `Long`. Shorts bring people in, long videos earn more per view.
- **Generic Broad-Topic Expansion & Long-Video Dual Outro (Bilingual `Long_EN` + `Long_ES`):** While the Short focuses on one cheeky hook and specific process, the `Long` version must cover the underlying industrial, food, or mechanical engineering technology **broadly and generically** across 5 structured chapters (1. Hook + promise & Global Industrial Scale, 2. Core Physics & Chemistry from First Principles with everyday analogies, 3. Historical Failures & Evolution, 4. Step-by-Step Factory Mechanics + 4th Master Fact reveal, 5. Real-World Applications & Future) to maximize Watch Time and mid-roll ad revenue in both English and Spanish.
- **Long-Video Comment-Keyword CTA:** Use the same `<CommentCTA />` shot twice in a Long: once at the end of chapter 2 (≈ 30–40 % of the runtime, keyword → bonus resource by DM) and once before the closing CTA. Same keyword rules as the Short.
- **Long-Video Closing CTA:** End every `Long` episode with an explicit, warm sign-off asking viewers to **hit like**, **subscribe/follow** for more breakdowns, and watch the next recommended video on the channel (*ES:* *"Si este vídeo te ha ayudado a entender cómo funciona esta industria por dentro, dale a me gusta, suscríbete para no perderte los próximos episodios y mira este otro vídeo del canal. ¡Hasta luego!"* / *EN:* *"If this breakdown helped you see how this industry works from the inside, hit like, subscribe for more episodes like this, and check out this next video on the channel. See you in the next one!"*).

### 10. "Generate high-CTR thumbnails" (Execute `.claude/skills/thumbnails-hooks/SKILL.md`)
Right after the script, voice, and video (`Short` and/or `Long`) are rendered, **read and execute the dedicated sub-skill located at `.claude/skills/thumbnails-hooks/SKILL.md`** for the current episode (`epN` / `epN_en` / `epN_es`):
- Pass the **episode ID**, the **target format** (`short` 9:16, `long` 16:9, or `both`), and the **reference video URL/ID** recorded in `episodes/epN/story.md`.
- Follow every step inside `.claude/skills/thumbnails-hooks/SKILL.md` to audit the reference video's thumbnail & title (what to keep vs. improve), combine it with 10 current niche trends and your dual visual style (`cream` Editorial + `dark` CAD), generate `shot_short.png` / `shot_long.png`, and export the winning cover (`thumbnail_<mode>_<N>.png`) before moving to Step 11.

### 11. "Package it"
Write `episodes/epN/upload.md`: a curiosity title under 60 characters (no clickbait the video doesn't pay off), a two-line description with the sources, 5 tags, a **"Comment-keyword automation" block** (keyword per language, the exact auto-reply DM text with the link it sends, and the pinned comment, e.g. *"Comenta PEPINILLO 👇 y te llega el vídeo completo por privado"*), and the winning exported thumbnail (`thumbnail_short_<N>.png` and/or `thumbnail_long_<N>.png`) generated by `.claude/skills/thumbnails-hooks/SKILL.md` in Step 10.
- **Bilingual Channel Separation Rule:** When packaging `epN_en` and `epN_es` (4X deliverables: `Short_EN`, `Short_ES`, `Long_EN`, `Long_ES`), generate separate metadata blocks for **two dedicated language channels** (`EN` and `ES`). Never upload the exact same visual video in two different languages on the same channel on the same day (it tanks CTR/retention and triggers duplicate-content suppression); if using a single YouTube channel, upload only one video file and attach the second language via YouTube's native Multi-Language Audio track.

## Six things that make it look premium (check every shot)
1. **Signs, labels, viewer comments and the comment-keyword phone live in the world** (signs, posters, maps, stamps, and physical `<CommentCard />` boards in the 3D scene — using universal numbers/units like `25 cm` or `4 bar` on set props so 3D sets work in both languages), never flat on top. **Only exceptions:** the HUD in `src/engine/Hud.tsx` (`<Counter>`, `<ProgressCards>`, `<NativeComment>`) and the captions, which read as the channel's interface, not as part of the world. Ink outlines only where the channel has them: the world is always NOINK; `Look.ink` controls the character/prop silhouette pass (Ricks Clips: characters only, world `ink: 0`).
2. **Shadows are never black.** Tinted to the measured colour (Ricks Clips: blue-violet), from the hemisphere light's ground colour and the grade (`cool`).
3. **The camera never jumps.** Every shot glides from one pose to another (`cam.from` → `cam.to`), with a little sway.
4. **Big round heads, meme-fusion faces:** the head is ≈ 42% of the height, arms are thick black lines, legs are filled trousers, hands are black mittens (see "Character style: Meme-Fusion"). Classic episodes keep their small-head look.
5. **A soft background**, so you only look at the character (`focus` = distance to the subject, `aperture` 0.35–0.6).
6. **Check stills before you render** (step 7.2). It catches a camera stuck in a wall before you waste a render on it, and gates the ElevenLabs credit pass so no paid audio is generated until the visuals are verified.

## Engine baseline: premium 2.5D (apply to every episode)
These are engine defaults, not per-episode hacks. Do not flatten the 3D set, do not put ink on the world, and do not disable the character pass to hide a framing mistake.

1. **Ink separation.** `Stage.tsx` renders the 3D world on layer `0` with NOINK. Drawn characters use `LAYER_CHAR = 1`; only explicitly marked interactive props use `LAYER_INK = 3` (`Box`, `Cyl`, `Sign`, `<CommentCard />` already support `ink`). Sky, snow, glows and particles stay on `LAYER_FX = 2` and never receive ink. The ink pass derives a clean silhouette from a dedicated character/prop alpha render, so 3D geometry never gets black world edges. Defaults: `Look.ink = 1`, colour `vec3(0.07, 0.05, 0.07)`, radius `2.2 * SS / width`. For measured Ricks Clips world ink, use `ink: 0` on the world look and keep character ink at `1`.
2. **Characters read as drawn cels.** `Toon.tsx` uses a 4-step `meshToonMaterial` ramp (`72/148/222/255`), `castShadow receiveShadow`, `customDepthMaterial` with the same alpha cutoff (`0.5`), and `emissiveIntensity = 0.12` (horse `0.12`). Keep big round heads, thin limbs, small mitten hands, and the drawn ink details in `draw.ts`. Characters must stay camera-facing but still sit in the set and cast/receive real shadows.
3. **Lighting + film response.** Keep a warm key and cool hemisphere/ground (never black shadows). `Stage` boosts the directional key by `1.25`, the hemisphere by `1.12`, pushes the ground tint toward indigo `#33348c`, and cuts ambient to `0.65`; `autoClear = true` and `NoToneMapping` prevent double tone mapping. ACES + gamma, split-toning (`warm #ffb070`, `cool #5a4fd0`), contrast, saturation, vignette, fine grain and threshold bloom run once in the final shader. Defaults: `bloom = 0.22`, `threshold = 0.78`, `contrast = 1.16`, `grade = 1`, `grain = 0.012`, `saturation = 1.08`, `exposure = 1.1`, `vignette = 0.35`. Tint shadows, never crush them; keep measured skin neutral with only a light warm lift.
4. **Premium kit + native GLB.** `kit.tsx` uses beveled boxes, `meshPhysicalMaterial` with `clearcoat = 0.08`, painted/brushed/fabric/worn textures from `tex.ts`, physical `Sign` frames with bolts, and `ContactShadow` under heavy props. Generic in-world labels use universal numbers/units. If a story needs a native model, use `<GLBModel src="/path/model.glb" pos rot scale ink />`; it keeps `colormap.png` nearest-filtered, enables real shadows, and clamps roughness/metalness so imports do not look plastic. No downloaded textures, images or HDRIs in the default pipeline.
5. **Camera + autofocus.** Every shot glides with smootherstep (`t*t*t*(t*(t*6-15)+10)`) plus tiny sway; never cut the camera inside a shot. `Stage` autofocuses each frame from the camera to the interpolated `cam.lookFrom → cam.lookTo` point (or `focusTarget` when supplied), smoothing focus by `0.22`; explicit `focus` overrides it. Defaults: `aperture = 0.35–0.6` (never above `0.72` for close-ups). Depth of field must use the downsampled gaussian blur buffer (`tSmall`) with NO radial UV offsets, and the blur mix never exceeds `0.78`; repeated radial taps cause diagonal ghost copies and are forbidden. If a face looks blurred, fix focus/framing, not brightness.

## If something breaks
- Out of usage: wait for the reset, then type "continue".
- The skill isn't found: you opened Claude Code in the wrong folder.
- A shot looks wrong: say exactly what's wrong ("the tree covers his face in shot 7") and fix only that shot, check its still, render again.
- Red text in the terminal: read it, fix the cause, don't just retry.
- The video has frames where the picture repeats as a mosaic (tiles of the same frame): the render ran several WebGL tabs at once on a software GPU. Render again with `--concurrency=1` (the default in `remotion.config.ts`) and check the file: extract a few frames with ffmpeg before calling it done. (ep8, 2026-11-27: 555 of 1,808 frames tiled with `--concurrency=3` on `--gl=swangle`; 0 with `--concurrency=1`.)