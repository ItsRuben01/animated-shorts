// ep8 — sausage plant sets. In-world labels are numbers, units and symbols only, so ES and EN share every shot.
import React from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow, StepSign } from "../ep7/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, StepSign };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const STEEL = "#b4bcc6";
export const COOKED = "#c8643a"; // frankfurter after the smokehouse
export const RAW = "#e8a29a"; // raw pink batter
export const CASING = "#fff1d6"; // cellulose casing (amber, see-through)

// ---------- room: white-tiled meat plant, red safety stripe, skylights ----------
export const Plant: React.FC<{ z?: number }> = ({ z = -7 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#b7b9c2", [10, 10])} rough={0.8} bevel={false} />
    <Box size={[60, 14, 0.4]} pos={[0, 7, z]} map={painted("#eef0ee", [8, 2])} rough={0.9} bevel={false} />
    <Box size={[60, 1.1, 0.5]} pos={[0, 1.2, z + 0.1]} color="#c0392b" rough={0.6} bevel={false} />
    <Box size={[60, 0.18, 0.55]} pos={[0, 1.85, z + 0.12]} color="#e0b44a" rough={0.5} bevel={false} />
    {[-9, -3, 3, 9].map((x) => (
      <Box key={x} size={[3.4, 2.4, 0.2]} pos={[x, 6.6, z + 0.25]} color="#f4fbff" emissive="#e6f2ff" emissiveIntensity={0.55} rough={0.3} />
    ))}
    <Cyl r={0.28} h={60} pos={[0, 9.4, z + 0.8]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.35} />
    <Cyl r={0.18} h={60} pos={[0, 8.7, z + 0.8]} rot={[0, 0, Math.PI / 2]} color="#3d7fb8" rough={0.45} />
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

// ---------- the sausage ----------
// Lies along x. len = total length incl. round ends. casing = see-through cellulose sleeve around it,
// peel 0..1 = the sleeve splits in two halves that fly up and back.
export const Sausage: React.FC<{
  pos?: V3; rot?: V3; len?: number; r?: number; color?: string; casing?: boolean; peel?: number; ink?: boolean; sweat?: number; shine?: boolean;
}> = ({ pos = [0, 0, 0], rot = [0, 0, 0], len = 1.6, r = 0.16, color = COOKED, casing = false, peel = 0, ink = false, sweat = 0, shine = true }) => {
  const body = Math.max(0.01, len - 2 * r);
  return (
    <group position={pos} rotation={rot}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow layers={ink ? LAYER_INK : 0}>
        <capsuleGeometry args={[r, body, 10, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.42} clearcoat={shine ? 0.45 : 0.1} clearcoatRoughness={0.35} />
      </mesh>
      {/* a soft highlight stripe so it reads glossy even at small size */}
      {shine ? (
        <mesh position={[0, r * 0.55, r * 0.55]} rotation={[0, 0, Math.PI / 2]} scale={[0.25, 1, 0.25]}>
          <capsuleGeometry args={[r, body * 0.8, 4, 8]} />
          <meshBasicMaterial color="#ffd8b8" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ) : null}
      {casing ? <Casing len={len} r={r} peel={peel} /> : null}
      {/* fat sweating out: yellow beads on the skin */}
      {sweat > 0
        ? Array.from({ length: 9 }).map((_, i) => {
            const u = (i + 0.5) / 9 - 0.5, th = 0.6 + hash(i) * 1.8, k = Math.min(1, sweat * 1.6 - hash(i + 4) * 0.5);
            if (k <= 0) return null;
            return (
              <mesh key={i} position={[u * body, Math.cos(th) * r * 1.02 - k * 0.04, Math.sin(th) * r * 1.02]} scale={[0.8, 1.2, 0.8].map((s) => s * k) as V3}>
                <sphereGeometry args={[r * 0.18, 10, 8]} />
                <meshPhysicalMaterial color="#f5d36a" roughness={0.1} clearcoat={1} transparent opacity={0.9} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

// the cellulose sleeve: two half-shells + twisted tails at both ends
const Casing: React.FC<{ len: number; r: number; peel: number }> = ({ len, r, peel }) => {
  const body = Math.max(0.01, len - 2 * r);
  const R = r * 1.08;
  const p = ease(Math.max(0, Math.min(1, peel)));
  const half = (side: 1 | -1) => (
    <group position={[p * 0.3 * side, p * (0.9 + (side > 0 ? 0.3 : 0)), -p * 0.5]} rotation={[side * p * 1.3, 0, side * p * 0.5]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[R, R, body + r * 1.5, 24, 1, true, side > 0 ? 0 : Math.PI, Math.PI]} />
        <meshPhysicalMaterial color={CASING} transparent opacity={0.22} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
  return (
    <group>
      {half(1)}
      {half(-1)}
      {p < 0.05
        ? [1, -1].map((s) => (
            <mesh key={s} position={[s * (len / 2 + r * 0.12), 0, 0]} scale={[0.7, 1, 1]}>
              <sphereGeometry args={[r * 0.28, 10, 8]} />
              <meshPhysicalMaterial color={CASING} transparent opacity={0.55} roughness={0.3} />
            </mesh>
          ))
        : null}
    </group>
  );
};

// a chain of linked sausages along x (twist knots between them)
export const Links: React.FC<{ pos?: V3; rot?: V3; n?: number; len?: number; r?: number; color?: string; casing?: boolean; ink?: boolean; sag?: number }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], n = 4, len = 1.0, r = 0.14, color = COOKED, casing = true, ink = false, sag = 0,
}) => {
  const step = len + r * 0.5;
  return (
    <group position={pos} rotation={rot}>
      {Array.from({ length: n }).map((_, i) => {
        const x = (i - (n - 1) / 2) * step;
        const y = -sag * Math.sin(((i + 0.5) / n) * Math.PI);
        return (
          <group key={i}>
            <Sausage pos={[x, y, 0]} len={len} r={r} color={color} casing={casing} ink={ink} />
            {i < n - 1 ? <Cyl r={r * 0.28} h={r * 0.7} pos={[x + step / 2, y, 0]} rot={[0, 0, Math.PI / 2]} color={CASING} rough={0.3} /> : null}
          </group>
        );
      })}
    </group>
  );
};

export const Ice: React.FC<{ pos: V3; s?: number; rot?: V3 }> = ({ pos, s = 0.18, rot = [0.4, 0.6, 0.2] }) => (
  <mesh position={pos} rotation={rot} castShadow>
    <boxGeometry args={[s, s, s]} />
    <meshPhysicalMaterial color="#e6f6ff" roughness={0.05} clearcoat={1} transparent opacity={0.75} transmission={0.2} />
  </mesh>
);

// ---------- step 1: bowl chopper (rotating bowl, knife hood), paste + crushed ice, fat cubes dropping in ----------
export const Chopper: React.FC<{ pos?: V3; spin?: number; ice?: number; fat?: N; paste?: N }> = ({ pos = [0, 0, 0], spin = 1.6, ice = 14, fat = 0, paste = 1 }) => {
  const t = useT();
  const f = num(fat, t), pz = num(paste, t);
  const pasteCol = new THREE.Color("#c8586a").lerp(new THREE.Color(RAW), pz).getStyle();
  return (
    <group position={pos}>
      {/* stand */}
      <Box size={[2.6, 1.2, 2.2]} pos={[0, 0.6, 0]} color={STEEL} rough={0.35} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3.4} opacity={0.5} />
      <group position={[0, 1.2, 0]} rotation={[0, t * spin, 0]}>
        {/* bowl wall + rim */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow layers={LAYER_INK}>
          <cylinderGeometry args={[1.3, 1.05, 0.7, 48, 1, true]} />
          <meshPhysicalMaterial color="#c9d0d8" roughness={0.22} metalness={0.3} clearcoat={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.05, 10, 48]} />
          <meshPhysicalMaterial color="#e3e8ee" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* paste surface with swirl ridges */}
        <Cyl r={1.18} h={0.1} pos={[0, 0.52, 0]} color={pasteCol} rough={0.6} seg={48} />
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, i * 1.05]}>
            <torusGeometry args={[0.35 + i * 0.13, 0.03, 6, 30, 2.2]} />
            <meshStandardMaterial color={pasteCol} roughness={0.7} />
          </mesh>
        ))}
        {Array.from({ length: ice }).map((_, i) => (
          <Ice key={i} pos={[Math.cos(i * 2.39) * (0.3 + (i % 5) * 0.17), 0.64, Math.sin(i * 2.39) * (0.3 + (i % 5) * 0.17)]} s={0.13 + hash(i) * 0.07} rot={[i, i * 0.7, 0]} />
        ))}
      </group>
      {/* knife hood (does not spin) */}
      <Box size={[0.7, 0.4, 1.0]} pos={[0.75, 2.1, -0.55]} color="#e3e8ee" rough={0.3} clearcoat={0.4} ink />
      <Cyl r={0.1} h={0.9} pos={[1.15, 1.75, -0.55]} color="#8a929c" rough={0.4} />
      {/* fat cubes falling into the bowl */}
      {f > 0
        ? Array.from({ length: 6 }).map((_, i) => {
            const d = Math.max(0, Math.min(1, f * 1.6 - i * 0.12));
            if (d <= 0) return null;
            return (
              <mesh key={i} position={[-0.4 + (i % 3) * 0.25, 4.2 - d * 2.4, 0.2 + Math.floor(i / 3) * 0.25]} rotation={[i, i * 0.5, 0]} castShadow>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#f7efe6" roughness={0.7} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

// ---------- a big dial thermometer on a post (number shown on a Card) ----------
export const Thermo: React.FC<{ pos?: V3; level?: N; label: string; hot?: boolean; scale?: number }> = ({ pos = [0, 0, 0], level = 0.3, label, hot = false, scale = 1 }) => {
  const t = useT();
  const lv = Math.max(0.05, Math.min(1, num(level, t)));
  const col = hot ? "#e0452f" : "#3d8fd8";
  return (
    <group position={pos} scale={scale}>
      <mesh position={[0, 1.4, 0]} castShadow layers={LAYER_INK}>
        <capsuleGeometry args={[0.22, 2.2, 8, 20]} />
        <meshPhysicalMaterial color="#f2f6fa" transparent opacity={0.55} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.36, 24, 18]} />
        <meshStandardMaterial color={col} roughness={0.3} emissive={col} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.3 + lv * 1.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, lv * 2.2, 14]} />
        <meshStandardMaterial color={col} roughness={0.3} emissive={col} emissiveIntensity={0.25} />
      </mesh>
      <Card pos={[0, 2.95, 0.05]} lines={[label]} w={1.45} h={0.6} bg={hot ? "#4a2430" : "#173846"} fg="#ffe6ad" />
    </group>
  );
};

// ---------- step 2: stuffer — hopper on a cabinet, nozzle, casing filling up along +x ----------
export const Stuffer: React.FC<{ pos?: V3; out?: N; r?: number }> = ({ pos = [0, 0, 0], out = 1, r = 0.16 }) => {
  const t = useT();
  const o = Math.max(0.02, Math.min(1, num(out, t)));
  const L = 0.4 + o * 3.0;
  return (
    <group position={pos}>
      <Box size={[1.6, 1.8, 1.4]} pos={[-1.2, 0.9, 0]} color="#d7dde3" rough={0.35} ink />
      <ContactShadow pos={[-1.2, 0.02, 0]} size={2.4} opacity={0.5} />
      <Cyl r={0.75} r2={0.3} h={1.1} pos={[-1.2, 2.35, 0]} color={STEEL} rough={0.3} clearcoat={0.5} ink />
      <Cyl r={0.68} h={0.06} pos={[-1.2, 2.88, 0]} color={RAW} rough={0.6} />
      {/* pressure gauge */}
      <Cyl r={0.22} h={0.08} pos={[-0.7, 1.45, 0.72]} rot={[Math.PI / 2, 0, 0]} color="#f4f4f0" rough={0.3} />
      <Box size={[0.03, 0.16, 0.02]} pos={[-0.66, 1.49, 0.78]} rot={[0, 0, -0.5 - o * 1.6]} color="#c0392b" bevel={false} />
      {/* nozzle */}
      <Cyl r={0.1} h={0.9} pos={[-0.05, 1.3, 0]} rot={[0, 0, Math.PI / 2]} color="#e3e8ee" rough={0.25} ink />
      {/* sleeve bunched on the nozzle */}
      <mesh position={[0.05, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.45 * (1 - o * 0.6), 18]} />
        <meshPhysicalMaterial color={CASING} transparent opacity={0.7} roughness={0.4} />
      </mesh>
      {/* the filled rope growing out */}
      <Sausage pos={[0.4 + L / 2, 1.3, 0]} len={L} r={r} color={RAW} casing shine={false} ink />
      <Box size={[3.8, 0.12, 0.8]} pos={[2.0, 1.08, 0]} color="#e3e8ee" rough={0.3} />
      <Box size={[0.2, 1.0, 0.6]} pos={[3.6, 0.5, 0]} color={STEEL} rough={0.4} />
    </group>
  );
};

// three calibres side by side, each with its gauge ring: the casing decides the thickness
export const Calibres: React.FC<{ pos?: V3; grow?: N }> = ({ pos = [0, 0, 0], grow = 1 }) => {
  const t = useT();
  const g = Math.max(0, Math.min(1, num(grow, t)));
  const rs = [0.1, 0.17, 0.28];
  return (
    <group position={pos}>
      <Box size={[3.4, 0.5, 1.4]} pos={[0, 0.25, 0]} color="#d7dde3" rough={0.4} ink />
      {rs.map((r, i) => {
        const k = ease(Math.max(0, Math.min(1, g * 2.2 - i * 0.45)));
        return (
          <group key={i} position={[(i - 1) * 1.05, 0.5, 0.1]}>
            <Sausage pos={[0, 0.85 * k + 0.05, 0]} rot={[0, 0, Math.PI / 2]} len={1.5 * Math.max(0.05, k)} r={r} color={COOKED} casing ink />
            <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r * 1.15, 0.035, 10, 32]} />
              <meshStandardMaterial color="#e0b44a" roughness={0.3} metalness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ---------- linker: a chuck that twists the rope; finished links slide off along +x ----------
export const Linker: React.FC<{ pos?: V3; speed?: number }> = ({ pos = [0, 0, 0], speed = 0.9 }) => {
  const t = useT();
  const shift = (t * speed) % 1.15;
  return (
    <group position={pos}>
      <Box size={[1.4, 2.0, 1.4]} pos={[-1.6, 1.0, 0]} color="#d7dde3" rough={0.35} ink />
      <ContactShadow pos={[-1.6, 0.02, 0]} size={2.2} opacity={0.5} />
      <group position={[-0.8, 1.4, 0]} rotation={[t * 9, 0, 0]}>
        <Cyl r={0.32} h={0.3} rot={[0, 0, Math.PI / 2]} color="#e0b44a" rough={0.35} ink />
        {[0, 1, 2, 3].map((i) => <Box key={i} size={[0.32, 0.08, 0.7]} rot={[i * Math.PI / 4, 0, 0]} color="#c99a35" rough={0.4} bevel={false} />)}
      </group>
      <Box size={[5.4, 0.12, 0.9]} pos={[1.9, 1.16, 0]} color="#e3e8ee" rough={0.3} />
      <group position={[shift, 0, 0]}>
        <Links pos={[1.9, 1.4, 0]} n={5} len={0.95} r={0.15} color={RAW} ink />
      </group>
    </group>
  );
};

// ---------- step 3: smokehouse — a trolley of hanging links inside a glowing oven + cold shower afterwards ----------
export const Oven: React.FC<{ pos?: V3; glow?: N; shower?: N; cooked?: N }> = ({ pos = [0, 0, 0], glow = 1, shower = 0, cooked = 1 }) => {
  const t = useT();
  const gl = num(glow, t), sh = num(shower, t), ck = num(cooked, t);
  const col = new THREE.Color(RAW).lerp(new THREE.Color(COOKED), ck).getStyle();
  return (
    <group position={pos}>
      {/* oven box with open front */}
      <Box size={[4.4, 0.3, 2.6]} pos={[0, 4.15, -0.2]} color="#9aa3ad" rough={0.4} ink />
      <Box size={[0.3, 4.3, 2.6]} pos={[-2.05, 2.15, -0.2]} color="#9aa3ad" rough={0.4} ink />
      <Box size={[0.3, 4.3, 2.6]} pos={[2.05, 2.15, -0.2]} color="#9aa3ad" rough={0.4} ink />
      <Box size={[4.4, 4.3, 0.2]} pos={[0, 2.15, -1.45]} color="#5d4a44" emissive="#ff7a30" emissiveIntensity={0.35 * gl} rough={0.6} />
      <pointLight position={[0, 2.4, 0.2]} color="#ff9a50" intensity={14 * gl} distance={7} decay={1.6} />
      {/* trolley bars with hanging loops of links */}
      {[3.5, 2.4].map((y, row) => (
        <group key={row}>
          <Cyl r={0.05} h={3.6} pos={[0, y, 0]} rot={[0, 0, Math.PI / 2]} color={STEEL} rough={0.3} />
          {[-1.3, -0.45, 0.4, 1.25].map((x, i) => (
            <group key={i} position={[x, y - 0.55, 0.1 * row]}>
              <Sausage rot={[0, 0, Math.PI / 2]} pos={[-0.12, 0, 0]} len={0.95} r={0.12} color={col} casing />
              <Sausage rot={[0, 0, Math.PI / 2]} pos={[0.12, 0, 0]} len={0.95} r={0.12} color={col} casing />
            </group>
          ))}
        </group>
      ))}
      {/* cold shower: falling water streaks */}
      {sh > 0
        ? Array.from({ length: 34 }).map((_, i) => {
            const x = -1.7 + (i % 17) * 0.21, z = -0.3 + Math.floor(i / 17) * 0.5;
            const y = 4.0 - (((t * 3.2 + hash(i) * 4) % 4));
            return (
              <mesh key={i} position={[x, y, z]} layers={LAYER_FX}>
                <cylinderGeometry args={[0.012, 0.012, 0.42, 4]} />
                <meshBasicMaterial color="#bfe4ff" transparent opacity={0.65 * sh} depthWrite={false} />
              </mesh>
            );
          })
        : null}
      <ContactShadow pos={[0, 0.02, -0.2]} size={4.6} opacity={0.5} />
    </group>
  );
};

// ---------- step 4: peeler — steam tunnel, blade, air jet; casings fly off, naked sausages come out ----------
export const Peeler: React.FC<{ pos?: V3; speed?: number }> = ({ pos = [0, 0, 0], speed = 0.55 }) => {
  const t = useT();
  const BLADE = 0.0;
  return (
    <group position={pos}>
      <Box size={[6.2, 0.9, 1.2]} pos={[0, 0.45, 0]} color="#d7dde3" rough={0.35} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={6.6} opacity={0.5} />
      {/* steam tunnel (left half) */}
      <mesh position={[-1.7, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 2.6, 28, 1, true]} />
        <meshPhysicalMaterial color="#eef6fb" transparent opacity={0.28} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* blade */}
      <group position={[BLADE, 1.62, 0]}>
        <Box size={[0.08, 0.5, 0.6]} pos={[0, 0.25, 0]} color="#3a3f46" rough={0.4} bevel={false} />
        <mesh position={[0, -0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[0.14, 0.32, 3]} />
          <meshPhysicalMaterial color="#e9eef3" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>
      {/* air nozzle */}
      <Cyl r={0.07} h={0.7} pos={[0.6, 1.9, 0.3]} rot={[0.6, 0, 0.3]} color="#e0b44a" rough={0.35} ink />
      {/* sausages travelling left → right; past the blade the casing peels off */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = -3.2 + ((t * speed * 1.0 + i * 1.12) % 6.7);
        const peel = Math.max(0, Math.min(1, (x - BLADE - 0.1) / 1.1));
        if (x > 3.3) return null;
        return <Sausage key={i} pos={[x, 1.25, 0]} len={0.95} r={0.15} color={COOKED} casing={peel < 0.98} peel={peel} ink />;
      })}
      {/* steam puffs */}
      {Array.from({ length: 10 }).map((_, i) => {
        const k = (t * 0.6 + hash(i)) % 1;
        return (
          <mesh key={i} position={[-2.8 + (i % 5) * 0.5, 1.7 + k * 1.6, (hash(i + 2) - 0.5) * 0.6]} layers={LAYER_FX} scale={0.3 + k * 0.5}>
            <sphereGeometry args={[0.5, 12, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18 * (1 - k)} depthWrite={false} />
          </mesh>
        );
      })}
      {/* bin catching the empty casings */}
      <Box size={[1.0, 0.8, 0.9]} pos={[1.3, 0.4, -1.2]} color="#3d7fb8" rough={0.5} ink />
    </group>
  );
};

// ---------- analogy: a brand-new phone, its protective film peeling off ----------
export const Phone: React.FC<{ pos?: V3; peel?: N; scale?: number }> = ({ pos = [0, 0, 0], peel = 0, scale = 1 }) => {
  const t = useT();
  const p = ease(Math.max(0, Math.min(1, num(peel, t))));
  return (
    <group position={pos} scale={scale}>
      <Box size={[1.0, 2.0, 0.12]} color="#23262e" rough={0.25} clearcoat={0.8} ink />
      <Box size={[0.9, 1.84, 0.02]} pos={[0, 0, 0.07]} color="#3a5fd0" emissive="#5a7fff" emissiveIntensity={0.45} rough={0.2} bevel={false} />
      {/* film: hinged at the top edge, lifts toward the camera */}
      <group position={[0, 0.93, 0.09]} rotation={[-p * 2.2, 0, 0]}>
        <mesh position={[0, -0.92, 0]}>
          <planeGeometry args={[0.92, 1.86]} />
          <meshPhysicalMaterial color="#f4f8ff" transparent opacity={0.4} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- proof: a giant cross-section; the outer protein sets into its own skin ----------
export const XSection: React.FC<{ pos?: V3; skin?: N; scale?: number; casing?: N }> = ({ pos = [0, 0, 0], skin = 1, scale = 1, casing = 0 }) => {
  const t = useT();
  const s = Math.max(0, Math.min(1, num(skin, t))), c = Math.max(0, Math.min(1, num(casing, t)));
  return (
    <group position={pos} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
      {c > 0.01 ? (
        <mesh position={[0, 0.02, 0]} scale={[1 + c * 0.6, 1, 1 + c * 0.6]}>
          <cylinderGeometry args={[1.18, 1.18, 0.34, 48, 1, true]} />
          <meshPhysicalMaterial color={CASING} transparent opacity={0.5 * (1 - c)} roughness={0.2} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ) : null}
      <Cyl r={1.1} h={0.3} color={new THREE.Color("#e9b4a2").lerp(new THREE.Color("#b5603a"), s).getStyle()} rough={0.5} seg={48} ink />
      <Cyl r={1.1 - 0.05 - s * 0.16} h={0.32} color="#efb9a8" rough={0.7} seg={48} />
      {/* fine fat specks in the emulsion */}
      {Array.from({ length: 26 }).map((_, i) => {
        const a = i * 2.39, rr = Math.sqrt((i + 0.5) / 26) * 0.8;
        return <Cyl key={i} r={0.03 + hash(i) * 0.02} h={0.335} pos={[Math.cos(a) * rr, 0, Math.sin(a) * rr]} color="#f7e2d6" rough={0.7} seg={8} />;
      })}
    </group>
  );
};

// ---------- packaging ----------
export const Pack: React.FC<{ pos?: V3; scale?: number; tag?: boolean; rot?: V3 }> = ({ pos = [0, 0, 0], scale = 1, tag = false, rot = [0, 0, 0] }) => (
  <group position={pos} scale={scale} rotation={rot}>
    {[-0.39, -0.13, 0.13, 0.39].map((z, i) => (
      <Sausage key={i} pos={[0, 0.18, z]} len={1.6} r={0.13} color={COOKED} ink />
    ))}
    <mesh position={[0, 0.2, 0]} castShadow>
      <boxGeometry args={[1.85, 0.42, 1.2]} />
      <meshPhysicalMaterial color="#f2f7ff" transparent opacity={0.22} roughness={0.05} clearcoat={1} depthWrite={false} />
    </mesh>
    <Box size={[1.9, 0.04, 1.25]} pos={[0, 0.0, 0]} color="#c0392b" rough={0.5} bevel={false} />
    {tag ? <Card pos={[0, 0.48, 0.62]} lines={["@ ______"]} w={1.15} h={0.5} bg="#fff6dc" fg="#c0392b" rot={[-0.5, 0, 0]} /> : null}
    <ContactShadow pos={[0, 0.0, 0]} size={2.4} opacity={0.5} />
  </group>
);

export const Bun: React.FC<{ pos?: V3; rot?: V3; scale?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], scale = 1 }) => (
  <group position={pos} rotation={rot} scale={scale}>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[0, 0, s * 0.2]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.75]} castShadow layers={LAYER_INK}>
        <capsuleGeometry args={[0.22, 1.3, 8, 20]} />
        <meshPhysicalMaterial color="#c98a45" roughness={0.65} clearcoat={0.15} />
      </mesh>
    ))}
  </group>
);

// a mixing tub of raw paste with ice (the "before")
export const Tub: React.FC<{ pos?: V3; scale?: number }> = ({ pos = [0, 0, 0], scale = 1 }) => (
  <group position={pos} scale={scale}>
    <Cyl r={0.7} r2={0.6} h={0.7} pos={[0, 0.35, 0]} color={STEEL} rough={0.3} clearcoat={0.5} ink />
    <Cyl r={0.64} h={0.06} pos={[0, 0.69, 0]} color={RAW} rough={0.7} />
    {Array.from({ length: 7 }).map((_, i) => <Ice key={i} pos={[Math.cos(i * 2.4) * 0.35, 0.75, Math.sin(i * 2.4) * 0.35]} s={0.12} rot={[i, i, 0]} />)}
    <ContactShadow pos={[0, 0.02, 0]} size={1.8} opacity={0.5} />
  </group>
);

// a framed 1920s portrait frame on the wall (the character stands in front of it)
export const Frame: React.FC<{ pos?: V3; w?: number; h?: number }> = ({ pos = [0, 0, 0], w = 3.2, h = 4.0 }) => (
  <group position={pos}>
    <Box size={[w + 0.3, h + 0.3, 0.15]} color="#7a5233" rough={0.6} />
    <Box size={[w, h, 0.05]} pos={[0, 0, 0.08]} color="#d8c39a" rough={0.9} bevel={false} />
  </group>
);

export { ramp };
