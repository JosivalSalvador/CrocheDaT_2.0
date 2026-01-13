import { z } from 'zod'

// Schema para Cadastro
export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

// Schema para Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
