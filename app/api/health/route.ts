// /api/health — uptime + Notion connectivity probe (both bases). Open without
// the password gate (excluded in middleware matcher).
import { NextResponse } from "next/server";
import { listPrograms } from "@/lib/notion/programs";
import { listElements } from "@/lib/notion/elements";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  const start = Date.now();
  try {
    const [programs, elements] = await Promise.all([listPrograms(), listElements()]);
    const elapsed = Date.now() - start;
    logger.info(
      { programsCount: programs.length, elementsCount: elements.length, durationMs: elapsed },
      "health.ok",
    );
    return NextResponse.json(
      {
        status: "ok",
        programsCount: programs.length,
        elementsCount: elements.length,
        durationMs: elapsed,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const name = error instanceof Error ? error.name : "Error";
    logger.error({ err: message, name }, "health.fail");
    return NextResponse.json(
      { status: "error", error: message, errorName: name, timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
