// ElevenLabs master voice for an episode — expressive by default.
//
//   node scripts/elevenlabs-voice.mjs <ep> <voiceId> [voiceLabel] [speed] [modelId] [flags]
//
// Flags:
//   --dry-run        print exactly what will be sent (tags included) + credit cost, call nothing paid
//   --only=3,7,12    re-take only these shots; every other shot is reused from the cache (no credits)
//   --out=<dir>      write voice.wav + timing.json to <dir> instead of public/<ep> + episodes/<ep>
//                    (use it to audition a new take without touching the episode)
//   --no-tags        do not prepend audio tags (plain read)
//   --force          skip the credit check
//   --tempo=1.1      speed every clip up/down locally with ffmpeg atempo (pitch kept, free, uses the cache)
//   --target=70      pick the tempo automatically so the whole voice lasts ~70 s (clamped 0.9–1.25)
//
// Default model: eleven_v4 (most emotive, audio tags + previous/next context).
// eleven_v3: audio tags, no previous/next context, stability snapped to 0 / 0.5 / 1.
// eleven_multilingual_v2: no tags, emotion only through settings + punctuation (the old, flat path).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const flags = Object.fromEntries(
  argv.filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.slice(2).split("=");
    return [k, v ?? true];
  })
);
const [ep, voiceId, voiceLabelArg, speedArg, modelPos] = argv.filter((a) => !a.startsWith("--"));
const voiceLabel = voiceLabelArg || voiceId;
const speed = Number(speedArg || 1);
const modelArg = modelPos || process.env.ELEVENLABS_MODEL || "eleven_v4";
const DRY = !!flags["dry-run"];
const ONLY = flags.only ? new Set(String(flags.only).split(",").map((s) => s.trim())) : null;
const USE_TAGS = !flags["no-tags"];

// Key: env var, then key file, then a dummy (an authenticating proxy may inject the real one).
const keyPath = process.env.ELEVENLABS_KEY_FILE || "C:/Users/rubca/OneDrive/Documentos/Canal_Ingenieria/ElevenLabs/API_key.txt";
const key =
  process.env.ELEVENLABS_API_KEY ||
  (fs.existsSync(keyPath) ? fs.readFileSync(keyPath, "utf8").replace(/^\uFEFF/, "").trim() : "proxy-injected");

const SR = 24000;
const CONCURRENCY = 3; // starter plan allows 3 concurrent requests
const API = "https://api.elevenlabs.io/v1";

if (!ep || !voiceId || Number.isNaN(speed)) {
  throw new Error("Usage: node scripts/elevenlabs-voice.mjs <ep> <voiceId> [voiceLabel] [speed] [modelId] [--dry-run] [--only=ids] [--out=dir] [--no-tags] [--force]");
}

// Emotion direction. `tag` = audio tag for v3/v4 (English tags work for Spanish text too).
// Lower stability = more acting range; `speed` multiplies the base speed so the rhythm changes
// from shot to shot instead of a single machine-gun tempo.
const EMOTION_PRESETS = {
  intrigued:    { tag: "[mischievously]",          stability: 0.3,  similarity_boost: 0.75, style: 0.6,  speed: 0.97 },
  mischievous:  { tag: "[mischievously]",          stability: 0.28, similarity_boost: 0.75, style: 0.65, speed: 0.98 },
  curious:      { tag: "[curious]",                stability: 0.32, similarity_boost: 0.76, style: 0.55, speed: 1.0 },
  analytical:   { tag: "[thoughtful]",             stability: 0.45, similarity_boost: 0.8,  style: 0.35, speed: 0.99 },
  serious:      { tag: "[dramatic]",               stability: 0.4,  similarity_boost: 0.8,  style: 0.45, speed: 0.95 },
  dramatic:     { tag: "[dramatic]",               stability: 0.35, similarity_boost: 0.78, style: 0.55, speed: 0.94 },
  suspense:     { tag: "[whispers]",               stability: 0.35, similarity_boost: 0.78, style: 0.5,  speed: 0.93 },
  amazed:       { tag: "[amazed]",                 stability: 0.25, similarity_boost: 0.74, style: 0.7,  speed: 1.03 },
  shocked:      { tag: "[gasps]",                  stability: 0.22, similarity_boost: 0.74, style: 0.7,  speed: 1.02 },
  enthusiastic: { tag: "[excited]",                stability: 0.22, similarity_boost: 0.74, style: 0.7,  speed: 1.05 },
  excited:      { tag: "[excited]",                stability: 0.22, similarity_boost: 0.74, style: 0.7,  speed: 1.06 },
  chuckles:     { tag: "[chuckles]",               stability: 0.28, similarity_boost: 0.76, style: 0.62, speed: 1.0 },
  laughs:       { tag: "[laughs]",                 stability: 0.25, similarity_boost: 0.75, style: 0.65, speed: 1.0 },
  playful:      { tag: "[playfully]",              stability: 0.28, similarity_boost: 0.75, style: 0.62, speed: 1.02 },
  sarcastic:    { tag: "[sarcastic]",              stability: 0.32, similarity_boost: 0.76, style: 0.6,  speed: 0.98 },
  warm:         { tag: "[warmly]",                 stability: 0.38, similarity_boost: 0.8,  style: 0.45, speed: 0.99 },
  proud:        { tag: "[proudly]",                stability: 0.35, similarity_boost: 0.8,  style: 0.5,  speed: 1.0 },
  neutral:      { tag: "",                         stability: 0.45, similarity_boost: 0.8,  style: 0.2,  speed: 1.0 },
};
EMOTION_PRESETS.intriguing = EMOTION_PRESETS.intrigued; // alias used in older shots.json

const shots = JSON.parse(fs.readFileSync(path.join("episodes", ep, "shots.json"), "utf8"));
const cacheDir = path.join("tmp", "elevenlabs-cache", ep);
fs.mkdirSync(cacheDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const clean = (t) => String(t ?? "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
const stripTags = (t) => clean(String(t ?? "").replace(/\[[^\]]*\]/g, " "));
const isV2 = (m) => !/v3|v4/.test(String(m));
const isV3 = (m) => /v3/.test(String(m));
const presetFor = (shot) => EMOTION_PRESETS[clean(shot.emotion).toLowerCase()] || EMOTION_PRESETS.neutral;

function buildSayText(shot, modelId) {
  if (shot.sayTts) return isV2(modelId) ? stripTags(shot.sayTts) : clean(shot.sayTts);
  const base = clean(shot.say ?? shot.text);
  if (isV2(modelId) || !USE_TAGS) return base;
  // `tag` on the shot overrides the preset ("" disables it for that shot).
  const tag = shot.tag != null ? clean(shot.tag) : presetFor(shot).tag;
  return tag ? `${tag} ${base}` : base;
}

function shotSettings(shot, modelId) {
  const p = presetFor(shot);
  let stability = clamp(Number(shot.stability ?? p.stability), 0, 1);
  if (isV3(modelId)) stability = stability < 0.25 ? 0 : stability < 0.75 ? 0.5 : 1; // v3: Creative / Natural / Robust
  const out = {
    stability,
    similarity_boost: clamp(Number(shot.similarity_boost ?? p.similarity_boost), 0, 1),
    speed: clamp(Number(shot.speed ?? speed * p.speed), 0.7, 1.2),
  };
  if (isV2(modelId)) {
    out.style = clamp(Number(shot.style ?? p.style), 0, 1);
    out.use_speaker_boost = shot.use_speaker_boost ?? true;
  }
  return out;
}

function requestBody(shot, index) {
  const modelId = String(shot.model || modelArg);
  const body = { text: buildSayText(shot, modelId), model_id: modelId, voice_settings: shotSettings(shot, modelId) };
  if (!isV3(modelId)) {
    // Context makes each clip sound like part of one continuous performance.
    const prev = stripTags(shots[index - 1]?.say ?? shots[index - 1]?.text);
    const next = stripTags(shots[index + 1]?.say ?? shots[index + 1]?.text);
    if (prev) body.previous_text = prev;
    if (next) body.next_text = next;
  }
  if (shot.seed != null) body.seed = shot.seed;
  return body;
}

const cacheFile = (shot, body) => {
  const h = crypto.createHash("sha1").update(JSON.stringify({ voiceId, body })).digest("hex").slice(0, 12);
  return path.join(cacheDir, `${String(shot.id).padStart(4, "0")}-${h}.json`);
};
const wantsFresh = (shot) => ONLY?.has(String(shot.id));

async function callApi(body, label) {
  const url = `${API}/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180000),
    });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    throw new Error(`ElevenLabs HTTP ${res.status} shot ${label}: ${await res.text()}`);
  }
  throw new Error(`ElevenLabs request failed for shot ${label}`);
}

// ---------- plan: what is cached, what costs credits ----------
const plan = shots.map((shot, i) => {
  const body = requestBody(shot, i);
  const file = cacheFile(shot, body);
  const cached = !wantsFresh(shot) && fs.existsSync(file);
  return { shot, body, file, cached };
});
const cost = plan.filter((p) => !p.cached).reduce((a, p) => a + p.body.text.length, 0);

// Direction lint: catch a flat read before paying for it.
const warnings = [];
for (let i = 2; i < shots.length; i++) {
  const e = (j) => clean(shots[j].emotion || "neutral").toLowerCase();
  if (e(i) === e(i - 1) && e(i) === e(i - 2)) warnings.push(`shots ${shots[i - 2].id}-${shots[i].id}: 3 in a row "${e(i)}" — vary the emotion or add a tag/sayTts`);
}
const untagged = plan.filter((p) => !/\[[^\]]+\]/.test(p.body.text)).length;
if (!isV2(modelArg) && USE_TAGS && untagged > shots.length * 0.4) warnings.push(`${untagged}/${shots.length} shots have no audio tag`);
if (speed > 1.1) warnings.push(`base speed ${speed} is high: fast reads lose intonation; prefer 1.0–1.08 and tighten gaps instead`);

console.log(`model ${modelArg} · voice ${voiceLabel} · base speed ${speed}`);
for (const p of plan) {
  const s = p.body.voice_settings;
  console.log(`${p.cached ? "cache" : "NEW  "} #${p.shot.id} stab ${s.stability} spd ${s.speed.toFixed(2)} | ${p.body.text}`);
}
for (const w of warnings) console.log("WARN", w);
console.log(`credits needed: ${cost} characters (${plan.filter((p) => !p.cached).length} new takes, ${plan.filter((p) => p.cached).length} cached)`);

if (DRY) process.exit(0);

if (cost > 0 && !flags.force) {
  const res = await fetch(`${API}/user/subscription`, { headers: { "xi-api-key": key } });
  if (res.ok) {
    const sub = await res.json();
    const left = sub.character_limit - sub.character_count;
    console.log(`credits left: ${left}`);
    if (left < cost) throw new Error(`Not enough ElevenLabs credits (${left} < ${cost}). Keep the Kokoro track or use --only.`);
  } else console.log(`(could not read subscription: HTTP ${res.status})`);
}

// ---------- audio helpers ----------
function readWav(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") throw new Error(`Not WAV: ${file}`);
  let pos = 12, fmt = null, data = null;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    const start = pos + 8;
    if (id === "fmt " && size >= 16) {
      fmt = { audioFormat: buf.readUInt16LE(start), numChannels: buf.readUInt16LE(start + 2), sampleRate: buf.readUInt32LE(start + 4), bitsPerSample: buf.readUInt16LE(start + 14) };
    }
    if (id === "data") data = buf.subarray(start, start + size);
    pos = start + size + (size % 2);
  }
  if (!fmt || !data || fmt.audioFormat !== 1 || fmt.numChannels !== 1 || fmt.sampleRate !== SR || fmt.bitsPerSample !== 16) throw new Error(`Unexpected WAV format: ${file}`);
  const samples = new Int16Array(data.length / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = data.readInt16LE(i * 2);
  return samples;
}

function writeWav(file, samples) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  const gain = peak ? Math.min(1, 29160 / peak) : 1;
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * gain))), 44 + i * 2);
  fs.writeFileSync(file, buf);
}

// Groups alignment characters into spoken words, skipping [audio tags] (they make sound but are not words).
function wordSpans(alignment, displayText, sayText, dur) {
  const chars = Array.isArray(alignment?.characters) ? alignment.characters : String(alignment?.characters ?? "").split("");
  const starts = alignment?.character_start_times_seconds || [];
  const ends = alignment?.character_end_times_seconds || [];
  const grouped = [];
  let cur = null, inTag = false;
  for (let i = 0; i < chars.length; i++) {
    const c = String(chars[i] ?? "");
    if (c === "[") { inTag = true; if (cur) grouped.push(cur); cur = null; continue; }
    if (inTag) { if (c === "]") inTag = false; continue; }
    if (!c.trim()) { if (cur) grouped.push(cur); cur = null; continue; }
    const s = Number(starts[i] ?? cur?.start ?? 0);
    const e = Number(ends[i] ?? s);
    if (!cur) cur = { start: s, end: e };
    else cur.end = e;
  }
  if (cur) grouped.push(cur);

  const words = String(displayText).trim().split(/\s+/).filter(Boolean);
  let spans = grouped;
  if (spans.length !== words.length && grouped.length) {
    // Numbers spoken as words ("6 %" → "seis por ciento"): spread caption words over the real speech window.
    const t0 = grouped[0].start, t1 = grouped[grouped.length - 1].end;
    const weights = words.map((w) => Math.max(1, w.length));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    spans = weights.map((w) => {
      const start = t0 + (acc / total) * (t1 - t0);
      acc += w;
      return { start, end: t0 + (acc / total) * (t1 - t0) };
    });
  }
  return words.map((w, i) => {
    const raw = spans[i] || { start: (i / words.length) * dur, end: ((i + 1) / words.length) * dur };
    const start = Math.max(0, Math.min(dur, Number(raw.start) || 0));
    const end = Math.max(start + 0.03, Math.min(dur, Number(raw.end) || start + 0.03));
    return { w, start, end };
  });
}

function rms(samples) {
  let s = 0;
  for (let i = 0; i < samples.length; i++) s += samples[i] * samples[i];
  return Math.sqrt(s / Math.max(1, samples.length));
}
// Loudness movement inside a shot (dB between loud and soft 50 ms windows). Low = monotone.
function dynamics(samples) {
  const win = Math.round(0.05 * SR), lv = [];
  for (let i = 0; i + win <= samples.length; i += win) {
    const r = rms(samples.subarray(i, i + win));
    if (r > 300) lv.push(20 * Math.log10(r));
  }
  if (lv.length < 4) return 0;
  lv.sort((a, b) => a - b);
  return lv[Math.floor(lv.length * 0.9)] - lv[Math.floor(lv.length * 0.1)];
}

async function renderShot(p, index, tempo = 1) {
  const { shot, body, file } = p;
  let json;
  if (p.cached) json = JSON.parse(fs.readFileSync(file, "utf8"));
  else {
    json = await callApi(body, shot.id);
    // Older takes of this shot stay in the cache under other hashes, so you can always go back.
    fs.writeFileSync(file, JSON.stringify(json));
  }
  const tmp = path.join(cacheDir, `_work_${shot.id}`);
  fs.writeFileSync(`${tmp}.mp3`, Buffer.from(json.audio_base64, "base64"));
  const conv = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", `${tmp}.mp3`, ...(tempo !== 1 ? ["-af", `atempo=${tempo}`] : []), "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", `${tmp}.wav`], { encoding: "utf8" });
  if (conv.status !== 0) throw new Error(`ffmpeg failed for shot ${shot.id}: ${conv.stderr}`);
  const raw = readWav(`${tmp}.wav`);
  fs.rmSync(`${tmp}.mp3`, { force: true });
  fs.rmSync(`${tmp}.wav`, { force: true });
  // Trim the padding ElevenLabs puts around each clip (20 clips = seconds of dead air).
  let peak = 0;
  for (let i = 0; i < raw.length; i++) peak = Math.max(peak, Math.abs(raw[i]));
  const th = peak * 0.03, pad = Math.round(0.04 * SR);
  let a = 0, b = raw.length - 1;
  while (a < b && Math.abs(raw[a]) < th) a++;
  while (b > a && Math.abs(raw[b]) < th) b--;
  a = Math.max(0, a - pad);
  b = Math.min(raw.length, b + pad * 2);
  const samples = raw.slice(a, b);
  const dur = samples.length / SR;
  const cut = a / SR;
  const localWords = wordSpans(json.alignment, shot.text, body.text, raw.length / SR * tempo).map((o) => {
    const start = Math.max(0, Math.min(dur, o.start / tempo - cut));
    return { ...o, start, end: Math.max(start + 0.03, Math.min(dur, o.end / tempo - cut)) };
  });
  const dyn = dynamics(samples);
  if (!quiet) console.log(`${index + 1}/${shots.length} #${shot.id} ${dur.toFixed(2)}s ${(localWords.length / dur).toFixed(2)} w/s dyn ${dyn.toFixed(1)} dB ${shot.emotion || "neutral"}${p.cached ? " (cache)" : ""}`);
  return { samples, dur, localWords, modelId: body.model_id, dyn };
}

let quiet = false;
let rendered = new Array(shots.length);
let nextIdx = 0;
let tempo = flags.tempo ? clamp(Number(flags.tempo), 0.5, 2) : 1;
async function worker() {
  while (nextIdx < shots.length) {
    const i = nextIdx++;
    // v3/v4 barely obey voice_settings.speed, so the per-emotion rhythm is applied locally instead.
    const sh = plan[i].shot;
    const local = isV2(plan[i].body.model_id) ? 1 : Number(sh.tempo ?? presetFor(sh).speed);
    rendered[i] = await renderShot(plan[i], i, +(tempo * local).toFixed(3));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
if (flags.target) {
  // Second pass is local only (every take is now cached): squeeze/stretch to the target length.
  const gaps = shots.reduce((a, s) => a + Number(s.gap ?? 0.06), 0);
  const speech = rendered.reduce((a, r) => a + r.dur, 0);
  tempo = +clamp(speech / Math.max(1, Number(flags.target) - gaps), 0.9, 1.25).toFixed(3);
  console.log(`--target ${flags.target}s: speech ${speech.toFixed(1)}s + gaps ${gaps.toFixed(1)}s → atempo ${tempo}`);
  if (tempo > 1.2) console.log("WARN atempo > 1.2 starts to sound rushed: cut words from the script instead");
  for (const p of plan) p.cached = true;
  quiet = true;
  nextIdx = 0;
  rendered = new Array(shots.length);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

const parts = [];
const timing = [];
let t = 0;
for (let i = 0; i < shots.length; i++) {
  const s = shots[i];
  const r = rendered[i];
  const words = r.localWords.map((o) => ({ w: o.w, start: +(o.start + t).toFixed(3), end: +(o.end + t).toFixed(3) }));
  timing.push({ id: s.id, voice: voiceLabel, model: r.modelId, emotion: s.emotion || null, start: +t.toFixed(3), end: +(t + r.dur).toFixed(3), words });
  parts.push(r.samples);
  const gap = Number(s.gap ?? 0.06);
  parts.push(new Int16Array(Math.round(gap * SR)));
  t += r.dur + gap;
}

const all = new Int16Array(parts.reduce((a, p) => a + p.length, 0));
let offset = 0;
for (const p of parts) { all.set(p, offset); offset += p.length; }

const outAudioDir = flags.out ? String(flags.out) : path.join("public", ep);
const outTimingDir = flags.out ? String(flags.out) : path.join("episodes", ep);
fs.mkdirSync(outAudioDir, { recursive: true });
fs.mkdirSync(outTimingDir, { recursive: true });
writeWav(path.join(outAudioDir, "voice.wav"), all);
fs.writeFileSync(path.join(outTimingDir, "timing.json"), JSON.stringify({ voice: voiceLabel, model: modelArg, speed, tempo, total: +t.toFixed(3), shots: timing }, null, 1));

// QA report: flag the shots most likely to sound flat, so you re-take only those with --only.
const flat = rendered.map((r, i) => ({ id: shots[i].id, dyn: r.dyn })).filter((x) => x.dyn > 0 && x.dyn < 9);
const wps = timing.reduce((a, s) => a + s.words.length, 0) / t;
console.log(`total ${t.toFixed(1)} s, ${wps.toFixed(2)} words/s, voice ${voiceLabel} → ${outAudioDir}/voice.wav`);
if (flat.length) console.log(`possibly flat (dyn < 9 dB): ${flat.map((x) => `#${x.id}`).join(" ")} → re-take with --only=${flat.map((x) => x.id).join(",")}`);
if (wps > 3.4) console.log(`fast read (${wps.toFixed(2)} w/s): cut words from the script rather than speeding the voice up`);
