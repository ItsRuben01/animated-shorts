import React, { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, Ground, Window } from "../engine/kit";
import { LAYER_FX } from "../engine/Stage";
import type { Look, V3 } from "../engine/Stage";
import { painted, planks } from "../engine/tex";

const labelCache = new Map<string, THREE.CanvasTexture>();
const labelTex = (lines: string[], bg: string, fg: string, ratio: number) => {
  const key = `${bg}|${fg}|${ratio.toFixed(2)}|${lines.join("\n")}`;
  const cached = labelCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  const W = 1024;
  const H = Math.max(128, Math.min(768, Math.round(W * ratio)));
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  const r = Math.min(42, H / 5);
  g.beginPath();
  g.moveTo(r, 0); g.lineTo(W - r, 0); g.quadraticCurveTo(W, 0, W, r);
  g.lineTo(W, H - r); g.quadraticCurveTo(W, H, W - r, H);
  g.lineTo(r, H); g.quadraticCurveTo(0, H, 0, H - r);
  g.lineTo(0, r); g.quadraticCurveTo(0, 0, r, 0); g.closePath(); g.fill();
  g.strokeStyle = fg; g.lineWidth = 10; g.stroke();
  let fs = Math.max(34, Math.min(124, Math.round((H - 60) / lines.length * 0.78)));
  const font = () => { g.font = `800 ${fs}px "Trebuchet MS", "Segoe UI", Arial, sans-serif`; };
  font();
  while (fs > 26 && lines.some((l) => g.measureText(l).width > W - 120)) { fs -= 4; font(); }
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = fg;
  lines.forEach((l, i) => g.fillText(l, W / 2, ((i + 0.5) * H) / lines.length, W - 90));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  labelCache.set(key, t);
  return t;
};

const Label: React.FC<{ lines: string[]; pos: V3; w: number; h: number; bg?: string; fg?: string; rot?: V3 }> = ({ lines, pos, w, h, bg = "#1d3340", fg = "#f6e7c6", rot }) => (
  <Box size={[w, h, 0.08]} pos={pos} rot={rot} map={labelTex(lines, bg, fg, h / w)} shadow={false} />
);

export const roomLook: Look = {
  fog: "#c9bda8", fogNear: 18, fogFar: 70,
  sun: { pos: [7, 12, 9], color: "#ffe0b6", intensity: 2.6, shadow: 24 },
  hemi: { sky: "#b9d2ff", ground: "#6a4a38", intensity: 0.9 },
  ambient: 0.16, exposure: 1.08, aperture: 0.45, vignette: 0.42, saturation: 1.16,
  warm: "#ffb070", cool: "#4a3fa8",
};

export const deskLook: Look = {
  ...roomLook, fog: "#c2b298", fogNear: 10, fogFar: 36,
  aperture: 0.58, exposure: 1.16, vignette: 0.48,
};

export const closeLook: Look = {
  ...deskLook, fog: "#b9a98f", fogNear: 6, fogFar: 22,
  aperture: 0.72, exposure: 1.22, vignette: 0.5,
};

export const Room: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Ground map={planks("#9a7550", [4, 4])} size={40} />
    <Box size={[18, 7, 0.3]} pos={[0, 3.5, -5]} map={painted("#d8c9a8", [4, 2], 300)} />
    <Box size={[0.3, 7, 14]} pos={[-8.8, 3.5, 2]} map={painted("#c9b99a", [3, 2], 300)} />
    <Box size={[0.3, 7, 14]} pos={[8.8, 3.5, 2]} map={painted("#c9b99a", [3, 2], 300)} />
    <Box size={[18, 0.3, 14]} pos={[0, 7, 2]} color="#e8dcc0" />
    <Window w={2.4} h={2.2} pos={[-4.5, 3.6, -4.82]} panes={[3, 3]} frame="#f0e6d2" />
    <Box size={[3.2, 1.6, 0.35]} pos={[4.6, 2.6, -4.72]} color="#6f8f74" />
    <Box size={[3.4, 0.12, 0.5]} pos={[4.6, 1.75, -4.55]} color="#5a3e28" />
    {[0, 1, 2].map((i) => (
      <group key={"book" + i} position={[3.7 + i * 0.7, 2.85, -4.42]} rotation={[0, 0, (i - 1) * 0.08]}>
        <Box size={[0.45, 0.9, 0.2]} color={["#7a3a2c", "#2f5a7a", "#8a6a2a"][i]} />
      </group>
    ))}
    <pointLight position={[0, 4.2, 1.5]} intensity={22} distance={13} decay={2} color="#ffd39a" />
    <mesh position={[0, 4.6, 1.6]} layers={LAYER_FX}>
      <sphereGeometry args={[0.42, 16, 12]} />
      <meshBasicMaterial color="#ffe1a8" transparent opacity={0.22} depthWrite={false} fog={false} />
    </mesh>
    {children}
  </group>
);

export const Desk: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Box size={[6.4, 0.18, 3.2]} pos={[0, 0.92, 0]} map={planks("#7a5334", [3, 2])} />
    <Box size={[6.4, 0.16, 0.18]} pos={[0, 0.76, 1.48]} color="#5a3a24" />
    {[-2.8, 2.8].map((x) => [-1.25, 1.25].map((z) => <Box key={x + "" + z} size={[0.18, 0.9, 0.18]} pos={[x, 0.45, z]} color="#5a3a24" />))}
    {children}
  </group>
);

export const Arduino: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => (
  <group position={pos}>
    <Box size={[2.5, 0.14, 1.55]} pos={[0, 0, 0]} color="#126b5a" rough={0.6} />
    <Box size={[2.32, 0.012, 0.035]} pos={[0, 0.078, 0.69]} color="#2e8b75" shadow={false} />
    <Box size={[2.32, 0.012, 0.035]} pos={[0, 0.078, -0.69]} color="#2e8b75" shadow={false} />
    <Box size={[0.035, 0.012, 1.42]} pos={[-1.17, 0.078, 0]} color="#2e8b75" shadow={false} />
    <Box size={[0.035, 0.012, 1.42]} pos={[1.17, 0.078, 0]} color="#2e8b75" shadow={false} />
    <Box size={[0.5, 0.22, 0.55]} pos={[-1.38, 0.02, 0]} color="#c8ccd2" rough={0.3} />
    <Box size={[0.34, 0.13, 0.38]} pos={[-1.38, 0.02, 0]} color="#8d939c" rough={0.4} />
    <Box size={[0.12, 0.1, 0.3]} pos={[-1.65, 0.02, 0]} color="#aeb4bd" rough={0.4} />
    <Cyl r={0.17} h={0.2} pos={[-1.28, 0.13, -0.46]} rot={[Math.PI / 2, 0, 0]} color="#15161a" rough={0.5} />
    <Cyl r={0.1} h={0.22} pos={[-1.28, 0.13, -0.46]} rot={[Math.PI / 2, 0, 0]} color="#07080b" rough={0.4} />
    <Box size={[0.62, 0.2, 0.62]} pos={[-0.25, 0.16, -0.05]} color="#1c1c22" rough={0.5} />
    <Cyl r={0.055} h={0.015} pos={[-0.25, 0.265, -0.05]} color="#5a5a62" rough={0.5} />
    {Array.from({ length: 6 }).map((_, i) => {
      const z = -0.28 + i * 0.092;
      return (
        <group key={"chip" + i}>
          <Box size={[0.13, 0.025, 0.04]} pos={[-0.6, 0.11, z]} color="#b6b9bf" rough={0.4} shadow={false} />
          <Box size={[0.13, 0.025, 0.04]} pos={[0.1, 0.11, z]} color="#b6b9bf" rough={0.4} shadow={false} />
        </group>
      );
    })}
    <Box size={[0.2, 0.09, 0.2]} pos={[-0.95, 0.13, -0.48]} color="#2a2a30" rough={0.5} />
    <Cyl r={0.07} h={0.05} pos={[-0.95, 0.19, -0.48]} color="#c9ccd2" rough={0.4} />
    <Cyl r={0.12} h={0.16} pos={[0.86, 0.15, -0.42]} color="#d9dde4" rough={0.3} />
    <Cyl r={0.08} h={0.12} pos={[0.52, 0.13, 0.28]} color="#c8b58a" rough={0.5} />
    <Cyl r={0.08} h={0.12} pos={[0.78, 0.13, 0.28]} color="#c8b58a" rough={0.5} />
    <Box size={[0.09, 0.06, 0.09]} pos={[1.02, 0.12, 0.5]} color="#8fe06a" emissive="#2f7a3a" emissiveIntensity={0.4} shadow={false} />
    <Box size={[0.09, 0.06, 0.09]} pos={[1.2, 0.12, 0.5]} color="#f0b25a" emissive="#7a4a20" emissiveIntensity={0.3} shadow={false} />
    {[-0.72, -0.44, -0.16, 0.12, 0.4, 0.68, 0.96].map((x) => (
      <group key={"h" + x}>
        <Box size={[0.16, 0.09, 0.2]} pos={[x, 0.12, 0.58]} color="#18181c" shadow={false} />
        <Box size={[0.16, 0.09, 0.2]} pos={[x, 0.12, -0.58]} color="#18181c" shadow={false} />
        <Box size={[0.09, 0.02, 0.12]} pos={[x, 0.18, 0.58]} color="#c9ccd2" shadow={false} />
        <Box size={[0.09, 0.02, 0.12]} pos={[x, 0.18, -0.58]} color="#c9ccd2" shadow={false} />
      </group>
    ))}
    <Label lines={["ARDUINO UNO"]} pos={[0.05, 0.086, 0.79]} w={1.5} h={0.2} bg="#126b5a" fg="#ecfff2" />
  </group>
);

export const Breadboard: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => (
  <group position={pos}>
    <Box size={[2.8, 0.14, 1.7]} pos={[0, 0, 0]} color="#eee9da" rough={0.8} />
    <Box size={[2.8, 0.15, 0.1]} pos={[0, 0, 0]} color="#c9c3b4" shadow={false} />
    {Array.from({ length: 12 }).map((_, i) => {
      const x = -1.18 + i * 0.215;
      return (
        <group key={"c" + i}>
          {[-0.62, -0.46, 0.46, 0.62].map((z) => (
            <Box key={z} size={[0.055, 0.03, 0.055]} pos={[x, 0.085, z]} color="#4a4a4a" shadow={false} />
          ))}
        </group>
      );
    })}
    {[-0.78, 0.78].map((z) => Array.from({ length: 12 }).map((_, i) => (
      <Box key={z + "" + i} size={[0.055, 0.03, 0.055]} pos={[-1.18 + i * 0.215, 0.085, z]} color="#4a4a4a" shadow={false} />
    )))}
  </group>
);

export const PushButton: React.FC<{ pos?: V3; pressed?: boolean }> = ({ pos = [0, 0, 0], pressed = false }) => (
  <group position={pos}>
    <Box size={[0.62, 0.14, 0.62]} pos={[0, 0.06, 0]} color="#222229" rough={0.6} />
    <Cyl r={0.19} h={pressed ? 0.05 : 0.13} pos={[0, pressed ? 0.15 : 0.19, 0]} color="#d94b42" rough={0.5} />
    {[-0.22, 0.22].map((x) => [-0.22, 0.22].map((z) => <Box key={x + "" + z} size={[0.07, 0.22, 0.07]} pos={[x, -0.08, z]} color="#c9a24a" />))}
  </group>
);

export const Led: React.FC<{ pos?: V3; on?: boolean; size?: number }> = ({ pos = [0, 0, 0], on = false, size = 1 }) => (
  <group position={pos} scale={size}>
    <Cyl r={0.025} h={0.42} pos={[-0.09, -0.08, 0]} color="#c8c8c8" rough={0.4} />
    <Cyl r={0.025} h={0.34} pos={[0.09, -0.12, 0]} color="#c8c8c8" rough={0.4} />
    <Cyl r={0.17} h={0.3} pos={[0, 0.2, 0]} color={on ? "#ff4a42" : "#7a2a28"} emissive={on ? "#ff2a20" : undefined} emissiveIntensity={on ? 1.4 : 0} rough={0.35} />
    <mesh position={[0, 0.38, 0]} castShadow>
      <sphereGeometry args={[0.175, 20, 16]} />
      <meshStandardMaterial color={on ? "#ff6a5e" : "#9a3a34"} emissive={on ? "#ff3024" : "#000000"} emissiveIntensity={on ? 1.8 : 0} roughness={0.35} />
    </mesh>
    {on ? (
      <mesh position={[0, 0.38, 0]} layers={LAYER_FX}>
        <sphereGeometry args={[0.55, 20, 16]} />
        <meshBasicMaterial color="#ff6a4a" transparent opacity={0.24} depthWrite={false} fog={false} />
      </mesh>
    ) : null}
    {on ? <pointLight position={[0, 0.5, 0]} intensity={5} distance={3.2} decay={2} color="#ff5a44" /> : null}
  </group>
);

export const Resistor: React.FC<{ pos?: V3; rot?: V3 }> = ({ pos = [0, 0, 0], rot = [0, 0, Math.PI / 2] }) => (
  <group position={pos} rotation={rot}>
    <Cyl r={0.09} h={0.42} pos={[0, 0, 0]} color="#d8c9a0" rough={0.7} />
    {[-0.11, -0.03, 0.05].map((y, i) => (
      <mesh key={"band" + i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.092, 0.012, 10, 28]} />
        <meshStandardMaterial color={["#e07b2c", "#e07b2c", "#6b3f1d"][i]} roughness={0.65} />
      </mesh>
    ))}
    <Cyl r={0.025} h={0.7} pos={[0, 0, 0]} rot={[Math.PI / 2, 0, 0]} color="#c8c8c8" />
  </group>
);

export const Wire: React.FC<{ points: V3[]; color: string }> = ({ points, color }) => {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 32, 0.035, 8, false);
  }, [points, color]);
  return <mesh geometry={geometry} castShadow><meshStandardMaterial color={color} roughness={0.7} /></mesh>;
};

export const PartsRow: React.FC<{ highlight?: number }> = ({ highlight = -1 }) => (
  <group>
    <group position={[-2.0, 1.1, -0.5]} scale={0.42}><Arduino /></group>
    <group position={[-0.75, 1.12, -0.35]}><PushButton /></group>
    <group position={[0.5, 1.14, -0.55]}><Resistor /></group>
    <group position={[1.8, 1.12, -0.35]}><Led size={1.3} /></group>
    {[0, 1, 2, 3].map((i) => (
      <group key={"part" + i} position={[-2.0 + i * 1.27, 1.62, -0.5]}>
        <Box size={[0.62, 0.32, 0.06]} color={i === highlight ? "#f0c257" : "#2d3340"} rough={0.6} />
        <Label lines={[["UNO", "BOTÓN", "330 Ω", "LED"][i]]} pos={[0, 0, 0.05]} w={0.58} h={0.28} bg={i === highlight ? "#f0c257" : "#2d3340"} fg={i === highlight ? "#2b1e0d" : "#f2e7cf"} />
      </group>
    ))}
  </group>
);

export const FlowCard: React.FC<{ pos?: V3; step?: number }> = ({ pos = [0, 2.25, -1.6], step = -1 }) => {
  const lines = ["5V", "BOTÓN", "330 Ω", "LED", "TIERRA"];
  return (
    <group position={pos}>
      <Box size={[2.5, 2.05, 0.12]} color="#20242c" rough={0.6} />
      {step >= 0 ? <Box size={[2.12, 0.3, 0.02]} pos={[0, 0.72 - step * 0.37, 0.075]} color="#f0c257" shadow={false} /> : null}
      <Label lines={lines} pos={[0, 0, 0.1]} w={2.3} h={1.85} bg="#161a22" fg="#8fe3c0" />
    </group>
  );
};

export const Card: React.FC<{ pos?: V3; lines: string[]; w?: number; h?: number; bg?: string; fg?: string }> = ({ pos = [0, 2.1, -1.6], lines, w = 3.2, h = 0.95, bg = "#1d3340", fg = "#f6e7c6" }) => (
  <group position={pos}>
    <Box size={[w + 0.14, h + 0.14, 0.12]} color="#c8933f" rough={0.6} />
    <Label lines={lines} pos={[0, 0, 0.08]} w={w} h={h} bg={bg} fg={fg} />
  </group>
);

export const Circuit: React.FC<{ pressed?: boolean; on?: boolean; wires?: boolean; showParts?: boolean; flow?: number }> = ({ pressed = false, on = false, wires = true, showParts = true, flow = -1 }) => (
  <group>
    <Arduino pos={[-0.95, 1.02, 0.05]} />
    <Breadboard pos={[1.05, 1.02, 0.05]} />
    {showParts ? <PushButton pos={[0.62, 1.1, -0.18]} pressed={pressed} /> : null}
    {showParts ? <Led pos={[1.55, 1.1, -0.18]} on={on} /> : null}
    {showParts ? <Resistor pos={[1.05, 1.16, -0.62]} /> : null}
    {wires ? (
      <group>
        <Wire points={[[-1.35, 1.14, 0.63], [-0.7, 1.3, 0.9], [0.3, 1.25, 0.85], [0.5, 1.14, 0.55]]} color={flow === 0 ? "#ff5a44" : "#22242a"} />
        <Wire points={[[-0.4, 1.14, 0.63], [-0.1, 1.36, 0.95], [0.45, 1.3, 0.55], [0.62, 1.14, 0.05]]} color={flow === 1 ? "#ff5a44" : "#d65a4a"} />
        <Wire points={[[0.05, 1.14, 0.63], [0.55, 1.42, 0.8], [1.2, 1.35, 0.6], [1.55, 1.14, 0.2]]} color={flow === 2 ? "#ff5a44" : "#b87333"} />
        <Wire points={[[1.75, 1.14, 0.2], [1.95, 1.3, 0.65], [1.35, 1.2, 0.85], [0.5, 1.14, 0.55]]} color={flow === 4 ? "#ff5a44" : "#22242a"} />
      </group>
    ) : null}
  </group>
);
