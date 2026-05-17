import express from 'express';
import jobRoutes from "./routes/job";

const app = express();
app.use(express.json());
app.use("/api/jobs", jobRoutes);

app.get("/health", (req, res) => {
    res.send({ status: "Job Service is running" })
})

export default app;
