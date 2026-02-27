import { z } from 'zod'
import { loginSchema } from './sessions.schema.js'

export type LoginInput = z.infer<typeof loginSchema>
