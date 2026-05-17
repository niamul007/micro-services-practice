import { Router } from "express";
import { createJob, getJobs, getJobById } from "../controllers/jobController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/create", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;