/**
 * @jest-environment node
 */

// Mock the session lookup, the auth config and the database before loading the route.
jest.mock("next-auth/next", () => ({ getServerSession: jest.fn() }));
jest.mock("../../src/pages/api/auth/[...nextauth]", () => ({ authOptions: {} }));
jest.mock("../../src/lib/prisma", () => ({
  user: { findUnique: jest.fn() },
  order: { findMany: jest.fn() },
}));

const { getServerSession } = require("next-auth/next");
const prisma = require("../../src/lib/prisma");
const handler = require("../../src/pages/api/getUserOrders").default;

function mockResponse() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe("GET /api/getUserOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 and skips the database when nobody is signed in", async () => {
    getServerSession.mockResolvedValue(null);
    const res = mockResponse();

    await handler({}, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.order.findMany).not.toHaveBeenCalled();
  });

  test("returns 404 when the signed-in email has no account", async () => {
    getServerSession.mockResolvedValue({ user: { email: "new@example.com" } });
    prisma.user.findUnique.mockResolvedValue(null);
    const res = mockResponse();

    await handler({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(prisma.order.findMany).not.toHaveBeenCalled();
  });

  test("returns only the signed-in user's orders", async () => {
    const orders = [{ id: "order-1", userId: "user-1", title: "Running shoes" }];
    getServerSession.mockResolvedValue({ user: { email: "shopper@example.com" } });
    prisma.user.findUnique.mockResolvedValue({ id: "user-1", email: "shopper@example.com" });
    prisma.order.findMany.mockResolvedValue(orders);
    const res = mockResponse();

    await handler({}, res);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "shopper@example.com" } });
    expect(prisma.order.findMany).toHaveBeenCalledWith({ where: { userId: "user-1" } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(orders);
  });
});
