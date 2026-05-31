"use client";
// Records the opened program slug into localStorage (v4 §2). Renders nothing.
import { useEffect } from "react";
import { recordRecent } from "@/lib/recent";

export function TrackRecent({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug);
  }, [slug]);
  return null;
}
