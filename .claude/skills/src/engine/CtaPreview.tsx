// Model sheet for the comment CTA: npx remotion still src/index.ts CtaPreview out/stills/cta.png --frame=40
import React from "react";
import { Stage } from "./Stage";
import { Box } from "./kit";
import { CommentCTA, type CtaLang } from "./CommentCTA";
import { studioLook } from "../ep7/world";

export const CtaPreview: React.FC<{ keyword?: string; reply?: string; lang?: CtaLang; channel?: string }> = ({
  keyword = "PEPINILLO", reply = "¡Aquí lo tienes: el pepinillo por dentro!", lang = "es", channel = "nebuu3d",
}) => (
  <Stage look={{ ...studioLook, aperture: 0.4 }} dur={150}
    cam={{ from: [0, 2.5, 6.4], to: [0, 2.45, 5.9], lookFrom: [0, 2.4, 0.8], lookTo: [0, 2.4, 0.8], fov: 40 }}>
    <Box size={[30, 0.4, 30]} pos={[0, -0.2, 0]} color="#4a3a30" rough={0.85} bevel={false} />
    <Box size={[30, 16, 0.4]} pos={[0, 8, -5]} color="#3b3036" rough={0.9} bevel={false} />
    <Box size={[2.6, 0.9, 1.4]} pos={[0, 0.45, 0.8]} color="#5a4030" rough={0.7} />
    <CommentCTA keyword={keyword} reply={reply} lang={lang} channel={channel} position={[0, 2.08, 0.8]} />
  </Stage>
);
