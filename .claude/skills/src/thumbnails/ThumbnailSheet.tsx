import React, { useLayoutEffect, useRef } from "react";
import { Img, staticFile } from "remotion";
import { PALETTES, ThumbHookSpec } from "./styles";
import { drawToon, ToonPose, ToonSpec } from "../engine/draw";

const POSES: Record<string, Omit<ToonPose, "t">> = {
  shocked: { eyes: "shock", mouth: "o", armL: "up", armR: "up" },
  pointing: { eyes: "wide", mouth: "grin", armL: "hips", armR: "point" },
  amazed: { eyes: "wide", mouth: "open", armL: "wave", armR: "hips" },
};

// The episode's drawn character, reacting (same drawToon as the video, so it matches every shot).
const ThumbToon: React.FC<{ spec: ToonSpec; pose: string; flip: boolean; w: number }> = ({ spec, pose, flip, w }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const g = ref.current?.getContext("2d");
    if (g) drawToon(g, spec, { t: 0.35, ...(POSES[pose] ?? POSES.amazed) });
  }, [spec, pose]);
  return (
    <canvas ref={ref} width={768} height={1024}
      style={{ width: w, height: (w * 1024) / 768, transform: flip ? "scaleX(-1)" : undefined,
        filter: `drop-shadow(0 ${w * 0.02}px ${w * 0.03}px rgba(0,0,0,0.45))` }} />
  );
};

export const ThumbCard: React.FC<{
  spec: ThumbHookSpec;
  width: number;
  height: number;
  showIndexBadge?: boolean;
}> = ({ spec, width, height, showIndexBadge = false }) => {
  const isCream = spec.theme === "cream";
  const pal = isCream ? PALETTES.cream : PALETTES.dark;
  const isVertical = height > width;
  const scale = width / (isVertical ? 1080 : 1280);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        background: pal.bg,
        fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${56 * scale}px ${48 * scale}px`,
        boxSizing: "border-box",
      }}
    >
      {/* Subtle Engineering Grid Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${pal.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${pal.gridColor} 1px, transparent 1px)`,
          backgroundSize: `${54 * scale}px ${54 * scale}px`,
          pointerEvents: "none",
        }}
      />

      {/* Index number badge for contact sheet selection */}
      {showIndexBadge && (
        <div
          style={{
            position: "absolute",
            top: 22 * scale,
            left: 22 * scale,
            background: "#F97316",
            color: "#FFFFFF",
            fontWeight: 900,
            fontSize: 34 * scale,
            padding: `${8 * scale}px ${20 * scale}px`,
            borderRadius: 14 * scale,
            zIndex: 30,
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          #{spec.index}
        </div>
      )}

      {/* Top Header & Headline Zone */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          gap: 14 * scale,
        }}
      >
        {spec.topPill && (
          <div
            style={{
              background: pal.pillDarkBg,
              color: pal.pillDarkText,
              border: isCream ? "none" : "1.5px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              padding: `${10 * scale}px ${26 * scale}px`,
              fontSize: 26 * scale,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 10 * scale,
            }}
          >
            {!isCream && (
              <span
                style={{
                  width: 14 * scale,
                  height: 14 * scale,
                  borderRadius: 4 * scale,
                  background: "#F97316",
                  display: "inline-block",
                }}
              />
            )}
            {spec.topPill}
          </div>
        )}

        {/* Main Hook Title */}
        <div
          style={{
            color: pal.ink,
            fontSize: (isVertical ? 82 : 66) * scale,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            maxWidth: "96%",
          }}
        >
          <div>{spec.headlineTop}</div>

          {spec.headlineSerif && (
            <div
              style={{
                display: "inline-block",
                marginTop: 8 * scale,
                padding: spec.highlightBox ? `${8 * scale}px ${26 * scale}px` : 0,
                background:
                  spec.highlightBox && isCream
                    ? "#F97316"
                    : spec.highlightBox && !isCream
                      ? "rgba(196, 245, 41, 0.08)"
                      : "transparent",
                border:
                  spec.highlightBox && !isCream
                    ? `${3 * scale}px solid #C4F529`
                    : "none",
                borderRadius: isCream ? 18 * scale : 0,
                position: "relative",
              }}
            >
              {/* CAD Corner Handles for Dark Mode */}
              {spec.highlightBox && !isCream && (
                <>
                  {[
                    { top: -7 * scale, left: -7 * scale },
                    { top: -7 * scale, right: -7 * scale },
                    { bottom: -7 * scale, left: -7 * scale },
                    { bottom: -7 * scale, right: -7 * scale },
                  ].map((pos, idx) => (
                    <span
                      key={idx}
                      style={{
                        position: "absolute",
                        width: 12 * scale,
                        height: 12 * scale,
                        background: "#C4F529",
                        ...pos,
                      }}
                    />
                  ))}
                </>
              )}

              <span
                style={{
                  fontFamily:
                    spec.highlightBox && isCream
                      ? "'Inter', sans-serif"
                      : "'Playfair Display', 'Georgia', serif",
                  fontStyle: spec.highlightBox && isCream ? "normal" : "italic",
                  fontWeight: spec.highlightBox && isCream ? 900 : 700,
                  color:
                    spec.highlightBox && isCream
                      ? "#FFFFFF"
                      : isCream
                        ? "#F97316"
                        : "#FFFFFF",
                }}
              >
                {spec.headlineSerif}
              </span>
            </div>
          )}

          {spec.headlineBottom && (
            <div style={{ marginTop: 6 * scale }}>{spec.headlineBottom}</div>
          )}
        </div>

        {/* Giant Outline / High-Contrast Metric */}
        {spec.bigMetric && (
          <div
            style={{
              fontSize: (isVertical ? 148 : 112) * scale,
              fontWeight: 900,
              lineHeight: 0.95,
              color: isCream ? "#F97316" : "#FFFFFF",
              WebkitTextStroke: isCream ? `${4 * scale}px #0D1321` : "none",
              textShadow: isCream
                ? `0 ${8 * scale}px 0 #0D1321`
                : `0 0 ${32 * scale}px rgba(249,115,22,0.45)`,
              marginTop: 6 * scale,
            }}
          >
            {spec.bigMetric}
          </div>
        )}
      </div>

      {/* Centerpiece 3D Render Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: isVertical ? "84%" : "58%",
          height: isVertical ? "44%" : "52%",
          borderRadius: 28 * scale,
          overflow: "hidden",
          border: `${4 * scale}px solid ${pal.cardBorder}`,
          boxShadow: isCream
            ? `0 ${18 * scale}px 0 #0D1321`
            : `0 ${20 * scale}px ${50 * scale}px rgba(0,0,0,0.65)`,
          background: pal.cardBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {spec.refImage && (
          <Img
            src={staticFile(spec.refImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Bold Diagonal Slash (YouTube-blocked style from reference) */}
        {spec.slashDiagonal && (
          <div
            style={{
              position: "absolute",
              width: "130%",
              height: 22 * scale,
              background: "#F97316",
              borderRadius: 999,
              transform: "rotate(-32deg)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            }}
          />
        )}

        {/* Tilted Rubber Stamp Overlay */}
        {spec.stampText && (
          <div
            style={{
              position: "absolute",
              transform: "rotate(-11deg)",
              border: `${6 * scale}px solid #EF4444`,
              color: "#EF4444",
              background: "rgba(11, 13, 18, 0.72)",
              padding: `${10 * scale}px ${28 * scale}px`,
              borderRadius: 12 * scale,
              fontSize: 54 * scale,
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {spec.stampText}
          </div>
        )}
      </div>

      {/* Reacting character + arrow (reference pattern: face + arrow + object) */}
      {spec.characterSpec && spec.characterPose && spec.characterPose !== "none" && (() => {
        const left = spec.characterSide === "left";
        const cw = (isVertical ? 760 : 470) * scale;
        return (
          <>
            <div style={{ position: "absolute", zIndex: 20, bottom: (isVertical ? -300 : -150) * scale,
              [left ? "left" : "right"]: (isVertical ? -170 : -60) * scale }}>
              {/* drawn facing right; flip when standing on the right so it faces the render */}
              <ThumbToon spec={spec.characterSpec} pose={spec.characterPose} flip={!left} w={cw} />
            </div>
            {spec.arrow && (
              <svg viewBox="0 0 200 200" style={{ position: "absolute", zIndex: 21,
                width: (isVertical ? 230 : 150) * scale, height: (isVertical ? 230 : 150) * scale,
                bottom: (isVertical ? 640 : 260) * scale, [left ? "left" : "right"]: (isVertical ? 330 : 340) * scale,
                transform: left ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 6px 0 #0D1321)" }}>
                <path d="M170 175 C 150 95, 110 60, 45 48" fill="none" stroke="#0D1321" strokeWidth="40" strokeLinecap="round" />
                <path d="M70 12 L 22 46 L 74 82 Z" fill="#0D1321" stroke="#0D1321" strokeWidth="26" strokeLinejoin="round" />
                <path d="M170 175 C 150 95, 110 60, 45 48" fill="none" stroke="#F97316" strokeWidth="26" strokeLinecap="round" />
                <path d="M70 12 L 22 46 L 74 82 Z" fill="#F97316" stroke="#F97316" strokeWidth="10" strokeLinejoin="round" />
              </svg>
            )}
          </>
        );
      })()}

      {/* Bottom Pill & Handwritten Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10 * scale,
        }}
      >
        {spec.bottomPill && (
          <div
            style={{
              background: "#F97316",
              color: "#FFFFFF",
              fontSize: 34 * scale,
              fontWeight: 900,
              padding: `${14 * scale}px ${36 * scale}px`,
              borderRadius: 999,
              transform: "rotate(-2deg)",
              boxShadow: isCream
                ? `0 ${6 * scale}px 0 #0D1321`
                : "0 10px 25px rgba(249,115,22,0.4)",
            }}
          >
            {spec.bottomPill}
          </div>
        )}

        {spec.footerHandwritten && (
          <div
            style={{
              color: "#EF4444",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 32 * scale,
              transform: "rotate(-2deg)",
            }}
          >
            {spec.footerHandwritten}
          </div>
        )}
      </div>
    </div>
  );
};

export const ThumbnailSheet: React.FC<{
  hooks: ThumbHookSpec[];
  cardWidth?: number;
  cardHeight?: number;
}> = ({ hooks, cardWidth = 1080, cardHeight = 1920 }) => {
  const gap = 36;
  return (
    <div
      style={{
        width: cardWidth * 5 + gap * 6,
        height: cardHeight * 2 + gap * 3,
        background: "#090B10",
        padding: gap,
        display: "grid",
        gridTemplateColumns: `repeat(5, ${cardWidth}px)`,
        gridTemplateRows: `repeat(2, ${cardHeight}px)`,
        gap,
        boxSizing: "border-box",
      }}
    >
      {hooks.slice(0, 10).map((hook) => (
        <ThumbCard
          key={hook.index}
          spec={hook}
          width={cardWidth}
          height={cardHeight}
          showIndexBadge
        />
      ))}
    </div>
  );
};