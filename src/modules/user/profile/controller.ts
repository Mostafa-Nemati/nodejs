import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { prisma } from "../../../config/prisma";

export const profile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ error: 'کاربر یافت نشد' })
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    res.status(200).json({ data: user, message: 'با موفقیت انجام شد' })
}