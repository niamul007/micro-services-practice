import { Request , Response } from "express";
import prisma from "../config/prisma";

export const getNotifications = async (req: Request, res: Response) => {
const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(400).json({message: "User ID is required"});
    }

    const getAllNotifications = await prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.status(200).json({notifications: getAllNotifications});
}
