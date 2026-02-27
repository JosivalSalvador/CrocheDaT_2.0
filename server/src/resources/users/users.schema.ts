import { z } from 'zod'

// =========================
// Email
// =========================

export const emailSchema = z
  .email({ message: 'Formato de e-mail inválido' })
  .transform((value) => value.trim().toLowerCase())

// =========================
// Password
// =========================

const passwordSchema = z
  .string()
  .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  .refine((value) => /[a-z]/.test(value), {
    message: 'A senha deve conter ao menos uma letra minúscula',
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: 'A senha deve conter ao menos uma letra maiúscula',
  })
  .refine((value) => /\d/.test(value), {
    message: 'A senha deve conter ao menos um número',
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: 'A senha deve conter ao menos um caractere especial',
  })

// =========================
// Schema para Cadastro
// =========================

export const registerUserSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length >= 3, {
      message: 'Nome deve ter no mínimo 3 caracteres',
    }),

  email: emailSchema,
  password: passwordSchema,
})
