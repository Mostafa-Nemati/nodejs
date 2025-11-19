import * as z from 'zod'

export const registerSchema = z.object({
    name: z.string().min(1, { message: 'نام الزامی است' }),
    family: z.string().min(1, { message: 'نام خانوادگی الزامی است' }),
    password: z.string().min(1, { message: 'پسورد الزامی است' }),
    nationalCode: z.string().optional(),
    phone: z.string().min(1, { message: 'پسورد الزامی است' }).max(11, { message: 'حداکثر ۱۱ رقم باشد' }),
    shiftId: z.number().min(1, { message: 'انتخاب شیفت الزامی است' })
})

export const loginSchema = z.object({
    password: z.string().min(1, { message: 'پسورد الزامی است' }),
    phone: z.string().min(1, { message: 'شماره موبایل الزامی است' }).max(11, { message: 'حداکثر ۱۱ رقم باشد' }),
})
