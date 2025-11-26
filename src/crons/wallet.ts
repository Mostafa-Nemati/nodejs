import dayjs from "dayjs"
import { toMinutes } from "../utils/tominutes";
import jalaliday from "jalaliday";
import { prisma } from "../config/prisma";
dayjs.extend(jalaliday);

export const updateWallet = async () => {
    const today = dayjs().calendar('jalali').format("YYYY-MM-DD");
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
            if (!log || !user.shiftId) continue;

            const shift = await prisma.shift.findFirst({
                where: { id: user.shiftId },
                include: { shiftSchedules: true }
            });
            if (!shift) continue;

            const shiftSchedule = shift?.shiftSchedules.find(
                (s: any) => s.dayOfWeek === dayWeek
            );
            const holiday = shift?.holidays ? JSON.parse(shift.holidays as string) : [];

            const leave = await prisma.leaveRquest.findFirst({
                where: {
                    userId: log.userId,
                    status: 'APPROVED',
                    startDate: { lte: today },
                    endDate: { gte: today }
                }
            });

            let earnedToday = 0;
            const nowJalali = dayjs().calendar('jalali');
            const daysInMonth = nowJalali.daysInMonth();
            const daySalaray = (user.baseSalary ?? 0) / daysInMonth;

            if (!shiftSchedule?.isActive || leave || holiday.includes(today)) {
                earnedToday = daySalaray
            } else {
                const expectedMinutes =
                    toMinutes(shiftSchedule?.endTime) - toMinutes(shiftSchedule?.startTime);
                const workedMinutes =
                    toMinutes(log.checkOut || "00:00") - toMinutes(log.checkIn || "00:00");

                const minuteSalary = expectedMinutes ? daySalaray / expectedMinutes : 0;
                earnedToday = workedMinutes * minuteSalary;
            }


            //Update Wallet
            await prisma.wallet.update({
                where: { userId: user.id },
                data: { balance: { increment: earnedToday } }
            })
        }

    } catch (error) {
        console.error("Error updating wallet:", error);
    }
}