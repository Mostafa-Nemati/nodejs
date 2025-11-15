import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { getNetwork } from "../../../utils/network";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { PrismaClient } from "../../../../generated/prisma";
import { AtenStatus } from "../../../types/attendance";
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
    const now = dayjs();
    const checkInTime = dayjs().format("HH:mm");
    const shiftStart = dayjs(`${dayjs().format("YYYY-MM-DD")}T${schedule.startTime}`);
    const earliestCheckIn = shiftStart.subtract(15, 'minute');
    if (now.isBefore(earliestCheckIn)) {
        return res.status(400).json({ error: 'حداکثر  15 دقیقه قبل شیفت امکان ثبت وجود دارد' })
    }


    //save log
    if (!userId) {
        throw new Error("User ID is required");
    }
    const log = await prisma.attendanceLog.create({
        data: {
            userId,
            date: today,
            checkIn: checkInTime,
            status: AtenStatus.PRESENT,
            ipAddress: IP
        }
    })
    res.json({ message: "ورود ثبت شد" });
}

/*
* Implement Check out
*/

export const checkOut = async (req: AuthRequest, res: Response) => {
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

    const log = await prisma.attendanceLog.findFirst({
        where: { userId, date: today }
    });
    if (!log) return res.status(400).json({ error: 'ورد ثبت نشده است' });

    //checkig IP && shift
    if (!user.shift) {
        return res.status(400).json({ error: 'برای شما شیفت تعریف نشده است' })
    }
    if (user.shift.ips) {
        const validIp = user.shift.ips.some(i => i.ipAddress === IP);
        if (!validIp) return res.status(400).json({ error: 'آی پی معتبر نیست' })
    }

    //check worked time
    const checkOutTime = dayjs().format("HH:mm");
    function toMinutes(time: any) {
        const [h, m] = time ? time.split(":").map(Number) : [];
        return h * 60 + m;
    }
    const workedMinutes = toMinutes(checkOutTime) - toMinutes(log.checkIn);
    const total = workedMinutes < 0 ? workedMinutes + 24 * 60 : workedMinutes;
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    const workedHours = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;


    //check overTime time
    const currentDay = dayjs().day();
    const shift = user.shift;
    const schedule = shift.shiftSchedules.find(s => s.dayOfWeek === currentDay);
    const expectedTimeMinutes = toMinutes(schedule?.endTime) - toMinutes(schedule?.startTime);
    const calcoverTime = workedMinutes - expectedTimeMinutes;
    const overTime = calcoverTime > 0 ? calcoverTime : 0;

    //check delay time

    res.json({ message: "خروج ثبت شد", workedHours });

}


