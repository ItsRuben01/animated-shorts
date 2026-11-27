// ep8 — "why the last 20 % charges slowly". One world: your phone, and the battery inside it drawn as a parking
// garage for lithium ions. In-world labels are numbers/symbols only (Li⁺, %, V), so ES and EN can share it.
import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX } from "../engine/Stage";
import { Card } from "../ep6/sets";

export { Card };

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const CYAN = "#5fe3ff";
export const GOLD = "#f2c14e";
export const CORAL = "#e0705a";

// ---------- floor of the tech world ----------
export const TechFloor: React.FC<{ y?: number }> = ({ y = -0.2 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, y, 0]} map={painted("#1f2550", [12, 12], 500)} rough={0.7} bevel={false} />
    {/* faint grid lines like a circuit board */}
    {Array.from({ length: 13 }).map((_, i) => (
      <mesh key={"x" + i} position={[-12 + i * 2, y + 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]} layers={LAYER_FX}>
        <planeGeometry args={[0.03, 40]} />
        <meshBasicMaterial color="#4a5ad8" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    ))}
    {Array.from({ length: 13 }).map((_, i) => (
      <mesh key={"z" + i} position={[0, y + 0.205, -12 + i * 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} layers={LAYER_FX}>
        <planeGeometry args={[0.03, 40]} />
        <meshBasicMaterial color="#4a5ad8" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    ))}
  </group>
);

// ---------- phone ----------
// Standing phone, centre at pos, 3 × 6.2 units. `charge` 0..1 fills the battery bar on the screen.
export const Phone: React.FC<{ pos?: V3; rot?: V3; charge?: N; scale?: number; glow?: string }> = ({ pos = [0, 3.3, 0], rot = [0, 0, 0], charge = 0, scale = 1, glow }) => {
  const t = useT();
  const c = clamp(num(charge, t));
  const barW = 2.0;
  const barColor = glow ?? (c >= 0.995 ? "#ff8a5c" : c > 0.79 ? GOLD : "#6dfc9b");
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <Box size={[3.0, 6.2, 0.34]} color="#14161d" rough={0.35} ink />
      <Box size={[2.78, 5.98, 0.02]} pos={[0, 0, 0.18]} color="#0b1028" emissive="#1b2a6b" emissiveIntensity={0.55} rough={0.2} shadow={false} />
      {/* dynamic island */}
      <Box size={[0.8, 0.22, 0.02]} pos={[0, 2.7, 0.2]} color="#05060a" rough={0.3} shadow={false} />
      {/* battery icon */}
      <group position={[0, 0.6, 0.21]}>
        <Box size={[barW + 0.16, 1.06, 0.02]} color="#d9def5" emissive="#d9def5" emissiveIntensity={0.4} shadow={false} bevel={false} />
        <Box size={[barW + 0.02, 0.92, 0.025]} pos={[0, 0, 0.005]} color="#0b1028" shadow={false} bevel={false} />
        <Box size={[0.12, 0.42, 0.02]} pos={[barW / 2 + 0.15, 0, 0]} color="#d9def5" shadow={false} bevel={false} />
        {c > 0.005 ? (
          <mesh position={[-barW / 2 + (barW * c) / 2, 0, 0.02]} layers={LAYER_FX}>
            <planeGeometry args={[barW * c, 0.8]} />
            <meshBasicMaterial color={barColor} toneMapped={false} />
          </mesh>
        ) : null}
      </group>
      {/* USB-C port */}
      <Box size={[0.5, 0.12, 0.16]} pos={[0, -3.1, 0]} color="#05060a" rough={0.4} shadow={false} bevel={false} />
    </group>
  );
};

// ---------- USB-C plug sliding into the phone's port (phone at its default pos) ----------
export const Plug: React.FC<{ insert: N; phonePos?: V3 }> = ({ insert, phonePos = [0, 3.3, 0] }) => {
  const t = useT();
  const k = clamp(num(insert, t));
  const y = phonePos[1] - 3.1 - 0.42 - (1 - k) * 1.6;
  return (
    <group position={[phonePos[0], y, phonePos[2]]}>
      <Box size={[0.42, 0.5, 0.13]} pos={[0, 0.2, 0]} color="#cfd6e4" rough={0.25} ink />
      <Box size={[0.62, 0.9, 0.36]} pos={[0, -0.45, 0]} color="#eef0f6" rough={0.5} ink />
      <Cyl r={0.12} h={8} pos={[0, -4.9, 0]} color="#eef0f6" rough={0.6} />
    </group>
  );
};

// little starburst + light when the plug connects
export const Spark: React.FC<{ pos: V3; at: number; scale?: number }> = ({ pos, at, scale = 1 }) => {
  const t = useT();
  const k = t - at;
  if (k < 0 || k > 0.5) return null;
  const s = (1 - k / 0.5) * scale;
  return (
    <group position={pos} layers={LAYER_FX}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[0, 0, i * 1.05 + k * 3]} scale={[s, s * 0.14, 1]} layers={LAYER_FX}>
          <boxGeometry args={[1.2 + (i % 2) * 0.6, 0.1, 0.05]} />
          <meshBasicMaterial color={i % 2 ? "#fff2a8" : CYAN} toneMapped={false} fog={false} />
        </mesh>
      ))}
      <pointLight color={CYAN} intensity={12 * s} distance={6} decay={1.6} />
    </group>
  );
};

// ---------- the battery as a parking garage ----------
// Cathode block on the left (ions waiting), separator in the middle, graphite "floors" on the right.
// `fill` 0..1 = state of charge. `plating` 0..1 grows silver lithium metal on the entrance of the graphite.
const LAYERS = 8, SLOTS = 6, N_IONS = LAYERS * SLOTS;
const GX0 = 0.15, GX1 = 2.55;          // graphite x range
const Y0 = 0.5, DY = 0.6;              // first gap height and floor spacing
const CX = -1.5;                       // cathode centre x
const slotPos = (i: number): V3 => {
  // fill deepest columns first, so the entrance fills last (the queue forms there)
  const col = Math.floor(i / LAYERS), layer = i % LAYERS;
  const x = GX1 - 0.2 - col * ((GX1 - GX0 - 0.35) / (SLOTS - 1));
  return [x, Y0 + layer * DY + DY / 2, 0];
};
const homePos = (i: number): V3 => {
  const col = i % 4, row = Math.floor(i / 4);
  return [CX - 0.5 + col * 0.33, 0.5 + row * 0.38, 0.15 * ((i * 7) % 3 - 1)];
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const BatteryPark: React.FC<{ fill: N; plating?: N; queue?: boolean; labels?: boolean }> = ({ fill, plating = 0, queue = false, labels = true }) => {
  const t = useT();
  const f = clamp(num(fill, t));
  const pl = clamp(num(plating, t));
  const c = f * N_IONS;
  const ions = useMemo(() => Array.from({ length: N_IONS }, (_, i) => i), []);
  const topY = Y0 + LAYERS * DY;
  return (
    <group>
      {/* casing (back wall + base) */}
      <Box size={[5.6, 0.25, 1.8]} pos={[0.2, 0.12, 0]} color="#2b3170" rough={0.6} />
      <Box size={[5.6, topY + 0.4, 0.15]} pos={[0.2, (topY + 0.4) / 2, -0.85]} color="#262b62" rough={0.8} bevel={false} />
      {/* cathode block, translucent coral */}
      <mesh position={[CX, (topY + 0.2) / 2 + 0.15, 0]}>
        <boxGeometry args={[1.5, topY + 0.2, 1.4]} />
        <meshPhysicalMaterial color={CORAL} transparent opacity={0.28} roughness={0.3} depthWrite={false} />
      </mesh>
      {/* separator */}
      <mesh position={[-0.45, (topY + 0.2) / 2 + 0.15, 0]} layers={LAYER_FX}>
        <planeGeometry args={[0.02, topY + 0.2]} />
        <meshBasicMaterial color="#9fb6ff" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.45, (topY + 0.2) / 2 + 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, topY + 0.2]} />
        <meshBasicMaterial color="#9fb6ff" transparent opacity={0.12} depthWrite={false} side={2} />
      </mesh>
      {/* graphite floors */}
      {Array.from({ length: LAYERS + 1 }).map((_, l) => (
        <Box key={l} size={[GX1 - GX0, 0.09, 1.3]} pos={[(GX0 + GX1) / 2, Y0 + l * DY, 0]} color="#3a3f52" rough={0.45} ink />
      ))}
      <Box size={[0.12, topY - Y0 + 0.1, 1.3]} pos={[GX1 + 0.06, (Y0 + topY) / 2, 0]} color="#3a3f52" rough={0.45} />
      {/* parking lines on each floor */}
      {Array.from({ length: LAYERS }).map((_, l) =>
        Array.from({ length: SLOTS + 1 }).map((__, s) => (
          <mesh key={l + "-" + s} position={[GX1 - 0.2 - (s - 0.5) * ((GX1 - GX0 - 0.35) / (SLOTS - 1)), Y0 + l * DY + 0.05, 0.25]} rotation={[-Math.PI / 2, 0, 0]} layers={LAYER_FX}>
            <planeGeometry args={[0.025, 0.5]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.55} toneMapped={false} />
          </mesh>
        ))
      )}
      {/* ions: wait in the cathode, fly across, park. ~6 in flight at once. */}
      {ions.map((i) => {
        const p = clamp((c - i) / 6 + 0.0);
        const h = homePos(i), s = slotPos(i);
        let pos: V3;
        if (p <= 0) pos = h;
        else {
          // 0..0.6: cross to the entrance; 0.6..1: drive into the slot
          const entry: V3 = [GX0 - 0.15, s[1], 0];
          if (p < 0.6) { const k = p / 0.6; pos = [lerp(h[0], entry[0], k), lerp(h[1], entry[1], k) + Math.sin(k * Math.PI) * 0.35, lerp(h[2], 0, k)]; }
          else { const k = (p - 0.6) / 0.4; pos = [lerp(entry[0], s[0], k * k * (3 - 2 * k)), s[1], 0]; }
        }
        // queue: when nearly full, ions in flight bunch up at the entrance
        if (queue && p > 0.3 && p < 1) pos = [GX0 - 0.25 - ((i * 13) % 5) * 0.12, pos[1], ((i * 5) % 3 - 1) * 0.25];
        const parked = p >= 1;
        return (
          <mesh key={i} position={pos} layers={LAYER_FX}>
            <sphereGeometry args={[0.12, 16, 12]} />
            <meshBasicMaterial color={parked ? "#9ff0ff" : CYAN} toneMapped={false} />
          </mesh>
        );
      })}
      {/* lithium plating: silver crust on the entrance of each floor */}
      {pl > 0 ? Array.from({ length: LAYERS * 4 }).map((_, j) => {
        const l = j % LAYERS, k = Math.floor(j / LAYERS);
        const g = clamp(pl * 1.4 - k * 0.22);
        if (g <= 0) return null;
        return (
          <mesh key={"pl" + j} position={[GX0 - 0.05 - k * 0.06, Y0 + l * DY + 0.12 + (k % 2) * 0.12, ((j * 7) % 5 - 2) * 0.22]} scale={[g, g, g]}>
            <dodecahedronGeometry args={[0.17 + (j % 3) * 0.05, 0]} />
            <meshStandardMaterial color="#e8edf5" metalness={0.35} roughness={0.3} emissive="#8f9ab2" emissiveIntensity={0.35} />
          </mesh>
        );
      }) : null}
      {labels ? (
        <>
          <Card pos={[CX, topY + 0.75, 0.2]} lines={["Li⁺"]} w={1.0} h={0.5} bg="#4a2430" fg="#ffe6ad" />
          <Card pos={[(GX0 + GX1) / 2, topY + 0.75, 0.2]} lines={["C₆"]} w={1.0} h={0.5} bg="#12384a" fg="#ffe6ad" />
        </>
      ) : null}
      <ContactShadow pos={[0.2, 0.01, 0]} size={6.5} opacity={0.5} />
    </group>
  );
};

// ---------- bedroom at night ----------
export const Bedroom: React.FC = () => (
  <group>
    <Box size={[40, 0.4, 40]} pos={[0, -0.2, 0]} map={painted("#3b3570", [8, 8], 600)} rough={0.9} bevel={false} />
    <Box size={[40, 14, 0.4]} pos={[0, 7, -4]} map={painted("#2d3068", [6, 2], 600)} rough={0.95} bevel={false} />
    {/* window with the moon */}
    <Box size={[3.6, 3.0, 0.2]} pos={[2.8, 4.6, -3.75]} color="#0f1640" emissive="#1c2a7a" emissiveIntensity={0.6} rough={0.3} />
    <mesh position={[3.4, 5.2, -3.6]} layers={LAYER_FX}>
      <circleGeometry args={[0.45, 40]} />
      <meshBasicMaterial color="#fff3cf" toneMapped={false} />
    </mesh>
    <Box size={[3.8, 0.14, 0.3]} pos={[2.8, 3.05, -3.6]} color="#c9b48a" rough={0.6} />
    {/* nightstand */}
    <Box size={[3.4, 2.0, 2.2]} pos={[0, 1.0, 0]} color="#7a5233" rough={0.7} ink />
    <Box size={[3.6, 0.16, 2.4]} pos={[0, 2.08, 0]} color="#8a6040" rough={0.6} />
    <Box size={[1.2, 0.12, 0.08]} pos={[0, 1.3, 1.12]} color="#d9a23f" rough={0.4} />
    {/* lamp */}
    <Cyl r={0.35} h={0.15} pos={[-1.2, 2.24, -0.5]} color="#d8cbb0" />
    <Cyl r={0.05} h={1.0} pos={[-1.2, 2.8, -0.5]} color="#d8cbb0" />
    <Cyl r={0.35} r2={0.6} h={0.6} pos={[-1.2, 3.45, -0.5]} color="#ffe2b0" emissive="#ffcf80" emissiveIntensity={0.5} />
    <pointLight position={[-1.2, 3.3, -0.2]} color="#ffc98a" intensity={6} distance={7} decay={1.6} />
  </group>
);
