import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Auxiliar para garantir unicidade e evitar colisões no banco
 */
const generateUniqueName = (base: string): string => `${base}-${randomBytes(4).toString('hex')}`

/**
 * Interfaces para tipagem rigorosa das respostas do Supertest
 */
interface AuthSession {
  token: string
  userId: string
  email: string
}

interface ProductImage {
  id: string
  name: string
  url: string
}

interface Product {
  id: string
  name: string
  categoryId: string
  images: ProductImage[]
}

/**
 * Helper para criar usuário e autenticar com Role específica
 */
async function createAndAuthenticateUser(role: 'USER' | 'ADMIN' = 'USER'): Promise<AuthSession> {
  const email = `${generateUniqueName('test')}@example.com`
  const password = 'Password123!'

  const registerRes = await request(app.server).post('/api/v1/users').send({
    name: 'Test User',
    email,
    password,
  })

  const userId = registerRes.body.userId as string
  if (!userId) throw new Error(`Registration failed: ${JSON.stringify(registerRes.body)}`)

  if (role === 'ADMIN') {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    })
  }

  const authRes = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  const token = authRes.body.token as string
  if (!token) throw new Error('Authentication failed: Token not found')

  return {
    token,
    userId,
    email,
  }
}

describe('Products Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  /**
   * Helper robusto para criação de categoria
   */
  async function createCategory(token: string): Promise<string> {
    const res = await request(app.server)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: generateUniqueName('Category') })

    // Verificação de segurança: tenta pegar res.body.id ou res.body.category.id
    const id = (res.body.id || res.body.category?.id) as string | undefined

    if (!id) {
      throw new Error(`Failed to capture Category ID. Response body: ${JSON.stringify(res.body)}`)
    }

    return id
  }

  describe('Fluxo de Gerenciamento de Produtos', () => {
    it('should be able to create a product as admin', async () => {
      const { token } = await createAndAuthenticateUser('ADMIN')
      const categoryId = await createCategory(token)

      const response = await request(app.server)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Produto Teste',
          description: 'Descrição detalhada com mais de dez caracteres',
          material: 'Lã Natural',
          productionTime: 10,
          price: 150.5,
          categoryId,
          images: [{ name: 'Foto 1', url: 'https://cdn.com/f1.jpg' }],
        })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      const product = response.body.product as Product
      expect(product).toBeDefined()
      expect(product.id).toBeDefined()
    })

    it('should be able to add an image to an existing product', async () => {
      const { token } = await createAndAuthenticateUser('ADMIN')
      const categoryId = await createCategory(token)

      // Criando produto via Prisma com segurança de tipos
      const product = await prisma.product.create({
        data: {
          name: 'Produto Base',
          description: 'Descricao valida para teste',
          material: 'Madeira',
          productionTime: 5,
          price: 100,
          category: { connect: { id: categoryId } },
        },
      })

      const response = await request(app.server)
        .post(`/api/v1/products/${product.id}/images`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Nova Foto', url: 'https://cdn.com/nova.jpg' })

      expect(response.statusCode).toBe(StatusCodes.CREATED)

      const body = response.body as { image: ProductImage }
      expect(body.image?.url).toBe('https://cdn.com/nova.jpg')
    })

    it('should be able to update product and change its category', async () => {
      const { token } = await createAndAuthenticateUser('ADMIN')
      const cat1Id = await createCategory(token)
      const cat2Id = await createCategory(token)

      const product = await prisma.product.create({
        data: {
          name: 'Nome Velho',
          description: 'Descricao valida para teste',
          material: 'Plástico',
          productionTime: 1,
          price: 20,
          category: { connect: { id: cat1Id } },
        },
      })

      const response = await request(app.server)
        .patch(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Nome Novo', categoryId: cat2Id })

      expect(response.statusCode).toBe(StatusCodes.OK)

      const updatedProduct = response.body.product as Product
      expect(updatedProduct.name).toBe('Nome Novo')
      expect(updatedProduct.categoryId).toBe(cat2Id)
    })

    it('should return 403 when a non-admin tries to delete a product', async () => {
      const { token } = await createAndAuthenticateUser('USER')
      // UUID fake válido
      const fakeId = '00000000-0000-0000-0000-000000000000'

      const response = await request(app.server)
        .delete(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })

    it('should be able to remove a specific image', async () => {
      const { token } = await createAndAuthenticateUser('ADMIN')
      const categoryId = await createCategory(token)

      const product = await prisma.product.create({
        data: {
          name: 'Produto com Imagem',
          description: 'Descricao valida para teste',
          material: 'Metal',
          productionTime: 3,
          price: 80,
          category: { connect: { id: categoryId } },
          images: { create: { name: 'Delete-me', url: 'https://del.jpg' } },
        },
        include: { images: true },
      })

      const imageId = product.images[0]?.id
      if (!imageId) throw new Error('Image ID was not created by Prisma')

      const response = await request(app.server)
        .delete(`/api/v1/products/images/${imageId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)

      const imageCheck = await prisma.productImage.findUnique({ where: { id: imageId } })
      expect(imageCheck).toBeNull()
    })
  })
})
