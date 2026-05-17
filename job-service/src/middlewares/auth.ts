import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = req?.headers?.authorization;
    if (!auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await axios.get("http://localhost:3001/api/auth/verify", {
      headers: {
        Authorization: auth
      }
    });

    (req as any).user = response.data.user;
    next();
  } catch (err: any) {
    console.log("middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};