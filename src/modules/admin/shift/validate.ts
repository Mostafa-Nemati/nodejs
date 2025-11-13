import * as z from 'zod'

export const shiftSchema = z.object({
    name: z.string().min(1, { message: 'عنوان آی پی الزامی است' }),
    ipAddress: z.email().min(1, { message: 'آی پی الزامی ست' }),
})