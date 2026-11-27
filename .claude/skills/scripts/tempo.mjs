// Speed up (or slow down) a finished narration without changing the pitch, and keep timing.json in sync.
// Usage: node scripts/tempo.mjs <ep> <factor>      e.g. node scripts/tempo.mjs ep8 1.05
// Rule (SKILL.md step 6D): only after trimming gaps and cutting words; never above 1.10.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ep = process.argv[2];
const f = Number(process.argv[3]);
if (!ep || !(f > 0.8 && f <= 1.1)) throw new Error("Usage: node scripts/tempo.mjs <ep> <factor 0.8–1.10>");
const wav = path.join("public", ep, "voice.wav");
const tmp = path.join("public", ep, "voice.tempo.tmp.wav");
const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-filter:a", `atempo=${f}`, "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", tmp], { encoding: "utf8" });
if (r.status !== 0) throw new Error(r.stderr);
fs.renameSync(tmp, wav);
const tf = path.join("episodes", ep, "timing.json");
const t = JSON.parse(fs.readFileSync(tf, "utf8"));
const k = (x) => +(x / f).toFixed(3);
t.total = k(t.total);
t.tempo = +((t.tempo ?? 1) * f).toFixed(4);
for (const s of t.shots) { s.start = k(s.start); s.end = k(s.end); for (const w of s.words) { w.start = k(w.start); w.end = k(w.end); } }
fs.writeFileSync(tf, JSON.stringify(t, null, 2));
const n = t.shots.reduce((a, s) => a + s.words.length, 0);
console.log(`total ${t.total.toFixed(1)} s, ${(n / t.total).toFixed(2)} words/s, tempo ×${t.tempo}`);
