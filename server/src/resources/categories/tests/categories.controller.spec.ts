import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { Role } from '@prisma/client' // ← ADICIONADO: Importando o Enum oficial
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Helper para nomes únicos
 */
const generateUniqueName = (base: string) => `${base}-${randomBytes(4).toString('hex')}`

/**
 * Helper de Autenticação (Reutilizando seu padrão)
 */
interface AuthSession {
  token: string
  userId: string
}

// ← ATUALIZADO: Usando o Enum do Prisma como tipo do argumento
async function createAndAuthenticateUser(role: Role = Role.USER): Promise<AuthSession> {
  const email = `test-${randomBytes(4).toString('hex')}@example.com`
  const password = 'Password123!'

  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Test User',
    email,
    password,
  })

  const userId = registerResponse.body.userId

  // Atualiza no banco caso precisemos de um perfil superior
  if (role !== Role.USER) {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
  }

  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  return { token: authResponse.body.token, userId }
}

describe('Categories Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Fluxo Público (GET)', () => {
    it('should be able to list categories without authentication', async () => {
      await prisma.category.create({ data: { name: generateUniqueName('Public List') } })

      const response = await request(app.server).get('/api/v1/categories')

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(Array.isArray(response.body.categories)).toBe(true)

      // ← ADICIONADO: Valida se o formato da lista bate com o categoryResponseSchema
      if (response.body.categories.length > 0) {
        const firstCategory = response.body.categories[0]
        expect(firstCategory).toHaveProperty('id')
        expect(firstCategory).toHaveProperty('name')
      }
    })

    it('should be able to get a category by ID', async () => {
      const category = await prisma.category.create({ data: { name: generateUniqueName('GetByID') } })

      const response = await request(app.server).get(`/api/v1/categories/${category.id}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.category).toBeDefined()
      expect(response.body.category.id).toBe(category.id)
      expect(response.body.category.name).toBe(category.name)
    })
  })

  describe('Fluxo Administrativo (POST/PATCH/DELETE)', () => {
    it('should return 403 when a regular user tries to create a category', async () => {
      const { token } = await createAndAuthenticateUser(Role.USER) // ← Enum

      const response = await request(app.server)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Unauthorized' })

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })

    it('should allow an admin to create, update and delete a category', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN) // ← Enum
      const categoryName = generateUniqueName('Admin CRUD')

      // 1. CREATE
      const createRes = await request(app.server)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: categoryName })

      expect(createRes.statusCode).toBe(StatusCodes.CREATED)
      expect(createRes.body.category).toBeDefined()
      expect(createRes.body.category).toHaveProperty('id')
      expect(createRes.body.category).toHaveProperty('name')

      const categoryId: string = createRes.body.category.id // ← Tipagem forçada para as próximas rotas

      // 2. UPDATE
      const updateRes = await request(app.server)
        .patch(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: categoryName + ' Updated' })

      expect(updateRes.statusCode).toBe(StatusCodes.OK)
      expect(updateRes.body.category.name).toContain('Updated')

      // 3. DELETE
      const deleteRes = await request(app.server)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(deleteRes.statusCode).toBe(StatusCodes.NO_CONTENT)

      // 4. VERIFY DELETED
      const verifyRes = await request(app.server).get(`/api/v1/categories/${categoryId}`)
      expect(verifyRes.statusCode).toBe(StatusCodes.NOT_FOUND)
    })

    it('should return 400 when creating a category with an invalid name', async () => {
      const { token } = await createAndAuthenticateUser(Role.ADMIN)

      const response = await request(app.server)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'ab' }) // Zod exige min 3 caracteres

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(response.body.message).toBeDefined()
    })
  })
})
