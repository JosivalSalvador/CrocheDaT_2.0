import { describe, it, expect } from 'vitest'
import { compare } from 'bcryptjs'
import { randomBytes } from 'node:crypto' // Para garantir unicidade
import { prisma } from '../../../lib/prisma.js'
import { registerUser } from '../users.service.js'
import { StatusCodes } from 'http-status-codes'

// Função auxiliar para evitar colisões entre testes
function generateUniqueEmail(base: string) {
  return `${base}-${randomBytes(4).toString('hex')}@example.com`
}

describe('Users Service (Integration)', () => {
  // REMOVIDO: o beforeEach com deleteMany() global

  describe('registerUser', () => {
    it('should be able to register a new user', async () => {
      const uniqueEmail = generateUniqueEmail('john.service')

      const { user } = await registerUser({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'Password123!',
      })

      expect(user.id).toBeDefined()
      expect(user.email).toEqual(uniqueEmail)

      const userInDb = await prisma.user.findUnique({
        where: { email: uniqueEmail },
      })

      expect(userInDb).toBeTruthy()
      const isPasswordCorrect = await compare('Password123!', userInDb!.password_hash)
      expect(isPasswordCorrect).toBe(true)
    })

    it('should not register user with duplicate email', async () => {
      const uniqueEmail = generateUniqueEmail('john.duplicate')

      await registerUser({
        name: 'John Doe',
        email: uniqueEmail,
        password: 'Password123!',
      })

      await expect(
        registerUser({
          name: 'Another John',
          email: uniqueEmail,
          password: 'Password123!',
        }),
      ).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      })

      const usersCount = await prisma.user.count({
        where: { email: uniqueEmail },
      })

      expect(usersCount).toEqual(1)
    })
  })
})
