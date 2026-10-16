import prisma from "../../lib/prisma";
import logger from "../../lib/logger";
import { withRequestLogging } from "../../lib/withRequestLogging";

// Health check for uptime monitors, Docker and the smoke-test script.
// 200 means the app is up and can reach the database; 503 means it can't.
// The response never includes error details, which stay in the server logs.

const DEFAULT_DB_TIMEOUT_MS = 2000;

function dbTimeoutMs() {
  const value = Number(process.env.HEALTH_DB_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_DB_TIMEOUT_MS;
}

// A hung database connection should fail the check quickly instead of hanging the monitor.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Database check timed out after ${ms} ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function healthCheck(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof res.setHeader === "function") res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const started = Date.now();
  let database = "ok";
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, dbTimeoutMs());
  } catch (error) {
    database = "unreachable";
    logger.warn("health check failed: database unreachable", { requestId: req.requestId, error });
  }

  const healthy = database === "ok";
  if (typeof res.setHeader === "function") res.setHeader("Cache-Control", "no-store");

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    checks: { database },
    version: process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : "local",
    uptimeSeconds: Math.round(process.uptime()),
    responseTimeMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  });
}

export default withRequestLogging("/api/health", healthCheck);
