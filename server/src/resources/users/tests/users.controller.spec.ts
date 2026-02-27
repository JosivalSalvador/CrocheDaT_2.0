import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

function generateUniqueEmail(base: string) {
  return `${base}-${randomBytes(4).toString('hex')}@example.com`
}

describe('Users Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/v1/users (Register)', () => {
    it('should be able to register a new user', async () => {
      const uniqueEmail = generateUniqueEmail('john.register')

      const response = await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'Password123!',
      })

      expect(response.statusCode).toEqual(StatusCodes.CREATED)
      expect(response.body.userId).toBeDefined()
      expect(response.body).not.toHaveProperty('password_hash')
    })

    it('should not register with duplicate email', async () => {
      const uniqueEmail = generateUniqueEmail('john.duplicate')

      await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'Password123!',
      })

      const response = await request(app.server).post('/api/v1/users').send({
        name: 'Another John',
        email: uniqueEmail,
        password: 'Password123!',
      })

      expect(response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it('should not register with invalid email format', async () => {
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'invalid-email-format',
        password: 'Password123!',
      })

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })

    it('should not register with weak password', async () => {
      const uniqueEmail = generateUniqueEmail('john.weak')
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'weak',
      })

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })

    it('should ignore injected role and create user as USER (Security Check)', async () => {
      const uniqueEmail = generateUniqueEmail('hacker.role')

      // 1. PRIMEIRO: Cria o usuário enviando um role malicioso
      await request(app.server).post('/api/v1/users').send({
        name: 'Hacker User',
        email: uniqueEmail,
        password: 'Password123!',
        role: 'ADMIN',
      })

      // 2. DEPOIS: Busca no banco para ver se o sistema ignorou o ADMIN e usou o default
      const userInDb = await prisma.user.findUnique({
        where: { email: uniqueEmail },
      })

      expect(userInDb).toBeDefined()
      // Verificamos se o role é 'USER'.
      // Se der undefined de novo, cheque se o nome no schema.prisma é 'role'
      expect(userInDb?.role).toBe('USER')
    })
  })
})
