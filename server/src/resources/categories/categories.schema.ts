import { z } from 'zod'

// =========================
// Nome da Categoria
// =========================
export const categoryNameSchema = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val.length >= 3, {
    message: 'O nome da categoria deve ter no mínimo 3 caracteres',
  })

// ==========================================
// Schema para Criar/Atualizar Categoria
// ==========================================
export const categorySchema = z.object({
  name: categoryNameSchema,
})

// Schema de Params (para quando buscarmos por ID no controller)
export const categoryIdSchema = z.object({
  id: z.uuid({ message: 'ID da categoria inválido' }),
})
