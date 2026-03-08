import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import { finishCart } from '../carts/carts.service.js'
import type { Prisma } from '@prisma/client'
import type { CreateChatInput, SendMessageInput } from './chats.types.js' // Removemos o ChatResponse daqui

/**
 * CRIA UM NOVO CHAT (SUPPORT ou ORDER)
 * Garante que encomendas finalizem o carrinho e suporte seja direto.
 * Agora valida se já existe um chat de ORDER aberto para o usuário.
 */
export async function createChat(userId: string, input: CreateChatInput) {
  const { type, cartId, firstMessage } = input

  // 1. Validação de Regra de Negócio para Encomendas
  if (type === 'ORDER') {
    // BLOQUEIO: Verifica se o usuário já tem algum chat de ORDER que ainda está aberto
    const activeOrderChat = await prisma.chat.findFirst({
      where: {
        userId,
        type: 'ORDER',
        isOpen: true,
      },
    })

    if (activeOrderChat) {
      throw new AppError(
        'Você já possui um chat de encomenda ativo. Finalize-o antes de abrir um novo.',
        StatusCodes.CONFLICT,
      )
    }

    if (!cartId) {
      throw new AppError('Cart ID is required for orders.', StatusCodes.BAD_REQUEST)
    }

    const cart = await prisma.cart.findUnique({ where: { id: cartId } })

    if (!cart || cart.userId !== userId) {
      throw new AppError('Cart not found or not owned by user.', StatusCodes.NOT_FOUND)
    }

    if (cart.status !== 'ACTIVE') {
      throw new AppError('This cart is already finished or abandoned.', StatusCodes.BAD_REQUEST)
    }

    // Marca o carrinho como FINISHED no banco
    await finishCart(userId)
  }

  // 2. Construção dinâmica do objeto para satisfazer o TS (sem chaves undefined)
  const createData: Prisma.ChatCreateInput = {
    type,
    user: { connect: { id: userId } },
  }

  if (type === 'ORDER' && cartId) {
    createData.cart = { connect: { id: cartId } }
  }

  if (firstMessage) {
    createData.messages = {
      create: {
        content: firstMessage,
        sender: { connect: { id: userId } },
      },
    }
  }

  const chat = await prisma.chat.create({
    data: createData,
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { name: true, role: true } } },
      },
    },
  })

  // O Prisma tipa o 'chat' perfeitamente com todas as relations que pedimos acima.
  return chat
}

/**
 * ENVIAR MENSAGEM EM UM CHAT EXISTENTE
 */
export async function sendMessage(userId: string, role: string, chatId: string, input: SendMessageInput) {
  const chat = await prisma.chat.findUnique({ where: { id: chatId } })

  if (!chat) throw new AppError('Chat not found.', StatusCodes.NOT_FOUND)
  if (!chat.isOpen) throw new AppError('This chat is closed.', StatusCodes.BAD_REQUEST)

  // BLOQUEIO USER PARA USER:
  // Se o cara for USER, o id dele TEM que ser o userId registrado no chat.
  // Se for ADMIN ou SUPPORTER, ele pode passar (pois está respondendo o suporte).
  const isOwner = chat.userId === userId
  const isStaff = role === 'ADMIN' || role === 'SUPPORTER'

  if (!isOwner && !isStaff) {
    throw new AppError('Você não tem permissão para enviar mensagens neste chat.', StatusCodes.FORBIDDEN)
  }

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        content: input.content,
        chat: { connect: { id: chatId } },
        sender: { connect: { id: userId } },
      },
      include: { sender: { select: { name: true, role: true } } },
    }),
    prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    }),
  ])

  return message
}

/**
 * LISTAR CHATS DO USUÁRIO LOGADO
 */
export async function listUserChats(userId: string) {
  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: { name: true, role: true } } },
      },
    },
  })

  return chats
}

/**
 * LISTAR TODOS OS CHATS (Acesso Admin/Suporte)
 */
export async function listAllChats() {
  const chats = await prisma.chat.findMany({
    orderBy: { lastMessageAt: 'desc' },
    include: {
      user: { select: { name: true, role: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: { name: true, role: true } } },
      },
    },
  })

  return chats
}

/**
 * BUSCAR DETALHES DE UM CHAT ESPECÍFICO
 */
export async function getChatDetails(chatId: string, userId: string, role: string) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { name: true, role: true } },
        },
      },
    },
  })

  if (!chat) {
    throw new AppError('Chat not found.', StatusCodes.NOT_FOUND)
  }

  // Proteção: Apenas o dono do chat ou Staff (Admin/Supporter) podem ver
  if (role === 'USER' && chat.userId !== userId) {
    throw new AppError('Access denied.', StatusCodes.FORBIDDEN)
  }

  return chat
}

/**
 * ALTERAR STATUS DO CHAT (Abrir/Fechar)
 */
export async function toggleChatStatus(chatId: string, isOpen: boolean) {
  const chat = await prisma.chat.findUnique({ where: { id: chatId } })

  if (!chat) {
    throw new AppError('Chat not found.', StatusCodes.NOT_FOUND)
  }

  return await prisma.chat.update({
    where: { id: chatId },
    data: { isOpen },
  })
}
