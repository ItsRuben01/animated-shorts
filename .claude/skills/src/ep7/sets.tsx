// ep7 — pickle factory sets. In-world labels are numbers, units and symbols only, so ES and EN share every shot.
import React from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";

export { Card, useT };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const GREEN = "#3f7d2e";
export const GREEN_DARK = "#2a5a20";
export const FLESH = "#cfe8a6";
export const PICKLED = "#9aa83a";
export const STEEL = "#aeb6bf";

// ---------- room ----------
export const Factory: React.FC<{ z?: number }> = ({ z = -7 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#a9b8b0", [10, 10])} rough={0.85} bevel={false} />
    <Box size={[60, 14, 0.4]} pos={[0, 7, z]} map={painted("#e4ece2", [8, 2])} rough={0.9} bevel={false} />
    <Box size={[60, 1.1, 0.5]} pos={[0, 1.2, z + 0.1]} color="#2e7d5b" rough={0.6} bevel={false} />
    <Box size={[60, 0.18, 0.55]} pos={[0, 1.85, z + 0.12]} color="#e0b44a" rough={0.5} bevel={false} />
    {[-9, -3, 3, 9].map((x) => (
      <Box key={x} size={[3.4, 2.4, 0.2]} pos={[x, 6.6, z + 0.25]} color="#fff6dc" emissive="#ffe9b8" emissiveIntensity={0.55} rough={0.3} />
    ))}
    <Cyl r={0.28} h={60} pos={[0, 9.4, z + 0.8]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.35} />
    <Cyl r={0.18} h={60} pos={[0, 8.7, z + 0.8]} rot={[0, 0, Math.PI / 2]} color="#c9603e" rough={0.45} />
  </group>
);

// ---------- cucumber ----------
// Drawn like the reference illustrations: lumpy silhouette with bumps on the outline, long pale streaks on a
// two-tone green skin, a stem nub at one end and the flower scar at the other, plus the ink outline.
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a: THREE.Color, b: THREE.Color, k: number) => a.clone().lerp(b, Math.max(0, Math.min(1, k)));

const cucumberGeo = (len: number, r: number, pickled: boolean) => {
  const NU = 72, NT = 36;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const base = new THREE.Color(pickled ? "#9aa83a" : "#4f9a34");
  const dark = new THREE.Color(pickled ? "#66721f" : "#2b6322");
  const streak = new THREE.Color(pickled ? "#c9d272" : "#9ccf62");
  for (let i = 0; i <= NU; i++) {
    const u = i / NU;
    // rounded ends, the stem end (+x) a little narrower, a slight belly off-centre
    const end = Math.pow(Math.sin(Math.PI * u), 0.42);
    const taper = 0.93 + 0.07 * (1 - u) + 0.05 * Math.sin(Math.PI * u * 1.2);
    for (let j = 0; j <= NT; j++) {
      const th = (j / NT) * Math.PI * 2;
      const lump = 1 + 0.045 * Math.sin(u * len * 7.3 + Math.sin(th * 3) * 1.4) * Math.sin(th * 4 + u * 5) + 0.03 * Math.sin(u * 23 + th * 7);
      const rad = r * end * taper * lump;
      pos.push((u - 0.5) * len, Math.cos(th) * rad, Math.sin(th) * rad);
      // streaks run along the length and wobble a little; the flower end (-x) and the belly are darker
      const st = Math.pow(Math.max(0, Math.cos(th * 6 + Math.sin(u * 7 + (j % 6)) * 0.35)), 3) * (0.35 + 0.65 * Math.sin(Math.PI * u));
      const under = Math.max(0, -Math.cos(th)) * 0.55 + Math.max(0, 0.22 - u) * 1.6;
      const c = mix(mix(base, streak, st * 0.85), dark, under);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NT; j++) {
    const a = i * (NT + 1) + j, b = a + NT + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

// Lies along x. len = total length, r = radius. dirt = brown specks (fresh from the field), pickled = olive colour.
export const Cucumber: React.FC<{ pos?: V3; rot?: V3; len?: number; r?: number; pickled?: number; dirt?: boolean; ink?: boolean; scale?: number }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], len = 2.2, r = 0.3, pickled = 0, dirt = false, ink = false, scale = 1,
}) => {
  const pk = pickled > 0.5;
  const L = Math.round(len * 50) / 50; // rebuild the mesh only when the length really changes
  const geo = React.useMemo(() => cucumberGeo(L, r, pk), [L, r, pk]);
  const nb = Math.max(8, Math.round(L * 11));
  const bumpCol = pk ? "#97a43a" : "#4b9533";
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <mesh geometry={geo} castShadow receiveShadow layers={ink ? LAYER_INK : 0}>
        <meshPhysicalMaterial vertexColors roughness={0.62} clearcoat={0.12} clearcoatRoughness={0.6} />
      </mesh>
      {/* bumps: half sunk into the skin so they break the outline, each with its dark spine dot */}
      {Array.from({ length: nb }).map((_, i) => {
        const u = 0.08 + 0.84 * ((i + hash(i) * 0.8) / nb);
        const th = hash(i + 7) * Math.PI * 2;
        const rr = r * Math.pow(Math.sin(Math.PI * u), 0.42) * 0.97;
        const y = Math.cos(th) * rr, z = Math.sin(th) * rr, x = (u - 0.5) * L;
        const k = r * (0.085 + hash(i + 3) * 0.04);
        return (
          <group key={i}>
            <mesh position={[x, y, z]} rotation={[th, 0, 0]} scale={[1.25, 0.6, 1.25]} layers={ink ? LAYER_INK : 0} castShadow>
              <sphereGeometry args={[k * 1.15, 12, 8]} />
              <meshStandardMaterial color={dirt && i % 3 === 0 ? "#6b4a2b" : bumpCol} roughness={0.55} />
            </mesh>
            <mesh position={[x, Math.cos(th) * (rr + k * 0.62), Math.sin(th) * (rr + k * 0.62)]}>
              <sphereGeometry args={[k * 0.22, 6, 5]} />
              <meshStandardMaterial color={pk ? "#4a5218" : "#1d3f17"} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      {/* stem nub (+x) and flower scar (-x) */}
      <group position={[L / 2 - r * 0.02, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <Cyl r={r * 0.13} r2={r * 0.09} h={r * 0.4} pos={[0, r * 0.18, 0]} color={pk ? "#7a6a2a" : "#6f8a2a"} rough={0.7} ink={ink} />
      </group>
      <mesh position={[-L / 2 + r * 0.03, 0, 0]} scale={[0.4, 1, 1]}>
        <sphereGeometry args={[r * 0.14, 10, 8]} />
        <meshStandardMaterial color={pk ? "#c9c36a" : "#d8e27a"} roughness={0.7} />
      </mesh>
      {dirt
        ? Array.from({ length: 7 }).map((_, i) => (
            <mesh key={"d" + i} position={[-L * 0.4 + (i / 6) * L * 0.8, -r * 0.6, r * 0.72]} scale={[1.6, 0.8, 0.5]}>
              <sphereGeometry args={[r * 0.16, 8, 6]} />
              <meshStandardMaterial color="#5a3d22" roughness={1} />
            </mesh>
          ))
        : null}
    </group>
  );
};

// One round slice seen face-on (+y up): skin ring, pale flesh, three-lobed seed core with seeds.
export const Slice: React.FC<{ r?: number; h?: number; pickled?: boolean; seeds?: boolean }> = ({ r = 0.3, h = 0.06, pickled = true, seeds = true }) => (
  <group>
    <Cyl r={r} h={h} color={pickled ? "#7f8c2c" : GREEN} rough={0.5} seg={22} />
    <Cyl r={r * 0.9} h={h + 0.006} color={pickled ? "#e2dc8e" : "#eef3c6"} rough={0.6} seg={22} />
    {seeds ? <>
      <Cyl r={r * 0.42} h={h + 0.012} color={pickled ? "#c8cc6a" : "#cfe39a"} rough={0.5} seg={3} />
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[Math.cos(k * 2.094 + 0.5) * r * 0.2, h / 2 + 0.008, Math.sin(k * 2.094 + 0.5) * r * 0.2]} rotation={[-Math.PI / 2, 0, -(k * 2.094 + 0.5)]} scale={[1, 0.5, 0.3]}>
          <sphereGeometry args={[r * 0.09, 8, 6]} />
          <meshStandardMaterial color="#fbf6dc" roughness={0.6} />
        </mesh>
      ))}
    </> : null}
  </group>
);

// ---------- step 1: washer ----------
export const Washer: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  return (
    <group position={pos}>
      {[-2.1, 2.1].map((x) => <Box key={x} size={[0.25, 1.3, 1.6]} pos={[x, 0.65, 0]} color="#5b6b78" rough={0.6} />)}
      <Box size={[4.6, 0.22, 1.6]} pos={[0, 1.4, 0]} color="#2d3a44" rough={0.8} />
      {Array.from({ length: 5 }).map((_, i) => {
        const x = (((i * 1.15 + t * 0.7) % 5.75) + 5.75) % 5.75 - 2.9;
        return <Cucumber key={i} pos={[x, 1.78, (i % 2) * 0.35 - 0.15]} rot={[0, 0.25 - (i % 3) * 0.2, 0]} len={1.0} r={0.17} dirt={x < -0.6} />;
      })}
      {/* spray bar + jets */}
      <Cyl r={0.12} h={4.4} pos={[0, 3.3, 0]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.3} />
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => (
        <group key={x}>
          <Cyl r={0.09} r2={0.05} h={0.25} pos={[x, 3.1, 0]} color="#7c8792" rough={0.3} />
          <mesh position={[x, 2.45, 0]} layers={LAYER_FX}>
            <coneGeometry args={[0.34 + Math.sin(t * 30 + i) * 0.03, 1.15, 14, 1, true]} />
            <meshBasicMaterial color="#d8f1ff" transparent opacity={0.42 + Math.sin(t * 22 + i * 2) * 0.08} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* soft brushes turning */}
      {[-0.9, 0.9].map((x) => (
        <group key={x} position={[x, 2.25, 0]} rotation={[0, 0, t * 6]}>
          <Cyl r={0.12} h={1.5} rot={[Math.PI / 2, 0, 0]} color="#2f6f8f" rough={0.95} />
          {Array.from({ length: 6 }).map((_, k) => (
            <Box key={k} size={[0.42, 0.05, 1.4]} rot={[0, 0, (k * Math.PI) / 6]} color="#7fc4e0" rough={1} bevel={false} shadow={false} />
          ))}
        </group>
      ))}
      <ContactShadow pos={[0, 0.02, 0]} size={5.2} opacity={0.5} />
    </group>
  );
};

// ---------- step 1b: grader (sorted by thickness, smaller = worth more) ----------
const Coins: React.FC<{ n: number; pos: V3 }> = ({ n, pos }) => (
  <group position={pos}>
    {Array.from({ length: n }).map((_, i) => (
      <Cyl key={i} r={0.26} h={0.09} pos={[0, i * 0.1, 0]} color="#f0c24a" emissive="#d99a1e" emissiveIntensity={0.25} rough={0.25} clearcoat={0.6} />
    ))}
  </group>
);

export const Grader: React.FC<{ pos?: V3; coins?: number }> = ({ pos = [0, 0, 0], coins = 1 }) => {
  const bins = [
    { x: -1.45, r: 0.13, label: "Ø 25 mm", n: 5 },
    { x: 0, r: 0.2, label: "Ø 38 mm", n: 3 },
    { x: 1.45, r: 0.27, label: "Ø 50 mm", n: 1 },
  ];
  return (
    <group position={pos}>
      {bins.map((b, i) => (
        <group key={i} position={[b.x, 0, 0]}>
          <Box size={[1.3, 0.12, 1.3]} pos={[0, 0.06, 0]} color="#2f6f8f" rough={0.6} />
          <Box size={[1.3, 0.9, 0.1]} pos={[0, 0.5, -0.6]} color="#2f6f8f" rough={0.6} />
          <Box size={[1.3, 0.6, 0.1]} pos={[0, 0.35, 0.6]} color="#3c86a8" rough={0.6} />
          <Box size={[0.1, 0.9, 1.3]} pos={[-0.6, 0.5, 0]} color="#2f6f8f" rough={0.6} />
          <Box size={[0.1, 0.9, 1.3]} pos={[0.6, 0.5, 0]} color="#2f6f8f" rough={0.6} />
          {[0, 1, 2].map((k) => (
            <Cucumber key={k} pos={[0, 0.25 + k * b.r * 1.7, -0.25 + k * 0.22]} rot={[0, 0.3 * (k - 1), 0]} len={0.9 + b.r * 1.5} r={b.r} />
          ))}
          <Card pos={[0, 1.45, 0.62]} lines={[b.label]} w={1.25} h={0.42} bg="#173846" fg="#f7e8bc" />
          <Coins n={Math.round(b.n * clamp(coins))} pos={[0, 1.95, 0.4]} />
        </group>
      ))}
      <ContactShadow pos={[0, 0.02, 0]} size={4.6} opacity={0.45} />
    </group>
  );
};

// ---------- step 2: brine tank ----------
export const Tank: React.FC<{ pos?: V3; bubbles?: N; nitrogen?: boolean; label?: boolean }> = ({ pos = [0, 0, 0], bubbles = 0, nitrogen = false, label = true }) => {
  const t = useT();
  const b = clamp(num(bubbles, t));
  return (
    <group position={pos}>
      {/* glassy cutaway shell + brine */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 4.8, 40, 1, true]} />
        <meshPhysicalMaterial color="#e9f4ee" transparent opacity={0.28} roughness={0.15} clearcoat={0.6} side={2} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[1.92, 1.92, 4.1, 40]} />
        <meshStandardMaterial color="#cfe6c3" transparent opacity={0.38} roughness={0.2} depthWrite={false} />
      </mesh>
      <Cyl r={2.12} h={0.25} pos={[0, 4.85, 0]} color="#d9dfe2" rough={0.4} />
      <Cyl r={2.12} h={0.3} pos={[0, 0.15, 0]} color="#d9dfe2" rough={0.4} />
      {[0, 1, 2, 3].map((k) => <Box key={k} size={[0.18, 0.6, 0.18]} pos={[Math.cos(k * 1.57 + 0.78) * 1.7, -0.0, Math.sin(k * 1.57 + 0.78) * 1.7]} color="#7c8792" />)}
      {Array.from({ length: 14 }).map((_, i) => (
        <Cucumber key={i} pos={[Math.cos(i * 2.2) * 1.1, 0.6 + (i % 7) * 0.5, Math.sin(i * 2.2) * 1.1]} rot={[i * 0.4, i * 0.9, 0.2]} len={1.0} r={0.17} pickled={0.3} />
      ))}
      {/* rising gas / nitrogen bubbles */}
      {b > 0
        ? Array.from({ length: 36 }).map((_, i) => {
            const y = (((i * 0.37 + t * (nitrogen ? 1.4 : 0.6)) % 4.0) + 4.0) % 4.0;
            const a = i * 1.7;
            const rr = nitrogen ? 0.6 + (i % 5) * 0.25 : 0.4 + (i % 7) * 0.2;
            return (
              <mesh key={i} position={[Math.cos(a) * rr, 0.3 + y, Math.sin(a) * rr]} scale={b}>
                <sphereGeometry args={[nitrogen ? 0.09 : 0.06, 10, 8]} />
                <meshStandardMaterial color={nitrogen ? "#e8f7ff" : "#ffffff"} transparent opacity={0.8} roughness={0.1} />
              </mesh>
            );
          })
        : null}
      {nitrogen ? (
        <>
          <Cyl r={0.14} h={3.2} pos={[2.4, 2.6, 0.4]} color="#3d6fb6" rough={0.3} />
          <Cyl r={0.14} h={0.8} pos={[2.0, 1.0, 0.4]} rot={[0, 0, Math.PI / 2]} color="#3d6fb6" rough={0.3} />
          <Card pos={[2.4, 4.6, 0.6]} lines={["N₂"]} w={0.9} h={0.6} bg="#1d3f78" fg="#e8f2ff" />
        </>
      ) : null}
      {label ? <Card pos={[0, 3.2, 2.15]} lines={["6 % NaCl"]} w={2.4} h={0.62} bg="#173846" fg="#f7e8bc" /> : null}
      <ContactShadow pos={[0, 0.02, 0]} size={5.4} opacity={0.5} />
    </group>
  );
};

// ---------- step 2 proof: x-ray slice of a cucumber ----------
// acid 0..1 = how far the acid front has travelled to the centre; water = drops leaving; hollow 0..1 = gas cavity (bloater).
export const XSlice: React.FC<{ pos?: V3; scale?: number; acid?: N; water?: boolean; gas?: N; hollow?: N }> = ({
  pos = [0, 2.2, 0], scale = 1, acid = 0, water = false, gas = 0, hollow = 0,
}) => {
  const t = useT();
  const a = clamp(num(acid, t));
  const g = clamp(num(gas, t));
  const h = clamp(num(hollow, t));
  const R = 1.9;
  return (
    <group position={pos} scale={scale}>
      {/* the rest of the cucumber behind the cut */}
      <Cyl r={R + 0.15} h={2.4} pos={[0, 0, -1.3]} rot={[Math.PI / 2, 0, 0]} color={GREEN} rough={0.5} clearcoat={0.3} seg={40} />
      {/* bumps around the skin edge so the outline reads as cucumber, not as a plate */}
      {Array.from({ length: 22 }).map((_, i) => {
        const an = i * 0.2856 + hash(i) * 0.12;
        return (
          <mesh key={"b" + i} position={[Math.cos(an) * (R + 0.17), Math.sin(an) * (R + 0.17), -0.12 - hash(i + 5) * 0.6]}>
            <sphereGeometry args={[0.1 + hash(i + 9) * 0.05, 10, 8]} />
            <meshStandardMaterial color="#4c9636" roughness={0.55} />
          </mesh>
        );
      })}
      <Cyl r={R + 0.15} h={0.12} pos={[0, 0, 0]} rot={[Math.PI / 2, 0, 0]} color={GREEN_DARK} rough={0.5} seg={40} />
      {/* thin light-green rind under the skin */}
      <Cyl r={R + 0.02} h={0.13} pos={[0, 0, 0.01]} rot={[Math.PI / 2, 0, 0]} color="#8cc456" rough={0.55} seg={40} />
      {/* acid-cured flesh (olive, translucent look) grows inward over the fresh cream flesh */}
      <Cyl r={R * 0.95} h={0.14} pos={[0, 0, 0.02]} rot={[Math.PI / 2, 0, 0]} color="#c3c85c" rough={0.45} seg={40} />
      <Cyl r={Math.max(0.01, R * 0.95 * (1 - a))} h={0.16} pos={[0, 0, 0.03]} rot={[Math.PI / 2, 0, 0]} color="#ecf2c2" rough={0.6} seg={40} />
      {/* three-lobed seed core with rows of seeds */}
      {[[0, 0, 0.42], ...[0, 1, 2].map((k) => [Math.cos(Math.PI / 2 + k * 2.094) * 0.36, Math.sin(Math.PI / 2 + k * 2.094) * 0.36, 0.36])].map(([x, y, rr], k) => (
        <mesh key={"c" + k} position={[x, y, 0.115]}>
          <circleGeometry args={[rr, 28]} />
          <meshStandardMaterial color={a > 0.95 ? "#d2d47a" : "#d4e6a2"} roughness={0.5} />
        </mesh>
      ))}
      {[0, 1, 2].map((k) => {
        const an = Math.PI / 2 + k * 2.094;
        return [0.28, 0.55].map((d, m) => (
          <mesh key={k + "-" + m} position={[Math.cos(an) * d, Math.sin(an) * d, 0.13]} rotation={[0, 0, an]} scale={[1, 0.45, 0.3]}>
            <sphereGeometry args={[0.16 - m * 0.02, 10, 8]} />
            <meshStandardMaterial color="#fbf6dc" roughness={0.6} />
          </mesh>
        ));
      })}
      {/* acid arrows pushing in */}
      {a > 0 && a < 1
        ? Array.from({ length: 8 }).map((_, i) => {
            const ang = i * 0.785;
            const rr = R * (1 - a) + 0.35;
            return (
              <mesh key={"a" + i} position={[Math.cos(ang) * rr, Math.sin(ang) * rr, 0.25]} rotation={[0, 0, ang + Math.PI / 2]}>
                <coneGeometry args={[0.13, 0.34, 10]} />
                <meshStandardMaterial color="#f0c24a" emissive="#d99a1e" emissiveIntensity={0.35} />
              </mesh>
            );
          })
        : null}
      {/* water drops pulled out by the salt */}
      {water
        ? Array.from({ length: 10 }).map((_, i) => {
            const ang = i * 0.628 + 0.3;
            const k = (((t * 0.6 + i * 0.13) % 1) + 1) % 1;
            const rr = R + 0.2 + k * 1.1;
            return (
              <mesh key={"w" + i} position={[Math.cos(ang) * rr, Math.sin(ang) * rr, 0.25]} scale={[1, 1.3, 1]}>
                <sphereGeometry args={[0.1 * (1 - k * 0.4), 10, 8]} />
                <meshStandardMaterial color="#7cc8f0" transparent opacity={0.85} roughness={0.1} />
              </mesh>
            );
          })
        : null}
      {/* gas bubbles inside the flesh */}
      {g > 0
        ? Array.from({ length: 9 }).map((_, i) => (
            <mesh key={"g" + i} position={[Math.cos(i * 2.3) * (0.3 + (i % 3) * 0.35), Math.sin(i * 2.3) * (0.3 + (i % 3) * 0.35) + Math.sin(t * 3 + i) * 0.05, 0.2]} scale={g}>
              <sphereGeometry args={[0.13 + (i % 3) * 0.05, 12, 10]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.05} />
            </mesh>
          ))
        : null}
      {/* hollow cavity (bloater) */}
      {h > 0 ? (
        <mesh position={[0, 0, 0.12]} scale={[h * 1.15, h * 0.72, 0.1]}>
          <sphereGeometry args={[1, 28, 18]} />
          <meshStandardMaterial color="#1f2b24" roughness={1} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- analogy: shaken soda bottle ----------
export const Soda: React.FC<{ pos?: V3; shake?: N }> = ({ pos = [0, 0, 0], shake = 1 }) => {
  const t = useT();
  const s = clamp(num(shake, t));
  return (
    <group position={pos} rotation={[0, 0, Math.sin(t * 28) * 0.12 * s]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 2.0, 28]} />
        <meshPhysicalMaterial color="#5a9a4a" transparent opacity={0.55} roughness={0.08} clearcoat={0.8} depthWrite={false} />
      </mesh>
      <Cyl r={0.55} r2={0.2} h={0.6} pos={[0, 2.5, 0]} color="#5a9a4a" rough={0.1} />
      <Cyl r={0.21} h={0.4} pos={[0, 2.95, 0]} color="#c93b3b" rough={0.4} ink />
      <Cyl r={0.5} h={1.7} pos={[0, 1.05, 0]} color="#c8923a" rough={0.3} />
      {Array.from({ length: 24 }).map((_, i) => {
        const y = (((i * 0.21 + t * 1.8) % 1.9) + 1.9) % 1.9;
        return (
          <mesh key={i} position={[Math.cos(i * 2.4) * 0.3, 0.25 + y, Math.sin(i * 2.4) * 0.3 + 0.2]} scale={0.4 + s * 0.8}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#fff6dc" transparent opacity={0.9} />
          </mesh>
        );
      })}
      <ContactShadow pos={[0, 0.02, 0]} size={1.8} />
    </group>
  );
};

// ---------- jar ----------
export const Jar: React.FC<{ pos?: V3; scale?: number; slices?: number; fill?: number; lid?: boolean; tag?: boolean; glow?: number }> = ({
  pos = [0, 0, 0], scale = 1, slices = 14, fill = 0.85, lid = true, tag = false, glow = 0,
}) => (
  <group position={pos} scale={scale}>
    <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.72, 0.72, 2.0, 32, 1, true]} />
      <meshPhysicalMaterial color="#eef8f4" transparent opacity={0.3} roughness={0.05} clearcoat={1} side={2} depthWrite={false} />
    </mesh>
    <Cyl r={0.74} h={0.08} pos={[0, 0.04, 0]} color="#dfeee8" rough={0.1} />
    <mesh position={[0, 0.08 + fill, 0]}>
      <cylinderGeometry args={[0.68, 0.68, fill * 2 - 0.1, 32]} />
      <meshStandardMaterial color="#e7dc8a" transparent opacity={0.45} roughness={0.1} depthWrite={false} emissive="#ff9a3a" emissiveIntensity={glow * 0.5} />
    </mesh>
    {Array.from({ length: slices }).map((_, i) => (
      <group key={i} position={[Math.cos(i * 2.4) * 0.32, 0.22 + i * 0.12, Math.sin(i * 2.4) * 0.32]} rotation={[1.2 + Math.sin(i) * 0.4, i, 0]}>
        <Slice r={0.3} h={0.06} seeds={i % 2 === 0} />
      </group>
    ))}
    {lid ? (
      <>
        <Cyl r={0.78} h={0.28} pos={[0, 2.12, 0]} color="#d9a23f" rough={0.3} clearcoat={0.6} ink />
        <Cyl r={0.6} h={0.05} pos={[0, 2.28, 0]} color="#e9c060" rough={0.3} />
      </>
    ) : null}
    {tag ? <Card pos={[0, 1.05, 0.75]} lines={["@ ______"]} w={1.15} h={0.62} bg="#fff6dc" fg="#2a5a20" /> : null}
    <ContactShadow pos={[0, 0.02, 0]} size={2.0} opacity={0.55} />
  </group>
);

// ---------- step 3: slicer ----------
export const Slicer: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  const feed = ((t * 0.35) % 1);
  return (
    <group position={pos}>
      <Box size={[3.4, 1.6, 1.4]} pos={[0, 0.8, 0]} color="#5b6b78" rough={0.6} />
      <Box size={[3.4, 0.14, 1.0]} pos={[-0.2, 1.67, 0]} color="#2d3a44" rough={0.8} />
      <group position={[0.75, 2.05, 0]} rotation={[0, 0, -t * 9]}>
        <Cyl r={0.75} h={0.06} rot={[Math.PI / 2, 0, 0]} color="#e8eef3" rough={0.15} clearcoat={0.8} />
        <Box size={[0.18, 1.4, 0.08]} color="#9aa6b1" rough={0.3} />
      </group>
      <Box size={[0.3, 1.0, 1.2]} pos={[0.75, 2.6, -0.2]} color="#c9603e" rough={0.5} />
      <Cucumber pos={[-0.55 + feed * 0.35, 1.95, 0]} len={1.9} r={0.24} pickled={1} />
      {Array.from({ length: 6 }).map((_, i) => {
        const k = (((t * 1.3 + i / 6) % 1) + 1) % 1;
        return (
          <group key={i} position={[1.05 + k * 0.6, 1.9 - k * k * 1.6, 0.1]} rotation={[0, 0, k * 6]}>
            <group rotation={[0, 0, Math.PI / 2]}><Slice r={0.24} h={0.05} /></group>
          </group>
        );
      })}
      <ContactShadow pos={[0, 0.02, 0]} size={4} opacity={0.5} />
    </group>
  );
};

// ---------- step 4: pasteurising tunnel ----------
export const Tunnel: React.FC<{ pos?: V3; labels?: boolean }> = ({ pos = [0, 0, 0], labels = true }) => {
  const t = useT();
  return (
    <group position={pos}>
      <Box size={[6.5, 0.25, 1.3]} pos={[0, 0.9, 0]} color="#2d3a44" rough={0.8} />
      {[-3, 3].map((x) => <Box key={x} size={[0.25, 0.9, 1.2]} pos={[x, 0.45, 0]} color="#5b6b78" />)}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = (((i * 1.5 + t * 0.5) % 7.5) + 7.5) % 7.5 - 3.6;
        const inside = Math.abs(x) < 1.6 ? 1 : 0;
        return <Jar key={i} pos={[x, 1.03, 0]} scale={0.42} glow={inside} />;
      })}
      {/* tunnel body, open front so the jars read */}
      <Box size={[3.4, 0.35, 1.6]} pos={[0, 2.35, 0]} color="#c9603e" rough={0.5} />
      <Box size={[3.4, 1.5, 0.12]} pos={[0, 1.65, -0.75]} color="#b0502f" rough={0.5} />
      {[-1.65, 1.65].map((x) => <Box key={x} size={[0.12, 1.5, 1.6]} pos={[x, 1.65, 0]} color="#c9603e" rough={0.5} />)}
      <mesh position={[0, 1.6, 0]} layers={LAYER_FX}>
        <boxGeometry args={[3.1, 1.2, 1.3]} />
        <meshBasicMaterial color="#ff9a3a" transparent opacity={0.18 + Math.sin(t * 4) * 0.03} depthWrite={false} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.8, 0.6]} color="#ffae5a" intensity={6} distance={5} decay={1.6} />
      {labels ? (
        <>
          <Card pos={[-0.85, 3.05, 0.4]} lines={["74 °C"]} w={1.5} h={0.62} bg="#4a2430" fg="#ffe6ad" />
          <Card pos={[0.85, 3.05, 0.4]} lines={["15 min"]} w={1.5} h={0.62} bg="#173846" fg="#f7e8bc" />
        </>
      ) : null}
      <ContactShadow pos={[0, 0.02, 0]} size={6.5} opacity={0.45} />
    </group>
  );
};

// ---------- pH meter ----------
export const PhMeter: React.FC<{ pos?: V3; value: string; ok?: boolean }> = ({ pos = [0, 0, 0], value, ok = true }) => (
  <group position={pos}>
    <Box size={[1.5, 2.3, 0.4]} pos={[0, 1.15, 0]} color="#f2efe6" rough={0.5} ink />
    <Card pos={[0, 1.6, 0.22]} lines={[value]} w={1.2} h={0.6} bg="#10241a" fg="#7dff9a" />
    <Cyl r={0.22} h={0.2} pos={[0, 0.7, 0.24]} rot={[Math.PI / 2, 0, 0]} color={ok ? "#3fbf6a" : "#c93b3b"} emissive={ok ? "#3fbf6a" : "#c93b3b"} emissiveIntensity={0.5} />
    <Cyl r={0.06} h={1.6} pos={[0, -0.6, 0]} color="#3a3f46" rough={0.4} />
  </group>
);

// ---------- big step number on a stand ----------
// big step number: own canvas so the digit fills the plate
const numCache = new Map<string, THREE.CanvasTexture>();
const numTex = (n: string) => {
  const hit = numCache.get(n);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e0b44a"; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#173846"; g.lineWidth = 18; g.strokeRect(22, 22, 468, 468);
  g.fillStyle = "#173846"; g.font = '900 380px "Trebuchet MS", "Segoe UI", Arial, sans-serif';
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 256, 280);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  numCache.set(n, t);
  return t;
};

export const StepSign: React.FC<{ n: string; pos: V3; size?: number }> = ({ n, pos, size = 1 }) => (
  <group position={pos}>
    <Cyl r={0.06} h={pos[1]} pos={[0, -pos[1] / 2, 0]} color="#3a3f46" />
    <Box size={[0.95 * size, 0.95 * size, 0.12]} pos={[0, 0.3, 0]} color="#d9a23f" rough={0.55} shadow={false} />
    <Box size={[0.85 * size, 0.85 * size, 0.06]} pos={[0, 0.3, 0.08]} map={numTex(n)} shadow={false} bevel={false} />
  </group>
);

// 3D arrow (before → after), no glyph needed
export const Arrow: React.FC<{ pos: V3; len?: number }> = ({ pos, len = 0.9 }) => (
  <group position={pos}>
    <Box size={[len, 0.16, 0.16]} pos={[-0.12, 0, 0]} color="#e0b44a" rough={0.4} ink />
    <mesh position={[len / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
      <coneGeometry args={[0.24, 0.4, 16]} />
      <meshStandardMaterial color="#e0b44a" roughness={0.4} />
    </mesh>
  </group>
);
