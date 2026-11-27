import React from "react";
import { Composition } from "remotion";
import { Episode, ShotStill, totalFrames } from "./ep5/Episode";
import { Episode as PreviousEpisode, ShotStill as PreviousShotStill, totalFrames as previousFrames } from "./ep4/Episode";
import { LongEpisode, longFrames } from "./ep4/Long";
import { EpisodeEN, EpisodeES, ShotStillEN, ShotStillES, totalFrames as ep6Frames } from "./ep6/Episode";
import { LongEN, LongES, LongShotStillEN, LongShotStillES, longFrames as ep6LongFrames } from "./ep6/Long";
import { Ep7EN, Ep7ES, Ep7ShotEN, Ep7ShotES, totalFrames as ep7Frames } from "./ep7/Episode";
import { ThumbnailSheet, ThumbCard } from "./thumbnails/ThumbnailSheet";
import { CastSheet } from "./engine/CastSheet";
import { CtaPreview } from "./engine/CtaPreview";

export const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Taipei" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="TaipeiSilent" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: false, audio: false }} />
    <Composition id="Short16x9" component={Episode} width={1920} height={1080} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: false, music: true }} />
    <Composition id="Shot5" component={ShotStill} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Shot" component={ShotStillEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Shot-ES" component={ShotStillES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep4Short" component={PreviousEpisode} width={1080} height={1920} fps={30} durationInFrames={previousFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep4Shot" component={PreviousShotStill} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Long" component={LongEpisode} width={1920} height={1080} fps={30} durationInFrames={longFrames(30)} />
    <Composition id="Short-EN" component={EpisodeEN} width={1080} height={1920} fps={30} durationInFrames={ep6Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Short-ES" component={EpisodeES} width={1080} height={1920} fps={30} durationInFrames={ep6Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Short-EN-Silent" component={EpisodeEN} width={1080} height={1920} fps={30} durationInFrames={ep6Frames(30, "en")} defaultProps={{ captions: false, audio: false }} />
    <Composition id="Short-ES-Silent" component={EpisodeES} width={1080} height={1920} fps={30} durationInFrames={ep6Frames(30, "es")} defaultProps={{ captions: false, audio: false }} />
    <Composition id="Long-EN" component={LongEN} width={1920} height={1080} fps={30} durationInFrames={ep6LongFrames(30, "en")} />
    <Composition id="Long-ES" component={LongES} width={1920} height={1080} fps={30} durationInFrames={ep6LongFrames(30, "es")} />
    <Composition id="LongShot-EN" component={LongShotStillEN} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="LongShot-ES" component={LongShotStillES} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep7 — pepinillos (Short bilingüe) */}
    <Composition id="Ep7Short-ES" component={Ep7ES} width={1080} height={1920} fps={30} durationInFrames={ep7Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep7Short-EN" component={Ep7EN} width={1080} height={1920} fps={30} durationInFrames={ep7Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep7Shot-ES" component={Ep7ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep7Shot-EN" component={Ep7ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* Hoja de modelo de personajes meme-fusión (comparar con ref/personajes_meme.jpg) */}
    <Composition id="CastSheet" component={CastSheet} width={2688} height={1100} fps={30} durationInFrames={30} defaultProps={{ sheet: "cast" as const }} />

    {/* CTA "Comenta «PALABRA»" → respuesta automática por DM (comprobar antes de usarlo en un episodio) */}
    <Composition id="CtaPreview" component={CtaPreview} width={1080} height={1920} fps={30} durationInFrames={150} defaultProps={{ keyword: "PEPINILLO", reply: "¡Aquí lo tienes: el pepinillo por dentro!", lang: "es" as const, channel: "nebuu3d" }} />

    {/* Miniaturas y paneles comparativos (10 portadas en shot.png + exportación individual) */}
    <Composition id="ThumbnailSheet" component={ThumbnailSheet} width={5616} height={3948} fps={30} durationInFrames={1} defaultProps={{ hooks: [], cardWidth: 1080, cardHeight: 1920 }} />
    <Composition id="ThumbnailSheet16x9" component={ThumbnailSheet} width={6616} height={1548} fps={30} durationInFrames={1} defaultProps={{ hooks: [], cardWidth: 1280, cardHeight: 720 }} />
    <Composition id="ThumbSingle" component={ThumbCard} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{ spec: {} as any, width: 1080, height: 1920 }} />
    <Composition id="ThumbSingle16x9" component={ThumbCard} width={1280} height={720} fps={30} durationInFrames={1} defaultProps={{ spec: {} as any, width: 1280, height: 720 }} />
  </>
);