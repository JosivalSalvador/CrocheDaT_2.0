import { z } from 'zod'
import { registerUserSchema, loginSchema } from './users.schema.js'

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
