// /api/health — uptime + Notion connectivity probe for Vercel monitoring.
import { NextResponse } from "next/server";
import { listPrograms } from "@/lib/notion/programs";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  const start = Date.now();
  try {
    const programs = await listPrograms();
    const elapsed = Date.now() - start;
    logger.info({ count: programs.length, durationMs: elapsed }, "health.ok");
    return NextResponse.json(
      {
        status: "ok",
        programsCount: programs.length,
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
