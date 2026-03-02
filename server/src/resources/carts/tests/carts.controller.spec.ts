import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Helpers para garantir isolamento e autenticação
 */
const generateUniqueEmail = () => `user-${randomBytes(4).toString('hex')}@example.com`

interface AuthSession {
  token: string
  userId: string
}

async function createAndAuthenticateUser(): Promise<AuthSession> {
  const email = generateUniqueEmail()
  const password = 'Password123!'

  // Criamos o usuário via API para garantir que o fluxo de hash de senha ocorra
  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Cart Tester',
    email,
    password,
  })

  const userId = registerResponse.body.userId

  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  return {
    token: authResponse.body.token,
    userId,
  }
}

async function createTestProduct() {
  const category = await prisma.category.upsert({
    where: { name: 'Amigurumi' },
    update: {},
    create: { name: 'Amigurumi' },
  })

  return await prisma.product.create({
    data: {
      name: `Product-${randomBytes(2).toString('hex')}`,
      description: 'Handmade item',
      material: 'Cotton',
      productionTime: 5,
      price: 100.0,
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
    it('should be able to add an item to the cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      const response = await request(app.server).post('/api/v1/carts').set('Authorization', `Bearer ${token}`).send({
        productId: product.id,
        quantity: 2,
      })

      expect(response.statusCode).toBe(StatusCodes.CREATED)
      expect(response.body.message).toContain('Item added')
      expect(response.body.cart.items).toHaveLength(1)
      expect(response.body.cart.totalAmount).toBe(200.0)
    })

    it('should return 401 when adding item without token', async () => {
      const product = await createTestProduct()

      const response = await request(app.server).post('/api/v1/carts').send({ productId: product.id, quantity: 1 })

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('GET /carts/me', () => {
    it('should be able to retrieve user active cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      // Adiciona item primeiro
      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const response = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.cart.id).toBeDefined()
      expect(response.body.cart.items[0].productId).toBe(product.id)
    })
  })

  describe('PATCH /carts/item/:itemId', () => {
    it('should be able to update item quantity', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      const addResponse = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const itemId = addResponse.body.cart.items[0].id

      const response = await request(app.server)
        .patch(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.cart.items[0].quantity).toBe(5)
      expect(response.body.cart.totalAmount).toBe(500.0)
    })
  })

  describe('DELETE /carts/item/:itemId', () => {
    it('should be able to remove an item from the cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      const addResponse = await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })

      const itemId = addResponse.body.cart.items[0].id

      const response = await request(app.server)
        .delete(`/api/v1/carts/item/${itemId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.cart.items).toHaveLength(0)
    })
  })

  describe('DELETE /carts/me', () => {
    it('should be able to clear the entire cart', async () => {
      const { token } = await createAndAuthenticateUser()
      const product = await createTestProduct()

      await request(app.server)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 10 })

      const response = await request(app.server).delete('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.message).toContain('cleared')

      // Verifica se realmente esvaziou
      const checkResponse = await request(app.server).get('/api/v1/carts/me').set('Authorization', `Bearer ${token}`)

      expect(checkResponse.body.cart.items).toHaveLength(0)
    })
  })
})
