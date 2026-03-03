import { z } from 'zod'
import { addToCartSchema, updateCartItemSchema, cartItemParamsSchema } from './carts.schema.js'

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type CartItemParams = z.infer<typeof cartItemParamsSchema>

// ==========================================
// Interface de Resposta (Output)
// ==========================================
export interface CartItemResponse {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  subtotal: number
  imageUrl: string | null
}

export interface CartResponse {
  id: string
  status: 'ACTIVE' | 'FINISHED' | 'ABANDONED'
  items: CartItemResponse[]
  totalAmount: number
  updatedAt: Date
  chatId?: string | null
}
