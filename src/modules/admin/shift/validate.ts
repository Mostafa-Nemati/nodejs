import * as z from 'zod'

export const createShiftSchema = z.object({
    name: z.string().min(1, "نام شیفت الزامی است."),
    schedules: z
        .array(
            z.object({
                dayOfWeek: z.number().min(0).max(6),
                isActive: z.boolean(),
                startTime: z.string().nullable().optional(),
                endTime: z.string().nullable().optional(),
            })
        )
        .length(7, "باید ۷ روز هفته را ارسال کنید."),
    ips: z
        .array(
            z.object({
                name: z.string(),
                ipAddress: z.string().ipv4("آی‌پی معتبر نیست."),
            })
        )
        .optional(),
});