import * as z from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, { message: 'نام الزامی است' }),
  email: z.email().min(1, { message: 'ایمیل الزامی است' }),
  password: z.string().min(1, { message: 'پسورد الزامی است' }),
  isVerified: z.boolean().default(false)
})