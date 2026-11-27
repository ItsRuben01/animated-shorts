import React from "react";
import { Composition } from "remotion";
import { Episode, ShotStill, totalFrames } from "./ep5/Episode";
import { Episode as PreviousEpisode, ShotStill as PreviousShotStill, totalFrames as previousFrames } from "./ep4/Episode";
import { LongEpisode, longFrames } from "./ep4/Long";
import { EpisodeEN, EpisodeES, ShotStillEN, ShotStillES, totalFrames as ep6Frames } from "./ep6/Episode";
import { LongEN, LongES, LongShotStillEN, LongShotStillES, longFrames as ep6LongFrames } from "./ep6/Long";
import { Ep7EN, Ep7ES, Ep7ShotEN, Ep7ShotES, totalFrames as ep7Frames } from "./ep7/Episode";
import { Ep8EN, Ep8ES, Ep8ShotEN, Ep8ShotES, totalFrames as ep8Frames } from "./ep8/Episode";
import { Ep9EN, Ep9ES, Ep9ShotEN, Ep9ShotES, totalFrames as ep9Frames } from "./ep9/Episode";
import { Ep10EN, Ep10ES, Ep10ShotEN, Ep10ShotES, totalFrames as ep10Frames } from "./ep10/Episode";
import { Ep11EN, Ep11ES, Ep11ShotEN, Ep11ShotES, totalFrames as ep11Frames } from "./ep11/Episode";
import { Ep12EN, Ep12ES, Ep12ShotEN, Ep12ShotES, totalFrames as ep12Frames } from "./ep12/Episode";
import { Ep13EN, Ep13ES, Ep13ShotEN, Ep13ShotES, totalFrames as ep13Frames } from "./ep13/Episode";
import { Ep14EN, Ep14ES, Ep14ShotEN, Ep14ShotES, totalFrames as ep14Frames } from "./ep14/Episode";
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

    {/* ep8 — la salchicha desnuda (Short bilingüe) */}
    <Composition id="Ep8Short-ES" component={Ep8ES} width={1080} height={1920} fps={30} durationInFrames={ep8Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep8Short-EN" component={Ep8EN} width={1080} height={1920} fps={30} durationInFrames={ep8Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep8Shot-ES" component={Ep8ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep8Shot-EN" component={Ep8ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep9 — bolas de acero (Short bilingüe) */}
    <Composition id="Ep9Short-ES" component={Ep9ES} width={1080} height={1920} fps={30} durationInFrames={ep9Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep9Short-EN" component={Ep9EN} width={1080} height={1920} fps={30} durationInFrames={ep9Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep9Shot-ES" component={Ep9ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep9Shot-EN" component={Ep9ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep10 — el chicle (Short bilingüe) */}
    <Composition id="Ep10Short-ES" component={Ep10ES} width={1080} height={1920} fps={30} durationInFrames={ep10Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep10Short-EN" component={Ep10EN} width={1080} height={1920} fps={30} durationInFrames={ep10Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep10Shot-ES" component={Ep10ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep10Shot-EN" component={Ep10ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep11 — ruedas de avión con nitrógeno (Short bilingüe) */}
    <Composition id="Ep11Short-ES" component={Ep11ES} width={1080} height={1920} fps={30} durationInFrames={ep11Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep11Short-EN" component={Ep11EN} width={1080} height={1920} fps={30} durationInFrames={ep11Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep11Shot-ES" component={Ep11ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep11Shot-EN" component={Ep11ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep12 — tornillos: rosca laminada (Short bilingüe) */}
    <Composition id="Ep12Short-ES" component={Ep12ES} width={1080} height={1920} fps={30} durationInFrames={ep12Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep12Short-EN" component={Ep12EN} width={1080} height={1920} fps={30} durationInFrames={ep12Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep12Shot-ES" component={Ep12ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep12Shot-EN" component={Ep12ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep13 — plátanos y etileno (Short bilingüe) */}
    <Composition id="Ep13Short-ES" component={Ep13ES} width={1080} height={1920} fps={30} durationInFrames={ep13Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep13Short-EN" component={Ep13EN} width={1080} height={1920} fps={30} durationInFrames={ep13Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep13Shot-ES" component={Ep13ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep13Shot-EN" component={Ep13ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

    {/* ep14 — latas de refresco (Short bilingüe) */}
    <Composition id="Ep14Short-ES" component={Ep14ES} width={1080} height={1920} fps={30} durationInFrames={ep14Frames(30, "es")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep14Short-EN" component={Ep14EN} width={1080} height={1920} fps={30} durationInFrames={ep14Frames(30, "en")} defaultProps={{ captions: true, music: true }} />
    <Composition id="Ep14Shot-ES" component={Ep14ShotES} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    <Composition id="Ep14Shot-EN" component={Ep14ShotEN} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />

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