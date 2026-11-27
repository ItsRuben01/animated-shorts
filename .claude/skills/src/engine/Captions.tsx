// Captions. Two modes:
// - "word" (default, episodes 1–7): one or two words at a time, heavy white type, dark outline, ~80% down.
// - "karaoke" (new episodes, styles/retention-rules.md): a short phrase near the top, spoken words bright,
//   upcoming words dimmed, the current word boxed. The subject keeps the centre of the frame.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fontFamily } from "./font";

export type Word = { w: string; start: number; end: number };

// Short words ride along with the next word so nothing flashes for 2 frames
export function groupWords(words: Word[], minDur = 0.22): Word[] {
  const out: Word[] = [];
  for (const w of words) {
    const last = out[out.length - 1];
    if (last && last.end - last.start < minDur && (last.w + " " + w.w).length <= 14 && !/[.?!]$/.test(last.w)) { last.w += " " + w.w; last.end = w.end; }
    else out.push({ ...w });
  }
  return out;
}

export type Phrase = { words: Word[]; start: number; end: number };

// Phrases for karaoke mode: break after . ? ! : , (when the phrase already has 2+ words), at maxWords,
// at maxChars, or at a pause longer than maxGap seconds.
export function groupPhrases(words: Word[], maxWords = 5, maxChars = 30, maxGap = 0.45): Phrase[] {
  const out: Phrase[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; };
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const chars = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (prev && (w.start - prev.end > maxGap || cur.length >= maxWords || chars > maxChars)) flush();
    cur.push(w);
    if (/[.?!:…]$/.test(w.w) || (/[,;]$/.test(w.w) && cur.length >= 2)) flush();
  }
  flush();
  return out;
}

type CaptionProps = { words: Word[]; y?: number; size?: number; mode?: "word" | "karaoke"; accent?: string };

export const Captions: React.FC<CaptionProps> = (p) => (p.mode === "karaoke" ? <KaraokeCaptions {...p} /> : <WordCaptions {...p} />);

const WordCaptions: React.FC<CaptionProps> = ({ words, y = 0.8, size = 70 }) => {   // 2026-11-05 user: smaller and lower so the picture stays clear (was 0.75 / 86)
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const t = frame / fps;
  const g = groupWords(words);
  const cur = g.find((w) => t >= w.start && t < w.end + 0.04);
  if (!cur) return null;
  const k = interpolate(t - cur.start, [0, 0.07, 0.13], [0.8, 1.08, 1], { extrapolateRight: "clamp" });
  const text = cur.w.replace(/[,]$/, "");
  const scale = Math.min(width, height) / 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: height * y, left: 0, right: 0, textAlign: "center", transform: `translateY(-50%) scale(${k})` }}>
        <span style={{ fontFamily, fontWeight: 900, fontSize: size * scale, color: "#ffffff", letterSpacing: -0.5,
          WebkitTextStroke: `${11 * scale}px #111014`, paintOrder: "stroke fill", textShadow: `0 ${6 * scale}px ${10 * scale}px rgba(0,0,0,0.45)` }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

const KaraokeCaptions: React.FC<CaptionProps> = ({ words, y = 0.085, size = 54, accent = "#7fb2ff" }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const t = frame / fps;
  const phrases = React.useMemo(() => groupPhrases(words), [words]);
  // hold a phrase until the next one starts (max 0.5 s) so the top never flickers empty mid-sentence
  const idx = phrases.findIndex((ph, i) => t >= ph.start - 0.03 && t < Math.min(ph.end + 0.5, phrases[i + 1]?.start ?? Infinity));
  if (idx < 0) return null;
  const ph = phrases[idx];
  const scale = Math.min(width, height) / 1080;
  const fade = interpolate(t - ph.start, [-0.03, 0.06], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: height * y, left: width * 0.08, right: width * 0.08, textAlign: "center", opacity: fade,
        fontFamily, fontSize: size * scale, lineHeight: 1.32, letterSpacing: -0.3 }}>
        {ph.words.map((w, i) => {
          const spoken = t >= w.start;
          const current = spoken && (i === ph.words.length - 1 || t < ph.words[i + 1].start);
          const pop = current ? interpolate(t - w.start, [0, 0.06, 0.12], [0.92, 1.05, 1], { extrapolateRight: "clamp" }) : 1;
          return (
            <React.Fragment key={i}>
              <span style={{
                display: "inline-block", position: "relative", padding: `0 ${8 * scale}px`, transform: `scale(${pop})`,
                fontWeight: spoken ? 800 : 600, color: spoken ? "#ffffff" : "rgba(235,235,245,0.5)",
                textShadow: `0 ${3 * scale}px ${12 * scale}px rgba(0,0,0,0.75), 0 0 ${3 * scale}px rgba(0,0,0,0.6)`,
                borderRadius: 8 * scale, outline: current ? `${3 * scale}px solid ${accent}` : "none",
                background: current ? "rgba(20,24,40,0.55)" : "transparent",
              }}>{w.w}</span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
