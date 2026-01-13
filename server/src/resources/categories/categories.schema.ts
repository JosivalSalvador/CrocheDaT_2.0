import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
})

// Schema de resposta (boa prática documentar o retorno)
export const categoryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
