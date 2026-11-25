// Model sheet for the meme-fusion characters, on white like ref/personajes_meme.jpg.
// Render: npx remotion still src/index.ts CastSheet out/stills/cast.png --props='{"sheet":"cast"}'
//   sheets: "cast" (outfits + props, mirrors reference cells), "faces" (every Expression), "poses" (arms/walk/talk)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { drawToon, EXPRESSIONS, ToonPose, ToonSpec } from "./draw";

type Cell = { spec: ToonSpec; pose?: Omit<ToonPose, "t">; label: string };
const W = "#f4f4f2";

// Reusable meme-style cast (copy any of these into an episode's cast.ts).
export const MEME_CAST: Record<string, ToonSpec> = {
  inspector: { hat: "hardhat", goggles: true, outfit: "labcoat", coat: W, tie: "#2f4e8a", face: "neutral" },
  troll: { hat: "none", outfit: "labcoat", coat: W, tie: "#c0392b", face: "troll" },
  scientist: { hat: "none", hair: "#6b4426", hairline: "mop", outfit: "labcoat", coat: W, tie: "#c0392b", face: "happy" },
  mechanic: { hat: "cap", outfit: "plaid", coat: "#4f8a3c", plaid: "#2c4a22", face: "neutral", toolbelt: true },
  foreman: { hat: "hardhat", outfit: "hivis", coat: "#b8392f", plaid: "#5a1a14", face: "neutral" },
  safety: { hat: "hardhat", goggles: true, outfit: "hivis", coat: "#b8392f", plaid: "#5a1a14", face: "smirk" },
  welder: { hat: "none", hair: "#6b4426", goggles: true, outfit: "polo", coat: "#8a6a4a", badge: "#8a6a4a", toolbelt: true, face: "happy" },
  rager: { hat: "none", outfit: "overalls", coat: "#6b5d50", plaid: "#3a302a", face: "rage" },
  visor: { hat: "visor", hair: "#6b4426", outfit: "plaid", coat: "#3f6fae", plaid: "#1f3a66", face: "poker" },
  skeptic: { hat: "none", outfit: "labcoat", coat: W, tie: "#4f6b3a", face: "skeptical" },
  lol: { hat: "none", outfit: "overalls", coat: "#6b5d50", plaid: "#3a302a", face: "lol" },
  radio: { hat: "none", outfit: "plaid", coat: "#b8392f", plaid: "#5a1a14", face: "derp" },
  tech: { hat: "none", hair: "#6b4426", headphones: true, outfit: "polo", coat: "#22345a", pants: "#22345a", face: "poker" },
  surveyor: { hat: "cap", goggles: true, outfit: "plaid", coat: "#4f7fc0", plaid: "#22406e", face: "neutral" },
};

const CAST: Cell[] = [
  { spec: MEME_CAST.inspector, label: "hardhat+goggles · labcoat · neutral" },
  { spec: MEME_CAST.troll, label: "labcoat · troll" },
  { spec: MEME_CAST.scientist, pose: { armR: "show", prop: "wrench" }, label: "mop hair · wrench · happy" },
  { spec: MEME_CAST.mechanic, pose: { armR: "show", prop: "gear" }, label: "cap · plaid · gear" },
  { spec: MEME_CAST.foreman, pose: { armR: "show", prop: "gear" }, label: "hardhat · hivis" },
  { spec: MEME_CAST.safety, label: "hardhat+goggles · hivis · smirk" },
  { spec: MEME_CAST.welder, pose: { armR: "show", prop: "wrench" }, label: "goggles · polo · toolbelt" },
  { spec: MEME_CAST.rager, pose: { armR: "show", prop: "blueprint" }, label: "overalls · blueprint · rage" },
  { spec: MEME_CAST.visor, label: "visor · plaid · poker" },
  { spec: MEME_CAST.skeptic, pose: { armR: "show", prop: "blueprint" }, label: "labcoat · skeptical" },
  { spec: MEME_CAST.lol, label: "overalls · lol" },
  { spec: MEME_CAST.radio, pose: { armR: "show", prop: "walkie" }, label: "plaid · walkie · derp" },
  { spec: MEME_CAST.tech, label: "headphones · polo · poker" },
  { spec: MEME_CAST.surveyor, pose: { armR: "hold", prop: "clipboard" }, label: "cap+goggles · clipboard" },
];

const FACES: Cell[] = EXPRESSIONS.map((e, i) => ({
  spec: { hat: "none", outfit: (["shirt", "plaid", "overalls", "hivis", "labcoat", "polo"] as const)[i % 6], coat: ["#c9b28a", "#4f8a3c", "#6b5d50", "#b8392f", W, "#22345a"][i % 6], tie: i % 6 === 4 ? "#c0392b" : undefined, face: e },
  label: e,
}));

const POSES: Cell[] = [
  { spec: MEME_CAST.inspector, pose: { armL: "hips", armR: "point" }, label: "hips + point" },
  { spec: MEME_CAST.foreman, pose: { armL: "wave", armR: "down", talk: true }, label: "wave + talk" },
  { spec: MEME_CAST.mechanic, pose: { armL: "up", armR: "up", face: "scream" }, label: "up · scream" },
  { spec: MEME_CAST.scientist, pose: { armL: "cross", armR: "cross", face: "suspicious" }, label: "cross · suspicious" },
  { spec: MEME_CAST.visor, pose: { walk: 1, face: "proud" }, label: "walk · proud" },
  { spec: MEME_CAST.tech, pose: { armL: "shrug", armR: "shrug", face: "high" }, label: "shrug · high" },
  { spec: { ...MEME_CAST.lol, face: "laugh" }, pose: { sit: true }, label: "sit · laugh" },
];

const ToonCell: React.FC<{ cell: Cell; t: number; w: number }> = ({ cell, t, w }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <canvas width={768} height={1024} style={{ width: w, height: (w * 1024) / 768 }}
      ref={(c) => { const g = c?.getContext("2d"); if (g) drawToon(g, cell.spec, { t, ...(cell.pose ?? {}) }); }} />
    <div style={{ font: "600 20px sans-serif", color: "#555", marginTop: -6 }}>{cell.label}</div>
  </div>
);

export const CastSheet: React.FC<{ sheet?: "cast" | "faces" | "poses" }> = ({ sheet = "cast" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const cells = sheet === "faces" ? FACES : sheet === "poses" ? POSES : CAST;
  const cols = 7, w = width / cols;
  return (
    <AbsoluteFill style={{ background: "#ffffff", display: "flex", flexWrap: "wrap", alignContent: "flex-start" }}>
      {cells.map((c, i) => <ToonCell key={i} cell={c} t={0.6 + frame / fps + i * 0.37} w={w} />)}
    </AbsoluteFill>
  );
};
