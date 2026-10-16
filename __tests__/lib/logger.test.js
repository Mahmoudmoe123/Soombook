/**
 * @jest-environment node
 */

import logger from "../../src/lib/logger";
import { withRequestLogging } from "../../src/lib/withRequestLogging";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Capture console output instead of printing it, and turn logging on for these tests.
let spies;
let savedLevel;
beforeEach(() => {
  savedLevel = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = "info";
  spies = {
    log: jest.spyOn(console, "log").mockImplementation(() => {}),
    warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
    error: jest.spyOn(console, "error").mockImplementation(() => {}),
  };
});
afterEach(() => {
  Object.values(spies).forEach((spy) => spy.mockRestore());
  if (savedLevel === undefined) delete process.env.LOG_LEVEL;
  else process.env.LOG_LEVEL = savedLevel;
});

const lastLine = (spy) => JSON.parse(spy.mock.calls[spy.mock.calls.length - 1][0]);

function mockResponse() {
  const res = { headers: {}, headersSent: false };
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn(() => res);
  res.setHeader = jest.fn((name, value) => {
    res.headers[name] = value;
  });
  return res;
}

describe("logger", () => {
  test("writes one JSON line with the level, message and fields", () => {
    logger.info("order created", { orderId: "o-1" });

    const entry = lastLine(spies.log);
    expect(entry.level).toBe("info");
    expect(entry.msg).toBe("order created");
    expect(entry.orderId).toBe("o-1");
    expect(Number.isNaN(Date.parse(entry.time))).toBe(false);
  });

  test("sends errors to stderr and keeps the error's name and message", () => {
    logger.error("could not create order", { error: new TypeError("user is null") });

    const entry = lastLine(spies.error);
    expect(entry.level).toBe("error");
    expect(entry.error).toEqual({ name: "TypeError", message: "user is null" });
  });

  test("skips messages below LOG_LEVEL", () => {
    process.env.LOG_LEVEL = "warn";

    logger.info("routine detail");
    logger.warn("something odd");

    expect(spies.log).not.toHaveBeenCalled();
    expect(spies.warn).toHaveBeenCalledTimes(1);
  });
});

describe("withRequestLogging", () => {
  test("gives each request an ID and logs the status and duration", async () => {
    const route = withRequestLogging("/api/example", async (req, res) => {
      res.status(201).json({ ok: true });
    });
    const req = { method: "POST", headers: {} };
    const res = mockResponse();

    await route(req, res);

    expect(UUID.test(req.requestId)).toBe(true);
    expect(res.headers["X-Request-Id"]).toBe(req.requestId);
    const entry = lastLine(spies.log);
    expect(entry.msg).toBe("request finished");
    expect(entry.route).toBe("/api/example");
    expect(entry.method).toBe("POST");
    expect(entry.status).toBe(201);
    expect(entry.requestId).toBe(req.requestId);
    expect(typeof entry.durationMs).toBe("number");
  });

  test("reuses a safe incoming X-Request-Id and replaces an unsafe one", async () => {
    const route = withRequestLogging("/api/example", async (req, res) => res.status(200).json({}));

    const safe = { method: "GET", headers: { "x-request-id": "abc-123" } };
    await route(safe, mockResponse());
    expect(safe.requestId).toBe("abc-123");

    const unsafe = { method: "GET", headers: { "x-request-id": "bad id\nwith newline" } };
    await route(unsafe, mockResponse());
    expect(UUID.test(unsafe.requestId)).toBe(true);
  });

  test("turns a crash into a logged 500 that includes the request ID", async () => {
    const route = withRequestLogging("/api/example", async () => {
      throw new Error("database exploded");
    });
    const req = { method: "GET", headers: {} };
    const res = mockResponse();

    await route(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].requestId).toBe(req.requestId);
    const entry = lastLine(spies.error);
    expect(entry.msg).toBe("request failed");
    expect(entry.error).toEqual({ name: "Error", message: "database exploded" });
  });

  test("does not try to respond twice if the route already sent a response", async () => {
    const route = withRequestLogging("/api/example", async (req, res) => {
      res.headersSent = true;
      throw new Error("failed after responding");
    });
    const res = mockResponse();

    await route({ method: "GET", headers: {} }, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(spies.error).toHaveBeenCalledTimes(1);
  });
});
