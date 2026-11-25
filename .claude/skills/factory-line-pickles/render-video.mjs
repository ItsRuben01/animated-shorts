import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const framesDir = join(here, 'render-frames-final');
const outDir = join(here, 'out');
mkdirSync(framesDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;
const profile = join(here, '.chrome-render-profile');
const url = 'file:///C:/Users/rubca/OneDrive/Documentos/Canal_Ingenieria/animated-shorts/.claude/skills/factory-line-pickles/pickle-line.html';
const args = [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--remote-allow-origins=*',
  '--enable-gpu',
  '--ignore-gpu-blocklist',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--window-size=1920,1080',
  '--hide-scrollbars',
  url,
];
const browser = spawn(chrome, args, { stdio: ['ignore', 'ignore', 'ignore'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function debuggerUrl() {
  for (let i = 0; i < 240; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await res.json();
      const tab = tabs.find((t) => t.type === 'page' && t.url.includes('pickle-line.html'));
      if (tab) return tab.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome debugger not ready');
}

const ws = new WebSocket(await debuggerUrl());
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (!msg.id || !pending.has(msg.id)) return;
  const { resolve, reject } = pending.get(msg.id);
  pending.delete(msg.id);
  if (msg.error) reject(new Error(JSON.stringify(msg.error)));
  else if (msg.result?.exceptionDetails) reject(new Error(msg.result.exceptionDetails.text));
  else resolve(msg.result?.result?.value);
};
function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const evaluate = (expression, awaitPromise = false) => send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
await send('Runtime.enable');

for (let i = 0; i < 240; i++) {
  if (await evaluate('window.__ready === true')) break;
  await sleep(250);
}
if (!(await evaluate('window.__ready === true'))) throw new Error('Page did not become ready');

const count = Math.round(await evaluate('window.DURATION * 30'));
const samples = Number(process.env.FRAME_SAMPLES || 16);
const first = Number(process.env.FRAME_START || 0);
const last = Number(process.env.FRAME_END || count - 1);
await evaluate(`window.__samples(${samples}); window.seek(${first / 30}); true`);
console.log(`Rendering ${last - first + 1}/${count} frames at ${samples} samples`);

for (let i = first; i <= last; i++) {
  const data = await evaluate(`window.seek(${i / 30}); document.getElementById('stage').toDataURL('image/jpeg', 0.94)`);
  writeFileSync(join(framesDir, `f${String(i).padStart(4, '0')}.jpg`), Buffer.from(data.split(',')[1], 'base64'));
  if ((i - first) % 15 === 0 || i === last) console.log(`frame ${i + 1}/${count}`);
}

const wav = await evaluate('window.__audio()', true);
writeFileSync(join(here, 'sound.wav'), Buffer.from(wav, 'base64'));
console.log('Offline sound rendered');

ws.close();
browser.kill();

if (process.env.SKIP_FFMPEG !== '1' && first === 0 && last === count - 1) {
  const ffmpeg = (args) => {
    const result = spawnSync('ffmpeg', args, { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
  };
  const soundRaw = join(here, 'sound.wav');
  const soundNorm = join(here, 'sound-norm.wav');
  const video = join(outDir, 'video.mp4');
  const final = join(outDir, 'pepinillos.mp4');
  ffmpeg(['-y', '-i', soundRaw, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', soundNorm]);
  ffmpeg(['-y', '-framerate', '30', '-i', join(framesDir, 'f%04d.jpg'), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', video]);
  ffmpeg(['-y', '-i', video, '-i', soundNorm, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final]);
  console.log(`Wrote ${final}`);
}
