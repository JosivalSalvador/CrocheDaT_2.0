import { z } from 'zod'
import { emailSchema } from '../users/users.schema.js'

// Schema para Login
export const loginSchema = z.object({
  email: emailSchema,

  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})
