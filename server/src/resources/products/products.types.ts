import { z } from 'zod'
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  addImageSchema,
  imageIdParamSchema,
  productResponseSchema,
  productImageResponseSchema,
} from './products.schema.js'

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductParams = z.infer<typeof productIdSchema>

// Tipos para o fluxo granular de imagens
export type AddImageInput = z.infer<typeof addImageSchema>
export type ImageParams = z.infer<typeof imageIdParamSchema>

// Tipos de Resposta inferidos magicamente do Zod
export type ProductImageResponse = z.infer<typeof productImageResponseSchema>
export type ProductResponse = z.infer<typeof productResponseSchema>
