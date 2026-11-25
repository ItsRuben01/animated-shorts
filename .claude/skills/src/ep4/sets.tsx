import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, ContactShadow, Cyl, Ground, PendantLamp, Sign } from "../engine/kit";
import type { Look, V3 } from "../engine/Stage";
import { LAYER_FX } from "../engine/Stage";
import { painted, planks, water } from "../engine/tex";

const tileFloorTex = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const n = 4;
  const s = 512 / n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      g.fillStyle = (x + y) % 2 === 0 ? "#e6e2d6" : "#779ea3";
      g.fillRect(x * s, y * s, s, s);
    }
  }
  g.strokeStyle = "rgba(42, 54, 64, 0.22)";
  g.lineWidth = 4;
  for (let i = 0; i <= n; i++) {
    g.beginPath();
    g.moveTo(i * s, 0);
    g.lineTo(i * s, 512);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i * s);
    g.lineTo(512, i * s);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(16, 16);
  t.anisotropy = 8;
  return t;
};

const labelCache = new Map<string, THREE.CanvasTexture>();
const labelTex = (lines: string[], bg: string, fg: string, ratio: number) => {
  const key = `${bg}|${fg}|${ratio.toFixed(2)}|${lines.join("\n")}`;
  const cached = labelCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = Math.max(128, Math.min(640, Math.round(1024 * ratio)));
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  const r = Math.min(36, c.height / 5);
  g.beginPath();
  g.moveTo(r, 0);
  g.lineTo(c.width - r, 0);
  g.quadraticCurveTo(c.width, 0, c.width, r);
  g.lineTo(c.width, c.height - r);
  g.quadraticCurveTo(c.width, c.height, c.width - r, c.height);
  g.lineTo(r, c.height);
  g.quadraticCurveTo(0, c.height, 0, c.height - r);
  g.lineTo(0, r);
  g.quadraticCurveTo(0, 0, r, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = fg;
  g.lineWidth = 9;
  g.stroke();
  let fs = Math.max(30, Math.min(112, Math.round(((c.height - 52) / lines.length) * 0.76)));
  const font = () => {
    g.font = `900 ${fs}px "Trebuchet MS", "Segoe UI", Arial, sans-serif`;
  };
  font();
  while (fs > 24 && lines.some((l) => g.measureText(l).width > c.width - 100)) {
    fs -= 4;
    font();
  }
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = fg;
  lines.forEach((l, i) =>
    g.fillText(l, c.width / 2, ((i + 0.5) * c.height) / lines.length, c.width - 88)
  );
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  labelCache.set(key, t);
  return t;
};

const Label: React.FC<{
  lines: string[];
  pos: V3;
  w: number;
  h: number;
  bg?: string;
  fg?: string;
  rot?: V3;
}> = ({ lines, pos, w, h, bg = "#173846", fg = "#f7e8bc", rot }) => (
  <Box size={[w, h, 0.08]} pos={pos} rot={rot} map={labelTex(lines, bg, fg, h / w)} shadow={false} ink={false} />
);

export const Card: React.FC<{
  pos?: V3;
  lines: string[];
  w?: number;
  h?: number;
  bg?: string;
  fg?: string;
}> = ({ pos = [0, 2.2, -1.6], lines, w = 2.8, h = 0.9, bg = "#173846", fg = "#f7e8bc" }) => (
  <group position={pos}>
    <Box size={[w + 0.18, h + 0.18, 0.12]} color="#c8933f" rough={0.5} clearcoat={0.2} ink={false} />
    <Label lines={lines} pos={[0, 0, 0.09]} w={w} h={h} bg={bg} fg={fg} />
  </group>
);

export const storeLook: Look = {
  fog: "#cadbe8",
  fogNear: 16,
  fogFar: 55,
  sun: { pos: [7, 12, 9], color: "#fff1d6", intensity: 2.35, shadow: 22 },
  hemi: { sky: "#cde2ff", ground: "#3b3a7a", intensity: 0.95 },
  ambient: 0.16,
  exposure: 1.08,
  aperture: 0.52,
  vignette: 0.34,
  saturation: 1.16,
  contrast: 1.15,
  bloom: 0.35,
  warm: "#ffb673",
  cool: "#4b43c4",
  ink: 0.85,
};
export const xrayLook: Look = {
  ...storeLook,
  fog: "#b9d2e6",
  fogNear: 11,
  fogFar: 36,
  sun: { pos: [5, 9, 10], color: "#e6f2ff", intensity: 2.0, shadow: 18 },
  hemi: { sky: "#b5d4ff", ground: "#343b85", intensity: 1.05 },
  aperture: 0.58,
  exposure: 1.1,
  vignette: 0.38,
  saturation: 1.18,
};
export const macroLook: Look = {
  ...xrayLook,
  fog: "#b2cce0",
  fogNear: 5,
  fogFar: 18,
  aperture: 0.78,
  exposure: 1.14,
  vignette: 0.42,
};
export const millLook: Look = {
  fog: "#cfe3ee",
  fogNear: 18,
  fogFar: 75,
  sun: { pos: [-8, 13, 7], color: "#ffefd0", intensity: 2.6, shadow: 28 },
  hemi: { sky: "#c2e0ff", ground: "#464282", intensity: 0.95 },
  ambient: 0.16,
  exposure: 1.08,
  aperture: 0.38,
  vignette: 0.32,
  saturation: 1.16,
  contrast: 1.14,
  warm: "#ffb673",
  cool: "#4b43c4",
  ink: 0.85,
};

export const Store: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const floorMap = useMemo(() => tileFloorTex(), []);
  return (
    <group>
      <Ground map={floorMap} size={44} />
      {/* Paredes y zócalo arquitectónico */}
      <Box size={[24, 8.5, 0.35]} pos={[0, 4.25, -6.2]} map={painted("#dfd7c4", [6, 2], 600)} />
      <Box size={[24, 1.3, 0.42]} pos={[0, 0.65, -6.15]} color="#35656d" />
      <Box size={[24, 0.25, 0.45]} pos={[0, 1.32, -6.14]} color="#e8dec8" />
      <Box size={[24, 0.3, 18]} pos={[0, 8.5, 2]} color="#ece8da" />

      {/* Estanterías completas de 4 baldas con productos variados */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 5.7, 0, -5.3]}>
          <Box size={[3.9, 4.1, 0.16]} pos={[0, 2.05, -0.46]} color="#2c4a52" />
          <Box size={[0.16, 4.1, 1.08]} pos={[-1.9, 2.05, 0]} color="#3a5f69" />
          <Box size={[0.16, 4.1, 1.08]} pos={[1.9, 2.05, 0]} color="#3a5f69" />
          {[0.75, 1.65, 2.55, 3.45].map((y, shelfIdx) => (
            <group key={shelfIdx}>
              <Box size={[3.8, 0.14, 1.05]} pos={[0, y, 0]} color="#ece4d0" />
              <Box size={[3.8, 0.06, 0.04]} pos={[0, y - 0.02, 0.53]} color="#d9644a" shadow={false} />
              {Array.from({ length: 11 }).map((_, i) => {
                const hItem = 0.34 + ((i + shelfIdx) % 3) * 0.09;
                return (
                  <Box
                    key={i}
                    size={[0.24, hItem, 0.44]}
                    pos={[-1.55 + i * 0.31, y + 0.07 + hItem / 2, 0.06]}
                    color={["#d95046", "#e9b43f", "#3f8a6e", "#4a7fb5", "#e27d42"][(i + shelfIdx) % 5]}
                  />
                );
              })}
            </group>
          ))}
        </group>
      ))}

      {/* Cartel principal de la tienda integrado en la pared */}
      <Sign lines={["MERCA", "CHONDA"]} pos={[0, 5.1, -5.85]} w={4.6} h={2.0} bg="#1f6b4e" fg="#fff0c4" />
      <Box size={[4.9, 0.2, 0.55]} pos={[0, 3.9, -5.7]} color="#1f6b4e" />

      {/* Lámparas colgantes cálidas */}
      <PendantLamp pos={[-3.2, 6.6, -1.5]} intensity={18} />
      <PendantLamp pos={[3.2, 6.6, -1.5]} intensity={18} />
      {children}
    </group>
  );
};

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

export const Milk: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => (
  <group position={pos} scale={scale}>
    <Box size={[0.42, 0.7, 0.42]} pos={[0, 0.35, 0]} color="#f4f1e6" />
    <Box size={[0.44, 0.16, 0.44]} pos={[0, 0.63, 0]} color="#5b9bd5" />
    <Box size={[0.3, 0.24, 0.02]} pos={[0, 0.32, 0.22]} color="#e8c94f" />
    <Box size={[0.22, 0.08, 0.02]} pos={[0, 0.46, 0.23]} color="#2f6fa8" />
  </group>
);

export const Pineapple: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => (
  <group position={pos} scale={scale}>
    <mesh position={[0, 0.32, 0]} castShadow>
      <sphereGeometry args={[0.3, 18, 14]} />
      <meshStandardMaterial color="#e3a92e" roughness={0.82} />
    </mesh>
    {[-1, 0, 1].map((i) => (
      <Box key={i} size={[0.05, 0.42, 0.05]} pos={[i * 0.14, 0.42, 0.2]} rot={[0, 0, i * 0.3]} color="#a56a24" />
    ))}
    {[-1, 1].map((s) => (
      <Box key={s} size={[0.07, 0.3, 0.05]} pos={[s * 0.11, 0.74, 0]} rot={[0, 0, s * 0.3]} color="#3f8a5a" />
    ))}
  </group>
);

export const Belt: React.FC<{
  pos?: V3;
  scale?: number;
  xray?: boolean;
  moving?: boolean;
  product?: "milk" | "pineapple" | "none";
  toX?: number;
  slide?: boolean;
  beam?: boolean;
  beamBroken?: boolean;
  scanner?: boolean;
}> = ({
  pos = [0, 0, 0],
  scale = 1,
  xray = false,
  moving = true,
  product = "none",
  toX = 0.55,
  slide = false,
  beam = false,
  beamBroken = false,
  scanner = true,
}) => {
  const t = useT();
  const shift = moving ? (t * 0.85) % 0.5 : 0;
  const px = slide ? -2.05 + (toX + 2.05) * Math.min(1, t / 2.5) : toX;
  return (
    <group position={pos} scale={scale}>
      <ContactShadow pos={[0, 0.012, 0]} size={7.2} opacity={0.45} />
      {!xray ? (
        <group>
          <Box size={[6.6, 0.92, 2.1]} pos={[0, 0.46, 0]} map={painted("#3d6f7e", [3, 1], 700)} />
          <Box size={[6.8, 0.12, 2.3]} pos={[0, 0.96, 0]} color="#dce7e4" />
        </group>
      ) : (
        <group>
          <Box size={[6.8, 0.1, 2.3]} pos={[0, 0.16, 0]} color="#235b74" />
          <Box size={[6.8, 0.1, 2.3]} pos={[0, 1.9, 0]} color="#235b74" />
          {[-3.35, 3.35].map((x) => (
            <Box key={x} size={[0.1, 1.85, 2.3]} pos={[x, 1.03, 0]} color="#235b74" />
          ))}
        </group>
      )}
      <Box size={[6.1, 0.09, 1.4]} pos={[0, 1.08, 0]} color="#22242a" rough={0.55} />
      {Array.from({ length: 13 }).map((_, i) => {
        const x = -2.8 + i * 0.48 + shift;
        return (
          <Box
            key={i}
            size={[0.06, 0.02, 1.34]}
            pos={[x > 2.85 ? x - 6.24 : x, 1.14, 0]}
            color="#4a4d55"
            shadow={false}
          />
        );
      })}
      {[-2.95, 2.95].map((x) => (
        <Cyl key={x} r={0.19} h={1.45} pos={[x, 1.08, 0]} rot={[Math.PI / 2, 0, 0]} color="#9aa8ad" rough={0.5} />
      ))}
      <group position={[0, 0.45, 0]}>
        <Box size={[0.95, 0.6, 0.8]} color={xray ? "#d97b35" : "#63808a"} rough={0.5} />
        <Cyl r={0.22} h={0.1} pos={[0.5, 0, 0]} rot={[0, 0, Math.PI / 2]} color="#d9dde0" />
        <Box size={[0.16, 0.16, 0.16]} pos={[-0.5, 0.1, 0]} color="#f0c257" />
        <group rotation={[0, 0, moving ? t * 5 : 0]}>
          <Box size={[0.05, 0.45, 0.05]} pos={[0.56, 0, 0.2]} color="#28323a" shadow={false} />
          <Box size={[0.05, 0.45, 0.05]} pos={[0.56, 0, -0.2]} color="#28323a" shadow={false} />
        </group>
      </group>
      {xray ? (
        <group>
          <Box size={[3.3, 0.06, 0.06]} pos={[0, 0.86, 0.4]} color="#4ba5d6" shadow={false} />
          <Box size={[3.3, 0.06, 0.06]} pos={[0, 0.86, -0.4]} color="#4ba5d6" shadow={false} />
          <Cyl r={0.3} h={0.14} pos={[-1.65, 0.86, 0]} rot={[Math.PI / 2, 0, 0]} color="#e29b42" />
          <Cyl r={0.3} h={0.14} pos={[1.65, 0.86, 0]} rot={[Math.PI / 2, 0, 0]} color="#e29b42" />
        </group>
      ) : null}
      {beam ? (
        <group>
          <Box size={[0.16, 0.7, 0.16]} pos={[1.05, 1.5, 0.8]} color="#d94a42" />
          <Box size={[0.16, 0.7, 0.16]} pos={[1.05, 1.5, -0.8]} color="#d94a42" />
          <Box
            size={[0.035, 0.035, 1.55]}
            pos={[1.05, 1.5, 0]}
            color={beamBroken ? "#ff8b6e" : "#ff3b30"}
            emissive={beamBroken ? "#ff5533" : "#ff2018"}
            emissiveIntensity={2.6}
            shadow={false}
          />
          {beamBroken ? (
            <mesh position={[1.05, 1.5, 0]} layers={LAYER_FX}>
              <sphereGeometry args={[0.28, 16, 12]} />
              <meshBasicMaterial color="#ff6a4a" transparent opacity={0.45} depthWrite={false} fog={false} />
            </mesh>
          ) : null}
        </group>
      ) : null}
      {scanner ? (
        <group position={[2.6, 1.3, -0.2]}>
          <Box size={[0.9, 0.5, 0.85]} color="#e5e9e4" />
          <Box
            size={[0.55, 0.06, 0.6]}
            pos={[0, 0.28, 0]}
            color="#ff5a48"
            emissive="#ff2a18"
            emissiveIntensity={1.6}
            shadow={false}
          />
          <Box size={[0.5, 0.16, 0.04]} pos={[0, 0.02, 0.45]} color="#2f6fa8" />
        </group>
      ) : null}
      {product === "milk" ? <Milk pos={[px, 1.14, 0]} /> : null}
      {product === "pineapple" ? <Pineapple pos={[px, 1.14, 0]} scale={0.9} /> : null}
    </group>
  );
};

export const Motor: React.FC<{ pos?: V3; scale?: number; spin?: boolean }> = ({
  pos = [0, 0, 0],
  scale = 1,
  spin = true,
}) => {
  const t = useT();
  return (
    <group position={pos} scale={scale}>
      <Cyl r={0.85} h={2.0} rot={[0, 0, Math.PI / 2]} color="#2f6f9e" rough={0.5} />
      {[-0.7, -0.3, 0.1, 0.5].map((x) => (
        <Cyl key={x} r={0.9} h={0.07} pos={[x, 0, 0]} rot={[0, 0, Math.PI / 2]} color="#255e88" />
      ))}
      <Box size={[0.5, 0.5, 0.5]} pos={[-1.1, 0, 0]} color="#586b76" />
      <Cyl r={0.18} h={1.2} pos={[1.5, 0, 0]} rot={[0, 0, Math.PI / 2]} color="#c9d1d6" />
      <group rotation={[0, 0, spin ? t * 5 : 0]} position={[1.5, 0, 0]}>
        <Box size={[0.08, 1.1, 0.12]} color="#d9a23f" />
        <Box size={[0.08, 0.12, 1.1]} color="#d9a23f" />
      </group>
      <Box
        size={[0.16, 0.16, 0.16]}
        pos={[-0.9, 0.75, 0]}
        color="#4fe0c0"
        emissive="#20b894"
        emissiveIntensity={1.8}
        shadow={false}
      />
      <pointLight position={[0, 1.2, 1]} intensity={8} distance={4} decay={2} color="#4fd8ff" />
    </group>
  );
};

export const EnergyArrows: React.FC<{ pos?: V3; count?: number }> = ({ pos = [0, 0, 0], count = 3 }) => {
  const t = useT();
  return (
    <group position={pos}>
      {Array.from({ length: count }).map((_, i) => {
        const x = -1.6 + ((t * 1.5 + i * 0.7) % 2.1);
        return (
          <group key={i} position={[x, 0.6, 0.6]}>
            <Box size={[0.34, 0.1, 0.1]} color="#4fd8ff" emissive="#2ab0ff" emissiveIntensity={2.2} shadow={false} />
            <mesh position={[0.22, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.13, 0.22, 8]} />
              <meshBasicMaterial color="#7becff" fog={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const WaterWheel: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => {
  const t = useT();
  return (
    <group position={pos} scale={scale}>
      <Box size={[0.35, 4.2, 0.35]} pos={[-2.2, 2.1, 0]} color="#5a3e28" />
      <Box size={[0.35, 4.2, 0.35]} pos={[2.2, 2.1, 0]} color="#5a3e28" />
      <Box size={[5.1, 0.3, 0.4]} pos={[0, 4.0, 0]} color="#6a4a2e" />
      <group position={[0, 2.3, 0]} rotation={[0, 0, -t * 0.65]}>
        <mesh castShadow>
          <torusGeometry args={[1.85, 0.13, 10, 40]} />
          <meshStandardMaterial color="#4a301e" roughness={0.9} />
        </mesh>
        <mesh castShadow>
          <torusGeometry args={[1.25, 0.1, 10, 40]} />
          <meshStandardMaterial color="#4a301e" roughness={0.9} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
            <Box size={[0.1, 1.85, 0.7]} pos={[0, 1.15, 0]} color="#8a5c34" />
            <Box size={[0.24, 0.5, 0.75]} pos={[0, 2.05, 0]} color="#c08b4e" />
          </group>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={"s" + i} size={[0.08, 3.6, 0.08]} pos={[0, 0, 0]} rot={[0, 0, (i * Math.PI) / 4]} color="#6a4528" />
        ))}
        <Cyl r={0.24} h={1.1} rot={[Math.PI / 2, 0, 0]} color="#3a2718" />
      </group>
    </group>
  );
};

export const River: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  return (
    <group position={pos}>
      <Box size={[20, 0.12, 5]} pos={[0, -0.05, 0.3]} map={water("#2e6f9d", [4, 2])} />
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -8 + ((i * 1.9 + t * 2.2) % 18);
        return (
          <Box
            key={i}
            size={[0.7 + (i % 3) * 0.4, 0.02, 0.08]}
            pos={[x, 0.03, -0.6 + (i % 4) * 0.5]}
            color="#bfe8ff"
            shadow={false}
          />
        );
      })}
      {[-7, -3, 3, 7].map((x) => (
        <mesh key={x} position={[x, 0.1, 1.7]} castShadow>
          <sphereGeometry args={[0.45, 14, 10]} />
          <meshStandardMaterial color="#8a9386" roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

export const Millstones: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => {
  const t = useT();
  return (
    <group position={pos} scale={scale}>
      <Box size={[2.4, 0.5, 2.4]} pos={[0, 0.25, 0]} color="#8b8272" />
      <Cyl r={1.0} h={0.6} pos={[0, 0.8, 0]} color="#b2aa98" rough={0.95} />
      <Cyl r={0.1} h={0.5} pos={[0, 1.2, 0]} color="#4a301e" />
      <group rotation={[0, t * 0.6, 0]}>
        <Cyl r={1.0} h={0.55} pos={[0, 1.55, 0]} color="#c4bba7" rough={0.95} />
        <Box size={[1.7, 0.08, 0.08]} pos={[0, 1.84, 0]} color="#6a4528" />
      </group>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 0.35, 2.02, 0.2]} castShadow>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial color={i === 0 ? "#6b8a3a" : "#d8b64a"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

export const Heart: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => (
  <group position={pos} scale={scale}>
    <mesh position={[-0.16, 0.16, 0]} castShadow>
      <sphereGeometry args={[0.24, 16, 12]} />
      <meshStandardMaterial color="#e14a55" roughness={0.6} />
    </mesh>
    <mesh position={[0.16, 0.16, 0]} castShadow>
      <sphereGeometry args={[0.24, 16, 12]} />
      <meshStandardMaterial color="#e14a55" roughness={0.6} />
    </mesh>
    <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI]} castShadow>
      <coneGeometry args={[0.38, 0.6, 4]} />
      <meshStandardMaterial color="#e14a55" roughness={0.6} />
    </mesh>
  </group>
);