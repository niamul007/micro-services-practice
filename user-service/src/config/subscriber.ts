import Redis from "ioredis";
import { Prisma } from "@prisma/client";
import prisma from "./prisma";
const subscriber = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

subscriber.on("connect", () => {
  console.log("Subscriber connected to Redis");
});

subscriber.on("error", (err) => {
  console.error("Subscriber Redis error:", err);
});

subscriber.subscribe("jobCreated", (err, count) => {
  if (err) {
    console.error("Failed to subscribe to jobCreated channel:", err);
  } else {
    console.log(
      `Subscribed to jobCreated channel. Subscription count: ${count}`,
    );
  }
});

subscriber.on("message", async (channel, message) => {
  if (channel === "jobCreated") {
    const job = JSON.parse(message);
    console.log("Received new job creation event:", job);

    // save notification to database
    try {
      await prisma.notification.create({
        data: {
          userId: job.userId,
          message: `New job posted: ${job.title}`,
          jobId: job.id,
        },
      });
      console.log("Notification saved for userId:", job.userId);
    } catch (err) {
      console.error("Error saving notification:", err);
    }
  }
});

export default subscriber;
