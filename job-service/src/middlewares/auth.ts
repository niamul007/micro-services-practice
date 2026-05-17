import axios from "axios";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = req?.headers?.authorization;
    console.log("auth header:", auth);
    if (!auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth?.split(" ")[1];
    
    // Verify token locally using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    console.log("middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
