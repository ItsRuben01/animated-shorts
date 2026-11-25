import React, { useMemo } from "react";
import * as THREE from "three";
import { LAYER_INK } from "./Stage";

export type AvatarStyle = "person" | "mecha" | "pet" | "tech";

export type CommentCardProps = {
  username: string;
  question: string;
  avatarStyle?: AvatarStyle;
  seed?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

function drawProceduralAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  style: AvatarStyle,
  seed: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const palettes = [
    ["#1E1B2E", "#E63946", "#8338EC"],
    ["#2B1917", "#D97706", "#FDE68A"],
    ["#1F2937", "#38BDF8", "#0284C7"],
    ["#272324", "#A3A3A3", "#E5E5E5"],
  ];
  const pal = palettes[Math.abs(seed) % palettes.length];

  // Fondo circular del avatar
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, pal[0]);
  grad.addColorStop(1, pal[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  if (style === "mecha") {
    // Emblema geométrico dividido en dos tonos (estilo referencia orgalus_)
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.72);
    ctx.lineTo(cx - r * 0.62, cy - r * 0.35);
    ctx.lineTo(cx - r * 0.42, cy + r * 0.55);
    ctx.lineTo(cx, cy + r * 0.75);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#9333EA";
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.72);
    ctx.lineTo(cx + r * 0.62, cy - r * 0.35);
    ctx.lineTo(cx + r * 0.42, cy + r * 0.55);
    ctx.lineTo(cx, cy + r * 0.75);
    ctx.closePath();
    ctx.fill();

    // Visor oscuro
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(cx - r * 0.46, cy - r * 0.12, r * 0.92, r * 0.18);
  } else if (style === "pet") {
    // Silueta estilizada de mascota en primer plano (estilo willy_x2013)
    ctx.fillStyle = "#D6C7B2";
    ctx.beginPath();
    ctx.arc(cx - r * 0.1, cy + r * 0.18, r * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#292524";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy + r * 0.12, r * 0.18, r * 0.28, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === "tech") {
    // Nodo de circuito / chip
    ctx.strokeStyle = pal[2];
    ctx.lineWidth = r * 0.12;
    ctx.strokeRect(cx - r * 0.42, cy - r * 0.42, r * 0.84, r * 0.84);
    ctx.fillStyle = "#F8FAFC";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Retrato estilizado con busto y cabeza (estilo anxomola)
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.82, r * 0.62, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#E2B49A";
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.08, r * 0.34, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1F2937";
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.18, r * 0.35, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

export const CommentCard: React.FC<CommentCardProps> = ({
  username,
  question,
  avatarStyle = "mecha",
  seed = 1,
  position = [0, 1.35, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 680;
    const ctx = canvas.getContext("2d")!;

    // Fondo blanco-papel mate (recibe iluminación y tintado de la escena 3D)
    ctx.fillStyle = "#F4EFEA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar circular arriba a la izquierda
    drawProceduralAvatar(ctx, 136, 132, 68, avatarStyle, seed);

    // Nombre de usuario en minúsculas a la derecha del avatar
    ctx.fillStyle = "#2B2D42";
    ctx.font = "500 44px 'Inter', 'Segoe UI', Arial, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(username, 236, 134);

    // Pregunta del espectador en sans-serif oscura y grande debajo
    ctx.fillStyle = "#0F172A";
    ctx.font = "600 64px 'Inter', 'Segoe UI', Arial, sans-serif";
    ctx.textBaseline = "top";
    const lines = wrapLines(ctx, question, 880);
    const lineHeight = 82;
    const startY = lines.length <= 2 ? 275 : 245;
    lines.forEach((line, idx) => {
      ctx.fillText(line, 68, startY + idx * lineHeight);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [username, question, avatarStyle, seed]);

  const cardWidth = 1.65;
  const cardHeight = 1.1;
  const cardDepth = 0.04;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Cuerpo físico de la tarjeta en el mundo 3D */}
      <mesh castShadow receiveShadow layers={LAYER_INK}>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial color="#EAE3DC" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Cara frontal con la textura generada */}
      <mesh position={[0, 0, cardDepth / 2 + 0.002]} layers={LAYER_INK}>
        <planeGeometry args={[cardWidth * 0.99, cardHeight * 0.99]} />
        <meshStandardMaterial map={texture} roughness={0.82} metalness={0.0} />
      </mesh>
    </group>
  );
};