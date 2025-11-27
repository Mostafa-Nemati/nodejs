import { Response } from "express";
import { prisma } from "../../../config/prisma";
import { AuthRequest } from "../../../types/auth-request";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { toMinutes } from "../../../utils/tominutes";
import { AtenStatus } from "../../../types/attendance";
dayjs.extend(jalaliday);

export const infoDashbaord = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const today = dayjs().calendar("jalali").format("YYYY-MM-DD");

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
    const attendance = await prisma.attendanceLog.findFirst({
        where: {
            userId: user.id,
            date: today
        },
        orderBy: {
            id: "desc"
        }

    })

    const tominuteStartTime = Number(toMinutes(schedule?.startTime));
    const tominuteEndTime = Number(toMinutes(schedule?.endTime));
    const totalTime = tominuteEndTime - tominuteStartTime;
    const H = Math.floor(totalTime / 60);
    const M = totalTime % 60;
    const totalWorkedTime = `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;

    const data = {
        user: {
            id: user.id,
            name: user.name,
            family: user.family,
            phone: user.phone
        },
        shift: schedule,
        totalHour: totalWorkedTime,
        present: attendance?.status === AtenStatus.PRESENT
    }

    res.status(200).json({ data: data, message: 'با موفقیت انجام شد' })
}
