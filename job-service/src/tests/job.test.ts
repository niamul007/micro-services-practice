process.env.USER_SERVICE_URL = "http://localhost:3001";

import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import axios from "axios";

describe("Job services", () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = "password123";
  let token: string;
  const job = {
    title: "Test Job",
    description: "This is a test job",
    location: "Remote",
    type: "Full-time",
  };

  beforeAll(async () => {
    await axios.post("http://localhost:3001/api/auth/register", {
      name: "Test User",
      email: testEmail,
      password: testPassword,
    }).catch(() => {});

    const login = await axios.post("http://localhost:3001/api/auth/login", {
      email: testEmail,
      password: testPassword,
    });
    token = login.data.token;
  });

  afterAll(async () => {
    await prisma.job.deleteMany({
      where: { title: { contains: "Test Job" } }
    });
    await prisma.$disconnect();
  });

  it("should create a job", async () => {
    const res = await request(app)
      .post("/api/jobs/create")
      .send(job)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Job created successfully");
    expect(res.body).toHaveProperty("job");
    expect(res.body.job).toMatchObject({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
    });
  });

  it("should not create job without token", async () => {
    const res = await request(app)
      .post("/api/jobs/create")
      .send(job);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  it("should get all jobs", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("jobs");
  });

  it("should get job by id", async () => {
    const created = await request(app)
      .post("/api/jobs/create")
      .send(job)
      .set("Authorization", `Bearer ${token}`);
    const jobId = created.body.job.id;

    const res = await request(app).get(`/api/jobs/${jobId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("job");
  });


  afterAll(async()=>{
    await prisma.job.deleteMany({
        where: {title: { contains: "Test Job" } }
    })
    await prisma.$disconnect();
  })
});