import express, { Request, Response } from "express";
import axios from "axios";


const app = express();
// parse JSON bodies for all routes
app.use(express.json());

// in a real app, use service discovery or environment variables instead of hardcoding URLs
const USER_SERVICE = "http://localhost:3001";
const JOB_SERVICE = "http://localhost:3002";

// proxy auth-related requests to user service
app.use("/api/auth", async (req: Request, res: Response) => {
  // forward the incoming request to the appropriate service and return the response back to the client
  try {
    const url = `${USER_SERVICE}${req.originalUrl}`;
    // forward method, URL, body, and headers (including auth token if present)
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        // only forward Authorization header if it exists to avoid sending undefined
        ...(req.headers.authorization && { Authorization: req.headers.authorization })
      }
    });
    // return the response from the user service directly to the client
    res.status(response.status).json(response.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

app.use("/api/jobs", async (req: Request, res: Response) => {
  try {
    const url = `${JOB_SERVICE}${req.originalUrl}`;
    // forward method, URL, body, and headers (including auth token if present) 
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