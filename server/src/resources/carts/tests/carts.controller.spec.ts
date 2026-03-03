import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import type { CartResponse } from '../carts.types.js'

/**
 * Interfaces Estritas para Response
 */
interface CartResponseBody {
  message?: string
  cart: CartResponse
}

interface AuthSession {
  token: string
  userId: string
  email: string
}

/**
 * Helpers de Isolamento
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

  const userId = registerResponse.body.userId as string

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

  return { token: authResponse.body.token, userId, email }
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

      const body = response.body as CartResponseBody
      expect(body.message).toBe('Item added to cart successfully.')
      expect(body.cart).toBeDefined()
      expect(body.cart.items).toHaveLength(1)

      const firstItem = body.cart.items[0]!
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

      // Setup: Adiciona um item para garantir que o carrinho existe e tem itens
      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const response = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = response.body as CartResponseBody
      expect(body.cart).toBeDefined()
      expect(body.cart.status).toBe('ACTIVE')
      expect(body.cart.items.length).toBeGreaterThan(0)
    })
  })

  describe('PATCH /carts/item/:itemId', () => {
    it('should be able to update the quantity of an existing cart item', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct(100.0)

      // Setup
      const addRes = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const itemId = (addRes.body as CartResponseBody).cart.items[0]!.id

      // Ação
      const response = await request(app.server)
        .patch(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 })

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = response.body as CartResponseBody
      expect(body.message).toBe('Cart updated successfully.')
      expect(body.cart.items[0]!.quantity).toBe(5)
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

      const itemId = (addRes.body as CartResponseBody).cart.items[0]!.id

      const response = await request(app.server)
        .delete(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = response.body as CartResponseBody
      expect(body.message).toBe('Item removed from cart.')
      expect(body.cart.items).toHaveLength(0)
    })
  })

  describe('DELETE /carts/me (clearMyCart)', () => {
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

      // Confirme se no seu `routes.ts` a rota é realmente `/carts/me`
      const response = await request(app.server).delete('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.message).toBe('Cart cleared successfully.')

      // Verifica se realmente limpou
      const getRes = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)
      expect((getRes.body as CartResponseBody).cart.items).toHaveLength(0)
    })
  })

  describe('GET /carts/detail/:itemId (getCartDetail)', () => {
    it('should retrieve a specific cart by its ID', async () => {
      const user = await createAndAuthenticateUser('USER')
      const admin = await createAndAuthenticateUser('ADMIN')
      const product = await createTestProduct(75.0)

      // Usuário cria o carrinho
      const addRes = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id, quantity: 2 })

      const cartId = (addRes.body as CartResponseBody).cart.id

      // Admin acessa os detalhes usando o ID do carrinho
      const response = await request(app.server)
        .get(`/api/v1/carts/${cartId}`)
        .set('Authorization', `Bearer ${admin.token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)

      const body = response.body as CartResponseBody
      expect(body.cart.id).toBe(cartId)
      expect(body.cart.totalAmount).toBe(150.0)
    })
  })
})
