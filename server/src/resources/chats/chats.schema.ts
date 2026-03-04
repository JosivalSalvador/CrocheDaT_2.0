import { z } from 'zod'
import { ChatType, Role } from '@prisma/client'

// =========================
// UUID Schema
// =========================
const uuidSchema = z.uuid({ message: 'ID em formato inválido' })

// ==========================================
// Schema para Criar Chat
// ==========================================
export const createChatSchema = z
  .object({
    type: z.enum([ChatType.ORDER, ChatType.SUPPORT], {
      error: 'Tipo de chat inválido. Escolha ORDER ou SUPPORT.',
    }),
    cartId: uuidSchema.optional(),
    // Primeira mensagem opcional ao abrir o chat
    firstMessage: z
      .string()
      .transform((t) => t.trim())
      .refine((t) => t.length <= 2000, { message: 'Mensagem muito longa' })
      .optional(),
  })
  .refine(
    (data) => {
      // Se for ORDER, o cartId é obrigatório conforme conversamos
      if (data.type === 'ORDER' && !data.cartId) return false
      return true
    },
    {
      message: 'O ID do carrinho é obrigatório para iniciar uma encomenda',
      path: ['cartId'],
    },
  )

// ==========================================
// Schema para Enviar Mensagem
// ==========================================
export const sendMessageSchema = z.object({
  content: z
    .string()
    .transform((t) => t.trim())
    .refine((t) => t.length > 0, { message: 'A mensagem não pode estar vazia' })
    .refine((t) => t.length <= 2000, { message: 'Mensagem muito longa' }),
})

// ==========================================
// Schema para Parâmetros
// ==========================================
export const chatParamsSchema = z.object({
  chatId: uuidSchema,
})

// ==========================================
// Schemas de Resposta (Output)
// ==========================================
export const messageResponseSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  createdAt: z.coerce.date(),
  senderId: z.uuid(),
  sender: z.object({
    name: z.string(),
    role: z.enum([Role.ADMIN, Role.SUPPORTER, Role.USER]),
  }),
})

export const chatResponseSchema = z.object({
  id: z.uuid(),
  isOpen: z.boolean(),
  type: z.enum([ChatType.ORDER, ChatType.SUPPORT]),
  userId: z.uuid(),
  cartId: z.uuid().nullable().optional(),
  lastMessageAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  messages: z.array(messageResponseSchema).optional(),
})
