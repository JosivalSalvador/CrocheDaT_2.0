import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import * as chatsController from './chats.controller.js'
import { createChatSchema, sendMessageSchema, chatParamsSchema } from './chats.schema.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

export async function chatsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Criar um novo chat (Suporte ou Encomenda)
   */
  router.post(
    '/chats',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['chats'],
        summary: 'Create a new chat (Support or Order)',
        body: createChatSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            chat: z.object({
              id: z.uuid(),
              type: z.enum(['ORDER', 'SUPPORT']),
              isOpen: z.boolean(),
              lastMessageAt: z.date(),
              cartId: z.string().nullable().optional(), // <-- ADICIONAR ESTA LINHA
              messages: z.array(z.any()).optional(),
            }),
          }),
        },
      },
    },
    chatsController.create,
  )

  /**
   * ROTA: Listar meus chats
   */
  router.get(
    '/chats/me',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['chats'],
        summary: 'List my active and past chats',
        response: {
          [StatusCodes.OK]: z.object({
            chats: z.array(
              z.object({
                id: z.uuid(),
                type: z.enum(['ORDER', 'SUPPORT']),
                isOpen: z.boolean(),
                lastMessageAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    chatsController.listMyChats,
  )

  /**
   * ROTA: Detalhes do chat + Mensagens
   */
  router.get(
    '/chats/:chatId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['chats'],
        summary: 'Get chat details and messages',
        params: chatParamsSchema,
        response: {
          [StatusCodes.OK]: z.object({
            chat: z.object({
              id: z.uuid(),
              type: z.enum(['ORDER', 'SUPPORT']),
              isOpen: z.boolean(),
              messages: z.array(
                z.object({
                  id: z.uuid(),
                  content: z.string(),
                  createdAt: z.date(),
                  sender: z.object({
                    name: z.string(),
                    role: z.string(),
                  }),
                }),
              ),
            }),
          }),
        },
      },
    },
    chatsController.getDetails,
  )

  /**
   * ROTA: Enviar mensagem
   */
  router.post(
    '/chats/:chatId/messages',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['chats'],
        summary: 'Send a message in a chat',
        params: chatParamsSchema,
        body: sendMessageSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.object({
              id: z.uuid(),
              content: z.string(),
              createdAt: z.date(),
              senderId: z.string(),
              sender: z.object({
                name: z.string(),
                role: z.string(),
              }),
            }),
          }),
        },
      },
    },
    chatsController.sendMessage,
  )

  // ==========================================
  // 🛡️ STAFF ONLY (ADMIN / SUPPORTER)
  // ==========================================

  router.get(
    '/chats',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN', 'SUPPORTER')],
      schema: {
        tags: ['staff'],
        summary: 'List all chats (Staff only)',
      },
    },
    chatsController.listAll,
  )

  router.patch(
    '/chats/:chatId/status',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN', 'SUPPORTER')],
      schema: {
        tags: ['staff'],
        summary: 'Close or reopen a chat',
        params: chatParamsSchema,
        body: z.object({
          isOpen: z.boolean(),
        }),
      },
    },
    chatsController.toggleStatus,
  )
}
