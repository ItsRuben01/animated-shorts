import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import enTiming from "../../episodes/ep6_en_long/timing.json";
import esTiming from "../../episodes/ep6_es_long/timing.json";
import { LongShotView } from "./longShots";
import type { Lang } from "./Episode";

const EP: Record<Lang, string> = { en: "ep6_en_long", es: "ep6_es_long" };
const TAIL = 1.2;
const timingFor = (lang: Lang) => (lang === "es" ? esTiming : enTiming);

export const longFrames = (fps: number, lang: Lang = "en") => Math.ceil((timingFor(lang).total + TAIL) * fps);

export const longShotSpans = (fps: number, lang: Lang = "en") =>
  timingFor(lang).shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timingFor(lang).shots.length ? Math.round(timingFor(lang).shots[i + 1].start * fps) : longFrames(fps, lang);
    return { id: s.id, from: a, dur: b - a };
  });

export const makeLongEpisode = (lang: Lang): React.FC => {
  const LongEpisodeForLang: React.FC = () => {
    const { fps } = useVideoConfig();
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {longShotSpans(fps, lang).map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"line " + s.id}>
            <LongShotView id={s.id} dur={s.dur} />
          </Sequence>
        ))}
        <Audio src={staticFile(`${EP[lang]}/mix.wav`)} />
      </AbsoluteFill>
    );
  };
  return LongEpisodeForLang;
};

export const makeLongShotStill = (lang: Lang): React.FC<{ id: number }> => {
  const Still: React.FC<{ id: number }> = ({ id }) => {
    const { fps } = useVideoConfig();
    const s = longShotSpans(fps, lang).find((x) => x.id === id);
    return s ? <LongShotView id={id} dur={s.dur} /> : null;
  };
  return Still;
};

export const LongEN = makeLongEpisode("en");
export const LongES = makeLongEpisode("es");
export const LongEpisode = LongEN;
export const LongShotStillEN = makeLongShotStill("en");
export const LongShotStillES = makeLongShotStill("es");
