import React from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Cyl } from "../engine/kit";
import type { V3 } from "../engine/Stage";
import { LAYER_FX } from "../engine/Stage";

const labelCache = new Map<string, THREE.CanvasTexture>();
const labelTex = (lines: string[], bg: string, fg: string, ratio: number) => {
  const key = `${bg}|${fg}|${ratio.toFixed(2)}|${lines.join("\n")}`;
  const cached = labelCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = Math.max(150, Math.min(620, Math.round(1024 * ratio)));
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  const r = Math.min(36, c.height / 5);
  g.beginPath();
  g.moveTo(r, 0); g.lineTo(c.width - r, 0); g.quadraticCurveTo(c.width, 0, c.width, r);
  g.lineTo(c.width, c.height - r); g.quadraticCurveTo(c.width, c.height, c.width - r, c.height);
  g.lineTo(r, c.height); g.quadraticCurveTo(0, c.height, 0, c.height - r);
  g.lineTo(0, r); g.quadraticCurveTo(0, 0, r, 0); g.closePath(); g.fill();
  g.strokeStyle = fg; g.lineWidth = 10; g.stroke();
  let fs = Math.max(34, Math.min(118, Math.round(((c.height - 60) / lines.length) * 0.78)));
  const font = () => { g.font = `900 ${fs}px "Trebuchet MS", "Segoe UI", Arial, sans-serif`; };
  font();
  while (fs > 26 && lines.some((l) => g.measureText(l).width > c.width - 110)) { fs -= 4; font(); }
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = fg;
  lines.forEach((l, i) => g.fillText(l, c.width / 2, ((i + 0.5) * c.height) / lines.length, c.width - 100));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  labelCache.set(key, t);
  return t;
};

export const Card: React.FC<{ pos?: V3; lines: string[]; w?: number; h?: number; bg?: string; fg?: string; rot?: V3 }> = ({
  pos = [0, 5.4, 1.5], lines, w = 5.4, h = 1.5, bg = "#12384a", fg = "#ffe6ad", rot,
}) => (
  <group position={pos} rotation={rot}>
    <Box size={[w + 0.22, h + 0.22, 0.14]} color="#d9a23f" rough={0.55} shadow={false} />
    <Box size={[w, h, 0.08]} pos={[0, 0, 0.11]} map={labelTex(lines, bg, fg, h / w)} shadow={false} />
  </group>
);

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const num = (v: number | ((t: number) => number), t: number) => (typeof v === "function" ? v(t) : v);

const Spark: React.FC<{ pos: V3; on: boolean }> = ({ pos, on }) => {
  const frame = useCurrentFrame();
  if (!on) return null;
  return (
    <group position={pos} layers={LAYER_FX}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, 0, i * 0.9 + frame * 0.06]} scale={[1, 0.16, 1]}>
          <boxGeometry args={[0.9 + (i % 2) * 0.5, 0.08, 0.08]} />
          <meshBasicMaterial color={i % 2 ? "#fff2a8" : "#ff9a2a"} fog={false} toneMapped={false} />
        </mesh>
      ))}
      <pointLight color="#ffb347" intensity={7} distance={9} decay={1.6} />
    </group>
  );
};

const Pores: React.FC<{ count?: number; pos?: V3; spread?: number }> = ({ count = 7, pos = [0, 1.9, 1.25], spread = 1.5 }) => (
  <group position={pos}>
    {Array.from({ length: count }).map((_, i) => (
      <mesh key={i} position={[((i * 37) % 13) / 13 * spread - spread / 2, ((i * 53) % 11) / 11 * 2.6 - 1.3, ((i * 17) % 7) / 7 * 0.3]}>
        <sphereGeometry args={[0.12 + (i % 3) * 0.045, 14, 12]} />
        <meshStandardMaterial color="#152239" roughness={1} />
      </mesh>
    ))}
  </group>
);

const Filament: React.FC<{ growth: number; from: number; to: number; y?: number; z?: number; color?: string; r?: number; glow?: boolean }> = ({
  growth, from, to, y = 1.9, z = 0.45, color = "#e8584f", r = 0.11, glow = false,
}) => {
  const segments = 12;
  const g = Math.max(0, Math.min(1, growth)) * segments;
  const len = Math.abs(to - from) / segments;
  return (
    <group>
      {Array.from({ length: segments }).map((_, i) => {
        const k = Math.min(1, g - i);
        if (k <= 0) return null;
        const x = from + (to - from) * ((i + 0.5) / segments);
        const yy = y + Math.sin(i * 1.7) * 0.16;
        return (
          <Cyl key={i} r={r * (1 - i * 0.035)} h={len * 1.25 * k} pos={[x, yy, z + Math.sin(i * 1.1) * 0.12]}
            rot={[0, 0, Math.PI / 2 + Math.sin(i * 1.3) * 0.16]} color={color} rough={0.35}
            emissive={glow ? color : undefined} emissiveIntensity={glow ? 0.55 : 0} />
        );
      })}
    </group>
  );
};

const Pressure: React.FC<{ on: boolean }> = ({ on }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.18) * 0.04;
  if (!on) return null;
  return (
    <group scale={[1, pulse, 1]}>
      <Box size={[6.2, 0.34, 3.0]} pos={[0, 4.65, 0]} color="#d9a23f" rough={0.4} />
      <Box size={[6.2, 0.34, 3.0]} pos={[0, -0.72, 0]} color="#d9a23f" rough={0.4} />
      {[-2.2, 0, 2.2].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x, 4.24, 1.6]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.24, 0.55, 12]} />
            <meshStandardMaterial color="#ffd36a" emissive="#d9a23f" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[x, -0.31, 1.6]}>
            <coneGeometry args={[0.24, 0.55, 12]} />
            <meshStandardMaterial color="#ffd36a" emissive="#d9a23f" emissiveIntensity={0.4} />
          </mesh>
        </React.Fragment>
      ))}
      <Card pos={[0, 5.6, 1.5]} lines={["600 MPa"]} w={3.4} h={0.9} bg="#4a2430" fg="#ffe6ad" />
    </group>
  );
};

export type CellProps = {
  growth?: number | ((t: number) => number);
  crack?: number | ((t: number) => number);
  pressure?: boolean;
  pores?: boolean;
  voids?: boolean;
  flat?: boolean;
  short?: boolean;
  labels?: boolean;
  bench?: boolean;
};

export const Cell: React.FC<CellProps> = ({ growth = 0, crack = 0, pressure = false, pores = false, voids = false, flat = false, short = false, labels = false, bench = true }) => {
  const t = useT();
  const g = num(growth, t);
  const c = num(crack, t);
  return (
    <group>
      {bench ? (
        <>
          <Box size={[10, 0.4, 5]} pos={[0, -1.05, 0]} color="#30445f" rough={0.8} />
          <Box size={[10, 0.16, 0.5]} pos={[0, -0.78, 2.3]} color="#d9a23f" rough={0.5} />
        </>
      ) : null}
      <Box size={[6.1, 3.9, 0.12]} pos={[0, 1.9, -1.55]} color="#14243b" rough={0.65} />
      <Box size={[6.8, 0.38, 3.0]} pos={[0, 4.38, 0]} color="#c94b4b" rough={0.55} />
      <Box size={[6.8, 0.38, 3.0]} pos={[0, -0.58, 0]} color="#c94b4b" rough={0.55} />
      <Box size={[0.38, 4.55, 3.0]} pos={[-3.21, 1.9, 0]} color="#c94b4b" rough={0.55} />
      <Box size={[0.38, 4.55, 3.0]} pos={[3.21, 1.9, 0]} color="#c94b4b" rough={0.55} />
      <Box size={[6.2, 0.12, 3.08]} pos={[0, 3.92, 0]} color="#14243b" rough={0.65} />
      <Box size={[6.2, 0.12, 3.08]} pos={[0, -0.12, 0]} color="#14243b" rough={0.65} />
      <Box size={[1.55, 3.85, 2.85]} pos={[-2.18, 1.9, 0]} color="#4c5f95" rough={0.55} />
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.75, 3.85, 2.86]} />
        <meshStandardMaterial color="#bfe4ff" emissive="#2a6a8f" emissiveIntensity={0.18} transparent opacity={0.56} roughness={0.28} />
      </mesh>
      <Box size={[1.5, 3.85, 2.85]} pos={[2.18, 1.9, 0]} color="#d7dce8" rough={0.28} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Box key={i} size={[2.5, 0.055, 0.055]} pos={[0, 0.5 + i * 0.38, 1.44]} color="#6fa8c8" rough={0.4} shadow={false} />
      ))}
      {pores || voids ? <Pores count={voids ? 11 : 6} pos={[0.4, 1.9, 1.5]} spread={voids ? 2.2 : 1.35} /> : null}
      {g > 0 ? <Filament growth={g} from={1.55} to={-2.1} y={1.75} z={1.55} glow={short} /> : null}
      {c > 0 ? <Filament growth={c} from={1.5} to={-2.35} y={2.1} z={1.58} color="#1a2744" r={0.17} /> : null}
      {flat ? (
        <>
          <Box size={[0.18, 3.5, 0.14]} pos={[1.38, 1.9, 1.52]} color="#f4f7ff" rough={0.22} />
          <Box size={[0.1, 3.5, 0.14]} pos={[1.27, 1.9, 1.52]} color="#9fb9d8" rough={0.4} />
        </>
      ) : null}
      <Pressure on={pressure} />
      {short ? <Spark pos={[-2.15, 2.0, 1.35]} on /> : null}
      {labels ? (
        <>
          <Card pos={[-2.2, 5.7, 1.5]} lines={["372 mAh/g"]} w={3.5} h={0.92} bg="#23345e" fg="#dbe7ff" />
          <Card pos={[2.2, 5.7, 1.5]} lines={["3860 mAh/g"]} w={3.5} h={0.92} bg="#23345e" fg="#dbe7ff" />
          <Card pos={[0, 0.0, 1.6]} lines={["10×"]} w={1.9} h={0.8} bg="#4a2430" fg="#ffe6ad" />
        </>
      ) : null}
    </group>
  );
};

export type MicroProps = { growth?: number | ((t: number) => number); crack?: number | ((t: number) => number); pore?: boolean; pressure?: boolean; short?: boolean };

export const Micro: React.FC<MicroProps> = ({ growth = 0, crack = 0, pore = true, pressure = false, short = false }) => {
  const t = useT();
  const g = num(growth, t);
  const c = num(crack, t);
  return (
    <group>
      <Box size={[10, 5.6, 2.4]} pos={[0, 0, -0.4]} color="#bfe4ff" rough={0.3} />
      {Array.from({ length: 36 }).map((_, i) => (
        <mesh key={i} position={[-4.5 + (i % 9) * 1.12, -1.9 + Math.floor(i / 9) * 1.15, 0.83]} castShadow={false}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#5e96b9" roughness={0.5} />
        </mesh>
      ))}
      {pore ? (
        <mesh position={[1.1, 0.1, 0.95]}>
          <sphereGeometry args={[0.78, 24, 18]} />
          <meshStandardMaterial color="#111d33" roughness={1} />
        </mesh>
      ) : null}
      {g > 0 ? <Filament growth={g} from={4.6} to={1.1} y={0.1} z={0.95} color="#e8584f" r={0.18} glow={short} /> : null}
      {c > 0 ? <Filament growth={c} from={1.1} to={-4.4} y={0.1} z={0.95} color="#1b2742" r={0.24} /> : null}
      {short ? <Spark pos={[-4.1, 0.1, 1.5]} on /> : null}
      {pressure ? <Card pos={[2.7, 2.9, 1]} lines={["600 MPa"]} w={3.3} h={0.9} bg="#4a2430" fg="#ffe6ad" /> : null}
    </group>
  );
};

export const Knife: React.FC = () => (
  <group rotation={[0, -0.3, 0.12]}>
    <Box size={[2.7, 0.14, 0.5]} pos={[0.7, 1.55, 0]} color="#e8eef8" rough={0.25} />
    <Box size={[1.15, 0.32, 0.42]} pos={[-1.05, 1.45, 0]} color="#6b452e" rough={0.7} />
    <Card pos={[0, 3.2, 0]} lines={["1"]} w={1.1} h={0.8} bg="#23345e" fg="#ffe6ad" />
  </group>
);

export const Jack: React.FC<{ push?: number | ((t: number) => number) }> = ({ push = 0 }) => {
  const t = useT();
  const p = num(push, t);
  return (
    <group>
      <Box size={[2.2, 0.28, 1.2]} pos={[0, 0, 0]} color="#31425d" rough={0.7} />
      <Cyl r={0.34} h={0.7} pos={[0, 0.5, 0]} color="#d9a23f" rough={0.35} />
      <Box size={[1.5, 0.22, 1.0]} pos={[0, 1.02 + p * 0.65, 0]} color="#9fb9d8" rough={0.3} />
      <mesh position={[0, 2.15 + p * 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.5, 1.7]} />
        <meshStandardMaterial color="#bfe4ff" emissive="#2a6a8f" emissiveIntensity={0.14} transparent opacity={0.62} roughness={0.28} />
      </mesh>
      {p > 0.55 ? <Filament growth={(p - 0.55) / 0.45} from={-1.1} to={1.1} y={2.15 + p * 0.65} z={0.9} color="#1b2742" r={0.18} /> : null}
      <Card pos={[0, 3.9, 0]} lines={["2"]} w={1.1} h={0.8} bg="#4a2430" fg="#ffe6ad" />
    </group>
  );
};

export const Gauge: React.FC<{ position?: number | ((t: number) => number) }> = ({ position = 0 }) => {
  const t = useT();
  const p = Math.max(0, Math.min(1, num(position, t)));
  return (
    <group>
      <Box size={[7, 0.55, 0.6]} pos={[0, 0, 0]} color="#23345e" rough={0.6} />
      <Box size={[1.5, 0.62, 0.68]} pos={[0, 0, 0.05]} color="#58b58b" rough={0.4} />
      <Box size={[0.16, 1.1, 0.8]} pos={[-3.5 + p * 7, 0, 0.22]} color="#ffd36a" emissive="#ffb347" emissiveIntensity={0.5} />
      <Card pos={[0, 1.5, 0]} lines={["P"]} w={1.1} h={0.8} bg="#4a2430" fg="#ffe6ad" />
    </group>
  );
};

export const CommentBubble: React.FC = () => (
  <group>
    <Card pos={[0, 3.6, 1.2]} lines={["?"]} w={3.0} h={1.7} bg="#fffdf6" fg="#173846" />
    <mesh position={[0, 2.45, 1.2]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.4, 0.7, 3]} />
      <meshStandardMaterial color="#173846" />
    </mesh>
  </group>
);
