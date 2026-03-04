import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { chatResponseSchema, messageResponseSchema } from '../chats.schema.js'

/**
 * ==========================================
 * Schemas Auxiliares para Validação de Resposta
 * Inferem os tipos automaticamente e testam o contrato
 * ==========================================
 */
const chatWithMsgSchema = z.object({
  message: z.string(),
  chat: chatResponseSchema,
})

const chatOnlySchema = z.object({
  chat: chatResponseSchema,
})

const chatsListSchema = z.object({
  chats: z.array(chatResponseSchema),
})

const messageResponseBodySchema = z.object({
  message: messageResponseSchema,
})

interface AuthSession {
  token: string
  userId: string
  email: string
}

/**
 * ==========================================
 * Helpers de Isolamento
 * ==========================================
 */
const generateUniqueEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@example.com`

async function createAndAuthenticateUser(role: 'USER' | 'ADMIN' | 'SUPPORTER' = 'USER'): Promise<AuthSession> {
  const email = generateUniqueEmail('chat-e2e')
  const password = 'Password123!'

  const registerResponse = await request(app.server)
    .post('/api/v1/users')
    .send({
      name: `Chat E2E ${role}`,
      email,
      password,
    })

  // Parse validando o retorno do registro
  const { userId } = z.object({ userId: z.string() }).parse(registerResponse.body)

  if (role !== 'USER') {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
  }

  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  // Parse validando o token
  const { token } = z.object({ token: z.string() }).parse(authResponse.body)

  return { token, userId, email }
}

async function createActiveCart(userId: string) {
  return await prisma.cart.create({
    data: { userId, status: 'ACTIVE' },
  })
}

/**
 * ==========================================
 * Suíte de Testes (E2E)
 * ==========================================
 */
describe('Chats Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /chats', () => {
    it('should be able to open a new SUPPORT chat', async () => {
      const { token } = await createAndAuthenticateUser()

      const response = await request(app.server).post('/api/v1/chats').set('Authorization', `Bearer ${token}`).send({
        type: 'SUPPORT',
        firstMessage: 'Olá, preciso de ajuda.',
      })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      // Validação Estrita + Tipagem Automática
      const body = chatWithMsgSchema.parse(response.body)
      expect(body.message).toBe('Chat opened successfully.')
      expect(body.chat.type).toBe('SUPPORT')
      expect(body.chat.isOpen).toBe(true)
      expect(body.chat.messages).toBeDefined()
      expect(body.chat.messages).toHaveLength(1)
    })

    it('should be able to open an ORDER chat linking an active cart', async () => {
      const { token, userId } = await createAndAuthenticateUser()
      const cart = await createActiveCart(userId)

      const response = await request(app.server).post('/api/v1/chats').set('Authorization', `Bearer ${token}`).send({
        type: 'ORDER',
        cartId: cart.id,
      })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      const body = chatWithMsgSchema.parse(response.body)
      expect(body.chat.type).toBe('ORDER')
      expect(body.chat.cartId).toBe(cart.id)

      // Valida se o carrinho foi finalizado no banco (E2E real)
      const finishedCart = await prisma.cart.findUnique({ where: { id: cart.id } })

      // Type Narrowing em vez de Non-null assertion (!)
      if (!finishedCart) throw new Error('O carrinho deveria existir no banco.')
      expect(finishedCart.status).toBe('FINISHED')
    })
  })

  describe('POST /chats/:chatId/messages', () => {
    it('should allow the owner to send a message', async () => {
      const { token } = await createAndAuthenticateUser()

      // Setup: Cria o chat
      const createRes = await request(app.server)
        .post('/api/v1/chats')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'SUPPORT' })

      const setupBody = chatWithMsgSchema.parse(createRes.body)
      const chatId = setupBody.chat.id

      // Ação: Envia a mensagem
      const response = await request(app.server)
        .post(`/api/v1/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Nova mensagem do usuário' })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      const body = messageResponseBodySchema.parse(response.body)
      expect(body.message.content).toBe('Nova mensagem do usuário')
    })

    it('should allow a SUPPORTER to send a message to a users chat', async () => {
      const user = await createAndAuthenticateUser('USER')
      const supporter = await createAndAuthenticateUser('SUPPORTER')

      // Setup: Usuário cria o chat
      const createRes = await request(app.server)
        .post('/api/v1/chats')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ type: 'SUPPORT' })

      const setupBody = chatWithMsgSchema.parse(createRes.body)
      const chatId = setupBody.chat.id

      // Ação: Suporte responde
      const response = await request(app.server)
        .post(`/api/v1/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${supporter.token}`)
        .send({ content: 'Olá, sou do suporte!' })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      const body = messageResponseBodySchema.parse(response.body)
      expect(body.message.content).toBe('Olá, sou do suporte!')
      expect(body.message.senderId).toBe(supporter.userId)
    })
  })

  describe('GET /chats/me', () => {
    it('should list all chats from the logged user', async () => {
      const { token } = await createAndAuthenticateUser()

      await request(app.server).post('/api/v1/chats').set('Authorization', `Bearer ${token}`).send({ type: 'SUPPORT' })
      await request(app.server).post('/api/v1/chats').set('Authorization', `Bearer ${token}`).send({ type: 'SUPPORT' })

      const response = await request(app.server).get('/api/v1/chats/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = chatsListSchema.parse(response.body)
      expect(body.chats.length).toBeGreaterThanOrEqual(2)

      const firstChat = body.chats[0]
      if (!firstChat) throw new Error('A lista de chats não deveria estar vazia.')

      expect(firstChat.type).toBe('SUPPORT')
    })
  })

  describe('GET /chats/:chatId', () => {
    it('should fetch details and messages of a specific chat', async () => {
      const { token } = await createAndAuthenticateUser()

      const createRes = await request(app.server)
        .post('/api/v1/chats')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'SUPPORT', firstMessage: 'Init' })

      const setupBody = chatWithMsgSchema.parse(createRes.body)
      const chatId = setupBody.chat.id

      const response = await request(app.server).get(`/api/v1/chats/${chatId}`).set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = chatOnlySchema.parse(response.body)
      expect(body.chat.id).toBe(chatId)
      expect(body.chat.messages).toHaveLength(1)
    })
  })

  describe('GET /chats (List All - Staff)', () => {
    it('should allow ADMIN to list all chats', async () => {
      const admin = await createAndAuthenticateUser('ADMIN')
      const user = await createAndAuthenticateUser('USER')

      // User cria um chat para garantir que a fila não está vazia
      await request(app.server)
        .post('/api/v1/chats')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ type: 'SUPPORT' })

      const response = await request(app.server).get('/api/v1/chats').set('Authorization', `Bearer ${admin.token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = chatsListSchema.parse(response.body)
      expect(body.chats.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('PATCH /chats/:chatId/status', () => {
    it('should allow closing a chat', async () => {
      const admin = await createAndAuthenticateUser('ADMIN')
      const user = await createAndAuthenticateUser('USER')

      const createRes = await request(app.server)
        .post('/api/v1/chats')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ type: 'SUPPORT' })

      const setupBody = chatWithMsgSchema.parse(createRes.body)
      const chatId = setupBody.chat.id

      const response = await request(app.server)
        .patch(`/api/v1/chats/${chatId}/status`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({ isOpen: false })

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = chatWithMsgSchema.parse(response.body)
      expect(body.message).toBe('Chat closed successfully.')
      expect(body.chat.isOpen).toBe(false)
    })
  })
})
