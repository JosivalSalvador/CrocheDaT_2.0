import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { cartResponseSchema } from '../carts.schema.js'

/**
 * ==========================================
 * Schemas Auxiliares para Validação de Resposta
 * Inferem os tipos automaticamente e testam o contrato
 * ==========================================
 */
const cartWithMsgSchema = z.object({
  message: z.string(),
  cart: cartResponseSchema,
})

const cartOnlySchema = z.object({
  cart: cartResponseSchema.nullable(),
})

const msgOnlySchema = z.object({
  message: z.string(),
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

async function createAndAuthenticateUser(role: 'USER' | 'ADMIN' = 'USER'): Promise<AuthSession> {
  const email = generateUniqueEmail('cart-e2e')
  const password = 'Password123!'

  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Cart E2E User',
    email,
    password,
  })

  // Parse validando o retorno do registro
  const { userId } = z.object({ userId: z.string() }).parse(registerResponse.body)

  if (role === 'ADMIN') {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    })
  }

  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  const { token } = z.object({ token: z.string() }).parse(authResponse.body)

  return { token, userId, email }
}

async function createTestProduct(price: number = 100.0) {
  const category = await prisma.category.upsert({
    where: { name: 'E2E Category' },
    update: {},
    create: { name: 'E2E Category' },
  })

  return await prisma.product.create({
    data: {
      name: `Prod-${randomBytes(2).toString('hex')}`,
      description: 'E2E Test Item',
      material: 'Wool',
      productionTime: 2,
      price,
      categoryId: category.id,
    },
  })
}

/**
 * ==========================================
 * Suíte de Testes (E2E)
 * ==========================================
 */
describe('Carts Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /carts', () => {
    it('should be able to add a new item to the cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct(150.0)

      const response = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 2 })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      // Valida o contrato e infere a tipagem do body automaticamente
      const body = cartWithMsgSchema.parse(response.body)

      expect(body.message).toBe('Item added to cart successfully.')
      expect(body.cart.items).toHaveLength(1)

      const firstItem = body.cart.items[0]
      if (!firstItem) throw new Error('O carrinho deveria ter o item adicionado')

      expect(firstItem.productId).toBe(product.id)
      expect(firstItem.quantity).toBe(2)
      expect(firstItem.subtotal).toBe(300.0)
      expect(body.cart.totalAmount).toBe(300.0)
    })
  })

  describe('GET /carts/me', () => {
    it('should be able to fetch the active cart of the logged user', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct(50.0)

      // Setup
      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const response = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = cartOnlySchema.parse(response.body)

      expect(body.cart).not.toBeNull()
      expect(body.cart?.status).toBe('ACTIVE')
      expect(body.cart?.items.length).toBeGreaterThan(0)
    })
  })

  describe('PATCH /carts/item/:itemId', () => {
    it('should be able to update the quantity of an existing cart item', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct(100.0)

      const addRes = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      // Pega o itemId blindado pelo Zod e faz o narrowing
      const addBody = cartWithMsgSchema.parse(addRes.body)
      const addedItem = addBody.cart.items[0]
      if (!addedItem) throw new Error('Setup falhou: item não foi adicionado')

      const itemId = addedItem.id

      const response = await request(app.server)
        .patch(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 })

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = cartWithMsgSchema.parse(response.body)
      expect(body.message).toBe('Cart updated successfully.')

      const updatedItem = body.cart.items[0]
      if (!updatedItem) throw new Error('O item deveria continuar no carrinho')

      expect(updatedItem.quantity).toBe(5)
      expect(body.cart.totalAmount).toBe(500.0)
    })
  })

  describe('DELETE /carts/item/:itemId', () => {
    it('should be able to remove a specific item from the cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      const addRes = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const addBody = cartWithMsgSchema.parse(addRes.body)
      const addedItem = addBody.cart.items[0]
      if (!addedItem) throw new Error('Setup falhou: item não foi adicionado')

      const itemId = addedItem.id

      const response = await request(app.server)
        .delete(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = cartWithMsgSchema.parse(response.body)
      expect(body.message).toBe('Item removed from cart.')
      expect(body.cart.items).toHaveLength(0)
    })
  })

  describe('DELETE /carts/me', () => {
    it('should be able to clear all items from the active cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product1 = await createTestProduct()
      const product2 = await createTestProduct()

      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1.id, quantity: 1 })
      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product2.id, quantity: 1 })

      const response = await request(app.server).delete('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = msgOnlySchema.parse(response.body)
      expect(body.message).toBe('Cart cleared successfully.')

      // Verifica se realmente limpou chamando a rota de GET
      const getRes = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)
      const getBody = cartOnlySchema.parse(getRes.body)
      expect(getBody.cart?.items).toHaveLength(0)
    })
  })

  describe('GET /carts/:itemId', () => {
    it('should retrieve a specific cart by its ID', async () => {
      const user = await createAndAuthenticateUser('USER')
      const admin = await createAndAuthenticateUser('ADMIN')
      const product = await createTestProduct(75.0)

      const addRes = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id, quantity: 2 })

      const addBody = cartWithMsgSchema.parse(addRes.body)
      const cartId = addBody.cart.id

      // Admin acessa os detalhes
      const response = await request(app.server)
        .get(`/api/v1/carts/${cartId}`)
        .set('Authorization', `Bearer ${admin.token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = z.object({ cart: cartResponseSchema }).parse(response.body)
      expect(body.cart.id).toBe(cartId)
      expect(body.cart.totalAmount).toBe(150.0)
    })
  })
})
