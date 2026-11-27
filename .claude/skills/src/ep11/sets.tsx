// ep11 — airplane tires & nitrogen. In-world labels are numbers, units and symbols only, so ES and EN share every shot.
import React from "react";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow } from "../ep7/sets";
import { Cross, Dial, Tire as CarTire } from "../ep10/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, Cross, Dial, CarTire };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const RUBBER = "#3d3c4a"; // tire rubber: violet-grey, never black
export const HUB = "#c9ced6";
export const LIVERY = "#2f6fb8"; // airline blue
export const FUSE = "#f4f5f7";
export const N2C = "#4f9bff"; // nitrogen molecule (blue)
export const O2C = "#ff5a5a"; // oxygen molecule (red)
export const VAPOR = "#ffcf4a"; // gases from the hot rubber (yellow)

// ---------- sky backdrop (gradient bands, never black) ----------
const Sky: React.FC<{ z?: number; top?: string; mid?: string; low?: string }> = ({ z = -40, top = "#8fc0ec", mid = "#b9d8f2", low = "#e4eef6" }) => (
  <group>
    <Box size={[200, 30, 0.4]} pos={[0, 34, z]} color={top} rough={1} bevel={false} shadow={false} />
    <Box size={[200, 12, 0.4]} pos={[0, 13, z + 0.3]} color={mid} rough={1} bevel={false} shadow={false} />
    <Box size={[200, 7, 0.4]} pos={[0, 3.5, z + 0.6]} color={low} rough={1} bevel={false} shadow={false} />
  </group>
);

// ---------- apron: asphalt, yellow taxi line, terminal + tower far away ----------
export const Apron: React.FC<{ sky?: [string, string, string] }> = ({ sky }) => (
  <group>
    <Box size={[120, 0.4, 120]} pos={[0, -0.2, 0]} map={painted("#8a8d9a", [14, 14])} rough={0.85} bevel={false} />
    <Box size={[0.35, 0.02, 120]} pos={[3.2, 0.01, 0]} color="#f2c230" rough={0.6} bevel={false} />
    <Box size={[120, 0.02, 0.3]} pos={[0, 0.01, -6]} color="#f4f4f0" rough={0.6} bevel={false} />
    {/* terminal */}
    <Box size={[34, 5, 6]} pos={[-6, 2.5, -26]} color="#d9dee6" rough={0.6} />
    <Box size={[34, 1.6, 6.2]} pos={[-6, 3.6, -25.9]} color="#7fb6dc" emissive="#a8d4f0" emissiveIntensity={0.25} rough={0.2} />
    {/* tower */}
    <Cyl r={0.9} h={12} pos={[14, 6, -28]} color="#e6e9ee" rough={0.6} />
    <Cyl r={2.0} r2={1.6} h={2.2} pos={[14, 13, -28]} color="#7fb6dc" emissive="#a8d4f0" emissiveIntensity={0.3} rough={0.2} />
    <Box size={[60, 0.4, 3]} pos={[0, 0.05, -20]} color="#6f8f4a" rough={0.95} bevel={false} />
    <Sky top={sky?.[0]} mid={sky?.[1]} low={sky?.[2]} />
  </group>
);

// ---------- runway (along x): centreline dashes, threshold bars, grass ----------
export const Runway: React.FC<{ sky?: [string, string, string] }> = ({ sky }) => (
  <group>
    <Box size={[200, 0.4, 200]} pos={[0, -0.25, 0]} map={painted("#7c9a52", [20, 20])} rough={0.95} bevel={false} />
    <Box size={[200, 0.3, 12]} pos={[0, -0.1, 0]} map={painted("#6e717e", [20, 2])} rough={0.85} bevel={false} />
    {Array.from({ length: 22 }).map((_, i) => (
      <Box key={i} size={[3, 0.02, 0.3]} pos={[-50 + i * 6, 0.06, 0]} color="#f4f4f0" rough={0.6} bevel={false} />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <Box key={"th" + i} size={[4, 0.02, 0.5]} pos={[-14, 0.06, -4.2 + i * 1.2]} color="#f4f4f0" rough={0.6} bevel={false} />
    ))}
    {Array.from({ length: 14 }).map((_, i) => (
      <group key={"l" + i}>
        <Cyl r={0.12} h={0.3} pos={[-40 + i * 6, 0.15, 6.4]} color="#f2c230" emissive="#ffd860" emissiveIntensity={0.6} />
        <Cyl r={0.12} h={0.3} pos={[-40 + i * 6, 0.15, -6.4]} color="#f2c230" emissive="#ffd860" emissiveIntensity={0.6} />
      </group>
    ))}
    <Sky top={sky?.[0]} mid={sky?.[1]} low={sky?.[2]} />
  </group>
);

// ---------- hangar: epoxy floor, ribbed walls, light strips ----------
export const Hangar: React.FC<{ z?: number }> = ({ z = -8 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#a7adbb", [10, 10])} rough={0.6} bevel={false} />
    <Box size={[60, 16, 0.4]} pos={[0, 8, z]} map={painted("#dfe3ea", [8, 2])} rough={0.9} bevel={false} />
    {Array.from({ length: 24 }).map((_, i) => (
      <Box key={i} size={[0.18, 16, 0.3]} pos={[-23 + i * 2, 8, z + 0.3]} color="#c6ccd6" rough={0.7} bevel={false} />
    ))}
    <Box size={[60, 0.5, 0.5]} pos={[0, 0.9, z + 0.5]} color="#f2c230" rough={0.5} bevel={false} />
    {[-8, -2.5, 3, 8.5].map((x) => (
      <Box key={x} size={[4, 0.25, 0.6]} pos={[x, 9.5, z + 3]} color="#f4fbff" emissive="#e6f2ff" emissiveIntensity={0.8} rough={0.3} />
    ))}
    <Box size={[60, 0.04, 0.3]} pos={[0, 0.01, 3.5]} color="#f2c230" rough={0.6} bevel={false} />
  </group>
);

// ---------- aircraft tire: smooth tread with grooves, hub with bolts, valve ----------
export const AirTire: React.FC<{ pos?: V3; r?: number; spin?: number; rot?: V3; valve?: boolean; glass?: number }> = ({
  pos = [0, 0, 0], r = 1, spin = 0, rot = [0, 0, 0], valve = true, glass = 0,
}) => {
  const t = useT();
  const see = glass > 0;
  return (
    <group position={pos} rotation={rot}>
      <group rotation={[0, 0, -t * spin]}>
        <mesh castShadow={!see} layers={LAYER_INK} renderOrder={see ? 2 : 0}>
          <torusGeometry args={[r, r * 0.42, 22, 64]} />
          <meshPhysicalMaterial color={RUBBER} roughness={0.7} clearcoat={0.08} transparent={see} opacity={see ? 1 - glass : 1} depthWrite={!see} />
        </mesh>
        {!see ? [-0.18, 0, 0.18].map((zz) => (
          <mesh key={zz} position={[0, 0, zz * r]}>
            <torusGeometry args={[r * 1.395, r * 0.03, 6, 64]} />
            <meshStandardMaterial color="#26252f" roughness={0.9} />
          </mesh>
        )) : null}
        <Cyl r={r * 0.6} h={r * 0.55} rot={[Math.PI / 2, 0, 0]} color={HUB} rough={0.3} seg={40} />
        <Cyl r={r * 0.22} h={r * 0.62} rot={[Math.PI / 2, 0, 0]} color="#8f96a2" rough={0.35} seg={24} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <Cyl key={i} r={r * 0.04} h={r * 0.64} pos={[Math.cos(a) * r * 0.38, Math.sin(a) * r * 0.38, 0]} rot={[Math.PI / 2, 0, 0]} color="#6b7380" rough={0.3} />;
        })}
        {valve ? <Cyl r={r * 0.035} h={r * 0.2} pos={[r * 0.5, r * 0.2, r * 0.3]} rot={[Math.PI / 2, 0, 0]} color="#d9a23f" rough={0.3} ink /> : null}
      </group>
    </group>
  );
};

// main landing gear: strut + 2 tires side by side (seen front-on: tires along x)
export const MainGear: React.FC<{ pos?: V3; r?: number; spin?: number; rot?: V3 }> = ({ pos = [0, 0, 0], r = 0.75, spin = 0, rot = [0, 0, 0] }) => (
  <group position={pos} rotation={rot}>
    <Cyl r={r * 0.14} h={r * 4} pos={[0, r * 1.4 + r * 2, 0]} color="#c6ccd6" rough={0.25} ink />
    <Box size={[r * 2.6, r * 0.18, r * 0.3]} pos={[0, r * 1.35, 0]} color="#aeb6c2" rough={0.3} />
    <AirTire pos={[-r * 1.15, r * 1.42, 0]} r={r} spin={spin} rot={[0, Math.PI / 2, 0]} valve={false} />
    <AirTire pos={[r * 1.15, r * 1.42, 0]} r={r} spin={spin} rot={[0, Math.PI / 2, 0]} valve={false} />
    <ContactShadow pos={[0, 0.01, 0]} size={r * 5} opacity={0.4} />
  </group>
);

// ---------- cartoon airliner (fuselage along +x = nose) ----------
export const Plane: React.FC<{ pos?: V3; rot?: V3; scale?: number; gear?: boolean; spin?: number }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, gear = true, spin = 0,
}) => (
  <group position={pos} rotation={rot} scale={scale}>
    <Cyl r={1.25} h={13} pos={[0, 2.9, 0]} rot={[0, 0, Math.PI / 2]} color={FUSE} rough={0.35} seg={36} ink />
    <mesh position={[6.5, 2.9, 0]} scale={[1.6, 1, 1]} castShadow layers={LAYER_INK}>
      <sphereGeometry args={[1.25, 32, 20, 0, Math.PI * 2, 0, Math.PI]} />
      <meshPhysicalMaterial color={FUSE} roughness={0.35} clearcoat={0.3} />
    </mesh>
    <Cyl r={1.25} r2={0.35} h={3.2} pos={[-8.1, 3.3, 0]} rot={[0, 0, -Math.PI / 2 - 0.1]} color={FUSE} rough={0.35} ink />
    {/* cockpit windows */}
    <Box size={[0.5, 0.3, 2.0]} pos={[7.4, 3.5, 0]} rot={[0, 0, -0.5]} color="#2a3a5c" rough={0.15} bevel={false} />
    {/* cheatline + windows */}
    <Box size={[13, 0.28, 2.56]} pos={[0, 2.3, 0]} color={LIVERY} rough={0.4} bevel={false} />
    {Array.from({ length: 18 }).map((_, i) => (
      <Box key={i} size={[0.22, 0.3, 2.54]} pos={[-5.6 + i * 0.66, 3.25, 0]} color="#2a3a5c" rough={0.15} bevel={false} shadow={false} />
    ))}
    {/* tail fin */}
    <Box size={[2.6, 3.2, 0.25]} pos={[-8.6, 5.2, 0]} rot={[0, 0, 0.35]} color={LIVERY} rough={0.4} ink />
    <Box size={[2.2, 0.18, 5.2]} pos={[-8.8, 3.6, 0]} color={FUSE} rough={0.4} ink />
    {/* wings + engines */}
    <Box size={[3.2, 0.25, 15]} pos={[0.2, 2.1, 0]} rot={[0, 0.25, 0]} color="#e3e6ec" rough={0.4} ink />
    {[-3.6, 3.6].map((z) => (
      <group key={z} position={[1.4, 1.25, z]}>
        <Cyl r={0.6} h={2.2} rot={[0, 0, Math.PI / 2]} color="#d8dce4" rough={0.3} ink />
        <Cyl r={0.42} h={0.05} pos={[1.12, 0, 0]} rot={[0, 0, Math.PI / 2]} color="#4a4e64" rough={0.4} />
      </group>
    ))}
    {gear ? (
      <group>
        {[-1.3, 1.3].map((z) => (
          <group key={z} position={[-0.4, 0, z]}>
            <Cyl r={0.08} h={1.4} pos={[0, 1.1, 0]} color="#c6ccd6" />
            <AirTire pos={[0, 0.42, 0.2]} r={0.3} spin={spin} valve={false} />
            <AirTire pos={[0, 0.42, -0.2]} r={0.3} spin={spin} valve={false} />
          </group>
        ))}
        <Cyl r={0.06} h={1.3} pos={[5.4, 1.15, 0]} color="#c6ccd6" />
        <AirTire pos={[5.4, 0.36, 0]} r={0.24} spin={spin} valve={false} />
      </group>
    ) : null}
  </group>
);

// ---------- puffs: white smoke (touchdown) or a breath of air ----------
export const Puffs: React.FC<{ pos?: V3; n?: number; on?: N; spread?: number; color?: string; size?: number }> = ({
  pos = [0, 0, 0], n = 9, on = 1, spread = 1, color = "#f4f4f6", size = 0.4,
}) => {
  const t = useT();
  const k = clamp(num(on, t));
  if (k <= 0) return null;
  return (
    <group position={pos}>
      {Array.from({ length: n }).map((_, i) => {
        const a = hash(i) * Math.PI * 2;
        const d = spread * (0.2 + hash(i + 7) * 0.8) * ease(k);
        const s = size * (0.5 + hash(i + 3) * 0.7) * (0.4 + k);
        return (
          <mesh key={i} position={[Math.cos(a) * d, Math.abs(Math.sin(a)) * d * 0.6 + hash(i + 2) * 0.2, Math.sin(a * 1.3) * d * 0.5]} scale={s} layers={LAYER_FX}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color={color} roughness={1} transparent opacity={0.85 * (1 - k * 0.5)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- nitrogen cart: three green bottles + hose to a valve ----------
export const N2Cart: React.FC<{ pos?: V3; hoseTo?: V3 }> = ({ pos = [0, 0, 0], hoseTo }) => {
  const start: V3 = [0.55, 1.45, 0.25];
  return (
    <group position={pos}>
      <Box size={[1.7, 0.2, 1.0]} pos={[0, 0.38, 0]} color="#3f6f9a" rough={0.5} ink />
      {[-0.6, 0.6].map((x) => <Cyl key={x} r={0.18} h={0.12} pos={[x, 0.18, 0.5]} rot={[Math.PI / 2, 0, 0]} color={RUBBER} />)}
      {[-0.55, 0, 0.55].map((x) => (
        <group key={x}>
          <Cyl r={0.24} h={1.5} pos={[x, 1.25, -0.1]} color="#3f8f5a" rough={0.4} ink />
          <mesh position={[x, 2.0, -0.1]}><sphereGeometry args={[0.24, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#3f8f5a" roughness={0.4} /></mesh>
          <Cyl r={0.06} h={0.2} pos={[x, 2.28, -0.1]} color="#b4bcc6" rough={0.3} />
        </group>
      ))}
      <Card pos={[0, 2.85, 0.1]} lines={["N₂"]} w={1.0} h={0.55} bg="#173846" fg="#bfe0ff" />
      {hoseTo ? (() => {
        const e: V3 = [hoseTo[0] - pos[0], hoseTo[1] - pos[1], hoseTo[2] - pos[2]];
        const pts = Array.from({ length: 10 }).map((_, i) => {
          const u = i / 9;
          return [start[0] + (e[0] - start[0]) * u, start[1] + (e[1] - start[1]) * u - Math.sin(u * Math.PI) * 0.9, start[2] + (e[2] - start[2]) * u] as V3;
        });
        return pts.slice(1).map((p, i) => {
          const q = pts[i];
          const mid: V3 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
          const dx = p[0] - q[0], dy = p[1] - q[1], dz = p[2] - q[2];
          const len = Math.hypot(dx, dy, dz);
          return (
            <group key={i} position={mid} rotation={[Math.atan2(dz, dy), 0, -Math.atan2(dx, Math.hypot(dy, dz))]}>
              <Cyl r={0.05} h={len + 0.04} color="#2f3640" rough={0.6} />
            </group>
          );
        });
      })() : null}
    </group>
  );
};

// ---------- molecule: two bonded spheres ----------
export const Molecule: React.FC<{ pos: V3; color: string; s?: number; rot?: number; glow?: number }> = ({ pos, color, s = 0.12, rot = 0, glow = 0.35 }) => (
  <group position={pos} rotation={[0, 0, rot]}>
    {[-1, 1].map((k) => (
      <mesh key={k} position={[k * s * 0.75, 0, 0]} layers={LAYER_FX}>
        <sphereGeometry args={[s, 14, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

// a jiggling cloud of molecules inside a box (w×h×d); `kinds` = list of colours, one per molecule
export const GasBox: React.FC<{ pos?: V3; w?: number; h?: number; d?: number; kinds: string[]; s?: number; speed?: number }> = ({
  pos = [0, 0, 0], w = 2, h = 2, d = 1, kinds, s = 0.1, speed = 1,
}) => {
  const t = useT() * speed;
  return (
    <group position={pos}>
      {kinds.map((c, i) => {
        const x = (hash(i) - 0.5) * w + Math.sin(t * 1.7 + i) * 0.08;
        const y = (hash(i + 31) - 0.5) * h + Math.cos(t * 1.3 + i * 2) * 0.08;
        const z = (hash(i + 57) - 0.5) * d;
        return <Molecule key={i} pos={[x, y, z]} color={c} s={s} rot={t * (0.6 + hash(i + 5)) + i} />;
      })}
    </group>
  );
};

// glass jar of "air": 78 % N2 (blue), 21 % O2 (red), 1 % other (grey)
export const AirJar: React.FC<{ pos?: V3; highlight?: N }> = ({ pos = [0, 0, 0], highlight = 0 }) => {
  const t = useT();
  const hi = clamp(num(highlight, t));
  const kinds = Array.from({ length: 50 }).map((_, i) => (i < 39 ? N2C : i < 49 ? O2C : "#b8bcc8"));
  return (
    <group position={pos}>
      <mesh position={[0, 1.3, 0]} renderOrder={2}>
        <cylinderGeometry args={[1.1, 1.1, 2.6, 40, 1, true]} />
        <meshPhysicalMaterial color="#dff0ff" roughness={0.05} transmission={0} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <Cyl r={1.16} h={0.2} pos={[0, 0.05, 0]} color="#8f96a2" rough={0.35} ink />
      <Cyl r={1.16} h={0.2} pos={[0, 2.65, 0]} color="#8f96a2" rough={0.35} ink />
      <group position={[0, 1.35, 0]}>
        <GasBox w={1.6} h={2.1} d={1.2} kinds={kinds.map((c) => (hi > 0 && c === N2C ? "#3a5f9a" : c))} s={0.09} />
      </group>
    </group>
  );
};

// ---------- X-ray tire: see-through rubber, molecules inside, brake glow, vapours, flash ----------
export const XrayTire: React.FC<{
  pos?: V3; r?: number; o2?: number; heat?: N; vapor?: N; ignite?: N; shake?: N;
}> = ({ pos = [0, 0, 0], r = 1.5, o2 = 10, heat = 0, vapor = 0, ignite = 0, shake = 0 }) => {
  const t = useT();
  const h = clamp(num(heat, t));
  const v = clamp(num(vapor, t));
  const ig = clamp(num(ignite, t));
  const sh = clamp(num(shake, t));
  const jx = sh * Math.sin(t * 61) * 0.05, jy = sh * Math.cos(t * 53) * 0.05;
  const total = 40;
  return (
    <group position={[pos[0] + jx, pos[1] + jy, pos[2]]}>
      <AirTire r={r} glass={0.72} valve={false} />
      {/* brake stack inside the hub glows from grey to orange */}
      <Cyl r={r * 0.5} h={r * 0.35} pos={[0, 0, 0.05]} rot={[Math.PI / 2, 0, 0]} color={h > 0.05 ? "#ff8a3a" : "#8f96a2"} emissive="#ff6a1a" emissiveIntensity={h * 1.6} rough={0.4} seg={32} />
      {h > 0.05 ? <pointLight position={[0, 0, 0.9]} color="#ff8a3a" intensity={h * 14} distance={6} decay={1.6} /> : null}
      {/* molecules travel round the inside of the tire */}
      {Array.from({ length: total }).map((_, i) => {
        const a = (i / total) * Math.PI * 2 + t * 0.25 + hash(i) * 0.12;
        const rr = r + (hash(i + 11) - 0.5) * r * 0.45;
        const zz = (hash(i + 23) - 0.5) * r * 0.45;
        const isO = i % Math.max(1, Math.round(total / Math.max(o2, 0.0001))) === 0 && o2 > 0;
        return <Molecule key={i} pos={[Math.cos(a) * rr, Math.sin(a) * rr, zz + 0.1]} color={isO ? O2C : N2C} s={r * 0.07} rot={t + i} />;
      })}
      {/* yellow vapours leak from the inner wall */}
      {v > 0 ? Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + hash(i + 3);
        const u = (t * 0.6 + hash(i + 8)) % 1;
        const rr = r * (0.7 + u * 0.55);
        return (
          <mesh key={"v" + i} position={[Math.cos(a) * rr, Math.sin(a) * rr, 0.25]} scale={r * 0.06 * v * (1.2 - u * 0.5)} layers={LAYER_FX}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={VAPOR} emissive={VAPOR} emissiveIntensity={0.7} transparent opacity={0.9 * v} depthWrite={false} />
          </mesh>
        );
      }) : null}
      {/* ignition: a cartoon star flash (no fire on characters, nothing graphic) */}
      {ig > 0 ? (
        <group position={[r * 0.55, r * 0.75, 0.6]} scale={0.2 + ig * 1.4} layers={LAYER_FX}>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 10) * Math.PI * 2]} position={[0, 0, 0]} layers={LAYER_FX}>
              <coneGeometry args={[0.12, i % 2 ? 0.9 : 1.4, 6]} />
              <meshBasicMaterial color={i % 2 ? "#ffd36a" : "#ff7a2a"} toneMapped={false} />
            </mesh>
          ))}
          <mesh layers={LAYER_FX}><sphereGeometry args={[0.35, 16, 12]} /><meshBasicMaterial color="#fff2c0" toneMapped={false} /></mesh>
          <pointLight color="#ff9a40" intensity={ig * 30} distance={8} decay={1.5} />
        </group>
      ) : null}
    </group>
  );
};

// a small in-flight flash at the gear (1986 flashback): soft orange burst, fades
export const Flash: React.FC<{ pos?: V3; on?: N; s?: number }> = ({ pos = [0, 0, 0], on = 0, s = 1 }) => {
  const t = useT();
  const k = clamp(num(on, t));
  if (k <= 0) return null;
  const a = Math.sin(k * Math.PI);
  return (
    <group position={pos} scale={s * (0.3 + k)}>
      <mesh layers={LAYER_FX}><sphereGeometry args={[0.6, 18, 12]} /><meshBasicMaterial color="#ffb25a" transparent opacity={a} toneMapped={false} depthWrite={false} /></mesh>
      <mesh layers={LAYER_FX}><sphereGeometry args={[0.3, 14, 10]} /><meshBasicMaterial color="#fff0c0" transparent opacity={a} toneMapped={false} depthWrite={false} /></mesh>
      <pointLight color="#ff9a40" intensity={a * 20} distance={10} decay={1.5} />
    </group>
  );
};

export { hash, ramp };
