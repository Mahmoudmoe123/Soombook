/**
 * @jest-environment node
 */

// The health check talks to the database, so mock Prisma before loading the route.
jest.mock("../../src/lib/prisma", () => ({ $queryRaw: jest.fn() }));

const prisma = require("../../src/lib/prisma");
const handler = require("../../src/pages/api/health").default;

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

const bodyOf = (res) => res.json.mock.calls[0][0];

describe("GET /api/health", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.HEALTH_DB_TIMEOUT_MS;
  });

  test("returns 200 and status ok when the database answers", async () => {
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    const res = mockResponse();

    await handler({ method: "GET", headers: {} }, res);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(bodyOf(res).status).toBe("ok");
    expect(bodyOf(res).checks).toEqual({ database: "ok" });
    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  test("returns 503 without leaking the database error when the query fails", async () => {
    prisma.$queryRaw.mockImplementation(() =>
      Promise.reject(new Error('password authentication failed for user "postgres"')),
    );
    const res = mockResponse();

    await handler({ method: "GET", headers: {} }, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(bodyOf(res).status).toBe("degraded");
    expect(bodyOf(res).checks).toEqual({ database: "unreachable" });
    expect(JSON.stringify(bodyOf(res)).includes("password")).toBe(false);
  });

  test("returns 503 when the database hangs past the timeout", async () => {
    process.env.HEALTH_DB_TIMEOUT_MS = "20";
    prisma.$queryRaw.mockImplementation(() => new Promise(() => {}));
    const res = mockResponse();

    await handler({ method: "GET", headers: {} }, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(bodyOf(res).checks).toEqual({ database: "unreachable" });
  });

  test("answers HEAD requests too, for uptime monitors that use them", async () => {
    prisma.$queryRaw.mockResolvedValue([]);
    const res = mockResponse();

    await handler({ method: "HEAD", headers: {} }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("rejects other methods with 405 and skips the database", async () => {
    const res = mockResponse();

    await handler({ method: "POST", headers: {} }, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.headers.Allow).toBe("GET, HEAD");
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  test("sends back a request ID so a failure can be found in the logs", async () => {
    prisma.$queryRaw.mockResolvedValue([]);
    const res = mockResponse();

    await handler({ method: "GET", headers: { "x-request-id": "monitor-check-42" } }, res);

    expect(res.headers["X-Request-Id"]).toBe("monitor-check-42");
  });
});
