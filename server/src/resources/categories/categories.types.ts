import { z } from 'zod'
import { categorySchema, categoryIdSchema, categoryResponseSchema } from './categories.schema.js'

export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryParams = z.infer<typeof categoryIdSchema>

// Útil para quando listarmos ou retornarmos a categoria do Service e no Swagger
export type CategoryResponse = z.infer<typeof categoryResponseSchema>
