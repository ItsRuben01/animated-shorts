// ep12 — screws: cold heading + thread rolling. In-world labels are numbers, units and symbols only (ES and EN share every shot).
import React from "react";
import { Box, Cyl, ContactShadow } from "../engine/kit";
import type { V3 } from "../engine/Stage";
import { LAYER_FX, LAYER_INK } from "../engine/Stage";
import { Card, useT } from "../ep6/sets";
import { Arrow, StepSign } from "../ep7/sets";
import { Mill, Studio, SteelMat, MACHINE, MACHINE_LIGHT, STEEL } from "../ep9/sets";
import { Cross } from "../ep10/sets";
import { ramp, ease } from "./world";

export { Card, useT, Arrow, StepSign, Mill, Studio, Cross, MACHINE };

type N = number | ((t: number) => number);
const num = (v: N, t: number) => (typeof v === "function" ? v(t) : v);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const WIRE = "#9aa3ad"; // raw drawn wire: matte grey steel
export const BRIGHT = "#d4dbe4"; // finished screw

// ---------- a screw standing up (head on top). thread 0..1 grows the rolled thread; head 0..1 swells the head ----------
export const Screw: React.FC<{ pos?: V3; rot?: V3; len?: number; r?: number; thread?: N; head?: N; spin?: number; scale?: number; raw?: boolean }> = ({
  pos = [0, 0, 0], rot = [0, 0, 0], len = 1.6, r = 0.12, thread = 1, head = 1, spin = 0, scale = 1, raw = false,
}) => {
  const t = useT();
  const th = clamp(num(thread, t));
  const hd = clamp(num(head, t));
  const rings = 14;
  const pitch = (len * 0.8) / rings;
  const col = raw ? WIRE : BRIGHT;
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <group rotation={[0, t * spin, 0]}>
        <mesh position={[0, len / 2, 0]} castShadow layers={LAYER_INK}>
          <cylinderGeometry args={[r, r, len, 24]} />
          {raw ? <meshStandardMaterial color={col} roughness={0.5} metalness={0.5} /> : <SteelMat color={col} rough={0.2} />}
        </mesh>
        {/* head: hex, grows from the shank radius to full size */}
        <mesh position={[0, len + r * 0.6 * (0.4 + hd * 0.6), 0]} castShadow layers={LAYER_INK}>
          <cylinderGeometry args={[r * (1 + hd * 1.1), r * (1 + hd * 1.1), r * 1.2 * (0.4 + hd * 0.6), 6]} />
          {raw ? <meshStandardMaterial color={col} roughness={0.5} metalness={0.5} /> : <SteelMat color={col} rough={0.2} />}
        </mesh>
        {/* rolled thread: tilted rings that swell out of the shank (no material added: the core shrinks a little) */}
        {th > 0.01 ? Array.from({ length: rings }).map((_, i) => (
          <mesh key={i} position={[0, pitch * (i + 0.5), 0]} rotation={[Math.PI / 2 + 0.09, 0, 0]}>
            <torusGeometry args={[r * 1.02, r * 0.22 * th, 6, 28]} />
            {raw ? <meshStandardMaterial color={col} roughness={0.45} metalness={0.5} /> : <SteelMat color={col} rough={0.18} />}
          </mesh>
        )) : null}
      </group>
    </group>
  );
};

// ---------- coil of wire + wire feeding to the right + blade chopping blanks ----------
export const WireFeed: React.FC<{ pos?: V3; period?: number }> = ({ pos = [0, 0, 0], period = 0.9 }) => {
  const t = useT();
  const ph = (t % period) / period;
  const blade = ph < 0.2 ? ease(ph / 0.2) : ph < 0.3 ? 1 : 1 - ease((ph - 0.3) / 0.4);
  return (
    <group position={pos}>
      <mesh position={[-1.6, 1.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.9, 0.25, 14, 44]} />
        <meshStandardMaterial color="#7d858f" roughness={0.45} metalness={0.55} />
      </mesh>
      <Box size={[0.4, 1.3, 0.4]} pos={[-1.6, 0.65, 0]} color={MACHINE} rough={0.5} />
      <Cyl r={0.06} h={2.2} pos={[-0.3, 1.3, 0]} rot={[0, 0, Math.PI / 2]} color={WIRE} rough={0.4} />
      {/* shear */}
      <Box size={[0.6, 0.5, 0.9]} pos={[0.9, 0.95, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[0.08, 0.5, 0.5]} pos={[0.85, 1.3 + 0.55 - blade * 0.45, 0.1]} color={STEEL} rough={0.25} ink />
      <Box size={[0.5, 0.12, 0.08]} pos={[0.85, 1.6 + 0.55 - blade * 0.45, 0.1]} color="#c0392b" rough={0.4} bevel={false} />
      {/* blanks tumbling down a chute into a tray */}
      <Box size={[1.6, 0.08, 0.6]} pos={[1.7, 0.75, 0]} rot={[0, 0, -0.35]} color={MACHINE_LIGHT} rough={0.3} />
      {[0, 1, 2].map((i) => {
        const u = ((t / period) + i / 3) % 1;
        return <Cyl key={i} r={0.06} h={0.3} pos={[1.1 + u * 1.3, 1.0 - u * 0.5, 0.05]} rot={[0, 0, Math.PI / 2 + u * 3]} color={WIRE} rough={0.4} />;
      })}
      <Box size={[1.0, 0.3, 0.8]} pos={[2.6, 0.15, 0]} color="#5a6474" rough={0.6} ink />
      {Array.from({ length: 10 }).map((_, i) => (
        <Cyl key={i} r={0.06} h={0.3} pos={[2.3 + hash(i) * 0.6, 0.34, -0.25 + hash(i + 5) * 0.5]} rot={[Math.PI / 2, hash(i + 2) * 3, 0]} color={WIRE} rough={0.4} />
      ))}
    </group>
  );
};

// ---------- cold heading press: the ram hits the blank, the top swells into a head ----------
export const HeadPress: React.FC<{ pos?: V3; period?: number; scale?: number }> = ({ pos = [0, 0, 0], period = 1.2, scale = 1 }) => {
  const t = useT();
  const k = Math.floor(t / period);
  const ph = (t % period) / period;
  const hit = ph < 0.3 ? ease(ph / 0.3) : ph < 0.45 ? 1 : 1 - ease((ph - 0.45) / 0.55);
  const head = Math.min(1, (k % 2) * 0.5 + (ph > 0.25 ? 0.5 : 0)); // two blows per head
  return (
    <group position={pos} scale={scale}>
      <Box size={[2.4, 1.4, 1.6]} pos={[0, 0.7, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={3.4} opacity={0.5} />
      <Box size={[0.4, 3.8, 1.2]} pos={[-1.0, 3.3, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[0.4, 3.8, 1.2]} pos={[1.0, 3.3, 0]} color={MACHINE} rough={0.5} ink />
      <Box size={[2.4, 0.5, 1.4]} pos={[0, 5.2, 0]} color={MACHINE} rough={0.5} ink />
      {/* lower die holding the blank */}
      <Cyl r={0.45} h={0.5} pos={[0, 1.65, 0]} color={STEEL} rough={0.3} ink />
      <Screw pos={[0, 1.4, 0]} len={0.9} r={0.11} thread={0} head={head} raw />
      {/* ram */}
      <group position={[0, 3.3 - hit * 0.95, 0]}>
        <Cyl r={0.45} h={0.5} color={STEEL} rough={0.3} ink />
        <Cyl r={0.22} h={2.0} pos={[0, 1.25, 0]} color="#8a929c" rough={0.35} />
      </group>
      {/* impact sparkle */}
      {hit > 0.95 ? (
        <group position={[0, 2.45, 0.5]} layers={LAYER_FX}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, i * 1.05]} scale={[1, 0.12, 1]} layers={LAYER_FX}>
              <circleGeometry args={[0.35, 3]} />
              <meshBasicMaterial color="#fff2c0" toneMapped={false} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};

// ---------- flat-die thread roller: two ridged dies, the right one slides, the screw rolls and gets its thread ----------
const Die: React.FC<{ pos: V3; h?: number }> = ({ pos, h = 2.2 }) => (
  <group position={pos}>
    <Box size={[0.4, 1.4, h]} color="#8a929c" rough={0.3} ink />
    {Array.from({ length: 16 }).map((_, i) => (
      <Box key={i} size={[0.05, 0.05, h * 0.98]} pos={[pos[0] < 0 ? 0.22 : -0.22, -0.6 + i * 0.08, 0]} rot={[0.09, 0, 0]} color="#b4bcc6" rough={0.2} bevel={false} shadow={false} />
    ))}
  </group>
);

export const Roller: React.FC<{ pos?: V3; period?: number; scale?: number; thread?: N; speed?: number }> = ({ pos = [0, 0, 0], period = 1.6, scale = 1, thread, speed = 1 }) => {
  const t = useT() * speed;
  const ph = (t % period) / period;
  const slide = ease(ph);
  const th = thread != null ? num(thread, t / speed) : ph;
  return (
    <group position={pos} scale={scale}>
      <Box size={[2.6, 1.0, 2.8]} pos={[0, 0.5, 0]} color={MACHINE} rough={0.5} ink />
      <ContactShadow pos={[0, 0.02, 0]} size={4} opacity={0.5} />
      <Die pos={[-0.36, 1.75, 0]} />
      <Die pos={[0.36, 1.75, -0.9 + slide * 1.8]} />
      <Screw pos={[0, 1.0, -0.45 + slide * 0.9]} len={1.4} r={0.13} thread={th} spin={-14} />
    </group>
  );
};

// a bin collecting finished screws (for "500 per minute")
export const Bin: React.FC<{ pos?: V3; n?: number }> = ({ pos = [0, 0, 0], n = 30 }) => (
  <group position={pos}>
    <Box size={[1.6, 0.7, 1.1]} pos={[0, 0.35, 0]} color="#c0392b" rough={0.55} ink />
    {Array.from({ length: n }).map((_, i) => (
      <Screw key={i} pos={[(hash(i) - 0.5) * 1.2, 0.72 + hash(i + 3) * 0.12, (hash(i + 7) - 0.5) * 0.7]} rot={[Math.PI / 2 + hash(i + 1), hash(i + 4) * 3, hash(i + 9)]} len={0.6} r={0.06} scale={1} />
    ))}
  </group>
);

// falling screws stream (from roller into bin)
export const Stream: React.FC<{ from: V3; to: V3; n?: number; rate?: number }> = ({ from, to, n = 6, rate = 1.5 }) => {
  const t = useT();
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const u = (t * rate + i / n) % 1;
        const p: V3 = [from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u - Math.sin(u * Math.PI) * -0.3, from[2] + (to[2] - from[2]) * u];
        return <Screw key={i} pos={p} rot={[u * 4, 0, u * 6]} len={0.6} r={0.06} />;
      })}
    </group>
  );
};

// ---------- grain-flow cross-section of a thread: cut (fibres sliced) vs rolled (fibres follow the teeth) ----------
const TEETH = 4;
const profile = (x: number, w: number, hTooth: number) => { // triangle wave top edge
  const u = ((x / w) * TEETH) % 1;
  return hTooth * (1 - Math.abs(u * 2 - 1));
};
export const Grain: React.FC<{ pos?: V3; mode: "cut" | "rolled"; w?: number; h?: number; glow?: N }> = ({ pos = [0, 0, 0], mode, w = 1.8, h = 1.1, glow = 0 }) => {
  const t = useT();
  const g = clamp(num(glow, t));
  const hT = h * 0.32;
  const lines = 7;
  const seg = 28;
  return (
    <group position={pos}>
      {/* panel backing */}
      <Box size={[w + 0.25, h + hT + 0.3, 0.1]} pos={[0, (hT) / 2, -0.08]} color="#2a3550" rough={0.6} />
      {/* steel body: columns whose height follows the thread profile */}
      {Array.from({ length: seg }).map((_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / seg);
        const top = h / 2 + profile(x + w / 2, w, hT);
        return <Box key={i} size={[w / seg + 0.002, top + h / 2, 0.06]} pos={[x, (top - h / 2) / 2, 0]} color="#aeb7c4" rough={0.35} bevel={false} shadow={false} />;
      })}
      {/* fibres */}
      {Array.from({ length: lines }).map((_, j) => {
        const y0 = -h / 2 + (j + 0.6) * (h / lines) * 0.95;
        const frac = (j + 0.6) / lines; // how close to the surface
        return Array.from({ length: seg }).map((_, i) => {
          const x0 = -w / 2 + i * (w / seg), x1 = x0 + w / seg;
          const lift = (x: number) => (mode === "rolled" ? profile(x + w / 2, w, hT) * frac * frac : 0);
          const ya = y0 + lift(x0), yb = y0 + lift(x1);
          const topA = h / 2 + profile(x0 + w / 2, w, hT);
          if (mode === "cut" && ya > topA - 0.03) return null; // fibre sliced at the surface
          const dx = x1 - x0, dy = yb - ya;
          return (
            <mesh key={j + "-" + i} position={[(x0 + x1) / 2, (ya + yb) / 2, 0.045]} rotation={[0, 0, Math.atan2(dy, dx)]}>
              <boxGeometry args={[Math.hypot(dx, dy) + 0.004, 0.022, 0.01]} />
              <meshStandardMaterial color={mode === "rolled" ? "#2f6fb8" : "#5a6478"} emissive={mode === "rolled" ? "#4f9bff" : "#000000"} emissiveIntensity={mode === "rolled" ? 0.2 + g * 0.8 : 0} />
            </mesh>
          );
        });
      })}
      {/* cut panel: little chips flying off */}
      {mode === "cut" ? Array.from({ length: 5 }).map((_, i) => {
        const u = (t * 0.7 + i / 5) % 1;
        return (
          <mesh key={"c" + i} position={[-w / 2 + hash(i) * w, h / 2 + hT + u * 0.6, 0.1]} rotation={[0, 0, u * 6 + i]} layers={LAYER_FX}>
            <torusGeometry args={[0.06, 0.015, 4, 10, Math.PI * 1.3]} />
            <meshStandardMaterial color="#c9ced6" metalness={0.6} roughness={0.3} />
          </mesh>
        );
      }) : null}
    </group>
  );
};

export { hash, ramp };
