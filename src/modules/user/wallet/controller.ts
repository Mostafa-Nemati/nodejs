import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { prisma } from "../../../config/prisma";

export const wallet = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    const wallet = await prisma.wallet.findUnique({
        where: { userId: req.user.id }
    });

    const datas = {
        ...wallet,
        salary: user?.baseSalary
    }

    res.status(200).json({ data: datas, message: 'با موفقیت انجام شد' })
}