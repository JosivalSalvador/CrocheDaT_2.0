import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { hash } from 'bcryptjs'
import { randomBytes } from 'node:crypto' // Import para unicidade
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

// Função para garantir que nenhum teste atropele o outro
function generateUniqueEmail(base: string) {
  return `${base}-${randomBytes(4).toString('hex')}@example.com`
}

describe('Refresh Token Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('PATCH /api/v1/token/refresh', () => {
    it('should be able to refresh token using cookie (and rotate it)', async () => {
      process.env.NODE_ENV = 'development'
      const uniqueEmail = generateUniqueEmail('john.refresh.ctrl')

      // REMOVIDO: deleteMany

      await prisma.user.create({
        data: {
          name: 'John Doe',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const loginResponse = await request(app.server).post('/api/v1/sessions').send({
        email: uniqueEmail,
        password: 'Password123!',
      })

      const loginCookies = loginResponse.headers['set-cookie']

      if (!Array.isArray(loginCookies) || loginCookies.length === 0) {
        throw new Error('Login failed to return cookies')
      }

      const refreshResponse = await request(app.server)
        .patch('/api/v1/token/refresh')
        .set('Cookie', loginCookies)
        .send()

      expect(refreshResponse.statusCode).toBe(StatusCodes.OK)
      expect(refreshResponse.body.token).toEqual(expect.any(String))

      const refreshCookies = refreshResponse.headers['set-cookie']
      expect(refreshCookies).toBeDefined()
      expect(refreshCookies![0]).toContain('refreshToken=')
      // Verifica rotação (cookie novo diferente do antigo)
      expect(refreshCookies![0]).not.toEqual(loginCookies[0])
    })

    it('should set Secure cookie in production', async () => {
      process.env.NODE_ENV = 'production'
      const uniqueEmail = generateUniqueEmail('john.refresh.prod')

      await prisma.user.create({
        data: {
          name: 'John Prod',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const loginResponse = await request(app.server).post('/api/v1/sessions').send({
        email: uniqueEmail,
        password: 'Password123!',
      })

      const loginCookies = loginResponse.headers['set-cookie']

      const refreshResponse = await request(app.server)
        .patch('/api/v1/token/refresh')
        .set('Cookie', loginCookies!)
        .send()

      const refreshCookies = refreshResponse.headers['set-cookie']
      expect(refreshCookies![0]).toContain('Secure')
    })

    it('should not be able to refresh without cookie', async () => {
      const response = await request(app.server).patch('/api/v1/token/refresh').send()

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    })

    it('should not be able to refresh with invalid/fake cookie', async () => {
      const response = await request(app.server)
        .patch('/api/v1/token/refresh')
        .set('Cookie', ['refreshToken=fake-uuid-token; Path=/; HttpOnly'])
        .send()

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    })
  })
})
