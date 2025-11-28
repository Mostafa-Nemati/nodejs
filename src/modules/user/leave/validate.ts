import * as z from 'zod'

export const LeaveSchema = z.object({
    type: z.string().min(1, { message: 'نوع مرخصی الزامی است' }),
    startDate: z.string().min(1, { message: 'تاریخ شروع الزامی است' }),
    endDate: z.string().min(1, { message: 'تاریخ پایان الزامی است' }),
    duration: z.string().min(1, { message: "مدت زمان الزامی است" }),
})

