import { describe, it, expect } from 'vitest'
import { hash } from 'bcryptjs'
import { TokenType } from '@prisma/client'
import { randomBytes, randomUUID } from 'node:crypto'
import { prisma } from '../../../lib/prisma.js'
import { AppError } from '../../../errors/app-error.js'
import { authenticateUser, signOut } from '../sessions.service.js'

function generateUniqueEmail(base: string) {
  const hashString = randomBytes(4).toString('hex')
  return `${base}-${hashString}@test.com`
}

describe('Sessions Service (Integration)', () => {
  describe('authenticateUser', () => {
    it('should be able to authenticate and save refresh token in DB', async () => {
      const passwordHash = await hash('Password123!', 10)
      const uniqueEmail = generateUniqueEmail('john.session')

      // Criamos o usuário
      const user = await prisma.user.create({
        data: {
          name: 'John Session',
          email: uniqueEmail,
          password_hash: passwordHash,
        },
      })

      // AJUSTE CRÍTICO: Garantimos que o usuário está "visível" para outras consultas
      // Isso evita o erro de Foreign Key em ambientes altamente paralelos.
      const checkUser = await prisma.user.findUnique({ where: { id: user.id } })
      if (!checkUser) throw new Error('User failed to persist')

      // Executamos a autenticação
      const result = await authenticateUser({
        email: user.email,
        password: 'Password123!',
      })

      // Asserções
      expect(result.user.id).toEqual(user.id)
      expect(result.user.email).toEqual(user.email)

      const token = await prisma.token.findUnique({
        where: { id: result.refreshToken },
      })

      expect(token).not.toBeNull()
      expect(token?.userId).toEqual(user.id)
      expect(token?.type).toEqual(TokenType.REFRESH_TOKEN)
    })

    it('should not authenticate with wrong password', async () => {
      const passwordHash = await hash('Password123!', 10)
      const uniqueEmail = generateUniqueEmail('john.wrong')

      await prisma.user.create({
        data: {
          name: 'John Wrong',
          email: uniqueEmail,
          password_hash: passwordHash,
        },
      })

      await expect(
        authenticateUser({
          email: uniqueEmail,
          password: 'WrongPassword',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })

    it('should not authenticate with non-existing email', async () => {
      const ghostEmail = `ghost-${randomUUID()}@test.com`

      await expect(
        authenticateUser({
          email: ghostEmail,
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })
  })

  describe('signOut', () => {
    it('should delete token if it exists', async () => {
      const passwordHash = await hash('Password123!', 10)
      const uniqueEmail = generateUniqueEmail('john.logout')

      const user = await prisma.user.create({
        data: {
          name: 'John Logout',
          email: uniqueEmail,
          password_hash: passwordHash,
        },
      })

      const { refreshToken } = await authenticateUser({
        email: user.email,
        password: 'Password123!',
      })

      await signOut(refreshToken)

      const token = await prisma.token.findUnique({
        where: { id: refreshToken },
      })

      expect(token).toBeNull()
    })

    it('should not throw if token does not exist', async () => {
      const randomTokenId = randomUUID()
      await expect(signOut(randomTokenId)).resolves.not.toThrow()
    })
  })
})
