import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../engine/Captions";
import timing from "../../episodes/ep5/timing.json";
import { shots } from "./shots";

export const TAIL = 0.7;
export const totalFrames = (fps: number) => Math.ceil((timing.total + TAIL) * fps);
export const voiceFrames = (fps: number) => Math.ceil(timing.total * fps);

export const shotSpans = (fps: number) =>
  timing.shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : totalFrames(fps);
    return { id: s.id, from: a, dur: b - a };
  });

export const ShotView: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const Shot = shots[id];
  return Shot ? <Shot dur={dur} /> : null;
};

export const Episode: React.FC<{ captions?: boolean; music?: boolean; audio?: boolean }> = ({ captions = true, music = true, audio = true }) => {
  const { fps } = useVideoConfig();
  const words = timing.shots.flatMap((s) => s.words);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {shotSpans(fps).map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <ShotView id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      {captions ? <Captions words={words} /> : null}
      {audio ? <Audio src={staticFile(music ? "ep5/mix.wav" : "ep5/voice.wav")} /> : null}
    </AbsoluteFill>
  );
};

export const ShotStill: React.FC<{ id: number }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const s = shotSpans(fps).find((x) => x.id === id)!;
  return <ShotView id={id} dur={s.dur} />;
};
