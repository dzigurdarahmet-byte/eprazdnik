// Hand-composed CSS gradient covers. Ported from proto/covers.jsx so the
// catalog matches the prototype visual without any character art / copyrighted assets.
import type { CSSProperties } from "react";

export type CoverKind =
  | "ice" | "arcane" | "hero" | "tesla" | "paper" | "neon" | "cryo"
  | "chemistry" | "slime" | "adventure" | "princess" | "whimsy" | "ladybug" | "purple";

const VARIANTS: Record<CoverKind, CSSProperties> = {
  ice: {
    background:
      "radial-gradient(ellipse at 30% 20%, #e0f2fe 0%, transparent 50%)," +
      "radial-gradient(ellipse at 80% 70%, #c4b5fd 0%, transparent 60%)," +
      "linear-gradient(135deg, #93c5fd 0%, #6366f1 60%, #312e81 100%)",
  },
  arcane: {
    background:
      "radial-gradient(circle at 20% 30%, rgba(252,211,77,.4) 0%, transparent 40%)," +
      "radial-gradient(circle at 80% 80%, rgba(124,58,237,.5) 0%, transparent 50%)," +
      "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)",
  },
  hero: {
    background:
      "radial-gradient(circle at 70% 30%, #fde047 0%, transparent 30%)," +
      "linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #1c1917 100%)",
  },
  tesla: {
    background:
      "radial-gradient(circle at 50% 40%, #fef3c7 0%, transparent 25%)," +
      "linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 50%, #312e81 100%)",
  },
  paper: {
    background:
      "linear-gradient(45deg, #fef3c7 25%, transparent 25%, transparent 75%, #fef3c7 75%)," +
      "linear-gradient(45deg, #fef3c7 25%, #fde68a 25%, #fde68a 75%, transparent 75%)",
    backgroundSize: "32px 32px",
    backgroundPosition: "0 0, 16px 16px",
    backgroundColor: "#fef9c3",
  },
  neon: {
    background:
      "radial-gradient(circle at 30% 40%, #f0abfc 0%, transparent 35%)," +
      "radial-gradient(circle at 70% 70%, #22d3ee 0%, transparent 40%)," +
      "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)",
  },
  cryo: {
    background:
      "radial-gradient(circle at 40% 30%, #ddd6fe 0%, transparent 40%)," +
      "radial-gradient(circle at 80% 80%, #67e8f9 0%, transparent 50%)," +
      "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0c4a6e 100%)",
  },
  chemistry: {
    background:
      "radial-gradient(circle at 30% 30%, #d9f99d 0%, transparent 35%)," +
      "radial-gradient(circle at 70% 70%, #fde047 0%, transparent 40%)," +
      "linear-gradient(135deg, #065f46 0%, #064e3b 50%, #1e1b4b 100%)",
  },
  slime: {
    background:
      "radial-gradient(ellipse at 30% 40%, #86efac 0%, transparent 50%)," +
      "radial-gradient(ellipse at 70% 70%, #fcd34d 0%, transparent 45%)," +
      "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
  },
  adventure: {
    background:
      "radial-gradient(circle at 30% 40%, #fed7aa 0%, transparent 40%)," +
      "linear-gradient(135deg, #92400e 0%, #7c2d12 50%, #1c1917 100%)",
  },
  princess: {
    background:
      "radial-gradient(circle at 30% 30%, #fde68a 0%, transparent 35%)," +
      "radial-gradient(circle at 70% 70%, #f9a8d4 0%, transparent 45%)," +
      "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)",
  },
  whimsy: {
    background:
      "radial-gradient(circle at 30% 30%, #5eead4 0%, transparent 40%)," +
      "radial-gradient(circle at 70% 70%, #fda4af 0%, transparent 40%)," +
      "linear-gradient(135deg, #134e4a 0%, #831843 100%)",
  },
  ladybug: {
    background:
      "radial-gradient(circle at 20% 30%, #18181b 0%, transparent 8%)," +
      "radial-gradient(circle at 75% 25%, #18181b 0%, transparent 10%)," +
      "radial-gradient(circle at 50% 70%, #18181b 0%, transparent 12%)," +
      "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
  },
  purple: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  },
};

function isCoverKind(s: string): s is CoverKind {
  return s in VARIANTS;
}

export function Cover({ kind, emoji }: { kind: string; emoji?: string }) {
  const safe = isCoverKind(kind) ? kind : "purple";
  return (
    <div
      className="cover"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 56,
        ...VARIANTS[safe],
      }}
      aria-hidden
    >
      {emoji ? <span style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,.35))" }}>{emoji}</span> : null}
    </div>
  );
}
