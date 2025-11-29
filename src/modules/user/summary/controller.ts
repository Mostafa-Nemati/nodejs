import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { prisma } from "../../../config/prisma";

export const summary = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: 'کاربر یافت نشد' });
    }

    const summary = await prisma.monthlySummary.findMany({
        where: {
            userId,
            month: req.query.month as string
        }
    });

    res.status(201).json({ data: summary, message: 'با موفقیت انجام شد' })
}