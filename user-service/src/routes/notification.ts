import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";
import { authMiddleware } from "../middlewares/auth";
const router = Router();
router.get("/", authMiddleware, getNotifications);

export default router;