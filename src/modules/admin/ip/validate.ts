import * as z from 'zod'

export const ipSchema = z.object({
    name: z.string().min(1, { message: 'عنوان آی پی الزامی است' }),
    ipAddress: z.string().min(1, { message: 'آی پی الزامی ست' }),
})