// ep9 — steel-ball plant sets. In-world labels are numbers, units and symbols only, so ES and EN share every shot.
import React from "react";
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
export const MACHINE = "#3f6f9a"; // painted machine blue
export const MACHINE_LIGHT = "#d7dde3";
export const HOT = "#ff7a2a";

// ---------- chrome reflections, made in code (no HDRI): warm skylight top, bright horizon band, violet floor ----------
let envTex: THREE.Texture | null = null;
export const steelEnv = () => {
  if (envTex) return envTex;
  const c = document.createElement("canvas");
  c.width = 512; c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#fff6e6");
  grd.addColorStop(0.3, "#aab3c0");
  grd.addColorStop(0.47, "#ffffff");
  grd.addColorStop(0.52, "#5b5e70");
  grd.addColorStop(0.75, "#3a3a52");
  grd.addColorStop(1, "#5a5878");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 256);
  // window strips
  g.fillStyle = "rgba(255,255,255,0.95)";
  for (let i = 0; i < 6; i++) g.fillRect(20 + i * 86, 46, 44, 30);
  g.fillStyle = "rgba(255,190,120,0.8)";
  g.fillRect(300, 150, 90, 14);
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  envTex = t;
  return t;
};

export const SteelMat: React.FC<{ color?: string; rough?: number; glow?: number }> = ({ color = "#d4dbe4", rough = 0.12, glow = 0 }) => (
  <meshPhysicalMaterial
    color={color} metalness={0.92} roughness={rough} clearcoat={1} clearcoatRoughness={0.08}
    envMap={steelEnv()} envMapIntensity={1.15}
    emissive={glow > 0 ? HOT : "#000000"} emissiveIntensity={glow * 1.6}
  />
);

// ---------- room: steel plant, blue machines, orange safety stripe, skylights ----------
export const Mill: React.FC<{ z?: number }> = ({ z = -7 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#9ea7b2", [10, 10])} rough={0.8} bevel={false} />
    <Box size={[60, 14, 0.4]} pos={[0, 7, z]} map={painted("#e6e9ec", [8, 2])} rough={0.9} bevel={false} />
    <Box size={[60, 1.1, 0.5]} pos={[0, 1.2, z + 0.1]} color={MACHINE} rough={0.6} bevel={false} />
    <Box size={[60, 0.18, 0.55]} pos={[0, 1.85, z + 0.12]} color="#f07a1f" rough={0.5} bevel={false} />
    {[-9, -3, 3, 9].map((x) => (
      <Box key={x} size={[3.4, 2.4, 0.2]} pos={[x, 6.6, z + 0.25]} color="#f4fbff" emissive="#e6f2ff" emissiveIntensity={0.55} rough={0.3} />
    ))}
    <Cyl r={0.28} h={60} pos={[0, 9.4, z + 0.8]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.35} />
    <Cyl r={0.18} h={60} pos={[0, 8.7, z + 0.8]} rot={[0, 0, Math.PI / 2]} color="#f2c230" rough={0.45} />
  </group>
);

// studio sweep for the hook: deep blue-violet backdrop (never black), warm key spot + cool rim
export const Studio: React.FC = () => (
  <group>
    <Box size={[30, 0.4, 30]} pos={[0, -0.2, 0]} color="#4a4e86" rough={0.85} bevel={false} />
    <Box size={[30, 16, 0.4]} pos={[0, 8, -5]} color="#555a94" rough={0.9} bevel={false} />
    <mesh position={[0, 2.2, -4.7]} layers={LAYER_FX}>
      <circleGeometry args={[2.0, 48]} />
      <meshBasicMaterial color="#b9bdf0" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
    </mesh>
    <spotLight position={[-3, 6, 5]} color="#fff0d6" intensity={60} angle={0.55} penumbra={0.6} distance={20} decay={1.6} />
    <pointLight position={[2.5, 3.2, -1.5]} color="#9fb6ff" intensity={8} distance={8} decay={1.6} />
  </group>
);

// ---------- the ball ----------
// ring 0..1 = the flash ring left by the heading dies (Saturn); squash = soft ball flattening (y scale);
// bump = one lump on the surface; color/rough let the raw (grey, matte) ball differ from the lapped mirror one.
export const Ball: React.FC<{
  pos?: V3; r?: number; ring?: number; squash?: number; bump?: number; raw?: boolean; glow?: number; ink?: boolean; spin?: number; rot?: V3;
}> = ({ pos = [0, 0, 0], r = 0.5, ring = 0, squash = 0, bump = 0, raw = false, glow = 0, ink = true, spin = 0, rot = [0.35, 0, 0.2] }) => {
  const t = useT();
  return (
    <group position={pos} rotation={[rot[0], rot[1] + t * spin, rot[2]]}>
      <mesh scale={[1 + squash * 0.45, 1 - squash * 0.55, 1 + squash * 0.45]} castShadow receiveShadow layers={ink ? LAYER_INK : 0}>
        <sphereGeometry args={[r, 48, 32]} />
        <SteelMat color={raw ? "#9aa3ad" : "#d4dbe4"} rough={raw ? 0.42 : 0.1} glow={glow} />
      </mesh>
      {ring > 0.01 ? (
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow layers={ink ? LAYER_INK : 0}>
          <torusGeometry args={[r * (1.0 + 0.22 * ring), r * 0.08 * ring + 0.004, 10, 48]} />
          <SteelMat color="#9aa3ad" rough={0.4} glow={glow} />
        </mesh>
      ) : null}
      {bump > 0.01 ? (
        <mesh position={[r * 0.72, r * 0.62, 0]} castShadow layers={ink ? LAYER_INK : 0}>
          <sphereGeometry args={[r * 0.22 * bump, 16, 12]} />
          <SteelMat color="#b8c0ca" rough={0.3} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- step 1: wire coil → cutter → heading press (two cups slam the slug into a ringed ball) ----------
// hit 0..1 = how closed the dies are; slug 0..1 = slug (cylinder) → ball morph
export const Header: React.FC<{ pos?: V3; period?: number }> = ({ pos = [0, 0, 0], period = 1.1 }) => {
  const t = useT();
  const ph = (t % period) / period;
  const close = ph < 0.35 ? ease(ph / 0.35) : ph < 0.5 ? 1 : 1 - ease((ph - 0.5) / 0.5);
  const gap = 0.9 * (1 - close);
  const formed = Math.floor(t / period) > 0 || ph > 0.3;
  return (
    <group position={pos}>
      {/* frame */}
      <Box size={[2.4, 1.4, 1.6]} pos={[0, 0.7, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3.4} opacity={0.5} />
      <Box size={[0.4, 3.6, 1.2]} pos={[-1.0, 3.2, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[0.4, 3.6, 1.2]} pos={[1.0, 3.2, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[2.4, 0.5, 1.4]} pos={[0, 5.0, 0]} color={MACHINE} rough={0.5} ink />
      {/* lower die (cup up) */}
      <Cyl r={0.5} h={0.5} pos={[0, 1.65, 0]} color={STEEL} rough={0.3} ink />
      {/* upper die / ram */}
      <group position={[0, 2.3 + 0.45 + gap, 0]}>
        <Cyl r={0.5} h={0.5} color={STEEL} rough={0.3} ink />
        <Cyl r={0.25} h={2.0} pos={[0, 1.25, 0]} color="#8a929c" rough={0.35} />
      </group>
      {/* the slug / ball between the dies */}
      {formed && close > 0.3
        ? <Ball pos={[0, 2.22, 0]} r={0.3} ring={1} raw rot={[0, 0, 0]} />
        : <Cyl r={0.2} h={0.5} pos={[0, 2.15, 0]} color="#9aa3ad" rough={0.45} ink />}
      {/* wire feeding from a coil on the left */}
      <mesh position={[-3.0, 1.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.8, 0.22, 12, 40]} />
        <meshStandardMaterial color="#7d858f" roughness={0.45} metalness={0.5} />
      </mesh>
      <Cyl r={0.06} h={2.0} pos={[-1.6, 2.15, 0]} rot={[0, 0, Math.PI / 2]} color="#8a929c" rough={0.4} />
      {/* finished ringed balls rolling away on the right */}
      <Box size={[2.6, 0.1, 0.7]} pos={[2.3, 1.45, 0.3]} rot={[0, 0, -0.08]} color={MACHINE_LIGHT} rough={0.3} />
      {[0, 1, 2, 3].map((i) => {
        const x = 1.3 + ((t * 0.9 + i * 0.6) % 2.4);
        return <Ball key={i} pos={[x, 1.66 - (x - 1.3) * 0.08, 0.3]} r={0.16} ring={1} raw spin={-3} />;
      })}
    </group>
  );
};

// ---------- step 2 / step 4: two big plates, lower fixed, upper spinning, balls riding in grooves ----------
// lap = softer bronze plates with grey abrasive paste; ring 0..1 = how much flash is left on the balls
export const Plates: React.FC<{ pos?: V3; ring?: N; lap?: boolean; spin?: number; balls?: number; lift?: number }> = ({
  pos = [0, 0, 0], ring = 1, lap = false, spin = 0.9, balls = 14, lift = 0.9,
}) => {
  const t = useT();
  const rg = clamp(num(ring, t));
  const plate = lap ? "#b9864a" : "#5d6670";
  const R = 1.9;
  return (
    <group position={pos}>
      <Box size={[3.4, 1.0, 3.0]} pos={[0, 0.5, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={4.2} opacity={0.5} />
      {/* lower plate with concentric grooves */}
      <Cyl r={R} h={0.35} pos={[0, 1.18, 0]} color={plate} rough={lap ? 0.55 : 0.4} seg={56} ink />
      {[0.7, 1.05, 1.4].map((gr) => (
        <mesh key={gr} position={[0, 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[gr, 0.05, 8, 56]} />
          <meshStandardMaterial color={lap ? "#6e6a62" : "#3a4048"} roughness={0.6} />
        </mesh>
      ))}
      {lap ? <Cyl r={R * 0.96} h={0.02} pos={[0, 1.37, 0]} color="#8d8f93" rough={0.9} seg={56} /> : null}
      {/* balls in the grooves, orbiting at half the plate speed */}
      {Array.from({ length: balls }).map((_, i) => {
        const gr = [0.7, 1.05, 1.4][i % 3];
        const a = (i / balls) * Math.PI * 2 + t * spin * 0.5;
        return <Ball key={i} pos={[Math.cos(a) * gr, 1.52, Math.sin(a) * gr]} r={0.15} ring={rg} raw={rg > 0.3} spin={4} rot={[i, 0, i * 0.5]} />;
      })}
      {/* upper plate (lifted so we can see in), spinning */}
      <group position={[0, 1.52 + lift, 0]} rotation={[0, t * spin, 0]}>
        <Cyl r={R} h={0.35} color={plate} rough={lap ? 0.55 : 0.4} seg={56} ink />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <Box key={k} size={[0.18, 0.06, 0.5]} pos={[Math.cos(k * 1.047) * 1.5, 0.2, Math.sin(k * 1.047) * 1.5]} rot={[0, -k * 1.047, 0]} color="#f07a1f" rough={0.5} bevel={false} />
        ))}
        <Cyl r={0.35} h={1.4} pos={[0, 0.85, 0]} color="#8a929c" rough={0.35} />
      </group>
      {/* coolant nozzle */}
      <Cyl r={0.07} h={1.6} pos={[-2.1, 2.0, 0.4]} rot={[0, 0, 0.5]} color="#e3e8ee" rough={0.3} />
    </group>
  );
};

// ---------- step 3: hardening furnace (glowing mouth) + oil quench tank with ripples ----------
export const Furnace: React.FC<{ pos?: V3; glow?: N; dunk?: N }> = ({ pos = [0, 0, 0], glow = 1, dunk = 0 }) => {
  const t = useT();
  const gl = clamp(num(glow, t)), dk = clamp(num(dunk, t));
  return (
    <group position={pos}>
      {/* furnace body */}
      <Box size={[2.6, 3.0, 2.2]} pos={[-1.5, 1.5, 0]} color="#7d4b3a" rough={0.8} ink />
      <Box size={[1.4, 1.1, 0.1]} pos={[-1.5, 1.7, 1.12]} color="#ffb060" emissive={HOT} emissiveIntensity={0.6 + gl * 2.2} rough={0.4} />
      <pointLight position={[-1.5, 1.7, 2.0]} color="#ff9040" intensity={8 * gl} distance={7} decay={1.6} />
      <Cyl r={0.3} h={1.6} pos={[-2.2, 3.8, -0.4]} color="#5a5f66" rough={0.6} />
      <ContactShadow pos={[-1.5, 0.02, 0]} size={3.2} opacity={0.5} />
      {/* chute from furnace to tank */}
      <Box size={[1.6, 0.1, 0.6]} pos={[0.1, 1.55, 0.3]} rot={[0, 0, -0.45]} color={STEEL} rough={0.35} />
      {/* oil tank */}
      <Box size={[1.9, 1.3, 1.9]} pos={[1.4, 0.65, 0.3]} color="#3a3f46" rough={0.5} ink />
      <Cyl r={0.82} h={0.04} pos={[1.4, 1.32, 0.3]} color="#6b4a1e" rough={0.12} clearcoat={1} seg={40} />
      {[0, 1, 2].map((i) => {
        const k = ((t * 0.8 + i / 3) % 1);
        return (
          <mesh key={i} position={[1.4, 1.35, 0.3]} rotation={[-Math.PI / 2, 0, 0]} layers={LAYER_FX}>
            <ringGeometry args={[0.1 + k * 0.7, 0.13 + k * 0.7, 40]} />
            <meshBasicMaterial color="#e8c37a" transparent opacity={0.45 * (1 - k)} depthWrite={false} />
          </mesh>
        );
      })}
      {/* glowing balls sliding down the chute and into the oil */}
      {[0, 1, 2].map((i) => {
        const k = ((t * 0.7 + i / 3) % 1);
        const x = -0.6 + k * 1.9, y = 1.95 - k * 0.85 - Math.max(0, k - 0.75) * 1.6;
        return <Ball key={i} pos={[x, y, 0.3]} r={0.16} glow={1 - dk * 0.0 - Math.max(0, k - 0.7) * 3} spin={-4} />;
      })}
      {/* steam above the oil */}
      {[0, 1, 2, 3].map((i) => {
        const k = ((t * 0.5 + i / 4) % 1);
        return (
          <mesh key={"s" + i} position={[1.2 + i * 0.15, 1.5 + k * 1.6, 0.3]} layers={LAYER_FX}>
            <sphereGeometry args={[0.18 + k * 0.25, 12, 10]} />
            <meshBasicMaterial color="#f4f0ea" transparent opacity={0.35 * (1 - k)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- twist: a soft ball gets flattened by a test press ----------
export const SquashTest: React.FC<{ pos?: V3; squash?: N }> = ({ pos = [0, 0, 0], squash = 0 }) => {
  const t = useT();
  const s = clamp(num(squash, t));
  const r = 0.55;
  const top = r * (1 - s * 0.55);
  return (
    <group position={pos}>
      <Box size={[2.0, 1.0, 1.6]} pos={[0, 0.5, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={2.8} opacity={0.5} />
      <Box size={[1.4, 0.16, 1.2]} pos={[0, 1.08, 0]} color={STEEL} rough={0.3} />
      <Ball pos={[0, 1.16 + top, 0]} r={r} squash={s} rot={[0, 0, 0]} />
      <group position={[0, 1.16 + top * 2 + 0.14, 0]}>
        <Box size={[1.2, 0.26, 1.0]} color={STEEL} rough={0.3} ink />
        <Cyl r={0.22} h={2.2} pos={[0, 1.2, 0]} color="#8a929c" rough={0.35} />
      </group>
      <Box size={[0.3, 3.6, 0.9]} pos={[-0.85, 2.6, -0.2]} color={MACHINE} rough={0.5} ink />
    </group>
  );
};

// ---------- a ball bearing: outer + inner ring, balls between; wobble = shake from one bad ball ----------
export const Bearing: React.FC<{ pos?: V3; scale?: number; spin?: number; wobble?: N; bad?: boolean; rot?: V3 }> = ({
  pos = [0, 0, 0], scale = 1, spin = 1.2, wobble = 0, bad = false, rot = [0.35, 0, 0],
}) => {
  const t = useT();
  const w = num(wobble, t);
  const shake: V3 = [Math.sin(t * 61) * 0.05 * w, Math.sin(t * 47 + 1) * 0.05 * w, 0];
  const n = 11;
  return (
    <group position={[pos[0] + shake[0], pos[1] + shake[1], pos[2]]} scale={scale} rotation={rot}>
      <mesh castShadow layers={LAYER_INK}>
        <torusGeometry args={[1.12, 0.16, 16, 64]} />
        <SteelMat rough={0.16} />
      </mesh>
      <group rotation={[0, 0, t * spin]}>
        <mesh castShadow layers={LAYER_INK}>
          <torusGeometry args={[0.56, 0.14, 16, 64]} />
          <SteelMat rough={0.16} />
        </mesh>
      </group>
      {/* cage */}
      <group rotation={[0, 0, t * spin * 0.45]}>
        <mesh>
          <torusGeometry args={[0.84, 0.03, 8, 64]} />
          <meshStandardMaterial color="#c9a24a" roughness={0.4} />
        </mesh>
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * Math.PI * 2;
          return <Ball key={i} pos={[Math.cos(a) * 0.84, Math.sin(a) * 0.84, 0]} r={0.17} bump={bad && i === 0 ? 1 : 0} rot={[0, 0, 0]} />;
        })}
      </group>
    </group>
  );
};

// ---------- proof: a giant magnifier over a mirror ball; the measured profile ring hugs the true circle ----------
export const Magnifier: React.FC<{ pos?: V3; trace?: N }> = ({ pos = [0, 0, 0], trace = 1 }) => {
  const t = useT();
  const tr = clamp(num(trace, t));
  return (
    <group position={pos}>
      <Ball pos={[0, 0, 0]} r={0.9} spin={0.4} rot={[0.2, 0, 0.1]} />
      {/* lens ring + handle */}
      <group position={[0.35, 0.25, 1.25]} rotation={[0, -0.15, 0]}>
        <mesh layers={LAYER_INK}>
          <torusGeometry args={[1.2, 0.09, 14, 64]} />
          <meshStandardMaterial color="#2f3640" roughness={0.4} />
        </mesh>
        <mesh>
          <circleGeometry args={[1.18, 48]} />
          <meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.12} roughness={0.02} clearcoat={1} depthWrite={false} />
        </mesh>
        <Cyl r={0.1} h={1.5} pos={[1.15, -1.25, 0]} rot={[0, 0, 0.75]} color="#c0392b" rough={0.5} ink />
      </group>
      {/* measured profile: a thin bright ring drawn around the silhouette */}
      <mesh position={[0, 0, 0.05]} layers={LAYER_FX}>
        <ringGeometry args={[0.95, 0.985, 96, 1, 0, Math.PI * 2 * Math.max(0.01, tr)]} />
        <meshBasicMaterial color="#5fe0a0" transparent opacity={0.9} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------- comparison: the Earth, with one tiny mountain sticking out ----------
const earthTex = (() => {
  let tex: THREE.Texture | null = null;
  return () => {
    if (tex) return tex;
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#2f6fb8"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#4f9a4a";
    for (let i = 0; i < 18; i++) {
      g.beginPath();
      g.ellipse(hash(i) * 512, 40 + hash(i + 9) * 176, 30 + hash(i + 3) * 60, 18 + hash(i + 5) * 40, hash(i + 7) * 3, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "rgba(255,255,255,0.85)";
    g.fillRect(0, 0, 512, 14); g.fillRect(0, 242, 512, 14);
    tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };
})();

export const Earth: React.FC<{ pos?: V3; r?: number; morph?: N }> = ({ pos = [0, 0, 0], r = 1.6, morph = 1 }) => {
  const t = useT();
  const m = clamp(num(morph, t)); // 0 = steel ball, 1 = Earth
  return (
    <group position={pos} rotation={[0.3, t * 0.25, 0]}>
      <mesh castShadow layers={LAYER_INK} visible={m < 0.5}>
        <sphereGeometry args={[r, 48, 32]} />
        <SteelMat />
      </mesh>
      <mesh castShadow layers={LAYER_INK} visible={m >= 0.5}>
        <sphereGeometry args={[r, 48, 32]} />
        <meshPhysicalMaterial map={earthTex()} roughness={0.6} clearcoat={0.3} />
      </mesh>
      {/* the tallest mountain: a tiny bump on the outline */}
      {m >= 0.5 ? (
        <mesh position={[0, r * 0.985, 0]} castShadow>
          <coneGeometry args={[0.06, 0.07, 10]} />
          <meshStandardMaterial color="#8a6a4a" roughness={0.8} />
        </mesh>
      ) : null}
      {/* thin atmosphere */}
      {m >= 0.5 ? (
        <mesh layers={LAYER_FX}>
          <sphereGeometry args={[r * 1.05, 40, 28]} />
          <meshBasicMaterial color="#9fd0ff" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

// a starfield backdrop (FX layer, never black)
export const Space: React.FC = () => (
  <group>
    <mesh position={[0, 3, -12]} layers={LAYER_FX}>
      <planeGeometry args={[60, 40]} />
      <meshBasicMaterial color="#232756" depthWrite={false} />
    </mesh>
    {Array.from({ length: 90 }).map((_, i) => (
      <mesh key={i} position={[(hash(i) - 0.5) * 30, (hash(i + 40) - 0.2) * 18, -11.5]} layers={LAYER_FX}>
        <circleGeometry args={[0.03 + hash(i + 80) * 0.05, 6]} />
        <meshBasicMaterial color="#fff6dc" toneMapped={false} />
      </mesh>
    ))}
  </group>
);

// ---------- sorting: balls roll down a gauge rail and drop into three bins by size ----------
export const Sorter: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => {
  const t = useT();
  return (
    <group position={pos}>
      {/* sloped rail */}
      <Box size={[4.6, 0.12, 0.5]} pos={[0, 2.3, 0]} rot={[0, 0, -0.12]} color={MACHINE_LIGHT} rough={0.3} ink />
      <Box size={[4.6, 0.6, 0.12]} pos={[0, 2.6, -0.3]} rot={[0, 0, -0.12]} color={MACHINE} rough={0.5} />
      {/* bins */}
      {[-1.4, 0, 1.4].map((x, i) => (
        <group key={i} position={[x, 0, 0.1]}>
          <Box size={[1.1, 1.1, 1.1]} pos={[0, 0.55, 0]} color={["#3d7fb8", "#4fa86a", "#c0392b"][i]} rough={0.6} ink />
          {Array.from({ length: 6 }).map((_, k) => (
            <Ball key={k} pos={[(k % 3 - 1) * 0.28, 1.12 + Math.floor(k / 3) * 0.1, (Math.floor(k / 3) - 0.5) * 0.3]} r={0.14} rot={[k, k, 0]} />
          ))}
        </group>
      ))}
      <ContactShadow pos={[0, 0.02, 0.1]} size={5} opacity={0.45} />
      {/* balls rolling and dropping */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const k = (t * 0.45 + i / 6) % 1;
        const bin = i % 3;
        const drop = [0.3, 0.6, 0.9][bin];
        const x = -2.2 + Math.min(k, drop) * 4.4;
        const fall = Math.max(0, k - drop) * 9;
        const y = 2.5 - (Math.min(k, drop) * 4.4) * 0.12 - fall * fall * 0.6;
        if (y < 1.1) return null;
        return <Ball key={i} pos={[x, y, 0]} r={0.14} spin={-5} />;
      })}
    </group>
  );
};

// a scrap of wire (the "before")
export const WireBit: React.FC<{ pos?: V3; rot?: V3; len?: number; r?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, Math.PI / 2], len = 0.7, r = 0.22 }) => (
  <Cyl r={r} h={len} pos={pos} rot={rot} color="#8d959e" rough={0.5} ink />
);

// a display cushion (velvet) for the "perfect pair"
export const Cushion: React.FC<{ pos?: V3; scale?: number; tag?: boolean; n?: number }> = ({ pos = [0, 0, 0], scale = 1, tag = false, n = 2 }) => (
  <group position={pos} scale={scale}>
    <Box size={[1.6, 0.9, 1.2]} pos={[0, 0.45, 0]} color="#2f3640" rough={0.5} />
    <Box size={[1.4, 0.18, 1.0]} pos={[0, 0.98, 0]} color="#7a1f3a" rough={0.95} />
    {Array.from({ length: n }).map((_, i) => (
      <Ball key={i} pos={[(i - (n - 1) / 2) * 0.52, 1.3, 0.05]} r={0.24} spin={0.6} rot={[0.2, i, 0]} />
    ))}
    {tag ? <Card pos={[0, 0.5, 0.62]} lines={["@ ______"]} w={1.2} h={0.5} bg="#fff6dc" fg="#c0392b" /> : null}
    <ContactShadow pos={[0, 0.0, 0]} size={2.2} opacity={0.5} />
  </group>
);

const CELLS = [44, 45, ...Array.from({ length: 100 }, (_, i) => i).filter((i) => i !== 44 && i !== 45)];

// tray that fills from 2 balls to a 10×10 grid ("a pair… or a hundred")
export const Tray: React.FC<{ pos?: V3; fill?: N }> = ({ pos = [0, 0, 0], fill = 0 }) => {
  const t = useT();
  const f = clamp(num(fill, t));
  const shown = 2 + Math.round(f * 98);
  return (
    <group position={pos}>
      <Box size={[2.3, 0.14, 2.3]} pos={[0, 0, 0]} color="#8a2a3a" rough={0.9} />
      {CELLS.map((order, i) => {
        // the first two sit in the centre, the rest fill the grid
        if (i >= shown) return null;
        const gx = order % 10, gz = Math.floor(order / 10);
        return <Ball key={i} pos={[(gx - 4.5) * 0.21, 0.17, (gz - 4.5) * 0.21]} r={0.095} ink={false} rot={[i, i * 0.3, 0]} />;
      })}
      <ContactShadow pos={[0, -0.06, 0]} size={3.2} opacity={0.5} />
    </group>
  );
};
