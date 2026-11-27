// ep15 — cream-filled buns: injected after baking. One world: the bakery; the bun is the tracker (it fills up across the Short).
// In-world labels: numbers, units and symbols only (ES and EN share every shot).
import React from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import { painted } from "../engine/tex";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { SteelMat } from "../ep9/sets";
import { ramp, ease } from "./world";

export { Card, useT };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const CRUST = "#c8803a";
export const CRUST_TOP = "#a8622a";
export const CRUMB = "#e9c48a";
export const DOUGH = "#f2e2c4";
export const CREAM = "#fffdf6";
export const MACHINE = "#5a8fb8";

// ---------- bakery room: cream tiles, pink stripe, warm skylights ----------
export const Bakery: React.FC<{ z?: number }> = ({ z = -7 }) => (
  <group>
    <Box size={[60, 0.4, 60]} pos={[0, -0.2, 0]} map={painted("#c2b6a6", [10, 10])} rough={0.8} bevel={false} />
    <Box size={[60, 14, 0.4]} pos={[0, 7, z]} map={painted("#f6efe2", [8, 2])} rough={0.9} bevel={false} />
    <Box size={[60, 1.1, 0.5]} pos={[0, 1.2, z + 0.1]} color={MACHINE} rough={0.6} bevel={false} />
    <Box size={[60, 0.18, 0.55]} pos={[0, 1.85, z + 0.12]} color="#e0569a" rough={0.5} bevel={false} />
    {[-9, -3, 3, 9].map((x) => (
      <Box key={x} size={[3.4, 2.4, 0.2]} pos={[x, 6.6, z + 0.25]} color="#fff8ee" emissive="#fff0dc" emissiveIntensity={0.55} rough={0.3} />
    ))}
  </group>
);

// plum studio for the cut-away shots (never black)
export const Inside: React.FC = () => (
  <group>
    <Box size={[30, 0.4, 30]} pos={[0, -0.2, 0]} color="#4f4680" rough={0.85} bevel={false} />
    <Box size={[30, 16, 0.4]} pos={[0, 8, -5]} color="#5a5090" rough={0.9} bevel={false} />
    <mesh position={[0, 2.2, -4.7]} layers={LAYER_FX}>
      <circleGeometry args={[2.3, 48]} />
      <meshBasicMaterial color="#f0c8a0" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
    </mesh>
    <spotLight position={[-3, 6, 5]} color="#fff0e0" intensity={60} angle={0.55} penumbra={0.6} distance={20} decay={1.6} />
  </group>
);

// ---------- a bun. cut = cut in half (front half removed): crumb face with air pockets and the cream blob ----------
// fill 0..1 = cream inside; rise 0..1 = dough rising (scale); baked 0..1 = pale dough → golden crust; holes = injection dots
const CAP = Math.PI * 0.62;               // dome: from the top down to just below the equator
const R = 0.6, CY = 0.5;                  // sphere radius and centre height (before squash)
const YB = CY + R * Math.cos(CAP);        // flat bottom height (≈ 0.28)
const RB = R * Math.sin(CAP);             // bottom radius
const crossSection = (() => {
  const sh = new THREE.Shape();
  const a0 = Math.asin((YB - CY) / R);    // angle where the circle meets the flat bottom (negative)
  sh.moveTo(-RB, YB);
  sh.lineTo(RB, YB);
  sh.absarc(0, CY, R, a0, Math.PI - a0, false);
  sh.lineTo(-RB, YB);
  return new THREE.ShapeGeometry(sh, 32);
})();

export const Bun: React.FC<{
  pos?: V3; s?: number; rot?: V3; cut?: boolean; fill?: N; rise?: N; baked?: N; holes?: number; long?: boolean; glowHoles?: N; spots?: number[];
}> = ({ pos = [0, 0, 0], s = 1, rot = [0, 0, 0], cut = false, fill = 0, rise = 1, baked = 1, holes = 0, long = false, glowHoles = 0, spots }) => {
  const t = useT();
  const f = clamp(num(fill, t));
  const r = 0.4 + 0.6 * clamp(num(rise, t));
  const b = clamp(num(baked, t));
  const g = clamp(num(glowHoles, t));
  const crust = new THREE.Color(DOUGH).lerp(new THREE.Color(CRUST), b);
  const sx = long ? 2.1 : 1, sy = 0.62;
  const xs = spots ?? (long ? [-0.3, 0, 0.3] : [0]);
  return (
    <group position={pos} rotation={rot} scale={s * r}>
      <group scale={[sx, sy, 1]} position={[0, -YB * sy, 0]}>
        {/* crust: full dome, or only the back half (z ≤ 0) when cut */}
        <mesh castShadow layers={LAYER_INK} position={[0, CY, 0]}>
          <sphereGeometry args={[R, 44, 26, cut ? Math.PI : 0, cut ? Math.PI : Math.PI * 2, 0, CAP]} />
          <meshPhysicalMaterial color={crust} roughness={0.6} clearcoat={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, YB + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[RB, 44, cut ? Math.PI : 0, cut ? Math.PI : Math.PI * 2]} />
          <meshStandardMaterial color={new THREE.Color("#e8c890").lerp(new THREE.Color("#b07040"), b * 0.5)} side={THREE.DoubleSide} />
        </mesh>
        {cut ? (
          <group>
            {/* crumb face + a thin crust rim */}
            <mesh geometry={crossSection} position={[0, 0, 0.001]} scale={[1.0, 1.0, 1]}>
              <meshStandardMaterial color={crust} roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
            <mesh geometry={crossSection} position={[0, 0.012, 0.003]} scale={[0.94, 0.955, 1]}>
              <meshStandardMaterial color={CRUMB} roughness={0.95} side={THREE.DoubleSide} />
            </mesh>
            {/* air pockets */}
            {Array.from({ length: long ? 26 : 14 }).map((_, i) => (
              <mesh key={i} position={[(hash(i) - 0.5) * 0.85, YB + 0.08 + hash(i + 7) * 0.62, 0.006]} scale={[1 / sx, 1 / sy, 1]}>
                <circleGeometry args={[0.022 + hash(i + 3) * 0.035, 14]} />
                <meshStandardMaterial color="#c89a5a" roughness={1} />
              </mesh>
            ))}
            {/* cream blob(s) */}
            {f > 0 ? xs.map((x, i) => (
              <group key={"c" + i} position={[x, CY + 0.1, 0.01]} scale={[(f * (long ? 0.16 : 0.34)), f * 0.32, 1]}>
                <mesh position={[0, 0, -0.001]} scale={1.08}><circleGeometry args={[1, 36]} /><meshStandardMaterial color="#e0a040" roughness={0.5} /></mesh>
                <mesh><circleGeometry args={[1, 36]} /><meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.4} roughness={0.35} /></mesh>
              </group>
            )) : null}
            {long && f > 0.65 ? (
              <mesh position={[0, CY + 0.1, 0.009]} scale={[((f - 0.65) / 0.35) * 0.4, 0.2 * f, 1]}>
                <circleGeometry args={[1, 36]} />
                <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.22} roughness={0.4} />
              </mesh>
            ) : null}
          </group>
        ) : null}
      </group>
      {/* injection dots, low on the front side */}
      {Array.from({ length: holes }).map((_, i) => {
        const x = holes === 1 ? 0 : (i / (holes - 1) - 0.5) * (long ? 1.4 : 0.6);
        return (
          <group key={"h" + i} position={[x, 0.08, cut ? 0.02 : RB * 0.98]}>
            <mesh><circleGeometry args={[0.035, 16]} /><meshStandardMaterial color="#5a3418" /></mesh>
            {g > 0 ? (
              <mesh position={[0, 0, 0.01]} layers={LAYER_FX} scale={1 + 0.15 * Math.sin(t * 8)}>
                <ringGeometry args={[0.07, 0.1, 24]} />
                <meshBasicMaterial color="#ffd24a" transparent opacity={g} toneMapped={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

/** world height of the cream centre above the bun's origin, for aiming the needle */
export const creamY = (s: number) => (CY + 0.1 - YB) * 0.62 * s;

// ---------- injector needle (steel tube + nozzle block), insert 0..1 moves it in along -x (needle points left) ----------
export const Needle: React.FC<{ pos?: V3; insert?: N; len?: number; rot?: V3; flow?: N }> = ({ pos = [0, 0, 0], insert = 1, len = 1.0, rot = [0, 0, 0], flow = 0 }) => {
  const t = useT();
  const k = clamp(num(insert, t));
  const fl = clamp(num(flow, t));
  return (
    <group position={pos} rotation={rot}>
      <group position={[(1 - k) * 0.9, 0, 0]}>
        <mesh position={[-len / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow layers={LAYER_INK}>
          <cylinderGeometry args={[0.03, 0.04, len, 16]} />
          <SteelMat color="#d4dbe4" rough={0.15} />
        </mesh>
        <mesh position={[-len, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.03, 0.08, 12]} />
          <SteelMat color="#d4dbe4" rough={0.15} />
        </mesh>
        <Box size={[0.5, 0.36, 0.36]} pos={[0.22, 0, 0]} color={MACHINE} rough={0.4} ink />
        <Cyl r={0.08} h={0.5} pos={[0.22, 0.4, 0]} color="#b4bcc6" rough={0.3} />
        {fl > 0 ? <mesh position={[-len - 0.02, 0, 0]} scale={0.04 + fl * 0.05} layers={LAYER_FX}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.3} /></mesh> : null}
      </group>
    </group>
  );
};

// ---------- piston doser: clear cylinder with cream, the piston pushes down a measured shot ----------
export const Doser: React.FC<{ pos?: V3; push?: N; s?: number }> = ({ pos = [0, 0, 0], push = 0, s = 1 }) => {
  const t = useT();
  const p = clamp(num(push, t));
  const H = 1.8;
  return (
    <group position={pos} scale={s}>
      <Box size={[1.2, 0.3, 1.0]} pos={[0, 0.15, 0]} color={MACHINE} rough={0.5} ink />
      <mesh position={[0, 0.3 + H / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.42, 0.42, H, 36, 1, true]} />
        <meshPhysicalMaterial color="#e8f4ff" roughness={0.05} transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* cream column under the piston */}
      <mesh position={[0, 0.3 + (H * (0.85 - p * 0.3)) / 2, 0]}>
        <cylinderGeometry args={[0.39, 0.39, H * (0.85 - p * 0.3), 32]} />
        <meshStandardMaterial color={CREAM} roughness={0.4} emissive={CREAM} emissiveIntensity={0.12} />
      </mesh>
      {/* piston head + rod */}
      <group position={[0, 0.3 + H * (0.85 - p * 0.3) + 0.06, 0]}>
        <Cyl r={0.4} h={0.12} color="#8a929c" rough={0.3} ink />
        <Cyl r={0.08} h={1.4} pos={[0, 0.76, 0]} color="#b4bcc6" rough={0.25} />
      </group>
      {/* outlet pipe */}
      <Cyl r={0.06} h={0.9} pos={[-0.85, 0.2, 0]} rot={[0, 0, Math.PI / 2]} color="#b4bcc6" rough={0.3} />
      {/* tick marks */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} size={[0.12, 0.02, 0.01]} pos={[0.36, 0.5 + i * 0.28, 0.42]} color="#3a3f46" bevel={false} shadow={false} />
      ))}
    </group>
  );
};

// ---------- oven with a glowing window ----------
export const Oven: React.FC<{ pos?: V3; glow?: N }> = ({ pos = [0, 0, 0], glow = 1 }) => {
  const t = useT();
  const g = clamp(num(glow, t));
  return (
    <group position={pos}>
      <Box size={[3.4, 2.6, 1.6]} pos={[0, 1.3, 0]} color="#b4bcc6" rough={0.35} ink />
      <Box size={[2.6, 1.2, 0.05]} pos={[0, 1.4, 0.81]} color="#3a2a22" emissive="#ff8a30" emissiveIntensity={0.4 + g * 1.2} rough={0.3} bevel={false} />
      <Box size={[2.2, 0.08, 0.1]} pos={[0, 2.3, 0.85]} color="#3a3f46" rough={0.4} />
      <pointLight position={[0, 1.4, 1.6]} color="#ff9a40" intensity={6 + g * 14} distance={7} decay={1.6} />
    </group>
  );
};

// ---------- a dollop of cream on a plate that melts (shrinks + spreads) ----------
export const Melting: React.FC<{ pos?: V3; melt?: N; s?: number }> = ({ pos = [0, 0, 0], melt = 0, s = 1 }) => {
  const t = useT();
  const m = clamp(num(melt, t));
  return (
    <group position={pos} scale={s}>
      <Cyl r={0.7} h={0.06} color="#f4f4f0" rough={0.3} seg={40} ink />
      <mesh position={[0, 0.05 + 0.32 * (1 - m), 0]} scale={[1 + m * 0.9, 1 - m * 0.85, 1 + m * 0.9]}>
        <sphereGeometry args={[0.38, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={new THREE.Color(CREAM).lerp(new THREE.Color("#b07a3a"), m * 0.6)} roughness={0.3} clearcoat={0.6} />
      </mesh>
      {m > 0.3 ? Array.from({ length: 6 }).map((_, i) => {
        const u = (t * 0.8 + i / 6) % 1;
        return (
          <mesh key={i} position={[(hash(i) - 0.5) * 0.4, 0.5 + u * 1.2, 0]} layers={LAYER_FX} scale={0.06 + u * 0.1}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#f4f0ea" transparent opacity={(1 - u) * 0.6 * m} depthWrite={false} />
          </mesh>
        );
      }) : null}
    </group>
  );
};

// ---------- cooling rack with buns ----------
export const Rack: React.FC<{ pos?: V3; n?: number; holes?: number; fill?: N }> = ({ pos = [0, 0, 0], n = 3, holes = 0, fill = 0 }) => (
  <group position={pos}>
    <Box size={[3.2, 0.06, 1.4]} pos={[0, 1.0, 0]} color="#b4bcc6" rough={0.3} />
    {[-1.5, 1.5].map((x) => [-0.6, 0.6].map((z) => <Cyl key={`${x}${z}`} r={0.04} h={1.0} pos={[x, 0.5, z]} color="#8a929c" />))}
    {Array.from({ length: 9 }).map((_, i) => <Box key={i} size={[0.03, 0.04, 1.4]} pos={[-1.4 + i * 0.35, 1.04, 0]} color="#d4dbe4" bevel={false} shadow={false} />)}
    {Array.from({ length: n }).map((_, i) => <Bun key={i} pos={[(i - (n - 1) / 2) * 1.0, 1.06, 0]} s={0.75} holes={holes} fill={fill} />)}
    <ContactShadow pos={[0, 0.01, 0]} size={3.6} opacity={0.4} />
  </group>
);

// steam wisps rising (from a hot bun / oven)
export const Steam: React.FC<{ pos?: V3; on?: N; n?: number; s?: number }> = ({ pos = [0, 0, 0], on = 1, n = 6, s = 1 }) => {
  const t = useT();
  const k = clamp(num(on, t));
  if (k <= 0) return null;
  return (
    <group position={pos} scale={s}>
      {Array.from({ length: n }).map((_, i) => {
        const u = (t * 0.6 + i / n) % 1;
        return (
          <mesh key={i} position={[(hash(i) - 0.5) * 0.6 + Math.sin(t * 2 + i) * 0.08, u * 1.4, 0]} layers={LAYER_FX} scale={0.08 + u * 0.18}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={(1 - u) * 0.5 * k} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export { hash, ramp, ease };
