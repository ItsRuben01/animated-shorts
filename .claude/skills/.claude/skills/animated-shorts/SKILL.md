---
name: animated-shorts
description: Make viral animated Shorts (2D cartoon characters in a 3D world) entirely in code with three.js + Remotion, a free Kokoro voice and code-made music. Clone the style of ANY animated channel by measuring it, write the story, voice it, build it, check stills, render a 9:16 Short and a 16:9 version, generate high-CTR thumbnails via thumbnails-hooks, and package it. ALWAYS run the performance-review skill (Step 0) first for any new video. Use when the user says "new video", "nuevo vídeo", "download their shorts", "measure the style", "turn this into a skill", "give me ideas", "write the script", "make the voice", "build the video", "make it yours", "make the long version", "make thumbnails", "package it", or "something looks off in shot N".
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

### 0. "Performance check" — MANDATORY before every new episode
Before ideas (Step 4) or script (Step 5) of any new video, **read and execute `.claude/skills/performance-review/SKILL.md`**: it pulls the real stats of the previous videos from Instagram, TikTok and YouTube (Windsor.ai connector), updates `insights/playbook.md` and writes a `## Performance brief` at the top of `episodes/epN/story.md`.
- The brief **overrides** the generic numbers in this skill when they conflict (duration, hook, CTA, topic choice). Example: if the playbook says "45–55 s, max 60 s", cut script steps until `timing.json` lands there; never speed up the voice to fit.
- Each episode tests **one** experiment from `Hipótesis en prueba`; write it in the brief.
- If the connector is unavailable, read the existing `insights/playbook.md`, apply it, and tell the user the stats could not be refreshed.

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
Ten true, strange, visual stories that fit the channel. For each one, **search YouTube** for the topic and write down the biggest Short and long video on it. If a Short already has millions of views on the same story, drop it (someone told it already). Pick one with a clear twist. **Rank the ideas against the active rules in `insights/playbook.md`** (Step 0): say for each idea which rule it satisfies and which topic family it belongs to.

**Score every idea before pitching it** (measured on two reference Shorts, 60 k vs 10.5 M views, same account and voice; see `styles/retention-rules.md`). An idea needs **3 of 3** to be pitched:
1. **In your hand right now (proximity).** Does the viewer own, touch or use the object *today*? (phone screen, charger, keys, coffee, fridge, toilet, sneakers → yes; AirTag, a factory machine they never see → weaker). Write `proximity: hand | home | street | far`. Only `hand` and `home` pass for a Short.
2. **Frame-0 action.** Can the first frame show the object *already doing something*, big and close (a giant finger hitting the glass, a cable plugging in with a spark, salt hitting water)? Write the frame-0 image in one sentence. A static establishing shot ("a pocket", "a factory") fails.
3. **Visible mechanism.** Can the key fact be *shown* as a physical change plus a number that moves on screen (finger steals the charge and a number drops `100 → 62`)? If the explanation needs a metaphor the viewer has to imagine ("a detective in your pocket"), it fails.

- **Short-form demand check (MANDATORY before choosing the topic — added 2026-11-27 after ep11):** a topic can have millions of views in long videos and none in Shorts (ep11: long videos 5.5 M / 3.7 M, best Short on the same story 678 views). Before writing the script:
  1. **YouTube Shorts:** `yt-dlp --flat-playlist --print "%(view_count)s|%(duration)s|%(id)s|%(title)s" "ytsearch25:<topic> shorts"` in EN and ES (2–3 phrasings each). Keep only rows with duration ≤ 70 s, sort by views, write the top 3 in `story.md`.
  2. **Adjacent angle:** also search the most visual version of the topic (e.g. "tire explodes" for airplane tires). If the adjacent angle has the views and the explainer doesn't, build the hook on that angle.
  3. **TikTok + Instagram:** they cannot be measured from here (no public search with views; Windsor only reads our own accounts). Ask the user to search the topic in both apps and report the top views, or say clearly in `story.md` that they were not checked. Never claim a topic is "trending" without these numbers.
  4. **Threshold:** if no Short/Reel/TikTok on the topic or its adjacent angle passes **100 K views**, flag it to the user as "demanda corta sin probar" and propose an alternative before writing; only continue if they confirm.
  5. Write the result in `story.md` under `## Validación del tema` (Shorts top 3, adjacent angle top 3, TikTok/IG status, verdict).

**Hook angle (choose one; humour is optional, not mandatory):**
- **Useful curiosity (default):** a surprising, true observation about the object the viewer is holding ("Your phone charges 0→80 % in half an hour… and then the last 20 % takes forever").
- **Mischievous double-entendre ("Humor Travieso Filtrado")**, only when it fits the object: a cheeky, platform-safe double meaning with 100 % clean literal words, then a deadpan pivot into the real process. Never let it be the only reason to watch: the frame-0 image and the promise must work without it. If a line could be limited by TikTok/Reels, write the softer alternative in `story.md`.

**YouTube Validation & 4X Feasibility:**
1. Check search demand, existing views, and Tier-1 (US/UK/CA) high-RPM potential vs. Spanish-market competition. Explicitly confirm whether the topic works for **4X Production** (a specific Short + a broader generic 6–10 min Long video) or **Shorts only**. Record the top reference video URL/ID and its title in `episodes/epN/story.md` so Step 10 can audit its thumbnail.
2. When pitching ideas, always provide: (a) the hook line, (b) the frame-0 image, (c) the visible mechanism + the number that moves, (d) the proximity score, (e) the one-world visual metaphor that will carry the whole Short (see step 5), (f) the broader 6–10 min Long video topic, and (g) the **comment keyword** + what the viewer gets by DM (see "Comment-Keyword CTA" in step 5).

### 5. "Write the script"
Write `episodes/epN/story.md` in the measured style, **respecting the Performance brief at the top of `story.md` (Step 0: target duration, hook pattern, CTA, the episode experiment)** and using the **8-piece retention structure** (always in this order). The reference Shorts that reach 10 M views follow it exactly:

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
- **Pace:** 3.0–3.6 words/s (Kokoro ≈ 3.4, expressive ElevenLabs v4 ≈ 3.0) (references: 3.25 and 3.45). Measure it in `timing.json` (`words / total`).
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

**Friend-tag (optional, inside piece 8 or body 3):** when the object has an obvious "that friend who is obsessed with…" angle, one short line (*"pásaselo a tu amigo que…"* / *"send this to your friend who…"*) before the comment CTA; never more than one sentence.

**Outro rule (piece 8) — Short vs. Long:**
- **Case A — Short WITH a companion Long video (`4X`):** close the loop, then send them to the Long with a reason (*ES:* *"Si quieres ver la fábrica entera por dentro, el vídeo largo está en mi canal."* / *EN:* *"The full factory tour is the long video on my channel."*).
- **Case B — Standalone Short:** close the loop and give one concrete action (*ES:* *"Guárdalo para la próxima vez que lo cargues, y sígueme para entender lo que tienes en la mano."* / *EN:* *"Save this for the next time you plug it in, and follow for more things you're holding right now."*).
- **Both cases:** piece 8 includes the mandatory **Comment-Keyword CTA** shot (below). Never end a Short without it.

#### Comment-Keyword CTA (mandatory on every Short and Long from now on)
Every video asks viewers to **comment one keyword** and promises an automatic reply by DM (references: `styles/cta/ref_comenta_palabra.png`, `styles/cta/ref_respuesta_dm.png`; engine check: `styles/cta/check_typed.png`, `styles/cta/check_reply.png` — a phone in the set: comments sheet, the keyword typed on the keyboard with the key lighting up orange, send, then a DM notification "*<channel> · mensaje* — ¡Aquí lo tienes: …!" with a video preview). Comments are the strongest ranking signal on Shorts/Reels/TikTok and the DM moves the viewer to the Long video.
- **Keyword:** ONE word, UPPERCASE, tied to the episode's object or process (`PEPINILLO`, `AUTOMÁTICO`, `SALMUERA`; EN `PICKLE`, `AUTOMATIC`). Max 12 letters so it fits the input field. Use a native word per language — never translate literally if the EN word is weak.
- **Promise (must be real):** what arrives by DM is the Long video (Case A) or a concrete extra (the full process "por dentro", the source table, the next part). Never promise something that doesn't exist; `upload.md` must say what the auto-reply sends.
- **Voice line (2.5–4 s, emotion `excited`), placed in piece 8, right after the loop-closing line and before "follow" / goodbye (it *is* the "one concrete action with a reason" of piece 8):**
  - *ES:* *"Comenta «PEPINILLO» y te mando por privado cómo funciona toda la fábrica por dentro."* / short form *"Comenta «PEPINILLO» y te lo enseño por dentro todo."*
  - *EN:* *"Comment «PICKLE» and I'll DM you the whole factory, step by step."*
  - The hook may tease it too (*"…y al final te digo qué comentar para verlo entero"*) — optional, only if it doesn't slow the first 3 s.
- **`shots.json`:** add a `cta` object to that shot: `{"id": 19, "text": "Comenta «PEPINILLO» y te lo enseño todo por dentro.", "emotion": "excited", "cta": {"keyword": "PEPINILLO", "reply": "¡Aquí lo tienes: el pepinillo por dentro!", "channel": "nebuu3d", "mode": "both"}}`. `mode`: `"both"` (type + send + DM reply in one shot, ≥ 2.8 s), or split over two shots: `"type"` on the "Comenta «X»" line and `"reply"` on the following line (as in the two references). `reply` ≤ 45 characters (2 lines). Optional `headline` overrides "Comenta"/"Comment".
- **Captions:** the caption for the keyword must show it with the guillemets (`«PEPINILLO»`) so the word is readable on screen even with sound off.

**Character Voice Casting & Emotion Direction:** Include a casting header in `story.md` defining characters, Kokoro draft IDs, ElevenLabs master IDs, and per-shot emotional tags. The narrator is an **expressive, complicit storyteller** (`em_alex` draft / **`Nebu`** master in ES — the channel owner's cloned voice, ElevenLabs id `rHTtFjgYAGnQOQw7Alsk`, used for every ES episode from ep12 on; `am_michael` / `Brian` in EN), NOT a flat documentary voice: a flat read bores the viewer and kills retention. The humor comes from a narrator who *enjoys* the double meaning (a cheeky smile in the voice, a pause before the punchline, a little laugh after it), while the technical facts are told with drama and wonder:
- Arc over the 8 pieces: `[mischievously]`/`[curious]` hook → `[playfully]`/`[thoughtful]` promise → `[dramatic]`/`[curious]` bodies (`[whispers]` for risks, `[chuckles]`/`[laughs]` on every wink) → `[amazed]` on each open loop (a little faster) → `[excited]` comment-keyword CTA → `[warmly]` goodbye.

Split it into `episodes/epN/shots.json` (and `episodes/epN_en/shots.json` + `episodes/epN_es/shots.json` for bilingual runs): one line of voice per shot (`{"id", "piece", "text", "say"?, "speaker"?, "emotion"?, "comment"?: {...}, "cta"?: {"keyword", "reply", "channel"?, "mode"?, "headline"?}}`; `piece` = 1–8 from the table above; `say` = how numbers are spoken, e.g. "eighteen_seventy-five" for "1875").

### 6. "Make the voice"

**A. Voice bible + emotional arc (before generating audio)**
- Add a casting header in `story.md`: character, age/attitude, pacing, allowed emotions, pronunciation notes, forbidden flat reads.
- Mark every shot in `shots.json`: `{"id","text","say?","sayTts?","emotion?","tag?","tempo?","model?","stability?","gap?"}`. `text` stays clean for captions; `say` is phonetic display-safe; `sayTts` is the TTS-only acting script (audio tags + expressive punctuation).
- **No flat reads.** Never 3 shots in a row with the same emotion (the script warns). At least 60 % of shots carry an audio tag. Every joke gets a reaction: a pause (`...`) before the punchline and a `[chuckles]`/`[laughs]` on it or right after.
- **Writing `sayTts` (this is where the feeling comes from):**
  - Keep the **same words** as `text`/`say`; only add tags and punctuation. Extra words desync the captions.
  - One tag at the start (`[excited]`), optionally one mid-line for a turn (`... [laughs] ¡Pues sí!`). Max 2 per shot.
  - Punctuation is acting: `...` = held pause / suspense, `¡!` = energy, `¿...?` = real question intonation, a comma before the key number puts weight on it.
  - Useful tags (English tags also work for Spanish text): `[mischievously] [playfully] [curious] [thoughtful] [dramatic] [whispers] [amazed] [gasps] [excited] [chuckles] [laughs] [sarcastic] [warmly] [proudly] [sighs]`.
  - Example: `"text": "Pero también sueltan gas, y el pepinillo puede quedarse hueco por dentro."` → `"sayTts": "[whispers] Pero también sueltan gas... y el pepinillo puede quedarse hueco por dentro."`

**B. Zero-cost Kokoro draft first**
- `node scripts/voice.mjs epN <voice> <speed>` (EN `am_michael 1.05`, ES `em_alex 1.05-1.06`). Writes `public/epN/voice.wav` + `episodes/epN/timing.json`.
- Kokoro has limited acting control: simulate intent with per-shot `speed` (0.98-1.08), short sentences, punctuation/`?`/`!`, and `say` phonetics. Treat as prosodic draft, not final acting.

**C. ElevenLabs master after visual validation**
1. Generate Kokoro for `epN_en`/`epN_es` before visual iteration (zero credits).
2. Only after step 7.2 `stills.mjs` passes 100%, run a **dry run** (free): it prints every line exactly as it will be sent, the direction warnings and the credit cost.
   `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <voiceLabel> 1.0 --dry-run`
3. Fix the warnings in `shots.json`, then render. Default model is **`eleven_v4`** (the most emotive: audio tags + previous/next context). The script checks the credits left before spending any.
   `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <voiceLabel> 1.0 --target=<seconds>`
   - `--target=58` sets the final length: the takes are sped up locally with ffmpeg `atempo` (pitch kept, free). Stay ≤ 1.2; if the script prints `atempo > 1.2`, **cut words from the script** instead of rushing the voice. Expressive reads are ~20 % slower than flat ones, so write ~15 % fewer words than for a Kokoro/v2 read (step 5 word counts already assume the final ≤ 60 s).
   - `--out=<dir>` auditions a take without touching `public/<ep>` / `episodes/<ep>`.
   - In the cloud, run Node with `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` (the key is injected by the proxy). Locally the key comes from `ELEVENLABS_API_KEY` or the key file.
   - `eleven_v3`: tags too, but no previous/next context (the script skips it) and stability snaps to 0 / 0.5 / 1. `eleven_multilingual_v2`: tags are stripped, emotion only through settings: flat, use only as a fallback.
4. Every take is cached in `tmp/elevenlabs-cache/<ep>/` (git-ignored). Re-running costs 0 credits unless a shot's text/tag/settings changed. Old takes stay in the cache under other hashes.
5. v3/v4 ignore `voice_settings.speed`, so the per-emotion rhythm is applied locally (`tempo` per shot, defaults below); `stability` is the acting knob: lower = more range.

| Emotion | tag | stability | tempo x |
|---|---|---:|---:|
| intrigued / mischievous | `[mischievously]` | 0.28-0.30 | 0.97-0.98 |
| curious / playful | `[curious]` / `[playfully]` | 0.28-0.32 | 1.00-1.02 |
| analytical | `[thoughtful]` | 0.45 | 0.99 |
| serious / dramatic | `[dramatic]` | 0.35-0.40 | 0.94-0.95 |
| suspense | `[whispers]` | 0.35 | 0.93 |
| amazed / shocked | `[amazed]` / `[gasps]` | 0.22-0.25 | 1.02-1.03 |
| enthusiastic / excited | `[excited]` | 0.22 | 1.05-1.06 |
| chuckles / laughs / sarcastic | `[chuckles]` / `[laughs]` / `[sarcastic]` | 0.25-0.32 | 0.98-1.00 |
| warm / proud | `[warmly]` / `[proudly]` | 0.35-0.38 | 0.99-1.00 |

6. After the ElevenLabs pass: `public/<ep>/voice.wav` and `episodes/<ep>/timing.json` are overwritten. Re-check shot durations/captions, then render. Never touch previous episode audio.

**D. Voice QA gate**
- The script prints per shot `w/s` and `dyn` (loudness movement in dB) and lists shots with `dyn < 9 dB` as **possibly flat**, with the exact `--only=` command to re-take them. Reference: the old flat v2 master of ep7_es averaged 15.6 dB, the v4 expressive one 17.6–18.4 dB.
- Listen to the hook, the punchlines, the reveal and the outro: there must be an audible smile, laugh or pause on every joke, and energy changes between steps.
- Check no clipping, no mispronounced numbers/names, captions aligned to new timing.
- **Length gate:** `timing.json` `total` ≤ 60 s and 3.0–3.6 words/s (step 5 limits; expressive v4 reads sit at the low end). ElevenLabs is usually slower than Kokoro (ep7_es went from 65 s to 78 s): if the master is over 60 s, in this order: (1) trim gaps (`gap` 0.08 s, 0.3–0.4 s only after the hook); (2) cut words in the longest lines; (3) only then speed it up: `--target=<s>` in `elevenlabs-voice.mjs` (per-take `atempo`) or `node scripts/tempo.mjs <ep> <factor>` on the finished narration (pitch-safe, rewrites `timing.json`; max `1.10`). Keep the Kokoro draft as `public/<ep>/voice_kokoro.wav` + `timing_kokoro.json`. (battery demo `retdemo`: Kokoro 59.9 s → ElevenLabs 68.4 s → speed 1.15 66.8 s → gaps + 9 words cut 62.6 s → `tempo.mjs 1.05` 59.7 s.)
- If a shot is flat: change its `emotion`/`tag`/`sayTts` (or lower `stability`) and re-take only it: `--only=7,12` (the other shots come from the cache, 0 credits).

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

### 11. "Package it" (then offer to merge into `main`, see "One shared project")
In `upload.md`, write the exact title/first caption line used on every platform (the Step 0 review matches published videos to episodes by it) and the Performance-brief experiment being tested.
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

## One shared project: keep everything in `main`
Every chat (cloud or local) starts from a copy of the GitHub repo's `main` branch, and cloud chats save their work on their own `claude/…` branch. Work that never reaches `main` is invisible to every later chat (that is how ep8–ep14, the expressive voice and the retention flow ended up split across 7 branches until 2026-11-27). So:
- **Start of every chat:** `git fetch origin`, make sure the work starts from the latest `origin/main`, and check `git branch -r --no-merged origin/main`. If any branch has work that is not in `main`, tell the user which episodes/changes it holds and offer to merge it before starting.
- **End of every step that changes files** (a new episode, a skill/engine change, thumbnails, upload.md, playbook updates): commit and push the session branch, then **remind the user that the work is not in `main` yet and ask whether to merge it now**. When they confirm, merge it into `main` (fetch `main` first; resolve conflicts keeping both sides' intent, never dropping another chat's episode or rule; check `npx tsc --noEmit` and one still) and push `main`.
- **Episode folders never collide:** before creating `epN`, check `main` for the highest existing `epN_*` and take the next number. A test/demo episode gets a name, not a number (e.g. `retdemo`).
- **Never commit generated junk:** render frames, Chrome profiles and caches (`tmp/`, `out/`) are in `.gitignore`.

## If something breaks
- Out of usage: wait for the reset, then type "continue".
- The skill isn't found: you opened Claude Code in the wrong folder.
- A shot looks wrong: say exactly what's wrong ("the tree covers his face in shot 7") and fix only that shot, check its still, render again.
- Red text in the terminal: read it, fix the cause, don't just retry.