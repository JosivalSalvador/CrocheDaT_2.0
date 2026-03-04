import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../../lib/prisma.js'
import {
  createChat,
  sendMessage,
  listUserChats,
  listAllChats,
  getChatDetails,
  toggleChatStatus,
} from '../chats.service.js'

/**
 * Helpers para isolamento de dados
 */
const createEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@test.com`

async function createUser(role: 'USER' | 'ADMIN' | 'SUPPORTER' = 'USER') {
  return await prisma.user.create({
    data: {
      name: `User ${role}`,
      email: createEmail(role.toLowerCase()),
      password_hash: 'hashedpassword',
      role,
    },
  })
}

async function createActiveCart(userId: string) {
  return await prisma.cart.create({
    data: {
      userId,
      status: 'ACTIVE',
    },
  })
}

describe('Chats Service (Integration)', () => {
  describe('createChat()', () => {
    it('should create a SUPPORT chat without a first message', async () => {
      const user = await createUser()

      const chat = await createChat(user.id, { type: 'SUPPORT' })

      expect(chat).toBeDefined()
      expect(chat.type).toBe('SUPPORT')
      expect(chat.isOpen).toBe(true)
      expect(chat.messages).toHaveLength(0)
    })

    it('should create a SUPPORT chat WITH a first message', async () => {
      const user = await createUser()

      const chat = await createChat(user.id, {
        type: 'SUPPORT',
        firstMessage: 'Olá, preciso de ajuda com um fio.',
      })

      expect(chat.messages).toBeDefined()
      expect(chat.messages).toHaveLength(1)

      const firstMessage = chat.messages[0]
      if (!firstMessage) throw new Error('A mensagem inicial não foi criada.')

      expect(firstMessage.content).toBe('Olá, preciso de ajuda com um fio.')
    })

    it('should create an ORDER chat, link the cart, and finish the cart', async () => {
      const user = await createUser()
      const cart = await createActiveCart(user.id)

      const chat = await createChat(user.id, {
        type: 'ORDER',
        cartId: cart.id,
      })

      expect(chat.type).toBe('ORDER')
      expect(chat.cartId).toBe(cart.id)

      // Verifica se o service realmente chamou o finishCart e atualizou o banco
      const updatedCart = await prisma.cart.findUnique({ where: { id: cart.id } })
      if (!updatedCart) throw new Error('O carrinho não foi encontrado.')

      expect(updatedCart.status).toBe('FINISHED')
    })

    it('should throw BAD_REQUEST if ORDER chat is created without cartId', async () => {
      const user = await createUser()

      await expect(createChat(user.id, { type: 'ORDER' })).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      })
    })

    it('should throw CONFLICT if user already has an active ORDER chat', async () => {
      const user = await createUser()
      const cart1 = await createActiveCart(user.id)
      const cart2 = await createActiveCart(user.id) // Outro carrinho

      // Cria o primeiro chat de ORDER (ativo)
      await createChat(user.id, { type: 'ORDER', cartId: cart1.id })

      // Tenta criar o segundo chat de ORDER sem fechar o primeiro
      await expect(createChat(user.id, { type: 'ORDER', cartId: cart2.id })).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      })
    })
  })

  describe('sendMessage()', () => {
    it('should allow the chat owner (USER) to send a message', async () => {
      const user = await createUser()
      const chat = await createChat(user.id, { type: 'SUPPORT' })

      const message = await sendMessage(user.id, user.role, chat.id, { content: 'Minha dúvida.' })

      expect(message.content).toBe('Minha dúvida.')
      expect(message.senderId).toBe(user.id)
    })

    it('should allow a SUPPORTER to send a message in a users chat', async () => {
      const user = await createUser('USER')
      const staff = await createUser('SUPPORTER')
      const chat = await createChat(user.id, { type: 'SUPPORT' })

      const message = await sendMessage(staff.id, staff.role, chat.id, { content: 'Como ajudo?' })

      expect(message.content).toBe('Como ajudo?')
      expect(message.senderId).toBe(staff.id)
    })

    it('should throw FORBIDDEN if a different USER tries to send a message', async () => {
      const owner = await createUser('USER')
      const invader = await createUser('USER')
      const chat = await createChat(owner.id, { type: 'SUPPORT' })

      await expect(
        sendMessage(invader.id, invader.role, chat.id, { content: 'Hackeando chat alheio' }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.FORBIDDEN,
      })
    })

    it('should throw BAD_REQUEST if trying to send a message to a closed chat', async () => {
      const user = await createUser()
      const chat = await createChat(user.id, { type: 'SUPPORT' })

      // Fecha o chat
      await toggleChatStatus(chat.id, false)

      await expect(sendMessage(user.id, user.role, chat.id, { content: 'Chat fechado' })).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
      })
    })
  })

  describe('getChatDetails()', () => {
    it('should return chat details for the owner', async () => {
      const user = await createUser()
      const createdChat = await createChat(user.id, { type: 'SUPPORT', firstMessage: 'Oi' })

      const chatDetails = await getChatDetails(createdChat.id, user.id, user.role)

      expect(chatDetails.id).toBe(createdChat.id)
      expect(chatDetails.messages).toHaveLength(1)
    })

    it('should allow ADMIN to read any chat', async () => {
      const user = await createUser('USER')
      const admin = await createUser('ADMIN')
      const createdChat = await createChat(user.id, { type: 'SUPPORT' })

      const chatDetails = await getChatDetails(createdChat.id, admin.id, admin.role)
      expect(chatDetails.id).toBe(createdChat.id)
    })

    it('should throw FORBIDDEN if non-owner user tries to read', async () => {
      const owner = await createUser('USER')
      const stranger = await createUser('USER')
      const createdChat = await createChat(owner.id, { type: 'SUPPORT' })

      await expect(getChatDetails(createdChat.id, stranger.id, stranger.role)).rejects.toMatchObject({
        statusCode: StatusCodes.FORBIDDEN,
      })
    })
  })

  describe('toggleChatStatus()', () => {
    it('should close and reopen a chat successfully', async () => {
      const user = await createUser()
      const chat = await createChat(user.id, { type: 'SUPPORT' })

      // Fechar
      const closedChat = await toggleChatStatus(chat.id, false)
      expect(closedChat.isOpen).toBe(false)

      // Reabrir
      const reopenedChat = await toggleChatStatus(chat.id, true)
      expect(reopenedChat.isOpen).toBe(true)
    })
  })

  describe('Listings (listUserChats & listAllChats)', () => {
    it('should list only the logged-in users chats', async () => {
      const user1 = await createUser()
      const user2 = await createUser()

      await createChat(user1.id, { type: 'SUPPORT' })
      await createChat(user1.id, { type: 'SUPPORT' })
      await createChat(user2.id, { type: 'SUPPORT' }) // Não deve aparecer para user1

      const user1Chats = await listUserChats(user1.id)
      expect(user1Chats).toHaveLength(2)
    })

    it('listAllChats should return chats from all users', async () => {
      const user1 = await createUser()
      const user2 = await createUser()

      await createChat(user1.id, { type: 'SUPPORT' })
      await createChat(user2.id, { type: 'SUPPORT' })

      const allChats = await listAllChats()
      // Deve ter pelo menos 2 (pode ter mais devido a outros testes, mas garantimos que traz ambos)
      expect(allChats.length).toBeGreaterThanOrEqual(2)
    })
  })
})
