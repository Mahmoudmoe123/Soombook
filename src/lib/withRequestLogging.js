import { randomUUID } from "crypto";
import logger from "./logger";

// Accept a caller's request ID (for example from a load balancer) only if it looks safe to log.
const VALID_REQUEST_ID = /^[A-Za-z0-9_-]{1,64}$/;

// Wraps an API route so that every request:
// - gets a request ID, returned in the X-Request-Id header and attached to req.requestId,
// - logs one line when it finishes, with the route, method, status code and duration,
// - turns an unexpected crash into a logged 500 that includes the request ID,
//   so a user's error report can be matched to the exact log line.
export function withRequestLogging(route, handler) {
  return async function loggedHandler(req, res) {
    const started = Date.now();
    const incoming = req.headers?.["x-request-id"];
    const requestId =
      typeof incoming === "string" && VALID_REQUEST_ID.test(incoming) ? incoming : randomUUID();

    req.requestId = requestId;
    if (typeof res.setHeader === "function") res.setHeader("X-Request-Id", requestId);

    try {
      await handler(req, res);
      logger.info("request finished", {
        route,
        method: req.method,
        status: res.statusCode,
        durationMs: Date.now() - started,
        requestId,
      });
    } catch (error) {
      logger.error("request failed", {
        route,
        method: req.method,
        status: 500,
        durationMs: Date.now() - started,
        requestId,
        error,
      });
      if (!res.headersSent) {
        res.status(500).json({ error: "Something went wrong. Please try again.", requestId });
      }
    }
  };
}
