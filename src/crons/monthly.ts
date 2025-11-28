import cron from 'node-cron'
import jalaliday from "jalaliday";
import dayjs from 'dayjs';
import { AtenStatus } from '../types/attendance';
import { toMinutes } from '../utils/tominutes';
import { prisma } from '../config/prisma';
dayjs.extend(jalaliday);

export const finalizeMonthlySalary = async () => {
    cron.schedule("10 0 1 * *", async () => {

        const lastMonth = dayjs()
            .subtract(1, "month")
            .calendar("jalali")
            .format("YYYY-MM");

        const daysInMonht = dayjs(lastMonth + "-01")
            .calendar("jalali")
            .daysInMonth();

        const users = await prisma.user.findMany({
            include: { shift: { include: { shiftSchedules: true } } }
        });

        for (const user of users) {
            const logs = await prisma.attendanceLog.findMany({
                where: {
                    userId: user.id,
                    date: { startsWith: lastMonth }
                }
            })
            let totalWorked = 0;
            let totalOvertime = 0;
            let totalDelaytime = 0;
            let absentDays = 0;

            for (let day = 1; day <= daysInMonht; day++) {
                const date = `${lastMonth}-${String(day).padStart(2, "0")}`;
                const log = logs.find((l: any) => l.date === date);

                const dow = dayjs(date).day();
                const schedule = user.shift?.shiftSchedules.find(
                    (s: any) => s.dayOfWeek === dow && s.isActive
                );
                if (!schedule) continue;

                if (!log || log.status === AtenStatus.ABSENT) {
                    absentDays++;
                    continue;
                }

                const workedMinutes = toMinutes(log.checkOut) - toMinutes(log.checkIn);
                const expectedTimeMinutes = toMinutes(schedule?.endTime) - toMinutes(schedule?.startTime);
                const dayDelay = Math.max(expectedTimeMinutes - workedMinutes, 0);

                totalWorked += toMinutes(log.workedHours) ?? 0;
                totalOvertime += toMinutes(log.overTime) ?? 0;
                totalDelaytime += dayDelay;
            }

            //calc salary
            const baseSalary = user.baseSalary ?? 0;
            const daySalary = baseSalary / daysInMonht;
            const minuteSalary = daySalary / 480;

            let deduction = 0;

            const netDelay = totalDelaytime - totalOvertime;

            if (absentDays > 2) {
                const extraAbsent = absentDays - 2;
                deduction += extraAbsent * daySalary;

                if (netDelay > 0) {
                    deduction += netDelay * minuteSalary
                }
            } else {
                const freeAbsentMinutes = absentDays * 480;
                if (netDelay > freeAbsentMinutes) {
                    deduction += (netDelay - freeAbsentMinutes) * minuteSalary;
                }
            }

            const finalSalary = Math.max(baseSalary - deduction, 0);

            await prisma.monthlySummary.create({
                data: {
                    userId: user.id,
                    month: lastMonth,
                    totalHours: totalWorked,
                    totalOvertime,
                    totalAbsent: absentDays,
                    totalDelayTime: totalDelaytime,
                    totalSalary: finalSalary,
                    finalizedAt: new Date(),
                }
            });

            await prisma.wallet.update({
                where: { userId: user.id },
                data: {
                    balance: 0,
                    credits: { increment: finalSalary }
                }
            })
        }
    })
}