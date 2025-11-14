import { Request, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { getNetwork } from "../../../utils/network";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { PrismaClient } from "../../../../generated/prisma";
import { error } from "console";
dayjs.extend(jalaliday);
const prisma = new PrismaClient()

export const checkIn = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const IP = await getNetwork();
    const today = dayjs().calendar("jalali").format("YYYY-MM-DD");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            shift: {
                include: { ips: true, shiftSchedules: true },
            }
        }
    });
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" })

    //shift
    if (!user.shift) {
        return res.status(400).json({ error: 'برای شما شیفت تعریف نشده است' })
    }
    const shift = user.shift;

    //checkig IP
    if (user.shift.ips) {
        const validIp = user.shift.ips.some(i => i.ipAddress === IP);
        if (!validIp) return res.status(400).json({ error: 'آی پی معتبر نیست' })
    }

    //check days
    const dayOfWeek = dayjs().day();



    res.json({ message: "ورود ثبت شد", dayOfWeek });
}

