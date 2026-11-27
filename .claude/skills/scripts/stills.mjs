// Check stills before rendering: node scripts/stills.mjs 1 2 3 [--frame=20] [--comp=Ep8Shot] [--prefix=ep8_]
// Bundles once, then renders one still per shot into out/stills/sNN.png. Look at every one before you render.
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
const args = process.argv.slice(2);
const frame = (args.find((a) => a.startsWith("--frame=")) || "--frame=20").split("=")[1];
const comp = (args.find((a) => a.startsWith("--comp=")) || "--comp=Shot").split("=")[1];
const prefix = (args.find((a) => a.startsWith("--prefix=")) || "--prefix=").split("=")[1] || "";
const ext = (args.find((a) => a.startsWith("--ext=")) || "--ext=png").split("=")[1].replace(/^\./, "");
const ids = args.filter((a) => !a.startsWith("--")).map(Number);
// pass-through for machines that need their own browser: --browser-executable=… --chrome-mode=… --gl=…
const extra = args.filter((a) => /^--(browser-executable|chrome-mode|gl)=/.test(a));
fs.mkdirSync("out/stills", { recursive: true });
execSync("npx remotion bundle src/index.ts --out-dir=out/bundle --log=error", { stdio: "inherit" });
const run = (id) => new Promise((ok) => {
  const propsFile = `out/stills/props-${id}.json`;
  fs.writeFileSync(propsFile, JSON.stringify({ id }));
  const p = spawn("npx", ["remotion", "still", "out/bundle", comp, `out/stills/${prefix}s${String(id).padStart(2, "0")}.${ext}`, `--props=${propsFile}`, `--frame=${frame}`, "--log=error", ...extra], { stdio: "inherit", shell: process.platform === "win32" });
  p.on("close", ok);
});
for (let i = 0; i < ids.length; i += 4) await Promise.all(ids.slice(i, i + 4).map(run));
console.log("stills in out/stills:", ids.map((i) => `${prefix}s${String(i).padStart(2, "0")}.${ext}`).join(" "));
