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
