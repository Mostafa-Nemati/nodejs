import dayjs from "dayjs";
import { PrismaClient } from "../../generated/prisma";
import { AtenStatus } from "../types/attendance";
import jalaliday from "jalaliday";

const prisma = new PrismaClient();
dayjs.extend(jalaliday);


export const attendance = async () => {
    try {
        const today = dayjs().calendar("jalali").format("YYYY-MM-DD");

        const logs = await prisma.attendanceLog.findMany({
            where: {
                date: today,
                checkOut: null,
                status: AtenStatus.PRESENT
            },
            include: { user: { include: { shift: { include: { shiftSchedules: true } } } } }
        });

        for (const log of logs) {
            const dayOfWeek = dayjs().day();
            const schedule = log.user.shift?.shiftSchedules.find(
                (s) => s.dayOfWeek === dayOfWeek
            )

            if (!schedule || !schedule.isActive) continue;

            const shiftEnd = dayjs(`${today}T${schedule.endTime}`);
            const latestCheckOut = shiftEnd.add(30, "minute");

            if (dayjs().isAfter(latestCheckOut)) {
                await prisma.attendanceLog.update({
                    where: { id: log.id },
                    data: { status: AtenStatus.ABSENT }
                })
            }
        }
    } catch (error) {
        console.error("Error updating attendane:", error);
    }
}
