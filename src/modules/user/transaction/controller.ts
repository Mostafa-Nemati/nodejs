import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { prisma } from "../../../config/prisma";

export const transaction = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: 'کاربر یافت نشد' })
    }

    const transactions = await prisma.walletTransaction.findMany({
        where: {
            userId,
            date: {
                startsWith: req.query.date as string
            }
        }
    });

    res.status(201).json({ data: transactions, message: 'باموفقیت انجام شد' })
}