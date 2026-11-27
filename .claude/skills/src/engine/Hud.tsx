// Screen HUD: the only things allowed flat on top of the 3D picture (besides captions).
// Measured on the reference Shorts in styles/retention-rules.md:
// - <Counter>: an animated number pill (▶ 58,8 mil → 10,5 M, 100 → 62). Every claim with a number shows one.
// - <ProgressCards>: gold "1 ? 2 ? 3 ?" cards that flip to ✓ as each promised item is told.
// - <NativeComment>: the flat comment sheet of a social app, rising from the bottom.
// All times are in seconds, local to the shot (the Sequence the HUD is placed in).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { fontFamily } from "./font"; // local Montserrat (offline / cloud-safe)

export const GOLD = "#f2c14e";
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const useLocal = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  return { t: frame / fps, width, height, s: Math.min(width, height) / 1080 };
};

export type Lang = "es" | "en";

export const formatNumber = (v: number, decimals = 0, lang: Lang = "es") =>
  v.toLocaleString(lang === "es" ? "es-ES" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: Math.abs(v) >= 10000 });

export type CounterProps = {
  from: number; to: number;
  start?: number; end?: number;              // when the number runs (s, local to the shot)
  appear?: number;                           // when the pill pops in (default = start - 0.2)
  decimals?: number; lang?: Lang;
  prefix?: string; suffix?: string;          // e.g. suffix " %" or " M"
  play?: boolean;                            // ▶ icon like a view counter
  x?: number; y?: number;                    // centre, as a fraction of the frame
  size?: number;                             // font size at 1080 px wide
  accent?: string;                           // number colour at the end of the run
  curve?: (k: number) => number;             // custom progress curve 0..1 → 0..1 (e.g. fast then slow)
  label?: string;                            // small caption under the number
};

export const Counter: React.FC<CounterProps> = ({
  from, to, start = 0.2, end = 1.6, appear, decimals = 0, lang = "es", prefix = "", suffix = "", play = false,
  x = 0.5, y = 0.62, size = 120, accent = GOLD, curve, label,
}) => {
  const { t, width, height, s } = useLocal();
  const a = appear ?? Math.max(0, start - 0.2);
  if (t < a) return null;
  const k0 = interpolate(t, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = curve ? curve(k0) : ease(k0);
  const v = from + (to - from) * k;
  const pop = interpolate(t - a, [0, 0.1, 0.2], [0.6, 1.08, 1], { extrapolateRight: "clamp" });
  const done = interpolate(t, [end, end + 0.12, end + 0.3], [1, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const running = t >= start && t <= end + 0.3;
  const color = k0 >= 1 ? accent : "#ffffff";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: width * x, top: height * y, transform: `translate(-50%,-50%) scale(${pop * done})`, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 18 * s, padding: `${14 * s}px ${36 * s}px`, borderRadius: 999,
          background: "rgba(14,16,26,0.82)", border: `${3 * s}px solid ${running ? "rgba(255,255,255,0.22)" : accent}`,
          boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.45)`,
        }}>
          {play ? <svg width={size * 0.42 * s} height={size * 0.48 * s} viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" fill={color} /></svg> : null}
          <span style={{ fontFamily, fontWeight: 900, fontSize: size * s, color, letterSpacing: -1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {prefix}{formatNumber(v, decimals, lang)}{suffix}
          </span>
        </div>
        {label ? <div style={{ fontFamily, fontWeight: 700, fontSize: size * 0.26 * s, color: "rgba(255,255,255,0.85)", marginTop: 12 * s, letterSpacing: 3 * s, textTransform: "uppercase", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export type ProgressCardsProps = {
  total: number;
  flips?: number[];          // local time (s) at which card i turns into ✓ (omit or Infinity = still "?"); negative = already ✓
  active?: number;           // index of the card being told now (raised + glowing)
  x?: number; y?: number; w?: number;  // centre and total width as fractions of the frame
  appear?: number;
};

export const ProgressCards: React.FC<ProgressCardsProps> = ({ total, flips = [], active, x = 0.5, y = 0.3, w = 0.62, appear = 0 }) => {
  const { t, width, height, s } = useLocal();
  if (t < appear) return null;
  const cw = (width * w) / (total + (total - 1) * 0.18);
  const ch = cw * 1.35;
  const pop = interpolate(t - appear, [0, 0.15, 0.3], [0.7, 1.05, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: width * x, top: height * y, transform: `translate(-50%,-50%) scale(${pop})`, display: "flex", gap: cw * 0.18 }}>
        {Array.from({ length: total }).map((_, i) => {
          const f = flips[i] ?? Infinity;
          // flip: scaleX 1 → 0 → 1 around f, face changes at the midpoint
          const sx = Number.isFinite(f) ? Math.abs(interpolate(t, [f - 0.16, f, f + 0.16], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 1;
          const done = t >= f;
          const isActive = active === i;
          const lift = isActive ? -0.08 * ch : 0;
          return (
            <div key={i} style={{
              width: cw, height: ch, borderRadius: 14 * s, position: "relative", transform: `translateY(${lift}px) scaleX(${Math.max(0.02, sx)}) scale(${isActive ? 1.12 : 1})`,
              background: "linear-gradient(160deg, #23212a, #121117)", border: `${4 * s}px solid ${GOLD}`,
              boxShadow: isActive ? `0 0 ${40 * s}px rgba(242,193,78,0.55)` : `0 ${8 * s}px ${20 * s}px rgba(0,0,0,0.5)`,
              opacity: done || isActive || active === undefined ? 1 : 0.8,
            }}>
              <div style={{ position: "absolute", top: 10 * s, left: 14 * s, fontFamily, fontWeight: 800, fontSize: cw * 0.2, color: GOLD }}>{i + 1}</div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 900, fontSize: cw * 0.6, color: GOLD }}>
                {done ? <svg width={cw * 0.5} height={cw * 0.5} viewBox="0 0 24 24"><path d="M4 12.5 L9.5 18 L20 6.5" stroke={GOLD} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : "?"}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const AVATAR_COLORS = ["#5b7cfa", "#f27a54", "#3fb68b", "#c264d6", "#e0a83a", "#4bb0d8", "#e25d7b", "#7d8a99"];

export type NativeCommentProps = {
  username: string; question: string; seed?: number; lang?: Lang;
  appear?: number; ago?: string;
  height?: number;   // sheet height as a fraction of the frame
};

export const NativeComment: React.FC<NativeCommentProps> = ({ username, question, seed = 1, lang = "es", appear = 0.1, ago = "1 d", height: hFrac = 0.34 }) => {
  const { t, width, height, s } = useLocal();
  if (t < appear) return null;
  const k = ease(interpolate(t, [appear, appear + 0.35], [0, 1], { extrapolateRight: "clamp" }));
  const sheetH = height * hFrac;
  const av = AVATAR_COLORS[Math.abs(seed) % AVATAR_COLORS.length];
  const L = lang === "es" ? { title: "Comentarios", reply: "Responder" } : { title: "Comments", reply: "Reply" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.35 * k})` }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: sheetH, transform: `translateY(${(1 - k) * sheetH}px)`,
        background: "#1c1c21", borderTopLeftRadius: 34 * s, borderTopRightRadius: 34 * s, boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
        fontFamily, color: "#f2f2f5",
      }}>
        <div style={{ width: 90 * s, height: 9 * s, borderRadius: 9, background: "#4a4a52", margin: `${18 * s}px auto ${16 * s}px` }} />
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 34 * s }}>{L.title}</div>
        <div style={{ height: 1, background: "#2e2e35", margin: `${22 * s}px 0` }} />
        <div style={{ display: "flex", gap: 24 * s, padding: `0 ${44 * s}px` }}>
          <div style={{ width: 86 * s, height: 86 * s, borderRadius: "50%", background: av, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40 * s, color: "#fff" }}>
            {username.replace(/[^a-zA-Z]/g, "").charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ fontSize: 28 * s, color: "#a3a3ad", fontWeight: 600 }}>{username} <span style={{ marginLeft: 10 * s }}>{ago}</span></div>
            <div style={{ fontSize: 40 * s, fontWeight: 600, lineHeight: 1.3, marginTop: 8 * s }}>{question}</div>
            <div style={{ fontSize: 27 * s, color: "#8d8d97", fontWeight: 700, marginTop: 14 * s }}>{L.reply}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
