import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // the bearer token should be in the format "Bearer <token>"
    const auth = req?.headers?.authorization;
    if (!auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/auth/verify`,
      {
        headers: {
          Authorization: auth,
        },
      },
    );
    // attach user info to request object for downstream handlers — avoids redundant token verification
    (req as any).user = response.data.user;
    next();
  } catch (err: any) {
    console.log("middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
