import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";

describe("Auth routes", () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = "password123";
  let token: string;

  beforeAll(async () => {
    // register once, reuse across all tests
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testEmail,
      password: testPassword,
    });

    // login once, store token for verify tests
    const login = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });
    token = login.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: "example.com" } },
    });
    await prisma.$disconnect();
  });

  it("should not register with existing email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User 2",
      email: testEmail,
      password: testPassword,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exist");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "wrongpassword",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should verify a valid token", async () => {
    const res = await request(app)
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testEmail);
  });

  it("should not verify without token", async () => {
    const res = await request(app).get("/api/auth/verify");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not verify an invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/verify")
      .set("Authorization", `Bearer invalidtoken`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});