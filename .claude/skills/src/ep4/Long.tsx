import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import timing from "../../episodes/ep4/timing.json";
import { shots } from "./shots";

export const longFrames = (fps: number) => Math.ceil((timing.total + 1.2) * fps);

export const LongEpisode: React.FC = () => {
  const { fps } = useVideoConfig();
  const total = longFrames(fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timing.shots.map((s, i) => {
        const a = i === 0 ? 0 : Math.round(s.start * fps);
        const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : total;
        const Shot = shots[s.id];
        return (
          <Sequence key={s.id} from={a} durationInFrames={b - a} name={"line " + s.id}>
            {Shot ? <Shot dur={b - a} /> : null}
          </Sequence>
        );
      })}
      <Audio src={staticFile("ep4/mix.wav")} />
    </AbsoluteFill>
  );
};
