import { z } from 'zod'

// Reuso e consistência
const emailSchema = z.email({ message: 'Formato de e-mail inválido' }).trim().toLowerCase()

const passwordSchema = z
  .string()
  .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
    message: 'A senha deve conter letra maiúscula, minúscula, número e caractere especial',
  })

// Schema para Cadastro
export const registerUserSchema = z.object({
  name: z.string().trim().min(3, {
    message: 'Nome deve ter no mínimo 3 caracteres',
  }),
  email: emailSchema,
  password: passwordSchema,
})

// Schema para Login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Por favor, digite sua senha' }),
})
