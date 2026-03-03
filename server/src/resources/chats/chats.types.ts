import { z } from 'zod'
import { Role, ChatType } from '@prisma/client'
import { createChatSchema, sendMessageSchema, chatParamsSchema } from './chats.schema.js'

export type CreateChatInput = z.infer<typeof createChatSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type ChatParams = z.infer<typeof chatParamsSchema>

// ==========================================
// Interface de Resposta (Output)
// ==========================================

export interface MessageResponse {
  id: string
  content: string
  createdAt: Date
  senderId: string
  sender: {
    name: string
    role: Role
  }
}

export interface ChatResponse {
  id: string
  isOpen: boolean
  type: ChatType
  userId: string
  cartId: string | null
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
  messages?: MessageResponse[]
}
