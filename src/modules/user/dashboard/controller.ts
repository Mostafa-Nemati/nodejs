import { Response } from "express";
import { prisma } from "../../../config/prisma";
import { AuthRequest } from "../../../types/auth-request";
import dayjs from "dayjs";

export const infoDashbaord = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            shift: { include: { shiftSchedules: true } }
        }
    });

    if (!user) {
        return res.status(401).json({ error: 'کاربر یافت نشد' });
    }
    const day = dayjs().day();
    const schedule = user.shift?.shiftSchedules.find(sh => sh.dayOfWeek === day);

    const data = {
        user: {
            id: user.id,
            name: user.name,
            family: user.family,
            phone: user.phone
        },
        shift: schedule
    }

    res.status(200).json({ data: data, message: 'با موفقیت انجام شد' })
}