// "Comenta «PALABRA»" call-to-action (keyword comment → automatic DM reply), rendered as a physical phone in the 3D world.
// Timeline (seconds from the start of the shot, all overridable):
//   0.0  headline "Comenta «PALABRA»" pops in above the phone, comments sheet open
//   type the keyword letter by letter (key lights up orange on the keyboard, caret blinks)
//   send button pressed → keyboard drops, your comment appears at the top of the list
//   DM notification slides in: "<channel> · mensaje" + reply + video preview with play button
// mode "type" stops after sending, mode "reply" starts on the DM, "both" (default) plays everything.
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box } from "./kit";
import type { V3 } from "./Stage";

export type CtaLang = "es" | "en";
export type CommentCTAProps = {
  keyword: string;
  reply: string;
  channel?: string;
  lang?: CtaLang;
  headline?: string; // "Comenta" / "Comment"
  mode?: "type" | "reply" | "both";
  start?: number; // s before typing starts
  cps?: number; // typed characters per second
  position?: V3;
  rotation?: V3;
  scale?: number;
  showHeadline?: boolean;
  accent?: string;
};

export type CtaSpec = Pick<CommentCTAProps, "keyword" | "reply" | "channel" | "headline" | "mode">;

const TXT = {
  es: { headline: "Comenta", panel: "Comentarios", add: "Añade un comentario...", msg: "mensaje", you: "tú", now: "ahora" },
  en: { headline: "Comment", panel: "Comments", add: "Add a comment...", msg: "message", you: "you", now: "now" },
};
const ROWS = { es: ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"], en: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] };
const FONT = "'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

export const ctaTimeline = (keyword: string, mode: CommentCTAProps["mode"] = "both", start = 0.35, cps = 9) => {
  if (mode === "reply") return { typeStart: -10, typeEnd: -9, send: -8.6, reply: start, end: start + 0.6 };
  const typeEnd = start + keyword.length / cps;
  const send = typeEnd + 0.3;
  return { typeStart: start, typeEnd, send, reply: mode === "type" ? Infinity : send + 0.55, end: send + 1.15 };
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, maxLines = 3) {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > max && cur) { out.push(cur); cur = w; } else cur = test;
  }
  if (cur) out.push(cur);
  return out.slice(0, maxLines);
}

function sendButton(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, accent: string, press: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1 - press * 0.16, 1 - press * 0.16);
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1a1310";
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.46); ctx.lineTo(r * 0.52, 0); ctx.lineTo(-r * 0.42, r * 0.46); ctx.lineTo(-r * 0.22, 0);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// 720 x 1440 phone screen, redrawn per frame
function drawScreen(
  ctx: CanvasRenderingContext2D, t: number, p: Required<Pick<CommentCTAProps, "keyword" | "reply" | "channel" | "lang" | "accent" | "mode">>,
  tl: ReturnType<typeof ctaTimeline>,
) {
  const W = 720, H = 1440, A = p.accent, L = TXT[p.lang];
  // the episode itself "playing" behind the UI: dim warm gradient + a soft moon + play button
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1d1916"); bg.addColorStop(1, "#0f0d0c");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#efe3c6";
  ctx.beginPath(); ctx.arc(560, 170, 44, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3a3330"; rr(ctx, 290, 26, 140, 10, 5); ctx.fill(); // speaker slot

  const typed = Math.floor(clamp((t - tl.typeStart) / Math.max(0.01, tl.typeEnd - tl.typeStart)) * p.keyword.length);
  const sent = t >= tl.send;
  const replyK = easeOut((t - tl.reply) / 0.45);
  const kbDrop = easeOut((t - tl.send) / 0.35); // keyboard slides away after send
  const press = clamp(1 - Math.abs(t - tl.send) / 0.12);

  // ---- comments sheet ----
  const sheetY = 430;
  ctx.fillStyle = "#242221"; rr(ctx, 0, sheetY, W, H - sheetY, 40); ctx.fill();
  ctx.fillStyle = "#4b4847"; rr(ctx, W / 2 - 50, sheetY + 22, 100, 10, 5); ctx.fill();
  ctx.fillStyle = "#f2efec"; ctx.font = `800 40px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(L.panel, W / 2, sheetY + 86);
  ctx.fillStyle = "#2c2a29"; ctx.fillRect(0, sheetY + 134, W, 3);
  ctx.textAlign = "left";

  let rowY = sheetY + 190;
  if (sent) { // your comment lands first, in the accent colour
    const k = easeOut((t - tl.send) / 0.3);
    ctx.globalAlpha = k;
    ctx.fillStyle = A; ctx.beginPath(); ctx.arc(80, rowY + 30, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1310"; ctx.font = `900 34px ${FONT}`; ctx.textAlign = "center"; ctx.fillText(L.you.slice(0, 1).toUpperCase(), 80, rowY + 32);
    ctx.textAlign = "left";
    ctx.fillStyle = "#9b9592"; ctx.font = `600 26px ${FONT}`; ctx.fillText(`${L.you} · ${L.now}`, 136, rowY + 10);
    ctx.fillStyle = "#ffffff"; ctx.font = `900 38px ${FONT}`; ctx.fillText(p.keyword, 136, rowY + 52);
    ctx.globalAlpha = 1;
    rowY += 120;
  }
  for (let i = 0; i < 3; i++) { // skeleton comments
    const y = rowY + i * 120;
    ctx.fillStyle = "#3a3736";
    ctx.beginPath(); ctx.arc(80, y + 30, 34, 0, Math.PI * 2); ctx.fill();
    rr(ctx, 136, y + 2, 160 + ((i * 53) % 70), 22, 11); ctx.fill();
    rr(ctx, 136, y + 40, 300 + ((i * 97) % 120), 22, 11); ctx.fill();
  }

  // ---- input pill + send ----
  const kbH = 420;
  const inputY = H - kbH - 150 + kbDrop * kbH;
  ctx.fillStyle = "#2a2827"; rr(ctx, 36, inputY, 520, 104, 52); ctx.fill();
  ctx.strokeStyle = "#3d3a39"; ctx.lineWidth = 3; ctx.stroke();
  const shown = sent ? "" : p.keyword.slice(0, typed);
  if (shown) {
    ctx.fillStyle = "#ffffff"; ctx.font = `900 46px ${FONT}`; ctx.fillText(shown, 74, inputY + 54);
    if (Math.floor(t * 2.4) % 2 === 0) { const w = ctx.measureText(shown).width; ctx.fillStyle = A; ctx.fillRect(80 + w, inputY + 28, 5, 52); }
  } else {
    ctx.fillStyle = "#8a8582"; ctx.font = `600 34px ${FONT}`; ctx.fillText(L.add, 74, inputY + 54);
  }
  sendButton(ctx, 628, inputY + 52, 52, A, press);

  // ---- keyboard ----
  if (kbDrop < 1) {
    const ky = H - kbH + kbDrop * kbH;
    ctx.fillStyle = "#151414"; ctx.fillRect(0, ky, W, kbH + 10);
    const hot = !sent && typed > 0 ? strip(p.keyword[typed - 1]) : "";
    ROWS[p.lang].forEach((row, r) => {
      const kw = 62, gap = 8, total = row.length * kw + (row.length - 1) * gap;
      const x0 = (W - total) / 2;
      [...row].forEach((ch, i) => {
        const x = x0 + i * (kw + gap), y = ky + 34 + r * 112;
        const on = ch === hot;
        ctx.fillStyle = on ? A : "#3a3837"; rr(ctx, x, y, kw, 90, 12); ctx.fill();
        ctx.fillStyle = on ? "#1a1310" : "#e9e5e2"; ctx.font = `700 34px ${FONT}`; ctx.textAlign = "center";
        ctx.fillText(ch, x + kw / 2, y + 47);
      });
    });
    ctx.textAlign = "left";
  }

  // ---- DM reply notification ----
  if (replyK > 0) {
    const cy = 300 - (1 - replyK) * 420;
    ctx.save(); ctx.globalAlpha = clamp(replyK * 1.4);
    ctx.fillStyle = "#1d1a19"; rr(ctx, 40, cy, W - 80, 560, 34); ctx.fill();
    ctx.strokeStyle = A; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = A; rr(ctx, 76, cy + 36, 78, 78, 18); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = `900 46px ${FONT}`; ctx.textAlign = "center"; ctx.fillText(p.channel.slice(0, 1).toUpperCase(), 115, cy + 77);
    ctx.textAlign = "left";
    ctx.fillStyle = "#c9c3bf"; ctx.font = `600 28px ${FONT}`; ctx.fillText(`${p.channel} · ${L.msg}`, 180, cy + 52);
    ctx.fillStyle = "#ffffff"; ctx.font = `900 38px ${FONT}`;
    wrap(ctx, p.reply, W - 80 - 180 - 30, 2).forEach((l, i) => ctx.fillText(l, 180, cy + 100 + i * 46));
    // video preview with play button
    const vx = 76, vy = cy + 210, vw = W - 152, vh = 310;
    const g = ctx.createLinearGradient(vx, vy, vx + vw, vy + vh);
    g.addColorStop(0, "#3a2c22"); g.addColorStop(1, "#16110e");
    ctx.fillStyle = g; rr(ctx, vx, vy, vw, vh, 22); ctx.fill();
    ctx.strokeStyle = "#6b4a36"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#d7cdbd"; ctx.beginPath(); ctx.arc(vx + vw - 120, vy + vh / 2, 60, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(10,8,8,0.82)"; ctx.beginPath(); ctx.arc(vx + vw / 2, vy + vh / 2, 78, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(vx + vw / 2 - 22, vy + vh / 2 - 34); ctx.lineTo(vx + vw / 2 + 34, vy + vh / 2); ctx.lineTo(vx + vw / 2 - 22, vy + vh / 2 + 34); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

function drawHeadline(ctx: CanvasRenderingContext2D, small: string, keyword: string) {
  ctx.clearRect(0, 0, 1024, 320);
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  ctx.font = `800 82px ${FONT}`;
  ctx.lineWidth = 14; ctx.strokeStyle = "#141014"; ctx.strokeText(small, 512, 80);
  ctx.fillStyle = "#e6e1dc"; ctx.fillText(small, 512, 80);
  let size = 118;
  const word = `«${keyword}»`;
  do { ctx.font = `900 ${size}px ${FONT}`; size -= 4; } while (ctx.measureText(word).width > 960 && size > 50);
  ctx.lineWidth = 18; ctx.strokeText(word, 512, 210);
  ctx.fillStyle = "#ffffff"; ctx.fillText(word, 512, 210);
}

export const CommentCTA: React.FC<CommentCTAProps> = ({
  keyword, reply, channel = "nebuu3d", lang = "es", headline, mode = "both", start = 0.35, cps = 9,
  position = [0, 1.9, 1.2], rotation = [0, 0, 0], scale = 1, showHeadline = true, accent = "#ff6a2b",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const kw = keyword.toUpperCase();
  const tl = useMemo(() => ctaTimeline(kw, mode, start, cps), [kw, mode, start, cps]);

  const screen = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 720; c.height = 1440;
    drawScreen(c.getContext("2d")!, t, { keyword: kw, reply, channel, lang, accent, mode }, tl);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return tex;
  }, [t, kw, reply, channel, lang, accent, mode, tl]);
  useEffect(() => () => screen.dispose(), [screen]);

  const head = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 320;
    drawHeadline(c.getContext("2d")!, headline ?? TXT[lang].headline, kw);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return tex;
  }, [headline, lang, kw]);
  useEffect(() => () => head.dispose(), [head]);

  // phone: 1.0 x 2.0 screen inside a dark bezel, standing on a small pedestal
  const sw = 1.0, sh = 2.0;
  const pop = easeOut(t / 0.35);
  const hk = interpolatePop(t);
  return (
    <group position={position} rotation={rotation} scale={scale * (0.9 + 0.1 * pop)}>
      <Box size={[sw + 0.14, sh + 0.16, 0.09]} color="#2a2422" rough={0.45} clearcoat={0.4} ink />
      <Box size={[sw + 0.2, sh + 0.22, 0.06]} pos={[0, 0, -0.035]} color="#6b5a50" rough={0.5} />
      <mesh position={[0, 0, 0.047]}>
        <planeGeometry args={[sw, sh]} />
        <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.85} roughness={0.35} metalness={0} />
      </mesh>
      <Box size={[0.62, 0.34, 0.5]} pos={[0, -sh / 2 - 0.2, -0.05]} color="#1e1a19" rough={0.7} />
      {showHeadline && hk > 0 ? (
        <mesh position={[0, sh / 2 + 0.42, 0.12]} scale={[hk, hk, 1]}>
          <planeGeometry args={[1.9, 0.594]} />
          <meshBasicMaterial map={head} transparent alphaTest={0.02} toneMapped={false} fog={false} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

// headline pops in with a small overshoot (0.6 → 1.08 → 1)
function interpolatePop(t: number) {
  const x = clamp(t / 0.32);
  return x >= 1 ? 1 : 0.6 + 0.4 * easeOut(x) + 0.08 * Math.sin(x * Math.PI);
}

// Helper for shots.tsx: find the `cta` object in an episode's shots.json
export const ctaFor = (shots: Array<{ cta?: CtaSpec }>): CtaSpec | undefined => shots.find((s) => s.cta)?.cta;
