// ep13 — banana ripening with ethylene. In-world labels: numbers, units, symbols only (ES and EN share every shot).
import React, { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow, StepSign } from "../ep7/sets";
import { Cross } from "../ep10/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, StepSign, Cross };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const GREEN = new THREE.Color("#6fae3a");
const YELLOW = new THREE.Color("#f6d23a");
const GREY = new THREE.Color("#7d7a6a");
const peel = (ripe: number, grey: number) => GREEN.clone().lerp(YELLOW, clamp(ripe)).lerp(GREY, clamp(grey));

// ---------- one banana: curved tube with tapered ends, dark stem tip ----------
export const Banana: React.FC<{ pos?: V3; rot?: V3; s?: number; ripe?: N; grey?: N; spots?: boolean }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], s = 1, ripe = 0, grey = 0, spots = false,
}) => {
  const t = useT();
  const r = num(ripe, t), g = num(grey, t);
  const geo = useMemo(() => {
    const pts = Array.from({ length: 9 }).map((_, i) => {
      const u = i / 8 - 0.5;
      return new THREE.Vector3(u * 1.6, -u * u * 1.1, 0);
    });
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 40, 0.17, 6, false);
    // taper the radius towards both ends
    const p = tube.attributes.position as THREE.BufferAttribute;
    const segs = 41, radial = 7;
    for (let i = 0; i < segs; i++) {
      const u = i / (segs - 1);
      const k = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, Math.max(0, u * 1.05 - 0.02)));
      const c = curve.getPointAt(Math.min(1, u));
      for (let j = 0; j < radial; j++) {
        const idx = i * radial + j;
        const v = new THREE.Vector3(p.getX(idx), p.getY(idx), p.getZ(idx)).sub(c).multiplyScalar(k).add(c);
        p.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    tube.computeVertexNormals();
    return tube;
  }, []);
  const col = peel(r, g);
  return (
    <group position={pos} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow layers={LAYER_INK}>
        <meshPhysicalMaterial color={col} roughness={0.55} clearcoat={0.25} flatShading />
      </mesh>
      <Cyl r={0.05} h={0.22} pos={[-0.86, -0.25, 0]} rot={[0, 0, 0.9]} color="#5a4a2a" rough={0.8} />
      <mesh position={[0.82, -0.3, 0]}><sphereGeometry args={[0.05, 8, 6]} /><meshStandardMaterial color="#3e3424" /></mesh>
      {spots && r > 0.8 ? [0.2, -0.3, 0.45].map((x, i) => (
        <mesh key={i} position={[x, -x * x * 0.7 + 0.16, 0.08]}><sphereGeometry args={[0.035, 8, 6]} /><meshStandardMaterial color="#6a4a22" /></mesh>
      )) : null}
    </group>
  );
};

// a hand of bananas (5 fingers fanned)
export const Hand: React.FC<{ pos?: V3; rot?: V3; s?: number; ripe?: N; grey?: N }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], s = 1, ripe = 0, grey = 0 }) => (
  <group position={pos} rotation={rot} scale={s}>
    {[-2, -1, 0, 1, 2].map((k) => (
      <Banana key={k} pos={[k * 0.06, 0.02 * k * k + k * 0.13, k * 0.16]} rot={[k * 0.22, 0, -k * 0.09]} ripe={ripe} grey={grey} />
    ))}
    <Cyl r={0.12} h={0.3} pos={[-0.95, -0.2, 0]} rot={[0, 0, 1.2]} color="#7a6a3a" rough={0.8} />
  </group>
);

// cardboard box of bananas
export const Crate: React.FC<{ pos?: V3; ripe?: N; rot?: V3 }> = ({ pos = [0, 0, 0], ripe = 0, rot = [0, 0, 0] }) => (
  <group position={pos} rotation={rot}>
    <Box size={[1.2, 0.5, 0.8]} pos={[0, 0.25, 0]} color="#c9a46a" rough={0.85} ink />
    <Box size={[1.22, 0.08, 0.82]} pos={[0, 0.48, 0]} color="#3f7d3a" rough={0.7} bevel={false} />
    <Hand pos={[0.05, 0.75, 0]} s={0.42} ripe={ripe} />
  </group>
);

// pallet stack of crates (rows × cols × layers)
export const Pallet: React.FC<{ pos?: V3; ripe?: N; layers?: number }> = ({ pos = [0, 0, 0], ripe = 0, layers = 3 }) => (
  <group position={pos}>
    <Box size={[2.6, 0.2, 1.8]} pos={[0, 0.1, 0]} color="#a07848" rough={0.9} />
    {Array.from({ length: layers }).map((_, l) => [-0.62, 0.62].map((x) => [-0.42, 0.42].map((z) => (
      <Box key={`${l}${x}${z}`} size={[1.18, 0.5, 0.78]} pos={[x, 0.45 + l * 0.52, z]} color="#c9a46a" rough={0.85} />
    ))))}
    {[-0.62, 0.62].map((x) => <Hand key={x} pos={[x + 0.05, 0.45 + layers * 0.52 + 0.08, 0.42]} s={0.4} ripe={ripe} />)}
    <ContactShadow pos={[0, 0.01, 0]} size={3.2} opacity={0.45} />
  </group>
);

// ---------- ethylene molecule C2H4: two dark carbons + four small white hydrogens ----------
export const Ethylene: React.FC<{ pos: V3; s?: number; rot?: number; glow?: number }> = ({ pos, s = 0.12, rot = 0, glow = 0.4 }) => (
  <group position={pos} rotation={[rot * 0.7, rot, 0]}>
    {[-1, 1].map((k) => (
      <group key={k}>
        <mesh position={[k * s * 0.8, 0, 0]} layers={LAYER_FX}>
          <sphereGeometry args={[s, 14, 10]} />
          <meshStandardMaterial color="#5a6a8a" emissive="#7fe0c0" emissiveIntensity={glow * 0.5} roughness={0.4} />
        </mesh>
        {[-1, 1].map((m) => (
          <mesh key={m} position={[k * s * 1.6, m * s * 0.9, 0]} layers={LAYER_FX}>
            <sphereGeometry args={[s * 0.55, 10, 8]} />
            <meshStandardMaterial color="#f4f6f8" emissive="#bff0e0" emissiveIntensity={glow * 0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

// a drifting cloud of ethylene molecules in a box
export const GasCloud: React.FC<{ pos?: V3; w?: number; h?: number; d?: number; n?: number; on?: N; s?: number; from?: V3 }> = ({
  pos = [0, 0, 0], w = 4, h = 3, d = 2, n = 22, on = 1, s = 0.08, from,
}) => {
  const t = useT();
  const k = clamp(num(on, t));
  if (k <= 0) return null;
  return (
    <group position={pos}>
      {Array.from({ length: n }).map((_, i) => {
        const target: V3 = [(hash(i) - 0.5) * w + Math.sin(t * 0.9 + i) * 0.15, (hash(i + 31) - 0.5) * h + Math.cos(t * 0.7 + i * 2) * 0.15, (hash(i + 57) - 0.5) * d];
        const appear = clamp(k * 1.6 - (i / n) * 0.6);
        if (appear <= 0) return null;
        const p: V3 = from
          ? [from[0] + (target[0] - from[0]) * ease(appear), from[1] + (target[1] - from[1]) * ease(appear), from[2] + (target[2] - from[2]) * ease(appear)]
          : target;
        return <Ethylene key={i} pos={p} s={s * (0.4 + 0.6 * appear)} rot={t * (0.5 + hash(i + 5)) + i} />;
      })}
    </group>
  );
};

// ---------- ripening room: insulated white panels, big roller door, gas nozzle ----------
export const Room: React.FC<{ z?: number; door?: N }> = ({ z = -6, door = 0 }) => {
  const t = useT();
  const dz = clamp(num(door, t));
  return (
    <group>
      <Box size={[50, 0.4, 50]} pos={[0, -0.2, 0]} map={painted("#a9aeb8", [10, 10])} rough={0.6} bevel={false} />
      <Box size={[50, 12, 0.4]} pos={[0, 6, z]} map={painted("#eef0f3", [8, 2])} rough={0.85} bevel={false} />
      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={i} size={[0.06, 12, 0.1]} pos={[-19 + i * 2, 6, z + 0.25]} color="#d4d8de" rough={0.7} bevel={false} shadow={false} />
      ))}
      <Box size={[50, 0.35, 0.4]} pos={[0, 0.5, z + 0.3]} color="#f2c230" rough={0.5} bevel={false} />
      {/* gas nozzle + pipe on the wall */}
      <Cyl r={0.08} h={50} pos={[0, 5.2, z + 0.5]} rot={[0, 0, Math.PI / 2]} color="#b4bcc6" rough={0.35} />
      <Cyl r={0.12} h={0.4} pos={[1.6, 4.95, z + 0.6]} color="#3f8f7a" rough={0.4} ink />
      {/* roller door coming down (in front-left of the scene) */}
      {dz > 0 ? <Box size={[6, 5.6 * dz, 0.15]} pos={[-5.2, 6 - 2.8 * dz, 1.5]} color="#e6e9ee" rough={0.6} /> : null}
    </group>
  );
};

// ---------- the open sea + a reefer cargo ship ----------
export const Sea: React.FC = () => {
  const t = useT();
  return (
    <group>
      <Box size={[200, 0.4, 200]} pos={[0, -0.3, 0]} color="#3f7fb8" rough={0.3} bevel={false} />
      {Array.from({ length: 18 }).map((_, i) => (
        <Box key={i} size={[1.2, 0.04, 0.12]} pos={[(hash(i) - 0.5) * 30 + Math.sin(t + i) * 0.3, -0.08, -2 - hash(i + 3) * 16]} color="#d8ecf8" rough={0.4} bevel={false} shadow={false} />
      ))}
      <Box size={[200, 30, 0.4]} pos={[0, 15, -40]} color="#a9d0ee" rough={1} bevel={false} shadow={false} />
      <Box size={[200, 4, 0.4]} pos={[0, 1.5, -39.6]} color="#dbeaf6" rough={1} bevel={false} shadow={false} />
    </group>
  );
};

export const Ship: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => {
  const t = useT();
  const bob = Math.sin(t * 1.3) * 0.06;
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]} rotation={[0, 0, Math.sin(t * 0.9) * 0.015]} scale={scale}>
      <Box size={[9, 1.4, 2.4]} pos={[0, 0.5, 0]} color="#2f4e8a" rough={0.5} ink />
      <Box size={[9.02, 0.3, 2.42]} pos={[0, -0.05, 0]} color="#b8392f" rough={0.5} bevel={false} />
      <mesh position={[4.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow><coneGeometry args={[1.2, 1.4, 4]} /><meshPhysicalMaterial color="#2f4e8a" roughness={0.5} /></mesh>
      {/* reefer containers (white = refrigerated) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Box key={i} size={[1.1, 0.7, 2.0]} pos={[-3.2 + (i % 5) * 1.25, 1.55 + Math.floor(i / 5) * 0.72, 0]} color={i % 3 === 0 ? "#3f7d3a" : "#f2f3f5"} rough={0.6} />
      ))}
      <Box size={[1.4, 1.8, 2.0]} pos={[-4.0, 2.1, 0]} color="#f2f3f5" rough={0.5} ink />
      <Box size={[1.3, 0.3, 2.02]} pos={[-4.0, 2.7, 0]} color="#2a3a5c" rough={0.2} bevel={false} />
      <Cyl r={0.22} h={0.9} pos={[-4.2, 3.4, 0]} color="#b8392f" rough={0.5} />
    </group>
  );
};

// thermometer showing 13 °C (mercury level 0..1)
export const Thermo: React.FC<{ pos?: V3; level?: N; s?: number; cold?: boolean }> = ({ pos = [0, 0, 0], level = 0.5, s = 1, cold = false }) => {
  const t = useT();
  const l = clamp(num(level, t));
  return (
    <group position={pos} scale={s}>
      <Box size={[0.5, 2.0, 0.12]} pos={[0, 0, -0.06]} color="#f4f1ea" rough={0.5} ink />
      <Cyl r={0.07} h={1.5} pos={[0, 0.15, 0.04]} color="#e8eef4" rough={0.2} />
      <Cyl r={0.05} h={1.4 * l + 0.01} pos={[0, -0.55 + 0.7 * l, 0.1]} color={cold ? "#4f9bff" : "#e0403a"} rough={0.4} />
      <mesh position={[0, -0.72, 0.06]}><sphereGeometry args={[0.15, 14, 10]} /><meshStandardMaterial color={cold ? "#4f9bff" : "#e0403a"} /></mesh>
    </group>
  );
};

// ---------- kitchen counter + paper bag + apple ----------
export const Kitchen: React.FC = () => (
  <group>
    <Box size={[40, 0.4, 40]} pos={[0, -0.2, 0]} map={painted("#c9b89a", [10, 10])} rough={0.7} bevel={false} />
    <Box size={[40, 12, 0.4]} pos={[0, 6, -4]} map={painted("#f2e6d2", [8, 2])} rough={0.9} bevel={false} />
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i} size={[0.6, 0.6, 0.05]} pos={[-1.5 + i * 0.62, 2.3, -3.75]} color={i % 2 ? "#6fa8c8" : "#f4f6f8"} rough={0.3} bevel={false} shadow={false} />
    ))}
    <Box size={[8, 1.0, 2.2]} pos={[0, 0.5, 0]} color="#5a7aa0" rough={0.6} ink />
    <Box size={[8.1, 0.12, 2.3]} pos={[0, 1.06, 0]} color="#e8e2d8" rough={0.35} />
  </group>
);

export const Apple: React.FC<{ pos?: V3; s?: number }> = ({ pos = [0, 0, 0], s = 1 }) => (
  <group position={pos} scale={s}>
    <mesh castShadow layers={LAYER_INK} scale={[1, 0.92, 1]}><sphereGeometry args={[0.28, 22, 16]} /><meshPhysicalMaterial color="#d83a32" roughness={0.35} clearcoat={0.5} /></mesh>
    <Cyl r={0.02} h={0.15} pos={[0, 0.3, 0]} rot={[0, 0, 0.2]} color="#5a4a2a" />
    <mesh position={[0.08, 0.32, 0]} rotation={[0, 0, -0.6]} scale={[1, 0.4, 0.2]}><sphereGeometry args={[0.08, 8, 6]} /><meshStandardMaterial color="#4f8a3a" /></mesh>
  </group>
);

export const Bag: React.FC<{ pos?: V3; s?: number }> = ({ pos = [0, 0, 0], s = 1 }) => (
  <group position={pos} scale={s}>
    <Box size={[1.2, 1.4, 0.8]} pos={[0, 0.7, 0]} color="#c49a62" rough={0.95} ink />
    <Box size={[1.22, 0.22, 0.82]} pos={[0, 1.45, 0]} rot={[0.15, 0, 0]} color="#b48a52" rough={0.95} bevel={false} />
  </group>
);

export { hash, ramp };
