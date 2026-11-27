import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../engine/Captions";
import enTiming from "../../episodes/ep15_en/timing.json";
import esTiming from "../../episodes/ep15_es/timing.json";
import { makeShots, type Lang } from "./shots";

export const TAIL = 0.7;
const EP: Record<Lang, string> = { en: "ep15_en", es: "ep15_es" };
const SHOTS = { en: makeShots("en"), es: makeShots("es") };

const timingFor = (lang: Lang) => (lang === "es" ? esTiming : enTiming);

export const totalFrames = (fps: number, lang: Lang = "en") => Math.ceil((timingFor(lang).total + TAIL) * fps);

export const shotSpans = (fps: number, lang: Lang = "en") =>
  timingFor(lang).shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timingFor(lang).shots.length ? Math.round(timingFor(lang).shots[i + 1].start * fps) : totalFrames(fps, lang);
    return { id: s.id, from: a, dur: b - a };
  });

const ShotView: React.FC<{ id: number; dur: number; lang: Lang }> = ({ id, dur, lang }) => {
  const Shot = SHOTS[lang][id];
  return Shot ? <Shot dur={dur} /> : null;
};

type EpisodeProps = { captions?: boolean; music?: boolean; audio?: boolean };

const makeEpisode = (lang: Lang): React.FC<EpisodeProps> => {
  const EpisodeForLang: React.FC<EpisodeProps> = ({ captions = true, music = true, audio = true }) => {
    const { fps } = useVideoConfig();
    const words = timingFor(lang).shots.flatMap((s) => s.words);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {shotSpans(fps, lang).map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
            <ShotView id={s.id} dur={s.dur} lang={lang} />
          </Sequence>
        ))}
        {captions ? <Captions words={words} mode="karaoke" /> : null}
        {audio ? <Audio src={staticFile(music ? `${EP[lang]}/mix.wav` : `${EP[lang]}/voice.wav`)} /> : null}
      </AbsoluteFill>
    );
  };
  return EpisodeForLang;
};

export const Ep15EN = makeEpisode("en");
export const Ep15ES = makeEpisode("es");

const makeShotStill = (lang: Lang): React.FC<{ id: number }> => {
  const Still: React.FC<{ id: number }> = ({ id }) => {
    const { fps } = useVideoConfig();
    const s = shotSpans(fps, lang).find((x) => x.id === id);
    return s ? <ShotView id={id} dur={s.dur} lang={lang} /> : null;
  };
  return Still;
};

export const Ep15ShotEN = makeShotStill("en");
export const Ep15ShotES = makeShotStill("es");
