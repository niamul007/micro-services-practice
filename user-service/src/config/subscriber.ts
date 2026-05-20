import Redis from "ioredis";

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
        console.log(`Subscribed to jobCreated channel. Subscription count: ${count}`);
    }
})

subscriber.on("message", (channel, message) => {
    if (channel === "jobCreated") {
        const job = JSON.parse(message);
        console.log("Received new job creation event:", job);
    }
});

export default subscriber;