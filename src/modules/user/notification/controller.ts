import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { prisma } from "../../../config/prisma";

export const notification = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: 'کاربر یافت نشد' })
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId,
        }
    });

    res.status(201).json({ data: notifications, message: 'با موفقیت انجام شد' })
}