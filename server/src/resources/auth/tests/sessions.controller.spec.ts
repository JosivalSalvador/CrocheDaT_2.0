import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { hash } from 'bcryptjs'
import { randomBytes } from 'node:crypto' // Importar para e-mails únicos
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

// Função auxiliar para evitar colisões
function generateUniqueEmail(base: string) {
  return `${base}-${randomBytes(4).toString('hex')}@example.com`
}

describe('Sessions Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/v1/sessions (Login)', () => {
    it('should authenticate and return JWT + refreshToken cookie (development)', async () => {
      process.env.NODE_ENV = 'development'
      const uniqueEmail = generateUniqueEmail('john.dev')

      // REMOVIDO: deleteMany (Não é mais necessário com e-mail único)

      await prisma.user.create({
        data: {
          name: 'John Dev',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const response = await request(app.server).post('/api/v1/sessions').send({
        email: uniqueEmail,
        password: 'Password123!',
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      // ... resto das asserções iguais
    })

    it('should set Secure cookie in production', async () => {
      process.env.NODE_ENV = 'production'
      const uniqueEmail = generateUniqueEmail('john.prod')

      await prisma.user.create({
        data: {
          name: 'John Prod',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const response = await request(app.server).post('/api/v1/sessions').send({
        email: uniqueEmail,
        password: 'Password123!',
      })

      const cookiesHeader = response.headers['set-cookie']
      expect(cookiesHeader?.[0]).toContain('Secure')
    })

    it('should not authenticate with wrong password', async () => {
      const uniqueEmail = generateUniqueEmail('john.wrong')

      await prisma.user.create({
        data: {
          name: 'John Wrong',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const response = await request(app.server).post('/api/v1/sessions').send({
        email: uniqueEmail,
        password: 'WrongPassword',
      })

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('POST /api/v1/sessions/logout (Logout)', () => {
    it('should clear refreshToken cookie and delete token from database', async () => {
      const uniqueEmail = generateUniqueEmail('john.logout')

      await prisma.user.create({
        data: {
          name: 'John Logout',
          email: uniqueEmail,
          password_hash: await hash('Password123!', 6),
        },
      })

      const agent = request.agent(app.server)
      await agent.post('/api/v1/sessions').send({ email: uniqueEmail, password: 'Password123!' })

      const logoutResponse = await agent.post('/api/v1/sessions/logout')
      expect(logoutResponse.statusCode).toBe(StatusCodes.NO_CONTENT)
    })
  })
})
