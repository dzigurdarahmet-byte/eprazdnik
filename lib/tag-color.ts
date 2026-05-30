// Map a free-text tag to one of the proto pastel tag colors, deterministically.
// Notion multi_select carries its own colors, but we don't read them; a stable
// hash keeps a given tag the same color everywhere it appears.
import type { TagColor } from "@/lib/status";

const COLORS: readonly TagColor[] = [
  "gray",
  "brown",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
];

// A few semantic pins so common tags read naturally; everything else hashes.
const PINS: Record<string, TagColor> = {
  b2b: "blue",
  b2c: "pink",
  премиум: "purple",
  квест: "orange",
  шоу: "red",
};

export function tagColorFor(tag: string): TagColor {
  const key = tag.trim().toLowerCase();
  const pinned = PINS[key];
  if (pinned) return pinned;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return COLORS[Math.abs(h) % COLORS.length] ?? "gray";
}
