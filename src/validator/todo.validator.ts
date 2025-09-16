import * as z from 'zod';

export const createTodoSchema = z.object({
    title: z.string().min(1, { message: "عنوان الزامی است !" }).max(200),
    description: z.string(),
    completed: z.stringbool().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
})