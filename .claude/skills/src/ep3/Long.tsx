import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Stage } from "../engine/Stage";
import type { CamKeys, V3 } from "../engine/Stage";
import { SHOTS } from "./shots";
import timing from "../../episodes/ep3/timing.json";

const TAIL = 1.2;
export const longFrames = (fps: number) => Math.ceil((timing.total + TAIL) * fps);

const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

function vary(c: CamKeys, v?: string): CamKeys {
  const L = c.lookFrom;
  switch (v) {
    case "near": return { ...c, from: lerp(c.from, L, 0.3), to: lerp(c.to, L, 0.35) };
    case "close": return { ...c, from: lerp(c.to, L, 0.3), to: lerp(c.to, L, 0.45) };
    case "wide": return { ...c, from: lerp(c.from, L, -0.35), to: lerp(c.to, L, -0.25) };
    case "back": return { ...c, from: c.to, to: c.from, lookFrom: c.lookTo ?? c.lookFrom, lookTo: c.lookFrom };
    case "low": return { ...c, from: [c.from[0], Math.max(0.6, c.from[1] * 0.55), c.from[2]], to: [c.to[0], Math.max(0.7, c.to[1] * 0.6), c.to[2]] };
    case "top": return { ...c, from: c.to, to: [c.to[0], c.to[1] + 4, c.to[2] - 2] };
    case "still": return { ...c, from: c.to, to: lerp(c.to, L, 0.06) };
    default: return c;
  }
}

const PLAN: { id: number; base: number; variant?: string }[] = [
  { id: 1, base: 1, variant: "wide" }, { id: 2, base: 2 }, { id: 3, base: 3, variant: "near" },
  { id: 4, base: 4, variant: "still" }, { id: 5, base: 5, variant: "top" }, { id: 6, base: 6, variant: "close" },
  { id: 7, base: 7, variant: "low" }, { id: 8, base: 8, variant: "near" }, { id: 9, base: 9, variant: "near" },
  { id: 10, base: 10, variant: "top" }, { id: 11, base: 11, variant: "still" }, { id: 12, base: 12, variant: "close" },
  { id: 13, base: 13, variant: "low" }, { id: 14, base: 14, variant: "close" }, { id: 15, base: 15, variant: "near" },
  { id: 16, base: 16, variant: "close" }, { id: 17, base: 17, variant: "wide" }, { id: 18, base: 18, variant: "near" },
  { id: 19, base: 19, variant: "still" }, { id: 20, base: 20, variant: "close" }, { id: 21, base: 21, variant: "back" },
  { id: 22, base: 22, variant: "low" }, { id: 23, base: 23, variant: "near" }, { id: 24, base: 24, variant: "wide" },
  { id: 25, base: 25, variant: "close" },
];

export const LongEpisode: React.FC = () => {
  const { fps } = useVideoConfig();
  const total = longFrames(fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timing.shots.map((s, i) => {
        const p = PLAN[i];
        const a = i === 0 ? 0 : Math.round(s.start * fps);
        const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : total;
        const S = SHOTS[p.base];
        const cam = vary(S.cam, p.variant);
        const focus = p.variant === "wide" ? S.focus * 1.3 : p.variant === "near" || p.variant === "close" ? S.focus * 0.7 : S.focus;
        return (
          <Sequence key={s.id} from={a} durationInFrames={b - a} name={`line ${s.id} (shot ${p.base} ${p.variant ?? ""})`}>
            <Stage look={S.look} cam={{ ...cam, fov: (cam.fov ?? 55) * 0.82 }} dur={b - a} focus={focus}>
              <S.Body dur={b - a} />
            </Stage>
          </Sequence>
        );
      })}
      <Audio src={staticFile("ep3/mix.wav")} />
    </AbsoluteFill>
  );
};
