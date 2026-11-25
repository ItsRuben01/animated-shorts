import React from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Cyl, Ground } from "../engine/kit";
import type { V3 } from "../engine/Stage";
import { LAYER_FX } from "../engine/Stage";
import { rng } from "../engine/tex";
import { TOWER } from "./world";

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
  pos = [0, 32, 0], lines, w = 6, h = 1.9, bg = "#14394c", fg = "#ffe6ad", rot,
}) => (
  <group position={pos} rotation={rot}>
    <Box size={[w + 0.2, h + 0.2, 0.14]} color="#c9a24a" rough={0.55} shadow={false} />
    <Box size={[w, h, 0.08]} pos={[0, 0, 0.11]} map={labelTex(lines, bg, fg, h / w)} shadow={false} />
  </group>
);

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const Plaza: React.FC<{ dusk?: boolean }> = ({ dusk }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
      <planeGeometry args={[260, 260]} />
      <meshStandardMaterial color={dusk ? "#b88869" : "#9aabb2"} roughness={1} />
    </mesh>
    <Cyl r={10.5} r2={9.6} h={0.5} pos={[0, 0.1, 0]} color={dusk ? "#b7926c" : "#8e9fa6"} />
    <Cyl r={7.4} h={0.16} pos={[0, 0.42, 0]} color={dusk ? "#d3aa7a" : "#b6c5c9"} />
  </group>
);

export const City: React.FC = () => {
  const r = rng(4211);
  const blocks = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2 + r() * 0.2;
    const d = 17 + r() * 22;
    const h = 1.6 + r() * 7.2;
    return { x: Math.cos(a) * d, z: Math.sin(a) * d, h, w: 2.2 + r() * 3.4, c: ["#6f8792", "#7f929c", "#647e8a", "#899aa1"][i % 4] };
  });
  return <group>{blocks.map((b, i) => <Box key={i} size={[b.w, b.h, b.w]} pos={[b.x, b.h / 2, b.z]} color={b.c} />)}</group>;
};

export const Tower: React.FC<{ x?: number; bend?: number; xray?: boolean; dusk?: boolean; tall?: boolean }> = ({
  x = 0, bend = 0, xray = false, dusk = false, tall = true,
}) => {
  const glass = [dusk ? "#3e7180" : "#347082", dusk ? "#4b8090" : "#3d8091", "#2c6477", "#437f8d"];
  const tiers = [];
  for (let i = 0; i < TOWER.tiers; i++) {
    const y = i * TOWER.tierH;
    const rb = TOWER.baseR - i * TOWER.step;
    const rt = rb + TOWER.flare;
    tiers.push(
      <group key={"tier" + i} position={[0, y, 0]}>
        {xray ? (
          <mesh position={[0, (TOWER.tierH - 0.16) / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[rt, rb, TOWER.tierH - 0.16, 4]} />
            <meshStandardMaterial color="#9fd3e2" transparent opacity={0.17} depthWrite={false} side={THREE.DoubleSide} roughness={0.2} />
          </mesh>
        ) : (
          <Cyl r={rb} r2={rt} h={TOWER.tierH - 0.16} pos={[0, (TOWER.tierH - 0.16) / 2, 0]} rot={[0, Math.PI / 4, 0]} seg={4} color={glass[i % glass.length]} />
        )}
        <Cyl r={rt + 0.16} r2={rt + 0.16} h={0.24} pos={[0, TOWER.tierH - 0.1, 0]} rot={[0, Math.PI / 4, 0]} seg={4} color={dusk ? "#e0b16f" : "#c9a24a"} />
        {[-2, -1, 0, 1, 2].map((k) => (
          <Box key={"fin" + k} size={[0.07, TOWER.tierH * 0.66, 0.09]} pos={[k * rb * 0.32, TOWER.tierH * 0.5, rb * 0.72]} color="#b9dbe4" emissive="#6db6c8" emissiveIntensity={0.3} shadow={false} />
        ))}
        {xray ? <Box size={[rb * 1.5, 0.07, rb * 1.5]} pos={[0, TOWER.tierH - 0.22, 0]} color="#f1c46e" shadow={false} /> : null}
      </group>,
    );
  }
  const top = TOWER.tiers * TOWER.tierH;
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, bend]}>
      {tiers}
      {xray ? (
        <group>
          {[-1, 1].map((sx) => [-1, 1].map((sz) => (
            <Box key={`${sx}${sz}`} size={[0.24, top, 0.24]} pos={[sx * 2.2, top / 2, sz * 2.2]} color="#e0b76e" />
          )))}
          <mesh position={[0, top * 0.51, 0]}>
            <boxGeometry args={[3.2, top * 0.82, 3.2]} />
            <meshStandardMaterial color="#9fd8e8" transparent opacity={0.14} depthWrite={false} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ) : null}
      <Cyl r={1.9} r2={1.15} h={1.5} pos={[0, top + 0.6, 0]} rot={[0, Math.PI / 4, 0]} seg={4} color={dusk ? "#e0b16f" : "#c9a24a"} />
      {tall ? (
        <group>
          <Cyl r={0.34} r2={0.06} h={5.2} pos={[0, top + 3.8, 0]} color="#d8c08c" />
          <Cyl r={0.12} r2={0.02} h={2.4} pos={[0, top + 7.4, 0]} color="#f2d9a6" />
          <mesh position={[0, top + 8.7, 0]} layers={LAYER_FX}>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshBasicMaterial color="#ffd98f" />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

export const Damper: React.FC<{ x?: number; angle?: number; glow?: number }> = ({ x = 0, angle = 0, glow = 0 }) => {
  const R = TOWER.ballR;
  const bands = [-1.2, -0.6, 0, 0.6, 1.2].map((dy) => ({ dy, r: Math.sqrt(Math.max(0.1, R * R - dy * dy)) + 0.01 }));
  return (
    <group position={[x, TOWER.pivotY, 0]} rotation={[0, 0, angle]}>
      <Cyl r={1.85} r2={1.85} h={0.32} pos={[0, 0.1, 0]} color="#c9a24a" />
      <Cyl r={0.6} h={0.5} pos={[0, -0.24, 0]} color="#e3c06a" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <Cyl key={"cable" + i} r={0.075} h={3.15} pos={[Math.cos(a) * 1.12, -1.72, Math.sin(a) * 1.12]} color="#e6d6ae" rough={0.45} />;
      })}
      <group position={[0, -4.1, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[R, 24, 16]} />
          <meshStandardMaterial color="#dca83e" emissive="#8a4d08" emissiveIntensity={0.25 + glow * 0.4} roughness={0.38} metalness={0.42} flatShading />
        </mesh>
        {bands.map((b) => (
          <mesh key={b.dy} position={[0, b.dy, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[b.r, 0.045, 6, 40]} />
            <meshStandardMaterial color="#f6d17a" emissive="#c68e25" emissiveIntensity={0.5} metalness={0.4} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0, R - 0.02]}>
          <circleGeometry args={[0.46, 16]} />
          <meshStandardMaterial color="#fff0b8" emissive="#ffd06a" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
};

export const Pistons: React.FC<{ x?: number; brake?: number }> = ({ x = 0, brake = 0 }) => {
  const t = useT();
  const flash = brake * (0.55 + 0.45 * Math.sin(t * 22));
  return (
    <group position={[x, TOWER.pistonY, 0]}>
      <Cyl r={3.1} r2={3.1} h={0.35} color="#3f6472" />
      <Cyl r={2.7} r2={2.7} h={0.2} pos={[0, 0.28, 0]} color="#c9a24a" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, -a, 0]}>
            <group position={[2.75, 0.34, 0]} rotation={[0, 0, Math.PI / 2 - 0.34]}>
              <Cyl r={0.23} h={1.45} pos={[0, -0.4, 0]} color="#4d6f7a" rough={0.4} />
              <Cyl r={0.11} h={1.05} pos={[0, 0.68, 0]} color="#e2e6dd" rough={0.3} />
              <Cyl r={0.29} h={0.14} pos={[0, -1.1, 0]} color="#c9a24a" />
            </group>
            {brake > 0 ? (
              <mesh position={[Math.cos(a) * 2.75, 0.72, Math.sin(a) * 2.75]} layers={LAYER_FX}>
                <sphereGeometry args={[0.28 + flash * 0.16, 10, 8]} />
                <meshBasicMaterial color="#fff0b0" transparent opacity={0.24 + flash * 0.5} depthWrite={false} fog={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

export const Atrium: React.FC<{ x?: number; open?: boolean }> = ({ x = 0, open = true }) => (
  <group position={[x, 0, 0]}>
    {[14.4, 18.1, 26.3].map((y) => (
      <Box key={"slab" + y} size={[9.2, 0.24, 9.2]} pos={[0, y, 0]} color="#a9bec4" />
    ))}
    {[-1, 1].map((s) => (
      <group key={s}>
        <Box size={[0.3, 10, 0.3]} pos={[s * 4.1, 22.8, 3.9]} color="#c9a24a" />
        <Box size={[0.3, 10, 0.3]} pos={[s * 4.1, 22.8, -3.9]} color="#c9a24a" />
      </group>
    ))}
    {open ? (
      <mesh position={[0, 22.8, 4.2]}>
        <planeGeometry args={[8, 9.6]} />
        <meshStandardMaterial color="#bfe4ee" transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} roughness={0.1} />
      </mesh>
    ) : null}
  </group>
);

export const Storm: React.FC<{ rain?: boolean }> = ({ rain = true }) => {
  const t = useT();
  const r = rng(9917);
  const clouds = Array.from({ length: 22 }, (_, i) => ({
    x: (r() - 0.5) * 78, y: 24 + r() * 20, z: -14 - r() * 34,
    s: 2.4 + r() * 5.2, c: ["#6e7e8c", "#7f8d99", "#5d6e7e", "#8b98a2"][i % 4],
  }));
  const drops = Array.from({ length: 90 }, (_, i) => ({ x: (r() - 0.5) * 62, y: r() * 44, z: (r() - 0.5) * 34, v: 14 + r() * 12 }));
  return (
    <group>
      {clouds.map((c, i) => {
        const x = ((c.x + t * 0.55 + 45) % 90) - 45;
        return (
          <mesh key={"cloud" + i} position={[x, c.y + Math.sin(t * 0.4 + i) * 0.3, c.z]} scale={[c.s * 1.5, c.s * 0.62, c.s]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={c.c} flatShading roughness={1} />
          </mesh>
        );
      })}
      {rain ? drops.map((d, i) => {
        const y = ((d.y - t * d.v) % 44 + 44) % 44;
        return (
          <mesh key={"rain" + i} position={[d.x, y, d.z]} layers={LAYER_FX}>
            <boxGeometry args={[0.025, 0.75, 0.025]} />
            <meshBasicMaterial color="#cfe6f4" transparent opacity={0.32} fog={false} />
          </mesh>
        );
      }) : null}
    </group>
  );
};

export const Wind: React.FC<{ count?: number }> = ({ count = 18 }) => {
  const t = useT();
  const r = rng(3141);
  const streaks = Array.from({ length: count }, () => ({ y: 8 + r() * 28, z: -4 + r() * 14, v: 12 + r() * 10, o: 0.3 + r() * 0.5 }));
  return (
    <group>
      {streaks.map((s, i) => {
        const x = ((t * s.v + i * 7.1) % 58) - 29;
        return (
          <mesh key={i} position={[x, s.y, s.z]} layers={LAYER_FX}>
            <boxGeometry args={[2.6, 0.045, 0.045]} />
            <meshBasicMaterial color="#d6f3ff" transparent opacity={s.o} fog={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Seismic: React.FC = () => {
  const t = useT();
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const k = (t * 0.8 + i / 3) % 1;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} scale={1 + k * 13} layers={LAYER_FX}>
            <torusGeometry args={[1, 0.035, 6, 56]} />
            <meshBasicMaterial color="#ffb26b" transparent opacity={(1 - k) * 0.75} fog={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Tuner: React.FC = () => {
  const t = useT();
  const wave = (phase: number, color: string, yBase: number) => (
    <group>
      {Array.from({ length: 30 }, (_, i) => {
        const x = -5.7 + i * 0.4;
        const y = yBase + Math.sin(x * 1.25 - t * 3.2 + phase) * 0.72;
        return (
          <mesh key={i} position={[x, y, 0]} layers={LAYER_FX}>
            <boxGeometry args={[0.27, 0.12, 0.12]} />
            <meshBasicMaterial color={color} fog={false} />
          </mesh>
        );
      })}
    </group>
  );
  return (
    <group>
      <Box size={[12.4, 8.6, 0.4]} pos={[0, 3.4, -2.4]} color="#183b4a" />
      <Box size={[12.8, 0.3, 0.6]} pos={[0, 7.7, -2.2]} color="#c9a24a" />
      <Box size={[12.8, 0.3, 0.6]} pos={[0, -0.9, -2.2]} color="#c9a24a" />
      {wave(0, "#ffd06a", 5.4)}
      {wave(Math.PI, "#69d9e8", 2.0)}
      <group position={[0, 3.5, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh><torusGeometry args={[1.05, 0.14, 8, 40]} /><meshStandardMaterial color="#d9b25d" emissive="#a56d18" emissiveIntensity={0.5} /></mesh>
        <mesh rotation={[0, 0, t * 1.6]}><boxGeometry args={[0.1, 1.9, 0.1]} /><meshStandardMaterial color="#fff0b8" emissive="#ffd06a" emissiveIntensity={1.2} /></mesh>
      </group>
      <Card pos={[0, 9.2, -1.8]} lines={["SINCRONIZACIÓN"]} w={6.6} h={1.5} bg="#14394c" />
    </group>
  );
};

export const BeforeAfter: React.FC = () => {
  const t = useT();
  return (
    <group>
      <Box size={[0.18, 26, 0.4]} pos={[0, 13, -2]} color="#e8d9b0" />
      <group position={[-7.2, 0, 0]} scale={0.62}>
        <Tower bend={-Math.sin(t * 8) * 0.075} dusk={false} tall={false} />
        <Card pos={[0, 33, 0]} lines={["ANTES"]} w={6.4} h={1.7} bg="#8f3540" fg="#ffe4c8" />
      </group>
      <group position={[7.2, 0, 0]} scale={0.62}>
        <Tower bend={-Math.sin(t * 8) * 0.006} dusk={false} tall={false} />
        <Card pos={[0, 33, 0]} lines={["DESPUÉS"]} w={6.4} h={1.7} bg="#1f6b5c" fg="#f2f5d6" />
      </group>
      <Card pos={[0, 7, 3.5]} lines={["-40 %", "OSCILACIÓN"]} w={7.2} h={2.4} bg="#14394c" fg="#ffd884" />
    </group>
  );
};

export const Bus: React.FC<{ brake?: number }> = ({ brake = 0 }) => {
  const t = useT();
  const skid = brake * (0.5 + 0.5 * Math.sin(t * 18));
  return (
    <group>
      <Box size={[8.4, 0.28, 2.7]} pos={[0, 0.75, 0]} color="#3d5964" />
      <Box size={[8.4, 0.3, 2.7]} pos={[0, 3.5, 0]} color="#d9a23f" />
      <Box size={[0.3, 2.7, 2.7]} pos={[-4.05, 2.1, 0]} color="#c98b36" />
      <Box size={[0.3, 2.7, 2.7]} pos={[4.05, 2.1, 0]} color="#c98b36" />
      <Box size={[8.3, 0.8, 0.22]} pos={[0, 3.05, -1.3]} color="#d9a23f" />
      <Box size={[7.6, 1.3, 0.1]} pos={[0, 2.28, -1.32]} color="#a9d7e6" emissive="#69b8d6" emissiveIntensity={0.3} shadow={false} />
      {[-2.9, -0.95, 0.95, 2.9].map((x) => <Box key={"pillar" + x} size={[0.16, 1.5, 0.14]} pos={[x, 2.28, -1.38]} color="#e7c979" />)}
      {[-2.9, 2.9].map((x) => (
        <group key={"wheel" + x} position={[x, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow><cylinderGeometry args={[0.62, 0.62, 0.3, 16]} /><meshStandardMaterial color="#252b30" /></mesh>
          <mesh position={[0, 0.17, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.28, 0.28, 0.05, 12]} /><meshStandardMaterial color="#aab7bc" /></mesh>
        </group>
      ))}
      {[-1, 1].map((s) => (
        <group key={"light" + s} position={[4.22, 1.55, s * 0.85]}>
          <Box size={[0.12, 0.34, 0.42]} color={brake ? "#ff5b47" : "#ffe9a6"} emissive={brake ? "#ff2c18" : "#ffd06a"} emissiveIntensity={brake ? 1.4 + skid : 0.7} shadow={false} />
        </group>
      ))}
      <Card pos={[0, 4.25, -0.8]} lines={["BUS 88"]} w={3.6} h={0.9} bg="#173846" fg="#ffe6ad" />
      {brake > 0 ? (
        <group layers={LAYER_FX}>
          {[-2.9, 2.9].map((x) => (
            <mesh key={"smoke" + x} position={[x - 1.1, 0.25 + skid * 0.2, 0]}>
              <sphereGeometry args={[0.38 + skid * 0.14, 10, 8]} />
              <meshBasicMaterial color="#d8dde0" transparent opacity={0.4} depthWrite={false} fog={false} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};

export const SunDisc: React.FC = () => (
  <group layers={LAYER_FX}>
    <mesh position={[-42, 17, -96]}>
      <circleGeometry args={[9, 48]} />
      <meshBasicMaterial color="#ffd9a0" fog={false} />
    </mesh>
    <mesh position={[-42, 17, -95]}>
      <circleGeometry args={[13, 48]} />
      <meshBasicMaterial color="#ffc98a" transparent opacity={0.22} depthWrite={false} fog={false} />
    </mesh>
  </group>
);

export const SkyLine: React.FC<{ dusk?: boolean }> = ({ dusk }) => (
  <group>
    <Plaza dusk={dusk} />
    <City />
  </group>
);

export const WindCard: React.FC = () => <Card pos={[11, 30, -1]} lines={["VIENTO"]} w={5.2} h={1.5} bg="#173846" fg="#bdefff" />;
