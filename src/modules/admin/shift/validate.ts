import * as z from 'zod'

export const createShiftSchema = z.object({
    name: z.string().min(1, "نام شیفت الزامی است."),
    shiftSchedules: z.object({
        create: z
            .array(
                z.object({
                    dayOfWeek: z.number().min(0).max(6),
                    isActive: z.boolean(),
                    startTime: z.string().nullable().optional(),
                    endTime: z.string().nullable().optional(),
                })
            )
            .length(7, "باید ۷ روز هفته را ارسال کنید."),
    }),
    holidays: z.array(z.string()),
    ips: z
        .object({
            connect: z.array(
                z.object({
                    id: z.number(),
                })
            ),
        })
        .optional(),
});