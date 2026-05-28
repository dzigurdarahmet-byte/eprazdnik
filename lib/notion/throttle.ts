// Tiny in-process throttle + retry for Notion API.
// Notion's published limit is ~3 req/sec; SSG parallelism can blow past that
// when 16 program pages render concurrently, so we serialize and back off on 429.
import { NotionRateLimitError } from "@/lib/notion/errors";

const MIN_INTERVAL_MS = 350; // ~2.85 req/sec, comfortably under the limit
const MAX_RETRIES = 4;

let chain: Promise<unknown> = Promise.resolve();

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function isRateLimit(err: unknown): { retryAfterMs: number } | null {
  if (err instanceof NotionRateLimitError) {
    return { retryAfterMs: (err.retryAfter ?? 1) * 1000 };
  }
  const e = err as { code?: string; status?: number; headers?: Record<string, string> };
  if (e.code === "rate_limited" || e.status === 429) {
    const retryAfter = Number(e.headers?.["retry-after"]) || 1;
    return { retryAfterMs: retryAfter * 1000 };
  }
  return null;
}

/**
 * Queues `fn` so it runs after a minimum interval since the last call, and
 * retries with exponential backoff on rate-limit responses.
 */
export function throttle<T>(fn: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    await delay(MIN_INTERVAL_MS);
    let attempt = 0;
    for (;;) {
      try {
        return await fn();
      } catch (err) {
        const rl = isRateLimit(err);
        if (!rl || attempt >= MAX_RETRIES) throw err;
        const backoff = rl.retryAfterMs * Math.pow(2, attempt);
        await delay(backoff);
        attempt++;
      }
    }
  };
  // Each new call is awaited after the previous one resolves (success OR throw).
  const next = chain.then(run, run);
  chain = next.catch(() => undefined);
  return next;
}
