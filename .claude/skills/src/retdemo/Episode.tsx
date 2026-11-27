import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../engine/Captions";
import timing from "../../episodes/retdemo/timing.json";
import { SHOTS } from "./shots";

export const TAIL = 0.6;

export const totalFrames = (fps: number) => Math.ceil((timing.total + TAIL) * fps);

export const shotSpans = (fps: number) =>
  timing.shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : totalFrames(fps);
    return { id: s.id, from: a, dur: b - a };
  });

const ShotView: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const Shot = SHOTS[id];
  return Shot ? <Shot dur={dur} /> : null;
};

type EpisodeProps = { captions?: boolean; music?: boolean; audio?: boolean };

export const Ep8: React.FC<EpisodeProps> = ({ captions = true, music = true, audio = true }) => {
  const { fps } = useVideoConfig();
  const words = timing.shots.flatMap((s) => s.words);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {shotSpans(fps).map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <ShotView id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      {captions ? <Captions words={words} mode="karaoke" /> : null}
      {audio ? <Audio src={staticFile(music ? "retdemo/mix.wav" : "retdemo/voice.wav")} /> : null}
    </AbsoluteFill>
  );
};

// One shot, with the episode's captions at that time, for stills.mjs (--comp=Ep8Shot)
export const Ep8Shot: React.FC<{ id: number }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const s = shotSpans(fps).find((x) => x.id === id);
  if (!s) return null;
  const words = timing.shots.flatMap((w) => w.words).map((w) => ({ ...w, start: w.start - s.from / fps, end: w.end - s.from / fps }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ShotView id={id} dur={s.dur} />
      <Captions words={words} mode="karaoke" />
    </AbsoluteFill>
  );
};
