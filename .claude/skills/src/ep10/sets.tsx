// ep10 — chewing-gum plant sets. In-world labels are numbers, units and symbols only, so ES and EN share every shot.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow, StepSign } from "../ep7/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, StepSign, ramp };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const STEEL = "#b4bcc6";
export const MACHINE = "#5a8fb8"; // food-plant machine blue
export const GUM = "#f08cbf"; // pink gum
export const GUM_DARK = "#c95b93";
export const BASE = "#d9d2c4"; // grey-cream gum base
export const RUBBER = "#3f3e4a"; // tire rubber: dark violet-grey, never black
export const SUGAR = "#fbf6ee";
export const SHELL = "#fff4f8"; // white sugar shell of a coated pellet

// ---------- room: white-tiled candy plant, pink safety stripe, skylights ----------
export const Plant: React.FC<{ z?: number }> = ({ z = -7 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#b9b6c4", [10, 10])} rough={0.8} bevel={false} />
    <Box size={[60, 14, 0.4]} pos={[0, 7, z]} map={painted("#f0eef0", [8, 2])} rough={0.9} bevel={false} />
    <Box size={[60, 1.1, 0.5]} pos={[0, 1.2, z + 0.1]} color={MACHINE} rough={0.6} bevel={false} />
    <Box size={[60, 0.18, 0.55]} pos={[0, 1.85, z + 0.12]} color="#e0569a" rough={0.5} bevel={false} />
    {[-9, -3, 3, 9].map((x) => (
      <Box key={x} size={[3.4, 2.4, 0.2]} pos={[x, 6.6, z + 0.25]} color="#f4fbff" emissive="#e6f2ff" emissiveIntensity={0.55} rough={0.3} />
    ))}
    <Cyl r={0.28} h={60} pos={[0, 9.4, z + 0.8]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.35} />
    <Cyl r={0.18} h={60} pos={[0, 8.7, z + 0.8]} rot={[0, 0, Math.PI / 2]} color="#f2c230" rough={0.45} />
  </group>
);

// studio sweep for the hook: deep blue-violet backdrop (never black), warm key spot + pink rim
export const Studio: React.FC = () => (
  <group>
    <Box size={[30, 0.4, 30]} pos={[0, -0.2, 0]} color="#4a4e86" rough={0.85} bevel={false} />
    <Box size={[30, 16, 0.4]} pos={[0, 8, -5]} color="#555a94" rough={0.9} bevel={false} />
    <mesh position={[0, 2.2, -4.7]} layers={LAYER_FX}>
      <circleGeometry args={[2.2, 48]} />
      <meshBasicMaterial color="#e6b9e0" transparent opacity={0.28} depthWrite={false} toneMapped={false} />
    </mesh>
    <spotLight position={[-3, 6, 5]} color="#fff0e0" intensity={60} angle={0.55} penumbra={0.6} distance={20} decay={1.6} />
    <pointLight position={[2.5, 3.2, -1.5]} color="#ffb0e0" intensity={8} distance={8} decay={1.6} />
  </group>
);

// ---------- Maya rainforest backdrop ----------
export const Jungle: React.FC = () => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#6f8a4a", [10, 10])} rough={0.95} bevel={false} />
    <Box size={[60, 16, 0.4]} pos={[0, 8, -9]} color="#9cc48a" rough={0.95} bevel={false} />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = (hash(i) - 0.5) * 22, z = -3 - hash(i + 20) * 5, h = 4 + hash(i + 40) * 3;
      return (
        <group key={i} position={[x, 0, z]}>
          <Cyl r={0.18} h={h} pos={[0, h / 2, 0]} color="#6b4a32" rough={0.9} />
          <mesh position={[0, h + 0.6, 0]} castShadow>
            <sphereGeometry args={[1.2 + hash(i + 60) * 0.8, 14, 10]} />
            <meshStandardMaterial color={["#4f8a3a", "#5f9a42", "#3f7a36"][i % 3]} roughness={0.9} />
          </mesh>
        </group>
      );
    })}
  </group>
);

// ---------- a pink gum pellet (pillow shape) — coated = white shell ----------
export const Pellet: React.FC<{ pos?: V3; s?: number; coated?: boolean; rot?: V3; spin?: number; ink?: boolean; color?: string }> = ({
  pos = [0, 0, 0], s = 0.3, coated = true, rot = [0, 0, 0], spin = 0, ink = true, color,
}) => {
  const t = useT();
  return (
    <mesh position={pos} rotation={[rot[0], rot[1] + t * spin, rot[2]]} scale={[s * 1.25, s * 0.55, s * 0.85]} castShadow receiveShadow layers={ink ? LAYER_INK : 0}>
      <sphereGeometry args={[1, 28, 18]} />
      <meshPhysicalMaterial color={color ?? (coated ? SHELL : GUM)} roughness={coated ? 0.28 : 0.55} clearcoat={coated ? 0.8 : 0.2} clearcoatRoughness={0.2} />
    </mesh>
  );
};

// ---------- tire (rubber torus + tread blocks) ----------
export const Tire: React.FC<{ pos?: V3; r?: number; spin?: number; rot?: V3; tube?: boolean }> = ({ pos = [0, 0, 0], r = 1, spin = 0.6, rot = [0, 0, 0], tube = false }) => {
  const t = useT();
  return (
    <group position={pos} rotation={rot}>
      <group rotation={[0, 0, -t * spin]}>
        <mesh castShadow layers={LAYER_INK}>
          <torusGeometry args={[r, r * 0.38, 18, 56]} />
          <meshPhysicalMaterial color={tube ? "#a2553e" : RUBBER} roughness={tube ? 0.45 : 0.75} clearcoat={tube ? 0.5 : 0.05} />
        </mesh>
        {!tube ? Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <Box key={i} size={[r * 0.18, r * 0.12, r * 0.6]} pos={[Math.cos(a) * r * 1.36, Math.sin(a) * r * 1.36, 0]} rot={[0, 0, a]} color="#34333e" rough={0.85} bevel={false} />;
        }) : null}
        {!tube ? <Cyl r={r * 0.62} h={r * 0.4} rot={[Math.PI / 2, 0, 0]} color="#c9ced6" rough={0.3} seg={32} /> : null}
      </group>
    </group>
  );
};

// ---------- a stretchy gum strand between two blobs ----------
export const Stretch: React.FC<{ pos?: V3; len?: N; r?: number }> = ({ pos = [0, 0, 0], len = 1.2, r = 0.12 }) => {
  const t = useT();
  const L = num(len, t);
  const thin = r * Math.max(0.35, 1 / Math.sqrt(Math.max(0.6, L)));
  return (
    <group position={pos}>
      <mesh position={[-L / 2, 0, 0]} castShadow layers={LAYER_INK}>
        <sphereGeometry args={[r * 2.2, 20, 14]} />
        <meshPhysicalMaterial color={GUM} roughness={0.5} clearcoat={0.3} />
      </mesh>
      <mesh position={[L / 2, 0, 0]} castShadow layers={LAYER_INK}>
        <sphereGeometry args={[r * 2.2, 20, 14]} />
        <meshPhysicalMaterial color={GUM} roughness={0.5} clearcoat={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow layers={LAYER_INK}>
        <cylinderGeometry args={[thin, thin, L, 16]} />
        <meshPhysicalMaterial color={GUM} roughness={0.5} clearcoat={0.3} />
      </mesh>
    </group>
  );
};

// ---------- sapodilla tree with zig-zag cuts and white latex dripping into a bucket ----------
export const Sapodilla: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  return (
    <group position={pos}>
      <Cyl r={0.55} r2={0.45} h={7} pos={[0, 3.5, 0]} color="#7a5638" rough={0.9} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={2.6} opacity={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} size={[0.5, 0.07, 0.06]} pos={[(i % 2 ? 0.12 : -0.12), 1.6 + i * 0.5, 0.52]} rot={[0, 0, i % 2 ? 0.5 : -0.5]} color="#f6f2e4" rough={0.4} bevel={false} />
      ))}
      <mesh position={[0, 5.8, 0]} castShadow>
        <sphereGeometry args={[2.4, 18, 14]} />
        <meshStandardMaterial color="#7fb85a" emissive="#2f5a20" emissiveIntensity={0.35} roughness={0.9} />
      </mesh>
      {/* bucket */}
      <Cyl r={0.32} r2={0.4} h={0.55} pos={[0.1, 0.3, 0.75]} color="#a07848" rough={0.8} ink />
      <Cyl r={0.36} h={0.02} pos={[0.1, 0.56, 0.75]} color="#f6f2e4" rough={0.3} />
      {/* drip */}
      {[0, 1, 2].map((i) => {
        const k = ((t * 0.9 + i / 3) % 1);
        return (
          <mesh key={i} position={[0.08, 1.45 - k * 0.85, 0.62]} layers={LAYER_FX}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#f6f2e4" roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- a slab of grey gum base ----------
export const BaseBlock: React.FC<{ pos?: V3; s?: number; rot?: V3; color?: string }> = ({ pos = [0, 0, 0], s = 1, rot = [0, 0, 0], color = BASE }) => (
  <Box size={[0.9 * s, 0.5 * s, 0.6 * s]} pos={pos} rot={rot} color={color} rough={0.6} ink />
);

// ---------- X-ray: tangled polymer chains inside a translucent gum blob; stretch pulls them straight-ish ----------
export const Chains: React.FC<{ pos?: V3; stretch?: N; r?: number }> = ({ pos = [0, 0, 0], stretch = 0, r = 1.4 }) => {
  const t = useT();
  const st = clamp(num(stretch, t));
  const curves = useMemo(() => Array.from({ length: 9 }).map((_, c) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 14; i++) {
      pts.push(new THREE.Vector3((hash(c * 31 + i) - 0.5) * 1.8, (hash(c * 17 + i + 5) - 0.5) * 1.8, (hash(c * 13 + i + 9) - 0.5) * 1.2));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.035, 6, false);
  }), []);
  const sx = 1 + st * 0.9, sy = 1 / Math.sqrt(sx);
  const cols = ["#ff5fa8", "#ffd35f", "#7fe0ff", "#b98bff"];
  return (
    <group position={pos} rotation={[0, t * 0.25, 0]}>
      <group scale={[sx, sy, sy]}>
        {curves.map((g, i) => (
          <mesh key={i} geometry={g} scale={r / 1.2}>
            <meshStandardMaterial color={cols[i % 4]} emissive={cols[i % 4]} emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        ))}
        <mesh layers={LAYER_FX}>
          <sphereGeometry args={[r, 40, 28]} />
          <meshPhysicalMaterial color={GUM} transparent opacity={0.22} roughness={0.2} clearcoat={1} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- step 1: sigma-blade mixer (open trough, two Z blades turning, pink mass) ----------
export const Mixer: React.FC<{ pos?: V3; pink?: N; pour?: N; scale?: number }> = ({ pos = [0, 0, 0], pink = 1, pour = 0, scale = 1 }) => {
  const t = useT();
  const pk = clamp(num(pink, t)), pr = clamp(num(pour, t));
  const mass = new THREE.Color(BASE).lerp(new THREE.Color(GUM), pk);
  return (
    <group position={pos} scale={scale}>
      <Box size={[3.6, 1.6, 2.4]} pos={[0, 0.8, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={4.4} opacity={0.5} />
      {/* trough walls */}
      <Box size={[3.4, 1.0, 0.16]} pos={[0, 2.1, 1.05]} color={STEEL} rough={0.3} ink />
      <Box size={[3.4, 1.0, 0.16]} pos={[0, 2.1, -1.05]} color={STEEL} rough={0.3} />
      <Box size={[0.16, 1.0, 2.2]} pos={[-1.62, 2.1, 0]} color={STEEL} rough={0.3} ink />
      <Box size={[0.16, 1.0, 2.2]} pos={[1.62, 2.1, 0]} color={STEEL} rough={0.3} ink />
      {/* the mass */}
      <mesh position={[0, 2.4, 0]} scale={[1.5, 0.3 + Math.sin(t * 3) * 0.03, 0.95]} castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial color={mass} roughness={0.5} clearcoat={0.3} />
      </mesh>
      {/* two Z blades */}
      {[-0.8, 0.8].map((x, k) => (
        <group key={k} position={[x, 2.25, 0]} rotation={[0, 0, (k ? -1 : 1) * t * 2.2]}>
          <Box size={[0.14, 0.9, 0.14]} pos={[0, 0, 0]} color="#8a929c" rough={0.3} />
          <Box size={[0.6, 0.12, 0.14]} pos={[0.25, 0.42, 0]} color="#8a929c" rough={0.3} />
          <Box size={[0.6, 0.12, 0.14]} pos={[-0.25, -0.42, 0]} color="#8a929c" rough={0.3} />
        </group>
      ))}
      <Cyl r={0.12} h={3.8} pos={[0, 2.25, 0]} rot={[0, 0, Math.PI / 2]} color="#8a929c" rough={0.3} />
      {/* hoppers: sugar (white), syrup (amber), flavor (pink) */}
      {pr > 0.01 ? [-1.1, 0, 1.1].map((x, i) => (
        <group key={i} position={[x, 0, -0.2]}>
          <Cyl r={0.35} r2={0.12} h={0.7} pos={[0, 4.3, 0]} color={["#e3e8ee", "#d9a23f", "#e0569a"][i]} rough={0.4} ink />
          {i === 1
            ? <Cyl r={0.05} h={1.7} pos={[0, 3.1, 0]} color="#e8a640" rough={0.15} clearcoat={1} />
            : Array.from({ length: 6 }).map((_, k) => {
                const q = ((t * 1.4 + k / 6) % 1);
                return (
                  <mesh key={k} position={[(hash(k + i * 7) - 0.5) * 0.12, 3.9 - q * 1.6, 0]} layers={LAYER_FX}>
                    <sphereGeometry args={[0.05, 6, 5]} />
                    <meshBasicMaterial color={i === 0 ? SUGAR : "#ff8ac4"} />
                  </mesh>
                );
              })}
        </group>
      )) : null}
    </group>
  );
};

// ---------- step 2: extruder pushing a pink ribbon onto a belt, rollers flatten it into a sheet ----------
export const Extruder: React.FC<{ pos?: V3; speed?: number }> = ({ pos = [0, 0, 0], speed = 0.6 }) => {
  const t = useT();
  return (
    <group position={pos}>
      {/* extruder body + nozzle */}
      <Box size={[1.8, 2.2, 1.6]} pos={[-3.2, 1.6, 0]} color={MACHINE} rough={0.5} ink />
      <Cyl r={0.6} r2={0.35} h={0.7} pos={[-2.0, 1.55, 0]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.3} ink />
      <Cyl r={0.5} h={1.0} pos={[-3.2, 3.2, 0]} color={STEEL} rough={0.3} />
      {/* conveyor */}
      <Box size={[6.4, 0.2, 1.3]} pos={[1.2, 1.05, 0]} color="#4a4f5a" rough={0.6} ink />
      <Box size={[6.6, 0.8, 1.2]} pos={[1.2, 0.5, 0]} color={MACHINE} rough={0.5} />
      <ContactShadow pos={[0, 0.02, 0]} size={8} opacity={0.45} />
      {/* thick ribbon until the rollers, thin sheet after */}
      <Box size={[1.9, 0.32, 0.8]} pos={[-0.75, 1.32, 0]} color={GUM} rough={0.5} ink />
      <Box size={[3.2, 0.08, 1.05]} pos={[2.6, 1.2, 0]} color={GUM} rough={0.5} ink />
      {/* sugar dust on the sheet */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} position={[1.1 + ((hash(i) * 3 + t * speed) % 3), 1.25, (hash(i + 3) - 0.5) * 0.9]} layers={LAYER_FX}>
          <sphereGeometry args={[0.025, 5, 4]} />
          <meshBasicMaterial color={SUGAR} />
        </mesh>
      ))}
      {/* two rollers (top roller spinning) */}
      {[0.35, 0.9].map((x, i) => (
        <group key={i} position={[x, 1.65 - i * 0.1, 0]}>
          <group rotation={[0, 0, -t * 3]}>
            <Cyl r={0.36} h={1.3} rot={[Math.PI / 2, 0, 0]} color={STEEL} rough={0.25} ink />
            <Box size={[0.06, 0.7, 1.32]} color="#8a929c" rough={0.3} bevel={false} />
          </group>
        </group>
      ))}
      <Box size={[0.2, 1.6, 0.2]} pos={[0.6, 1.9, 0.75]} color={MACHINE} rough={0.5} />
      <Box size={[0.2, 1.6, 0.2]} pos={[0.6, 1.9, -0.75]} color={MACHINE} rough={0.5} />
    </group>
  );
};

// ---------- step 3: scoring cutter + cooling tunnel; pellets come out the far side ----------
export const Cutter: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  const ph = (t % 0.8) / 0.8;
  const down = ph < 0.3 ? ease(ph / 0.3) : 1 - ease(clamp((ph - 0.3) / 0.5));
  return (
    <group position={pos}>
      <Box size={[7.4, 0.2, 1.3]} pos={[0.6, 1.05, 0]} color="#4a4f5a" rough={0.6} ink />
      <Box size={[7.6, 0.8, 1.2]} pos={[0.6, 0.5, 0]} color={MACHINE} rough={0.5} />
      <ContactShadow pos={[0.6, 0.02, 0]} size={8} opacity={0.45} />
      {/* sheet in */}
      <Box size={[2.0, 0.08, 1.05]} pos={[-2.3, 1.2, 0]} color={GUM} rough={0.5} ink />
      {/* cutter head */}
      <group position={[-1.0, 1.95 - down * 0.55, 0]}>
        <Box size={[0.9, 0.5, 1.2]} color={STEEL} rough={0.3} ink />
        {[-0.3, 0, 0.3].map((x) => <Box key={x} size={[0.03, 0.25, 1.1]} pos={[x, -0.35, 0]} color="#e3e8ee" rough={0.2} bevel={false} />)}
      </group>
      <Box size={[0.2, 2.0, 0.2]} pos={[-1.0, 2.2, 0.7]} color={MACHINE} rough={0.5} />
      {/* scored pieces */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} size={[0.3, 0.1, 0.3]} pos={[-0.3 + i * 0.35, 1.2, ((i % 2) - 0.5) * 0.4]} color={GUM} rough={0.5} ink />
      ))}
      {/* cooling tunnel (cool blue, frost) */}
      <Box size={[3.0, 1.4, 1.6]} pos={[2.4, 1.85, 0]} color="#bcd8ee" rough={0.3} ink />
      <Box size={[2.8, 0.9, 0.05]} pos={[2.4, 1.85, 0.82]} color="#e8f6ff" emissive="#a8d8ff" emissiveIntensity={0.4} rough={0.2} />
      {/* pellets moving out */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 0.6 + ((t * 0.5 + i * 0.75) % 3.8);
        return <Pellet key={i} pos={[x, 1.25, ((i % 2) - 0.5) * 0.35]} s={0.16} coated={false} />;
      })}
    </group>
  );
};

// ---------- step 4: tilted coating drum (pan) with tumbling pellets and a syrup nozzle ----------
export const Pan: React.FC<{ pos?: V3; coat?: N; sticky?: N; scale?: number }> = ({ pos = [0, 0, 0], coat = 1, sticky = 0, scale = 1 }) => {
  const t = useT();
  const c = clamp(num(coat, t)), st = clamp(num(sticky, t));
  const col = new THREE.Color(GUM).lerp(new THREE.Color(SHELL), c);
  const n = 16;
  return (
    <group position={pos} scale={scale}>
      <Box size={[1.6, 1.4, 1.6]} pos={[0, 0.7, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3.6} opacity={0.5} />
      <group position={[0, 2.25, 0]} rotation={[0.75, 0, 0]}>
        <group rotation={[0, t * 1.4, 0]}>
          <mesh castShadow layers={LAYER_INK}>
            <sphereGeometry args={[1.35, 40, 24, 0, Math.PI * 2, Math.PI * 0.32, Math.PI * 0.68]} />
            <meshPhysicalMaterial color="#d3dae2" metalness={0.15} roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* pellets tumbling in the bottom of the pan */}
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + t * 1.1 * (0.6 + hash(i) * 0.4);
          const rr = 0.35 + hash(i + 3) * 0.5;
          const clump = st * 0.8;
          return (
            <mesh key={i} position={[Math.cos(a) * rr * (1 - clump), -0.75 + hash(i + 5) * 0.2, Math.sin(a) * rr * (1 - clump)]} rotation={[i, t * 3 + i, 0]} scale={[0.2, 0.09, 0.14]} castShadow layers={LAYER_INK}>
              <sphereGeometry args={[1, 16, 10]} />
              <meshPhysicalMaterial color={col} roughness={0.3 + st * 0.3} clearcoat={0.6} />
            </mesh>
          );
        })}
      </group>
      {/* syrup nozzle */}
      <Cyl r={0.06} h={2.2} pos={[-1.1, 3.6, 0.6]} rot={[0, 0, 0.8]} color="#e3e8ee" rough={0.3} />
      {[0, 1, 2].map((i) => {
        const k = ((t * 1.2 + i / 3) % 1);
        return (
          <mesh key={i} position={[-0.3, 2.9 - k * 0.7, 0.75]} layers={LAYER_FX}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshBasicMaterial color="#f8e8c8" />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- cross-section of a coated pellet: pink core + white shell rings (layers grow) ----------
export const Section: React.FC<{ pos?: V3; layers?: N; scale?: number; highlight?: boolean }> = ({ pos = [0, 0, 0], layers = 8, scale = 1, highlight = false }) => {
  const t = useT();
  const n = Math.round(clamp(num(layers, t) / 12) * 12);
  return (
    <group position={pos} scale={[scale * 1.3, scale * 0.65, scale]}>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0.02 + i * 0.002]}>
          <circleGeometry args={[0.72 + (n - i) * 0.025, 48]} />
          <meshStandardMaterial color={i % 2 ? "#fbe6ef" : highlight ? "#ffe9a8" : SHELL} roughness={0.5} />
        </mesh>
      )) }
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.7, 48]} />
        <meshStandardMaterial color={GUM} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.02]} layers={LAYER_INK}>
        <circleGeometry args={[0.74 + n * 0.025, 48]} />
        <meshStandardMaterial color="#e9dfe4" roughness={0.5} />
      </mesh>
    </group>
  );
};

// ---------- analogy: a wall panel, a paint roller adding thin stripes ----------
export const Wall: React.FC<{ pos?: V3; coats?: N }> = ({ pos = [0, 0, 0], coats = 1 }) => {
  const t = useT();
  const c = clamp(num(coats, t));
  const y = 1.4 + Math.sin(t * 3) * 1.0;
  return (
    <group position={pos}>
      <Box size={[2.4, 3.4, 0.2]} pos={[0, 1.9, 0]} color="#d8cfc4" rough={0.9} ink />
      {[0, 1, 2, 3].map((k) => (k / 4 < c ? <Box key={k} size={[2.2, 3.2, 0.02]} pos={[0, 1.9, 0.11 + k * 0.012]} color={["#f6d0e2", "#f2b8d4", "#ee9fc6", "#ea86b8"][k]} rough={0.8} bevel={false} /> : null))}
      <group position={[0.2, y + 0.5, 0.35]}>
        <Cyl r={0.16} h={1.1} rot={[0, 0, Math.PI / 2]} color="#f2b8d4" rough={0.9} ink />
        <Cyl r={0.04} h={0.9} pos={[0.6, -0.4, 0]} rot={[0, 0, 0.4]} color="#3a3f46" />
        <Cyl r={0.07} h={0.5} pos={[0.82, -0.95, 0]} color="#c0392b" rough={0.5} ink />
      </group>
    </group>
  );
};

// ---------- humidity dial (needle sweeps) ----------
export const Dial: React.FC<{ pos?: V3; value?: N }> = ({ pos = [0, 0, 0], value = 0.2 }) => {
  const t = useT();
  const v = clamp(num(value, t));
  return (
    <group position={pos}>
      <Cyl r={0.7} h={0.14} rot={[Math.PI / 2, 0, 0]} color="#f4f1ea" rough={0.5} seg={40} ink />
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI * 0.25]}>
        <ringGeometry args={[0.45, 0.6, 32, 1, 0, Math.PI * 0.35]} />
        <meshBasicMaterial color="#4fa86a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, -Math.PI * 0.25]}>
        <ringGeometry args={[0.45, 0.6, 32, 1, Math.PI * 0.15, Math.PI * 0.35]} />
        <meshBasicMaterial color="#c0392b" side={THREE.DoubleSide} />
      </mesh>
      <group position={[0, 0, 0.1]} rotation={[0, 0, Math.PI * 0.7 - v * Math.PI * 0.9]}>
        <Box size={[0.5, 0.05, 0.03]} pos={[0.25, 0, 0]} color="#2f3640" bevel={false} />
      </group>
      <Cyl r={0.05} h={0.05} pos={[0, 0, 0.12]} rot={[Math.PI / 2, 0, 0]} color="#2f3640" />
    </group>
  );
};

// ---------- the "7" crossed out ----------
export const Cross: React.FC<{ pos?: V3; on?: N; s?: number }> = ({ pos = [0, 0, 0], on = 1, s = 1 }) => {
  const t = useT();
  const k = ease(clamp(num(on, t)));
  return (
    <group position={pos} scale={s}>
      <Box size={[1.6 * k + 0.01, 0.16, 0.06]} rot={[0, 0, 0.7]} color="#c0392b" rough={0.5} shadow={false} />
      <Box size={[1.6 * k + 0.01, 0.16, 0.06]} rot={[0, 0, -0.7]} color="#c0392b" rough={0.5} shadow={false} />
    </group>
  );
};

// ---------- a blister pack of coated pellets ----------
export const Pack: React.FC<{ pos?: V3; scale?: number; tag?: boolean; rot?: V3 }> = ({ pos = [0, 0, 0], scale = 1, tag = false, rot = [0, 0, 0] }) => (
  <group position={pos} scale={scale} rotation={rot}>
    <Box size={[1.6, 1.0, 0.12]} pos={[0, 0, 0]} color="#e0569a" rough={0.5} ink />
    {Array.from({ length: 6 }).map((_, i) => (
      <Pellet key={i} pos={[(i % 3 - 1) * 0.45, (Math.floor(i / 3) - 0.5) * 0.42, 0.1]} s={0.17} rot={[Math.PI / 2, 0, 0]} />
    ))}
    {tag ? <Card pos={[0, -0.78, 0.08]} lines={["@ ______"]} w={1.2} h={0.42} bg="#fff6dc" fg="#c0392b" /> : null}
  </group>
);

// a pile of coated pellets on a tray
export const Pile: React.FC<{ pos?: V3; n?: number; coated?: boolean }> = ({ pos = [0, 0, 0], n = 14, coated = true }) => (
  <group position={pos}>
    <Box size={[1.4, 0.1, 1.0]} color="#e3e8ee" rough={0.3} />
    {Array.from({ length: n }).map((_, i) => (
      <Pellet key={i} pos={[(hash(i) - 0.5) * 1.0, 0.12 + hash(i + 9) * 0.12, (hash(i + 4) - 0.5) * 0.7]} s={0.16} coated={coated} rot={[hash(i + 2) * 0.6, hash(i + 6) * 3, 0]} />
    ))}
  </group>
);

export { hash };
