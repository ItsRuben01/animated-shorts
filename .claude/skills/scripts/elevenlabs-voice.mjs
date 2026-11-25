import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ep = process.argv[2];
const voiceId = process.argv[3];
const voiceLabel = process.argv[4] || voiceId;
const speed = Number(process.argv[5] || 1);
const modelArg = process.argv[6] || process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const keyPath = process.env.ELEVENLABS_KEY_FILE || "C:/Users/rubca/OneDrive/Documentos/Canal_Ingenieria/ElevenLabs/API_key.txt";
const key = fs.readFileSync(keyPath, "utf8").replace(/^\uFEFF/, "").trim();
const SR = 24000;
const CONCURRENCY = 4;

const EMOTION_PRESETS = {
  intrigued: { stability: 0.3, similarity_boost: 0.78, style: 0.55, speed: 1.0 },
  curious: { stability: 0.35, similarity_boost: 0.78, style: 0.5, speed: 1.02 },
  analytical: { stability: 0.55, similarity_boost: 0.82, style: 0.25, speed: 0.98 },
  serious: { stability: 0.5, similarity_boost: 0.85, style: 0.3, speed: 0.96 },
  amazed: { stability: 0.25, similarity_boost: 0.75, style: 0.65, speed: 1.04 },
  enthusiastic: { stability: 0.28, similarity_boost: 0.76, style: 0.6, speed: 1.03 },
  warm: { stability: 0.45, similarity_boost: 0.8, style: 0.35, speed: 0.98 },
  proud: { stability: 0.42, similarity_boost: 0.82, style: 0.4, speed: 0.99 },
  neutral: { stability: 0.42, similarity_boost: 0.82, style: 0, speed: 1.0 },
  // 2026-11-25 ep7: aliases used in shots.json (previously fell back to neutral)
  intriguing: { stability: 0.3, similarity_boost: 0.78, style: 0.55, speed: 1.0 },
  chuckles: { stability: 0.32, similarity_boost: 0.78, style: 0.58, speed: 1.01 },
};

if (!ep || !voiceId || !key || Number.isNaN(speed)) {
  throw new Error(
    "Usage: node scripts/elevenlabs-voice.mjs <ep> <voiceId> [voiceLabel] [speed] [modelId]"
  );
}

const shots = JSON.parse(fs.readFileSync(path.join("episodes", ep, "shots.json"), "utf8"));
const tmpDir = path.join("tmp", "elevenlabs", ep);
fs.mkdirSync(tmpDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const clean = (t) => String(t ?? "").replace(/_/g, " ").replace(/\s+/g, " ").trim();

function buildSayText(shot, modelId) {
  if (shot.sayTts) return clean(shot.sayTts);
  const base = clean(shot.say ?? shot.text);
  const emotion = clean(shot.emotion);
  if (!emotion) return base;
  if (String(modelId).includes("v3") || shot.useAudioTags) return `[${emotion}] ${base}`;
  return base; // multilingual_v2: no bracket tags; use punctuation/prosody in say/text
}

function shotSettings(shot, modelId) {
  const preset = EMOTION_PRESETS[clean(shot.emotion).toLowerCase()] || EMOTION_PRESETS.neutral;
  const out = {
    stability: clamp(Number(shot.stability ?? preset.stability), 0, 1),
    similarity_boost: clamp(Number(shot.similarity_boost ?? preset.similarity_boost), 0, 1),
    style: clamp(Number(shot.style ?? preset.style), 0, 1),
    use_speaker_boost: shot.use_speaker_boost ?? true,
    speed: clamp(Number(shot.speed ?? speed * preset.speed), 0.7, 1.2),
  };
  // v3 currently ignores/handles style differently in some APIs; keep configurable but harmless.
  if (String(modelId).includes("v3") && shot.style == null) out.style = preset.style;
  return out;
}

async function requestJson(shot, index) {
  const modelId = String(shot.model || modelArg);
  const text = buildSayText(shot, modelId);
  const prev = clean(shots[index - 1]?.say ?? shots[index - 1]?.text);
  const next = clean(shots[index + 1]?.say ?? shots[index + 1]?.text);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: modelId,
    voice_settings: shotSettings(shot, modelId),
  };
  if (prev) body.previous_text = prev;
  if (next) body.next_text = next;
  if (shot.seed != null) body.seed = shot.seed;

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180000),
    });
    if (res.ok) return { json: await res.json(), text, modelId };
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    const detail = await res.text();
    throw new Error(`ElevenLabs HTTP ${res.status} shot ${shot.id}: ${detail}`);
  }
  throw new Error(`ElevenLabs request failed for shot ${shot.id}`);
}

function readWav(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") throw new Error(`Not WAV: ${file}`);
  let pos = 12;
  let fmt = null;
  let data = null;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    const start = pos + 8;
    if (id === "fmt " && size >= 16) {
      fmt = {
        audioFormat: buf.readUInt16LE(start),
        numChannels: buf.readUInt16LE(start + 2),
        sampleRate: buf.readUInt32LE(start + 4),
        bitsPerSample: buf.readUInt16LE(start + 14),
      };
    }
    if (id === "data") data = buf.subarray(start, start + size);
    pos = start + size + (size % 2);
  }
  if (!fmt || !data || fmt.audioFormat !== 1 || fmt.numChannels !== 1 || fmt.sampleRate !== SR || fmt.bitsPerSample !== 16) {
    throw new Error(`Unexpected WAV format: ${file}`);
  }
  const samples = new Int16Array(data.length / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = data.readInt16LE(i * 2);
  return samples;
}

function writeWav(file, samples) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  const gain = peak ? Math.min(1, 29160 / peak) : 1;
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-32768, Math.min(32767, Math.round(samples[i] * gain)));
    buf.writeInt16LE(v, 44 + i * 2);
  }
  fs.writeFileSync(file, buf);
}

function wordSpans(alignment, displayText, sayText, dur) {
  const chars = Array.isArray(alignment?.characters) ? alignment.characters : String(alignment?.characters ?? "").split("");
  const starts = alignment?.character_start_times_seconds || [];
  const ends = alignment?.character_end_times_seconds || [];
  const grouped = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const c = String(chars[i] ?? "");
    if (!c.trim()) {
      if (cur) grouped.push(cur);
      cur = null;
      continue;
    }
    const s = Number(starts[i] ?? cur?.start ?? 0);
    const e = Number(ends[i] ?? s);
    if (!cur) cur = { start: s, end: e };
    else cur.end = e;
  }
  if (cur) grouped.push(cur);

  const words = String(displayText).trim().split(/\s+/).filter(Boolean);
  let spans = grouped;
  if (spans.length !== words.length) {
    const sayWords = String(sayText).trim().split(/\s+/).filter(Boolean);
    const weights = (sayWords.length === words.length ? sayWords : words).map((w) => Math.max(1, w.length));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    spans = weights.map((w) => {
      const start = (acc / total) * dur;
      acc += w;
      return { start, end: (acc / total) * dur };
    });
  }
  return words.map((w, i) => {
    const raw = spans[i] || { start: (i / words.length) * dur, end: ((i + 1) / words.length) * dur };
    const start = Math.max(0, Math.min(dur, Number(raw.start) || 0));
    const end = Math.max(start + 0.03, Math.min(dur, Number(raw.end) || start + 0.03));
    return { w, start, end };
  });
}

async function renderShot(shot, index) {
  const { json, text, modelId } = await requestJson(shot, index);
  const mp3 = path.join(tmpDir, `${String(shot.id).padStart(4, "0")}.mp3`);
  const wav = path.join(tmpDir, `${String(shot.id).padStart(4, "0")}.wav`);
  fs.writeFileSync(mp3, Buffer.from(json.audio_base64, "base64"));
  const conv = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", "-i", mp3, "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", wav],
    { encoding: "utf8" }
  );
  if (conv.status !== 0) throw new Error(`ffmpeg failed for shot ${shot.id}: ${conv.stderr}`);
  const raw = readWav(wav);
  // 2026-11-25 ep7: trim leading/trailing silence (ElevenLabs pads each clip; 20 clips = seconds of dead air)
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
  const localWords = wordSpans(json.alignment, shot.text, text, raw.length / SR).map((o) => {
    const start = Math.max(0, Math.min(dur, o.start - cut));
    return { ...o, start, end: Math.max(start + 0.03, Math.min(dur, o.end - cut)) };
  });
  console.log(`${index + 1}/${shots.length} shot ${shot.id} ${dur.toFixed(2)}s ${shot.emotion || "neutral"} ${modelId}`);
  return { samples, dur, localWords, modelId, text };
}

const rendered = new Array(shots.length);
let next = 0;
async function worker() {
  while (next < shots.length) {
    const i = next++;
    rendered[i] = await renderShot(shots[i], i);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const parts = [];
const timing = [];
let t = 0;
for (let i = 0; i < shots.length; i++) {
  const s = shots[i];
  const r = rendered[i];
  const words = r.localWords.map((o) => ({ w: o.w, start: +(o.start + t).toFixed(3), end: +(o.end + t).toFixed(3) }));
  timing.push({
    id: s.id,
    voice: voiceLabel,
    model: r.modelId,
    emotion: s.emotion || null,
    start: +t.toFixed(3),
    end: +(t + r.dur).toFixed(3),
    words,
  });
  parts.push(r.samples);
  const gap = Number(s.gap ?? 0.06);
  parts.push(new Int16Array(Math.round(gap * SR)));
  t += r.dur + gap;
}

const totalSamples = parts.reduce((a, p) => a + p.length, 0);
const all = new Int16Array(totalSamples);
let offset = 0;
for (const p of parts) {
  all.set(p, offset);
  offset += p.length;
}

fs.mkdirSync(path.join("public", ep), { recursive: true });
writeWav(path.join("public", ep, "voice.wav"), all);
fs.writeFileSync(
  path.join("episodes", ep, "timing.json"),
  JSON.stringify({ voice: voiceLabel, model: modelArg, speed, total: +t.toFixed(3), shots: timing }, null, 1)
);
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log("total", t.toFixed(1), "s,", (timing.reduce((a, s) => a + s.words.length, 0) / t).toFixed(2), "words/s, voice", voiceLabel);
