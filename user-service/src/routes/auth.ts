import { register,login , verify } from "../controllers/authController";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify);

export default router;