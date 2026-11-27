# Animated Shorts (made with code)

This folder makes animated Shorts entirely on this computer: three.js worlds + drawn characters (Remotion), a free Kokoro voice, music made in code.
The workflow is the skill in `.claude/skills/animated-shorts/SKILL.md`. Read it before doing anything.
**Every new video starts with Step 0:** run `.claude/skills/performance-review/SKILL.md` (real Instagram/TikTok/YouTube stats via the Windsor.ai connector) and follow the rules in `insights/playbook.md`.

- Example episode: `episodes/ep1` + `src/ep1` (London's green taxi huts). Copy it for new episodes.
- Short (9:16): `npx remotion render src/index.ts Short episodes/ep1/out/episode_1.mp4 --codec=h264 --crf=18`
- Long version (16:9): composition `Long`.
- Always check stills before rendering: `node scripts/stills.mjs <shot ids>`.
- Every Short/Long ends with the comment-keyword CTA ("Comenta «PALABRA»" → auto DM): `src/engine/CommentCTA.tsx`, rules in the skill (Step 5).
- New video, new chat. Start from the latest `main`, and at the end of each step remind the user the work is only on the session branch and offer to merge it into `main` (see "One shared project" in the skill).
- Voice master (ElevenLabs, expressive): `node scripts/elevenlabs-voice.mjs <ep> <voiceId> <label> 1.0 --dry-run` first (free), then `--target=<s>`. Default model `eleven_v4` with audio tags from `emotion`/`sayTts`; re-take flat shots only with `--only=ids` (cache = 0 credits). Never a flat documentary read: see step 6 of the skill.
- Spanish narrator (from ep12 on): the owner's cloned voice **Nebu** (`rHTtFjgYAGnQOQw7Alsk`, ElevenLabs "mis voces", es-andalusian). English stays Brian (`nPczCjzI2devNBz1zQrb`). Never use David Martin for new ES episodes.
- Before writing any script: run the short-form demand check in step 4 of the skill (Shorts ≤ 70 s + adjacent angle + TikTok/IG reported by the user; flag topics under 100 K).
