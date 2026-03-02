import { z } from 'zod'
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  addImageSchema,
  imageIdParamSchema,
} from './products.schema.js'

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductParams = z.infer<typeof productIdSchema>

// Novos tipos para o fluxo granular
export type AddImageInput = z.infer<typeof addImageSchema>
export type ImageParams = z.infer<typeof imageIdParamSchema>

export interface ProductImageResponse {
  id: string
  name: string
  url: string
  productId: string
}

export interface ProductResponse {
  id: string
  name: string
  description: string
  material: string
  productionTime: number
  price: string | number
  categoryId: string
  category?: {
    name: string
  }
  images?: ProductImageResponse[]
  createdAt: Date
  updatedAt: Date
}
