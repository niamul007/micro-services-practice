import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const USER_SERVICE = "http://localhost:3001";
const JOB_SERVICE = "http://localhost:3002";

app.use("/api/auth", async (req: Request, res: Response) => {
  try {
    const url = `${USER_SERVICE}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && { Authorization: req.headers.authorization })
      }
    });
    res.status(response.status).json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

app.use("/api/jobs", async (req: Request, res: Response) => {
  try {
    const url = `${JOB_SERVICE}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && { Authorization: req.headers.authorization })
      }
    });
    res.status(response.status).json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from API Gateway!");
});

export default app;