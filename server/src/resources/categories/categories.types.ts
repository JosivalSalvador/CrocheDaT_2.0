import { z } from 'zod'
import { categorySchema, categoryIdSchema } from './categories.schema.js'

export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryParams = z.infer<typeof categoryIdSchema>

// Útil para quando listarmos ou retornarmos a categoria do Service
export interface CategoryResponse {
  id: string
  name: string
}
