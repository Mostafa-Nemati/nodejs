import { Request, Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { getNetwork } from "../../../utils/network";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { PrismaClient } from "../../../../generated/prisma";
import { AtenStatus } from "../../../types/attendance";
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
    const currentDay = dayjs().day();
    const schedule = shift.shiftSchedules.find(s => s.dayOfWeek === currentDay);
    if (!schedule?.isActive) {
        return res.status(400).json({ error: 'برای امروز شیفت تعریف نشده' })
    }

    //check shift time
    const shiftTimeStr = schedule.startTime;
    if (!shiftTimeStr) {
        throw new Error("User ID is required");
    }
    const [hour, minute] = shiftTimeStr.split(":").map(Number);
    const shiftTime = dayjs().hour(hour).minute(minute).second(0);
    const now = dayjs();
    const earliestAllowed = shiftTime.subtract(30, 'minute');
    //if (earliestAllowed) {
    //    return res.status(400).json({ error: 'حداکثر نیم ساعت قبل شیفت امکان ثبت وجود دارد' })
    //}
    //save log
    if (!userId) {
        throw new Error("User ID is required");
    }
    const checkInTime = dayjs().format("HH:mm");
    //const log = await prisma.attendanceLog.create({
    //    data: {
    //        userId,
    //        date: today,
    //        checkIn: checkInTime,
    //        status: AtenStatus.PRESENT,
    //        ipAddress: IP
    //    }
    //})
    const tt = shiftTime.diff(now, "minute")
    res.json({ message: "ورود ثبت شد", now, shiftTime, tt });
}

