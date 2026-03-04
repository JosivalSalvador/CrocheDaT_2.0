import { z } from 'zod'

// =========================
// Product ID
// =========================
const productIdSchema = z.uuid({ message: 'ID do produto em formato inválido' })

// =========================
// Schema para Adicionar Item
// =========================
export const addToCartSchema = z.object({
  productId: productIdSchema,
  quantity: z
    .number()
    .int({ message: 'A quantidade deve ser um número inteiro' })
    .positive({ message: 'A quantidade deve ser no mínimo 1' })
    .default(1),
})

// ==========================================
// Schema para Atualizar Quantidade
// ==========================================
export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int({ message: 'A quantidade deve ser um número inteiro' })
    .min(0, { message: 'A quantidade não pode ser negativa' }),
})

// ==========================================
// Schema para Parâmetros de Item
// ==========================================
export const cartItemParamsSchema = z.object({
  itemId: z.uuid({ message: 'ID do item inválido' }),
})

// ==========================================
// Schemas de Resposta (Output)
// ==========================================
export const cartItemResponseSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  subtotal: z.number(),
  imageUrl: z.url().nullable(),
})

export const cartResponseSchema = z.object({
  id: z.uuid(),
  status: z.enum(['ACTIVE', 'FINISHED', 'ABANDONED']),
  items: z.array(cartItemResponseSchema),
  totalAmount: z.number(),
  updatedAt: z.coerce.date(),
  chatId: z.uuid().nullable().optional(),
})
