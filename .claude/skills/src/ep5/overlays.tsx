import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });

export const CommentBubble: React.FC<{ text?: string }> = ({ text = "¿Pero qué tiene que ver una bola colgando con que no se caiga un edificio? 😂" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;
  const k = interpolate(t, [0, 0.22, 0.36], [0.6, 1.08, 1], { extrapolateRight: "clamp" });
  const scale = Math.min(width, 1920) / 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "18%", left: "6%", right: "6%",
        display: "flex", justifyContent: "center",
        transform: `translateY(-50%) scale(${k})`,
      }}>
        <div style={{
          position: "relative", maxWidth: 880 * scale, padding: `${26 * scale}px ${34 * scale}px`,
          background: "#fffdf6", border: `${8 * scale}px solid #173846`, borderRadius: 34 * scale,
          boxShadow: `0 ${14 * scale}px ${30 * scale}px rgba(12,24,36,0.32)`,
          fontFamily, fontWeight: 800, fontSize: 44 * scale, lineHeight: 1.18,
          color: "#173846", textAlign: "center",
        }}>
          {text}
          <div style={{
            position: "absolute", bottom: -26 * scale, left: "50%", marginLeft: -22 * scale,
            width: 0, height: 0, borderLeft: `${24 * scale}px solid transparent`,
            borderRight: `${24 * scale}px solid transparent`, borderTop: `${26 * scale}px solid #173846`,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
