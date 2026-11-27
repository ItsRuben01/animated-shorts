// ep14 — aluminium drink cans. In-world labels: numbers, units and symbols only (ES and EN share every shot).
import React from "react";
import * as THREE from "three";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow, StepSign } from "../ep7/sets";
import { Mill, Studio, SteelMat, MACHINE, STEEL } from "../ep9/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, StepSign, Mill, Studio, MACHINE };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const ALU = "#d6dce4";
export const RED = "#d8342c"; // can print
export const SODA = "#7a3a1e"; // cola
export const LINER = "#d9b85a"; // golden epoxy lining

const AluMat: React.FC<{ color?: string }> = ({ color = ALU }) => <SteelMat color={color} rough={0.22} />;

// ---------- a can: body (height h), neck, rim, dome; printed band; optional lid + tab ----------
export const Can: React.FC<{ pos?: V3; rot?: V3; s?: number; h?: N; lid?: boolean; print?: boolean; spin?: number; shake?: N }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], s = 1, h = 1, lid = true, print = true, spin = 0.3, shake = 0,
}) => {
  const t = useT();
  const hh = 0.12 + clamp(num(h, t)) * 1.1; // 0 = shallow cup, 1 = full-height body
  const full = clamp(num(h, t)) > 0.95;
  const sh = clamp(num(shake, t));
  const jx = sh * Math.sin(t * 40) * 0.08, jy = sh * Math.abs(Math.cos(t * 33)) * 0.06;
  const r = 0.33;
  return (
    <group position={[pos[0] + jx, pos[1] + jy, pos[2]]} rotation={rot} scale={s}>
      <group rotation={[0, t * spin, 0]}>
        <mesh position={[0, hh / 2, 0]} castShadow layers={LAYER_INK}>
          <cylinderGeometry args={[r, r, hh, 40, 1, !full && !lid]} />
          <AluMat />
        </mesh>
        {print && full ? (
          <mesh position={[0, hh * 0.48, 0]}>
            <cylinderGeometry args={[r + 0.004, r + 0.004, hh * 0.7, 40, 1, true]} />
            <meshPhysicalMaterial color={RED} roughness={0.3} clearcoat={0.8} />
          </mesh>
        ) : null}
        {print && full ? (
          <mesh position={[0, hh * 0.5, 0]}>
            <cylinderGeometry args={[r + 0.006, r + 0.006, 0.08, 40, 1, true]} />
            <meshPhysicalMaterial color="#f4f4f0" roughness={0.3} clearcoat={0.8} />
          </mesh>
        ) : null}
        {full ? (
          <>
            {/* neck: tapers to the smaller lid */}
            <mesh position={[0, hh + 0.06, 0]} castShadow>
              <cylinderGeometry args={[r * 0.82, r, 0.12, 40, 1, !lid]} />
              <AluMat />
            </mesh>
            {lid ? (
              <group position={[0, hh + 0.13, 0]}>
                <Cyl r={r * 0.84} h={0.03} color={ALU} rough={0.25} seg={40} />
                <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * 0.83, 0.018, 8, 40]} /><AluMat /></mesh>
                <Box size={[0.16, 0.012, 0.09]} pos={[0.04, 0.025, 0]} color="#c4cad2" rough={0.25} bevel={false} />
              </group>
            ) : null}
          </>
        ) : null}
      </group>
    </group>
  );
};

// a flat aluminium disc (the starting blank)
export const Disc: React.FC<{ pos?: V3; r?: number; rot?: V3 }> = ({ pos = [0, 0, 0], r = 0.55, rot = [0, 0, 0] }) => (
  <group position={pos} rotation={rot}>
    <mesh castShadow layers={LAYER_INK}><cylinderGeometry args={[r, r, 0.03, 48]} /><AluMat /></mesh>
  </group>
);

// a sheet of printer paper standing on edge (for the "as thin as paper" comparison)
export const Paper: React.FC<{ pos?: V3; rot?: V3 }> = ({ pos = [0, 0, 0], rot = [0, 0, 0] }) => (
  <group position={pos} rotation={rot}>
    <Box size={[1.05, 1.48, 0.012]} pos={[0, 0.74, 0]} color="#fbfbf8" rough={0.9} bevel={false} />
  </group>
);

// ---------- cupper press: punch comes down, the disc becomes a shallow cup ----------
export const Cupper: React.FC<{ pos?: V3; at?: number }> = ({ pos = [0, 0, 0], at = 1 }) => {
  const t = useT();
  const k = ease(ramp(t, at, at + 0.4));
  const up = ease(ramp(t, at + 0.6, at + 1.1));
  return (
    <group position={pos}>
      <Box size={[2.4, 1.3, 1.6]} pos={[0, 0.65, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3.4} opacity={0.5} />
      <Box size={[0.4, 3.6, 1.2]} pos={[-1.0, 3.1, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[0.4, 3.6, 1.2]} pos={[1.0, 3.1, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[2.4, 0.5, 1.4]} pos={[0, 4.9, 0]} color={MACHINE} rough={0.5} ink />
      <Cyl r={0.6} h={0.12} pos={[0, 1.36, 0]} color={STEEL} rough={0.3} />
      {k < 0.5 ? <Disc pos={[0, 1.44, 0]} r={0.55} /> : <Can pos={[0, 1.43, 0]} h={0} lid={false} print={false} spin={0} />}
      <group position={[0, 3.3 - k * 1.55 + up * 1.55, 0]}>
        <Cyl r={0.33} h={0.5} color={STEEL} rough={0.3} ink />
        <Cyl r={0.18} h={1.8} pos={[0, 1.15, 0]} color="#8a929c" rough={0.35} />
      </group>
    </group>
  );
};

// ---------- ironing: a horizontal ram pushes the cup through three rings; the wall stretches ----------
export const Ironer: React.FC<{ pos?: V3; dur: number }> = ({ pos = [0, 0, 0], dur }) => {
  const t = useT();
  const u = ease(ramp(t, 0.3, dur * 0.75));
  return (
    <group position={pos}>
      <Box size={[4.4, 0.9, 1.4]} pos={[0, 0.45, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={4.6} opacity={0.5} />
      {[-0.2, 0.35, 0.9].map((x, i) => (
        <group key={i} position={[x, 1.45, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh layers={LAYER_INK}><torusGeometry args={[0.42, 0.09 - i * 0.01, 12, 40]} /><SteelMat color="#9aa3ad" rough={0.25} /></mesh>
          <Box size={[0.2, 0.55, 0.2]} pos={[0, -0.7, 0]} color="#8a929c" rough={0.4} />
        </group>
      ))}
      {/* ram (left) + the can body growing to the right */}
      <Cyl r={0.2} h={2.2} pos={[-2.0 + u * 1.6, 1.45, 0]} rot={[0, 0, Math.PI / 2]} color="#8a929c" rough={0.3} />
      <Can pos={[-0.9 + u * 1.6, 1.45, 0]} rot={[0, 0, -Math.PI / 2]} h={u} lid={false} print={false} spin={0} />
    </group>
  );
};

// ---------- cutaway can: front half removed, golden lining, cola inside ----------
export const CanCut: React.FC<{ pos?: V3; s?: number; fill?: N; liner?: N }> = ({ pos = [0, 0, 0], s = 1, fill = 0.85, liner = 1 }) => {
  const t = useT();
  const f = clamp(num(fill, t));
  const L = clamp(num(liner, t));
  const r = 0.33, hh = 1.22;
  return (
    <group position={pos} scale={s}>
      {/* back half of the wall (open side faces the camera) */}
      <mesh position={[0, hh / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r, hh, 40, 1, true, Math.PI * 0.5, Math.PI]} />
        <meshPhysicalMaterial color={ALU} metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* golden lining just inside */}
      {L > 0 ? (
        <mesh position={[0, hh / 2, 0]}>
          <cylinderGeometry args={[r - 0.015, r - 0.015, hh * L, 40, 1, true, Math.PI * 0.5, Math.PI]} />
          <meshPhysicalMaterial color={LINER} roughness={0.25} clearcoat={0.9} side={THREE.DoubleSide} emissive={LINER} emissiveIntensity={0.05} />
        </mesh>
      ) : null}
      {/* cola, as a half cylinder */}
      {f > 0 ? (
        <mesh position={[0, (hh * f) / 2 + 0.02, 0]}>
          <cylinderGeometry args={[r - 0.03, r - 0.03, hh * f, 40, 1, false, Math.PI * 0.5, Math.PI]} />
          <meshPhysicalMaterial color={SODA} roughness={0.15} clearcoat={1} transparent opacity={0.92} />
        </mesh>
      ) : null}
      {/* cut face of the cola (flat side towards the camera) */}
      {f > 0 ? <Box size={[(r - 0.03) * 2, hh * f, 0.01]} pos={[0, (hh * f) / 2 + 0.02, 0.002]} color={SODA} rough={0.15} bevel={false} shadow={false} /> : null}
      {/* section edges */}
      <Box size={[0.02, hh, 0.02]} pos={[r, hh / 2, 0]} color="#8a929c" bevel={false} shadow={false} />
      <Box size={[0.02, hh, 0.02]} pos={[-r, hh / 2, 0]} color="#8a929c" bevel={false} shadow={false} />
      <Cyl r={r} h={0.04} pos={[0, 0.02, 0]} color={ALU} rough={0.3} seg={40} />
      {/* rising bubbles */}
      {f > 0.1 ? Array.from({ length: 8 }).map((_, i) => {
        const u = (t * 0.5 + hash(i)) % 1;
        return (
          <mesh key={i} position={[(hash(i + 3) - 0.5) * r * 1.2, 0.1 + u * hh * f * 0.95, 0.05]} layers={LAYER_FX}>
            <sphereGeometry args={[0.018 + hash(i + 7) * 0.015, 8, 6]} />
            <meshStandardMaterial color="#f4e8d8" transparent opacity={0.8} />
          </mesh>
        );
      }) : null}
    </group>
  );
};

// ---------- conveyor with a stream of cans ----------
export const Conveyor: React.FC<{ pos?: V3; len?: number; n?: number; speed?: number; lid?: boolean; print?: boolean }> = ({
  pos = [0, 0, 0], len = 8, n = 12, speed = 1.2, lid = true, print = true,
}) => {
  const t = useT();
  return (
    <group position={pos}>
      <Box size={[len, 0.8, 0.9]} pos={[0, 0.4, 0]} color={MACHINE} rough={0.5} />
      <Box size={[len, 0.05, 0.8]} pos={[0, 0.83, 0]} color="#3a3f46" rough={0.7} bevel={false} />
      {Array.from({ length: n }).map((_, i) => {
        const x = ((i / n) * len + t * speed) % len - len / 2;
        return <Can key={i} pos={[x, 0.86, 0]} s={0.55} lid={lid} print={print} spin={0} />;
      })}
    </group>
  );
};

// ---------- filler + seamer: cola fills the open can, the lid drops, rollers spin ----------
export const Seamer: React.FC<{ pos?: V3; dur: number }> = ({ pos = [0, 0, 0], dur }) => {
  const t = useT();
  const fill = ease(ramp(t, 0.2, dur * 0.4));
  const drop = ease(ramp(t, dur * 0.45, dur * 0.6));
  const seam = ramp(t, dur * 0.6, dur * 0.8);
  return (
    <group position={pos}>
      <Box size={[2.2, 1.0, 1.4]} pos={[0, 0.5, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3} opacity={0.5} />
      {/* filler nozzle */}
      <Cyl r={0.08} h={1.6} pos={[-0.15, 3.1, 0]} color="#8a929c" rough={0.3} />
      {fill > 0 && fill < 1 ? <Cyl r={0.035} h={1.2} pos={[-0.15, 2.0, 0]} color={SODA} rough={0.2} /> : null}
      <group position={[0, 1.0, 0]}>
        <CanCut s={1} fill={fill * 0.85} />
      </group>
      {/* lid descending */}
      <group position={[0, 1.0 + 1.36 + (1 - drop) * 1.0, 0]}>
        <Cyl r={0.29} h={0.04} color={ALU} rough={0.25} seg={40} />
      </group>
      {/* seaming rollers */}
      {[-1, 1].map((k) => (
        <group key={k} position={[k * (0.62 - seam * 0.2), 2.36, 0]} rotation={[0, t * 18 * seam, 0]}>
          <Cyl r={0.16} h={0.14} color={STEEL} rough={0.25} ink />
        </group>
      ))}
    </group>
  );
};

// ---------- pressure arrows pushing outward from inside a can ----------
export const PressureArrows: React.FC<{ pos?: V3; on?: N; s?: number }> = ({ pos = [0, 0, 0], on = 1, s = 1 }) => {
  const t = useT();
  const k = clamp(num(on, t));
  if (k <= 0) return null;
  const pulse = 1 + Math.sin(t * 6) * 0.06;
  return (
    <group position={pos} scale={s}>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 0.55 * pulse * k, 0.65 + Math.sin(a) * 0.75 * pulse * k, 0.4]} rotation={[0, 0, a - Math.PI / 2]} scale={k}>
            <mesh layers={LAYER_FX}><coneGeometry args={[0.09, 0.22, 10]} /><meshBasicMaterial color="#4fd0ff" toneMapped={false} /></mesh>
            <mesh position={[0, -0.16, 0]} layers={LAYER_FX}><cylinderGeometry args={[0.03, 0.03, 0.16, 8]} /><meshBasicMaterial color="#4fd0ff" toneMapped={false} /></mesh>
          </group>
        );
      })}
    </group>
  );
};

// a big dome arc indicator under an upturned can
export const DomeArrows: React.FC<{ pos?: V3; on?: N }> = ({ pos = [0, 0, 0], on = 1 }) => {
  const t = useT();
  const k = clamp(num(on, t));
  return (
    <group position={pos} scale={0.01 + 0.99 * k}>
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, -0.55, 0.3]}>
          <mesh layers={LAYER_FX}><coneGeometry args={[0.08, 0.2, 10]} /><meshBasicMaterial color="#4fd0ff" toneMapped={false} /></mesh>
          <mesh position={[0, -0.15, 0]} layers={LAYER_FX}><cylinderGeometry args={[0.025, 0.025, 0.18, 8]} /><meshBasicMaterial color="#4fd0ff" toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
};

export { hash, ramp };
