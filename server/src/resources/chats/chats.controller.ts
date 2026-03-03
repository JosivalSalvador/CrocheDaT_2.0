import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as chatsService from './chats.service.js'
import type { CreateChatInput, SendMessageInput, ChatParams } from './chats.types.js'

/**
 * CRIAR UM NOVO CHAT (SUPPORT ou ORDER)
 */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const body = request.body as CreateChatInput

  const chat = await chatsService.createChat(userId, body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Chat opened successfully.',
    chat,
  })
}

/**
 * ENVIAR UMA MENSAGEM
 */
export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const { role } = request.user // <--- MUDANÇA 1: Extraímos a role do token
  const { chatId } = request.params as ChatParams
  const body = request.body as SendMessageInput

  // <--- MUDANÇA 2: Agora enviamos 4 argumentos para o Service
  const message = await chatsService.sendMessage(userId, role, chatId, body)

  return reply.status(StatusCodes.CREATED).send({ message })
}

/**
 * BUSCAR MEUS CHATS (Histórico do Usuário)
 */
export async function listMyChats(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const chats = await chatsService.listUserChats(userId)

  return reply.status(StatusCodes.OK).send({ chats })
}

/**
 * BUSCAR DETALHES DO CHAT (Mensagens)
 */
export async function getDetails(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const { role } = request.user
  const { chatId } = request.params as ChatParams

  const chat = await chatsService.getChatDetails(chatId, userId, role)

  return reply.status(StatusCodes.OK).send({ chat })
}

// ==========================================
// 🛡️ MÉTODOS DE STAFF (ADMIN/SUPPORTER)
// ==========================================

/**
 * LISTAR TODOS OS CHATS (Fila de Atendimento)
 */
export async function listAll(request: FastifyRequest, reply: FastifyReply) {
  const chats = await chatsService.listAllChats()
  return reply.status(StatusCodes.OK).send({ chats })
}

/**
 * ALTERAR STATUS (Fechar ou Reabrir Chat)
 */
export async function toggleStatus(request: FastifyRequest, reply: FastifyReply) {
  const { chatId } = request.params as ChatParams
  const { isOpen } = request.body as { isOpen: boolean }

  const chat = await chatsService.toggleChatStatus(chatId, isOpen)

  return reply.status(StatusCodes.OK).send({
    message: `Chat ${isOpen ? 'reopened' : 'closed'} successfully.`,
    chat,
  })
}
