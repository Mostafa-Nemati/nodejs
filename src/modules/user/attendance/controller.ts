import { Response } from "express";
import { AuthRequest } from "../../../types/auth-request";
import { getNetwork } from "../../../utils/network";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { AtenStatus } from "../../../types/attendance";
import { toMinutes } from "../../../utils/tominutes";
import { prisma } from "../../../config/prisma";
dayjs.extend(jalaliday);

export const checkIn = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const IP = await getNetwork();
    const today = dayjs().calendar("jalali").format("YYYY-MM-DD");
    const now = dayjs();

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
        return res.status(422).json({ error: 'برای شما شیفت تعریف نشده است' })
    }
    const shift = user.shift;

    //checkig IP
    if (user.shift.ips) {
        const validIp = user.shift.ips.some((i: any) => i.ipAddress === IP);
        if (!validIp) return res.status(422).json({ error: 'آی پی معتبر نیست' })
    }

    //check days
    const currentDay = dayjs().day();
    const schedule = shift.shiftSchedules.find((s: any) => s.dayOfWeek === currentDay);
    if (!schedule?.isActive) {
        return res.status(422).json({ error: 'برای امروز شیفت تعریف نشده' })
    }

    const shiftEnd = dayjs(`${dayjs().format("YYYY-MM-DD")}T${schedule.endTime}`);
    const latestCheckOut = shiftEnd.add(30, 'minute');
    if (now.isAfter(latestCheckOut)) {
        return res.status(422).json({ error: 'برای امروز شیفت تعریف نشده' })
    }

    //check shift time
    const checkInTime = dayjs().format("HH:mm");
    const shiftStart = dayjs(`${dayjs().format("YYYY-MM-DD")}T${schedule.startTime}`);
    const earliestCheckIn = shiftStart.subtract(30, 'minute');
    if (now.isBefore(earliestCheckIn)) {
        return res.status(422).json({ error: 'حداکثر  30 دقیقه قبل شیفت امکان ثبت وجود دارد' })
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
            },
        }
    });
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" })

    //checkig IP && shift
    if (!user.shift) {
        return res.status(422).json({ error: 'برای شما شیفت تعریف نشده است' })
    }
    if (user.shift.ips) {
        const validIp = user.shift.ips.some((i: any) => i.ipAddress === IP);
        if (!validIp) return res.status(422).json({ error: 'آی پی معتبر نیست' })
    }

    //checked log 
    const log = await prisma.attendanceLog.findFirst({
        where: { userId, date: today }
    });
    if (!log) return res.status(422).json({ error: 'ورود ثبت نشده است' });

    //check shift time
    const now = dayjs();
    const dayCurrent = dayjs().day();
    const scheduleTime = user.shift.shiftSchedules.find((s: any) => s.dayOfWeek === dayCurrent);
    if (!scheduleTime?.isActive) {
        return res.status(422).json({ error: 'برای امروز شیفت تعریف نشده' })
    }
    const shiftEnd = dayjs(`${dayjs().format("YYYY-MM-DD")}T${scheduleTime.endTime}`);
    const latestCheckOut = shiftEnd.add(30, 'minute');
    if (now.isAfter(latestCheckOut)) {
        return res.status(422).json({ error: 'حداکثر  30 دقیقه بعداز شیفت امکان ثبت خروج وجود دارد' })
    }


    //check worked time
    const checkOutTime = dayjs().format("HH:mm");
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
    const schedule = shift.shiftSchedules.find((s: any) => s.dayOfWeek === currentDay);
    const expectedTimeMinutes = toMinutes(schedule?.endTime) - toMinutes(schedule?.startTime);
    const calcoverTime = workedMinutes - expectedTimeMinutes;
    const calcoverH = Math.floor(total / 60);
    const calcoverM = total % 60;
    const overTime = calcoverTime > 0
        ? `${calcoverH.toString().padStart(2, "0")}:${calcoverM.toString().padStart(2, "0")}`
        : '0';

    //check delay time
    const time = expectedTimeMinutes - workedMinutes;
    const timeH = Math.floor(total / 60);
    const timeM = total % 60;
    const delayTime = time > 0
        ? `${timeH.toString().padStart(2, "0")}:${timeM.toString().padStart(2, "0")}`
        : '0';


    //update Wallet
    const nowJalali = dayjs().calendar('jalali');
    const daysInMonth = nowJalali.daysInMonth();
    const daySalaray = (user.baseSalary ?? 0) / daysInMonth;
    const minuteSalary = daySalaray / expectedTimeMinutes;
    const earnedToday = workedMinutes * minuteSalary;

    if (!userId) {
        return res.status(400).json({ error: "userId معتبر نیست" });
    }

    await prisma.wallet.upsert({
        where: { userId },
        update: {
            balance: { increment: earnedToday }
        },
        create: {
            date: new Date(),
            userId: userId,
            balance: earnedToday
        }
    })


    //Update Logs
    await prisma.attendanceLog.update({
        where: { id: log.id },
        data: {
            checkOut: checkOutTime,
            workedHours,
            overTime,
            delayTime
        }
    })
    res.json({ message: "خروج ثبت شد", user });

}


