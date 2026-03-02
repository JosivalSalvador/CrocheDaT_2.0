import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

/** * Auxiliar para garantir unicidade nos testes e evitar colisões
 */
const generateUniqueEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@example.com`

/**
 * Interface para o retorno do helper de autenticação
 */
interface AuthSession {
  token: string
  userId: string
  email: string
}

async function createAndAuthenticateUser(role: 'USER' | 'ADMIN' = 'USER'): Promise<AuthSession> {
  const email = generateUniqueEmail('test')
  const password = 'Password123!'

  // Registro
  const registerResponse = await request(app.server).post('/api/v1/users').send({
    name: 'Test User',
    email,
    password,
  })

  const userId = registerResponse.body.userId

  if (role === 'ADMIN') {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    })
  }

  // Login
  const authResponse = await request(app.server).post('/api/v1/sessions').send({
    email,
    password,
  })

  return {
    token: authResponse.body.token,
    userId,
    email,
  }
}

describe('Users Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Autogestão (/me)', () => {
    it('should be able to get profile', async () => {
      const { token } = await createAndAuthenticateUser()

      const response = await request(app.server).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.user.id).toBeDefined()
    })

    it('should be able to delete account and clear cookies', async () => {
      const { token } = await createAndAuthenticateUser()

      const response = await request(app.server).delete('/api/v1/users/me').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)

      const cookies = response.get('Set-Cookie')
      expect(cookies).toBeDefined()
      // Garante que o array de cookies não é undefined antes de acessar o índice
      if (cookies) {
        expect(cookies[0]).toContain('refreshToken=;')
      }
    })
  })

  describe('Administração (/users)', () => {
    it('should return 403 when non-admin tries to list users', async () => {
      const { token } = await createAndAuthenticateUser('USER')

      const response = await request(app.server).get('/api/v1/users').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })

    it('should return 200 when admin lists users', async () => {
      const { token } = await createAndAuthenticateUser('ADMIN')

      const response = await request(app.server).get('/api/v1/users').set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(Array.isArray(response.body.users)).toBe(true)
    })

    it('should allow admin to change a user role', async () => {
      const admin = await createAndAuthenticateUser('ADMIN')
      const targetUser = await createAndAuthenticateUser('USER')

      const response = await request(app.server)
        .patch(`/api/v1/users/${targetUser.userId}/role`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({ role: 'SUPPORTER' })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(response.body.user.role).toBe('SUPPORTER')
    })
  })
})
