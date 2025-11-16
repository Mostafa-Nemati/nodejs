import dayjs from "dayjs"
import { PrismaClient } from "../../generated/prisma";
import { toMinutes } from "../utils/tominutes";
const prisma = new PrismaClient()

export const updateWallet = async () => {
    const today = dayjs().calendar('jalali').format("YYY-MM-DD");
    const dayWeek = dayjs().day();

    try {
        const users = await prisma.user.findMany({
            include: {
                attendanceLogs: {
                    where: {
                        date: today
                    }
                }
            }
        });
        for (const user of users) {
            const log = user.attendanceLogs[0]
            if (!log) continue;

            if (!user.shiftId) continue;

            const schedule = await prisma.shift.findFirst({
                where: { id: user.shiftId },
                include: { shiftSchedules: true }
            });
            const shiftSchedule = schedule?.shiftSchedules.find(
                s => s.dayOfWeek === dayWeek
            );

            let earnedToday = 0;
            const nowJalali = dayjs().calendar('jalali');
            const daysInMonth = nowJalali.daysInMonth();
            const daySalaray = (user.baseSalary ?? 0) / daysInMonth;

            const leave = await prisma.leaveRquest.findFirst({
                where: {
                    userId: log.userId,
                    status: 'APPROVED',
                    startDate: { lte: today },
                    endDate: { gte: today }
                }
            });
            const shift = await prisma.shift.findFirst({
                where: { id: user.shiftId },
            });
            const holiday = shift?.holidays ? JSON.parse(shift.holidays as string) : [];


            if (!shiftSchedule?.isActive || leave || holiday.include(today)) {
                earnedToday = daySalaray
            }

            const expectedMinutes =
                toMinutes(shiftSchedule?.endTime) - toMinutes(shiftSchedule?.startTime);
            const workedMinutes =
                toMinutes(log.checkOut || "00:00") - toMinutes(log.checkIn || "00:00");

            const minuteSalary = daySalaray / expectedMinutes;
            earnedToday = workedMinutes * minuteSalary;


            //Update Wallet
            await prisma.wallet.update({
                where: { userId: user.id },
                data: { balance: { increment: earnedToday } }
            })
        }

    } catch (error) {

    }
}