// Structured logger. Use this instead of console.* anywhere in app code.
import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
