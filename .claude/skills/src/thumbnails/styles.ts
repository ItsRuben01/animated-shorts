export type ThumbTheme = "cream" | "dark";

export type ThumbHookSpec = {
  index: number; // 1..10
  archetype: string;
  theme: ThumbTheme;
  topPill?: string;
  headlineTop: string;
  headlineSerif?: string; // Highlighted italic serif word/phrase
  headlineBottom?: string;
  highlightBox?: boolean; // Wraps headlineSerif in orange pill or CAD selection box
  bigMetric?: string; // e.g. "330 Ω", "30 ms", "660 t"
  metricSub?: string;
  stampText?: string; // e.g. "FALLO", "NO EXISTE", "CRÍTICO"
  slashDiagonal?: boolean; // Bold diagonal slash across centerpiece
  bottomPill?: string;
  footerHandwritten?: string;
  refImage: string; // Relative path in public/thumb_refs/
  characterPose?: "shocked" | "pointing" | "amazed" | "none";
  characterSpec?: import("../engine/draw").ToonSpec; // the episode's own drawn character (cast.ts)
  characterSide?: "left" | "right";
  arrow?: boolean; // curved orange arrow from the character to the 3D centerpiece
};

export const PALETTES = {
  cream: {
    bg: "radial-gradient(circle at 50% 38%, #F7F0E4 0%, #ECE1CE 65%, #DFD0B8 100%)",
    ink: "#0D1321",
    mutedInk: "#334155",
    accent: "#F97316",
    accentSecondary: "#EF4444",
    pillDarkBg: "#0D1321",
    pillDarkText: "#FFFFFF",
    cardBg: "#FFFFFF",
    cardBorder: "#0D1321",
    gridColor: "rgba(13, 19, 33, 0.04)",
  },
  dark: {
    bg: "radial-gradient(circle at 50% 45%, #161B26 0%, #0D1017 65%, #07090D 100%)",
    ink: "#FFFFFF",
    mutedInk: "#94A3B8",
    accent: "#F97316",
    lime: "#C4F529",
    accentSecondary: "#EF4444",
    pillDarkBg: "rgba(255, 255, 255, 0.07)",
    pillDarkText: "#E2E8F0",
    cardBg: "#141923",
    cardBorder: "rgba(255, 255, 255, 0.14)",
    gridColor: "rgba(255, 255, 255, 0.045)",
  },
} as const;