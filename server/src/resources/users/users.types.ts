import { z } from 'zod'
import { registerUserSchema } from './users.schema.js'

export type RegisterUserInput = z.infer<typeof registerUserSchema>
