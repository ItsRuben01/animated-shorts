// ep8 — shots. Each shot = 3D Stage + optional HUD (Counter / ProgressCards / NativeComment) on top.
// Pieces (styles/retention-rules.md): 1–2 hook · 3 promise · 4–6 body 1 · 7 loop · 8–10 body 2 · 11 loop · 12–14 body 3 · 15–16 CTA
import React from "react";
import { Stage } from "../engine/Stage";
import { Counter, NativeComment, ProgressCards } from "../engine/Hud";
import { BatteryPark, Bedroom, Card, Phone, Plug, Spark, TechFloor, useT } from "./sets";
import { cam, closeLook, dangerLook, nightLook, ramp, smooth, techLook } from "./world";
import shotsJson from "../../episodes/ep8/shots.json";

type P = { dur: number };
type Comment = { username: string; question: string; seed?: number };
const comment = (shotsJson as Array<{ comment?: Comment }>).find((s) => s.comment)!.comment!;

const PH: [number, number, number] = [0, 4.6, 0];          // standing phone in the tech world
const NIGHT_PHONE = { pos: [0.2, 2.2, 0.25] as [number, number, number], rot: [-Math.PI / 2, 0, 0.35] as [number, number, number], scale: 0.3 };
const S = (dur: number) => dur / 30;                         // shot length in seconds

export const SHOTS: Record<number, React.FC<P>> = {
  // 1 HOOK — frame 0: the plug is already sliding into the port, big in frame; spark; 0 → 80 % races
  1: ({ dur }) => <>
    <Stage look={closeLook} dur={dur} cam={cam([0.7, 1.15, 2.7], [0, 1.15, 0], 40, [3.4, 5.6, 15.5], [0, 4.4, 0])}>
      <TechFloor y={-3.2} />
      <pointLight position={[0.8, 1.6, 2.0]} color="#ffe6c0" intensity={7} distance={6} decay={1.5} />
      <Phone pos={PH} charge={(t) => ramp(t, 0.4, 2.7) * 0.8} />
      <Plug phonePos={PH} insert={(t) => 0.72 + 0.28 * smooth(ramp(t, 0, 0.3))} />
      <Spark pos={[0, PH[1] - 3.15, 0.3]} at={0.3} scale={1.2} />
    </Stage>
    <Counter from={0} to={80} start={0.4} end={2.7} appear={0.35} suffix=" %" y={0.74} size={150} />
  </>,

  // 2 HOOK — the last 20 %: the number crawls
  2: ({ dur }) => <>
    <Stage look={techLook} dur={dur} cam={cam([3.4, 5.6, 15.5], [0, 4.4, 0], 40, [2.6, 5.4, 13.0], [0, 4.5, 0])}>
      <TechFloor y={-3.2} />
      <Phone pos={PH} charge={(t) => 0.8 + ramp(t, 0.2, S(dur)) * 0.03} />
      <Plug phonePos={PH} insert={1} />
    </Stage>
    <Counter from={80} to={83} start={0.2} end={S(dur)} appear={0} suffix=" %" y={0.74} size={150} curve={(k) => k} accent="#ffffff" />
  </>,

  // 3 PROMISE — two things you'll take away: two "?" cards; the camera dives toward the battery
  3: ({ dur }) => <>
    <Stage look={techLook} dur={dur} cam={cam([2.6, 5.4, 13.0], [0, 4.5, 0], 40, [0.8, 5.0, 8.0], [0, 4.8, 0])}>
      <TechFloor y={-3.2} />
      <Phone pos={PH} charge={0.83} />
      <Plug phonePos={PH} insert={1} />
    </Stage>
    <ProgressCards total={2} appear={0.9} y={0.22} w={0.38} />
  </>,

  // 4 BODY 1 — inside: lithium ions travel across
  4: ({ dur }) => <Stage look={techLook} dur={dur} cam={cam([-0.6, 3.4, 13.5], [0.3, 2.9, 0], 40, [0.3, 3.1, 12.0], [0.3, 2.9, 0])}>
    <TechFloor />
    <BatteryPark fill={(t) => ramp(t, 0.1, S(dur)) * 0.14} />
  </Stage>,

  // 5 BODY 1 — they park between graphite floors
  5: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([2.8, 3.6, 10.0], [1.0, 2.9, 0], 40, [2.2, 3.3, 9.0], [1.0, 2.9, 0])}>
    <TechFloor />
    <BatteryPark fill={(t) => 0.14 + ramp(t, 0, S(dur)) * 0.26} />
  </Stage>,

  // 6 BODY 1 — empty garage: the charger pushes at full power; the charge races to 80 %
  6: ({ dur }) => <>
    <Stage look={techLook} dur={dur} cam={cam([0.4, 3.0, 12.8], [0.3, 2.9, 0], 40, [-0.3, 3.6, 13.6], [0.3, 2.9, 0])}>
      <TechFloor />
      <BatteryPark fill={(t) => 0.4 + ramp(t, 0.2, S(dur) - 0.2) * 0.4} />
    </Stage>
    <Counter from={40} to={80} start={0.2} end={S(dur) - 0.2} suffix=" %" y={0.76} size={130} curve={(k) => k} />
  </>,

  // 7 OPEN LOOP 1 — snap push onto the nearly full entrance
  7: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 3.2, 12.0], [0.3, 2.9, 0], 40, [-0.6, 3.1, 8.6], [0.3, 2.9, 0])}>
    <TechFloor />
    <BatteryPark fill={0.8} />
  </Stage>,

  // 8 BODY 2 — nearly full: ions queue at the entrance, the % crawls
  8: ({ dur }) => <>
    <Stage look={closeLook} dur={dur} cam={cam([-0.6, 3.1, 8.6], [0.3, 2.9, 0], 40, [-1.0, 3.3, 9.3], [0.3, 2.9, 0])}>
      <TechFloor />
      <BatteryPark fill={(t) => 0.8 + ramp(t, 0, S(dur)) * 0.06} queue />
    </Stage>
    <Counter from={80} to={84} start={0} end={S(dur)} appear={0} suffix=" %" y={0.76} size={130} curve={(k) => k} accent="#ffffff" />
  </>,

  // 9 BODY 2 — what pushing harder would do: metallic lithium grows at the entrance
  9: ({ dur }) => <Stage look={dangerLook} dur={dur} cam={cam([-1.4, 3.0, 8.0], [0.2, 2.9, 0], 40, [-1.0, 2.9, 6.8], [0.2, 2.9, 0])}>
    <TechFloor />
    <BatteryPark fill={0.86} queue plating={(t) => ramp(t, 1.0, S(dur) - 0.8)} />
  </Stage>,

  // 10 BODY 2 — so the charger lowers the current; card 1 of the promise turns into ✓
  10: ({ dur }) => <>
    <Stage look={techLook} dur={dur} cam={cam([0.6, 3.9, 13.0], [0.3, 3.7, 0], 40, [0.8, 3.6, 11.8], [0.3, 3.6, 0])}>
      <TechFloor />
      <BatteryPark fill={(t) => 0.86 + ramp(t, 0.5, S(dur)) * 0.1} labels={false} />
    </Stage>
    <Counter from={3} to={0.5} decimals={1} start={0.6} end={3.6} suffix=" A" y={0.76} size={130} label="corriente" accent="#7fb2ff" />
    <ProgressCards total={2} flips={[S(dur) - 0.9]} active={0} y={0.22} w={0.38} />
  </>,

  // 11 OPEN LOOP 2 — cut to the bedroom at night, snap push on the phone
  11: ({ dur }) => <Stage look={nightLook} dur={dur} cam={cam([1.2, 5.2, 11.5], [0.6, 3.0, -0.8], 40, [0.6, 4.6, 8.0], [0.3, 2.6, -0.3])}>
    <Bedroom />
    <Phone {...NIGHT_PHONE} charge={0.8} />
  </Stage>,

  // 12 BODY 3 — the phone learns your schedule: holds 80 % all night, finishes just before you wake up
  12: ({ dur }) => {
    const D = S(dur);
    return <>
      <Stage look={nightLook} dur={dur} cam={cam([0.6, 4.6, 8.0], [0.3, 2.6, -0.3], 40, [-0.1, 4.6, 5.8], [0.2, 2.5, 0])}>
        <Bedroom />
        <Phone {...NIGHT_PHONE} charge={(t) => 0.8 + ramp(t, D - 1.7, D - 0.4) * 0.2} />
        <NightClock d={D} />
      </Stage>
      <Counter from={80} to={100} start={D - 1.7} end={D - 0.4} appear={0.3} suffix=" %" y={0.76} size={130} curve={(k) => k} />
    </>;
  },

  // 13 BODY 3 — hours at 100 % wear it out; a viewer asks about Android
  13: ({ dur }) => <>
    <Stage look={nightLook} dur={dur} cam={cam([-0.1, 4.6, 5.8], [0.2, 2.5, 0], 40, [0.4, 4.2, 4.8], [0.2, 2.3, 0.1])}>
      <Bedroom />
      <Phone {...NIGHT_PHONE} charge={1} glow="#ff8a5c" />
    </Stage>
    <NativeComment username={comment.username} question={comment.question} seed={comment.seed} appear={S(dur) - 1.5} />
  </>,

  // 14 BODY 3 — answer: Android has its own; card 2 turns into ✓
  14: ({ dur }) => <>
    <Stage look={nightLook} dur={dur} cam={cam([0.4, 4.2, 4.8], [0.2, 2.3, 0.1], 40, [1.0, 4.6, 6.8], [0.3, 2.5, -0.2])}>
      <Bedroom />
      <Phone {...NIGHT_PHONE} charge={0.8} />
    </Stage>
    <ProgressCards total={2} flips={[-1, 1.0]} active={1} y={0.22} w={0.38} />
  </>,

  // 15 CTA — back in the phone's world: the whole metaphor, both cards done
  15: ({ dur }) => <>
    <Stage look={techLook} dur={dur} cam={cam([0.8, 3.6, 13.5], [0.2, 3.6, 0], 40, [-0.4, 3.8, 12.4], [0.2, 3.6, 0])}>
      <TechFloor />
      <Phone pos={[0.2, 4.1, -3.2]} scale={1.3} charge={0.8} />
      <BatteryPark fill={0.8} labels={false} />
    </Stage>
    <ProgressCards total={2} flips={[-1, -1]} y={0.22} w={0.38} />
  </>,

  // 16 CTA — follow: pull out, the phone back on its cable
  16: ({ dur }) => <Stage look={techLook} dur={dur} cam={cam([-0.4, 3.8, 12.4], [0.2, 3.6, 0], 40, [-1.2, 5.2, 17.5], [0.2, 4.0, 0])}>
    <TechFloor />
    <Phone pos={[0.2, 4.1, -3.2]} scale={1.3} charge={0.8} />
    <BatteryPark fill={0.8} />
  </Stage>,
};

// small clock card above the nightstand: 23:00, then 06:55 just before the charge finishes
const NightClock: React.FC<{ d: number }> = ({ d }) => {
  const t = useT();
  return <Card pos={[-0.2, 3.9, 0.2]} lines={[t < d - 1.9 ? "23:00" : "06:55"]} w={1.2} h={0.5} bg="#0d1440" fg="#7dffb2" />;
};
