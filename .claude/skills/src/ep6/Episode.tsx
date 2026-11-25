import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../engine/Captions";
import enTiming from "../../episodes/ep6_en/timing.json";
import esTiming from "../../episodes/ep6_es/timing.json";
import { shots } from "./shots";

export type Lang = "en" | "es";
export const TAIL = 0.7;
const EP: Record<Lang, string> = { en: "ep6_en", es: "ep6_es" };

const timingFor = (lang: Lang) => (lang === "es" ? esTiming : enTiming);

export const totalFrames = (fps: number, lang: Lang = "en") => Math.ceil((timingFor(lang).total + TAIL) * fps);

export const shotSpans = (fps: number, lang: Lang = "en") =>
  timingFor(lang).shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timingFor(lang).shots.length ? Math.round(timingFor(lang).shots[i + 1].start * fps) : totalFrames(fps, lang);
    return { id: s.id, from: a, dur: b - a };
  });

export const ShotView: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const Shot = shots[id];
  return Shot ? <Shot dur={dur} /> : null;
};

export type EpisodeProps = { captions?: boolean; music?: boolean; audio?: boolean };

export const makeEpisode = (lang: Lang): React.FC<EpisodeProps> => {
  const EpisodeForLang: React.FC<EpisodeProps> = ({ captions = true, music = true, audio = true }) => {
    const { fps } = useVideoConfig();
    const words = timingFor(lang).shots.flatMap((s) => s.words);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {shotSpans(fps, lang).map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
            <ShotView id={s.id} dur={s.dur} />
          </Sequence>
        ))}
        {captions ? <Captions words={words} /> : null}
        {audio ? <Audio src={staticFile(music ? `${EP[lang]}/mix.wav` : `${EP[lang]}/voice.wav`)} /> : null}
      </AbsoluteFill>
    );
  };
  return EpisodeForLang;
};

export const EpisodeEN = makeEpisode("en");
export const EpisodeES = makeEpisode("es");

export const makeShotStill = (lang: Lang): React.FC<{ id: number }> => {
  const Still: React.FC<{ id: number }> = ({ id }) => {
    const { fps } = useVideoConfig();
    const s = shotSpans(fps, lang).find((x) => x.id === id);
    return s ? <ShotView id={id} dur={s.dur} /> : null;
  };
  return Still;
};

export const ShotStillEN = makeShotStill("en");
export const ShotStillES = makeShotStill("es");
