import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [, , cmd, ep, arg3, arg4] = process.argv;

if (!cmd || !ep) {
  console.error("Usage:");
  console.error("  node scripts/thumbnails.mjs capture <epN> <f1,f2,f3> [short|long|both]");
  console.error("  node scripts/thumbnails.mjs sheet <epN> [short|long|both]");
  console.error("  node scripts/thumbnails.mjs export <epN> <1..10> [short|long|both]");
  process.exit(1);
}

const epDir = path.join("episodes", ep);
const outDir = path.join(epDir, "out");
const publicRefDir = path.join("public", "thumb_refs", ep);
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(publicRefDir, { recursive: true });

const isSpanish = ep.toLowerCase().includes("es");

function resolveModes(modeArg) {
  const m = (modeArg || "both").toLowerCase();
  if (m === "both" || m === "ambas") return ["short", "long"];
  if (m === "long" || m === "largo" || m === "16x9") return ["long"];
  return ["short"];
}

function sourceCompFor(mode) {
  if (mode === "long") {
    return isSpanish ? "Long-ES" : "Long-EN";
  }
  return isSpanish ? "Short-ES" : "Short-EN";
}

if (cmd === "capture") {
  const frames = (arg3 || "30,180,420").split(",").map((s) => s.trim());
  const modes = resolveModes(arg4);

  for (const mode of modes) {
    const comp = sourceCompFor(mode);
    frames.forEach((frame, idx) => {
      const dest = path.join(publicRefDir, `${mode}_ref_${idx + 1}.png`);
      console.log(`Capturing [${mode.toUpperCase()}] ${comp} frame ${frame} -> ${dest}`);
      execSync(
        `npx remotion still src/index.ts ${comp} "${dest}" --frame=${frame}`,
        { stdio: "inherit" }
      );
    });
  }
} else if (cmd === "sheet") {
  const modes = resolveModes(arg3);

  for (const mode of modes) {
    const specPath = path.join(epDir, `thumbnails_${mode}.json`);
    if (!fs.existsSync(specPath)) {
      console.error(`Missing ${specPath}. Create thumbnails_${mode}.json with 10 hooks first.`);
      process.exit(1);
    }
    const sheetComp = mode === "long" ? "ThumbnailSheet16x9" : "ThumbnailSheet";
    const sheetOut = path.join(outDir, `shot_${mode}.png`);
    console.log(`Rendering 10-thumbnail [${mode.toUpperCase()}] sheet -> ${sheetOut}`);
    execSync(
      `npx remotion still src/index.ts ${sheetComp} "${sheetOut}" --props="${specPath}"`,
      { stdio: "inherit" }
    );
  }
} else if (cmd === "export") {
  const idx = Number(arg3 || 1);
  const modes = resolveModes(arg4);

  for (const mode of modes) {
    const specPath = path.join(epDir, `thumbnails_${mode}.json`);
    if (!fs.existsSync(specPath)) {
      console.error(`Missing ${specPath}.`);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(specPath, "utf8"));
    const chosen = data.hooks.find((h) => h.index === idx) || data.hooks[0];
    const singleComp = mode === "long" ? "ThumbSingle16x9" : "ThumbSingle";
    const width = mode === "long" ? 1280 : 1080;
    const height = mode === "long" ? 720 : 1920;
    const singleOut = path.join(outDir, `thumbnail_${mode}_${idx}.png`);
    const tmpProps = path.join(epDir, `_tmp_thumb_${mode}_${idx}.json`);

    fs.writeFileSync(tmpProps, JSON.stringify({ spec: chosen, width, height }));
    execSync(
      `npx remotion still src/index.ts ${singleComp} "${singleOut}" --props="${tmpProps}"`,
      { stdio: "inherit" }
    );
    fs.unlinkSync(tmpProps);
    console.log(`Exported winning [${mode.toUpperCase()}] thumbnail -> ${singleOut}`);
  }
}