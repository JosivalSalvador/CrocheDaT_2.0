import { describe, it, expect } from 'vitest'
import { TokenType } from '@prisma/client'
import { randomBytes, randomUUID } from 'node:crypto'
import { prisma } from '../../../lib/prisma.js'
import { refreshUserToken } from '../refresh.service.js'

function generateUniqueEmail(base: string) {
  const hashString = randomBytes(4).toString('hex')
  return `${base}-${hashString}@test.com`
}

describe('Refresh Token Service (Integration)', () => {
  describe('refreshUserToken', () => {
    it('should refresh token with rotation', async () => {
      const uniqueEmail = generateUniqueEmail('john.refresh')
      const user = await prisma.user.create({
        data: {
          name: 'John Refresh',
          email: uniqueEmail,
          password_hash: 'hash',
        },
      })

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 10)

      const oldToken = await prisma.token.create({
        data: {
          type: TokenType.REFRESH_TOKEN,
          userId: user.id,
          expiresAt: futureDate,
        },
      })

      const result = await refreshUserToken(oldToken.id)

      expect(result.user.id).toEqual(user.id)
      expect(result.refreshToken).not.toEqual(oldToken.id)

      const oldTokenCheck = await prisma.token.findUnique({
        where: { id: oldToken.id },
      })
      expect(oldTokenCheck).toBeNull()

      const newTokenCheck = await prisma.token.findUnique({
        where: { id: result.refreshToken },
      })
      expect(newTokenCheck).not.toBeNull()
    })

    it('should fail if token does not exist', async () => {
      // Quando o ID não existe no banco
      await expect(refreshUserToken(randomUUID())).rejects.toThrow('Refresh token not found or expired.')
    })

    it('should fail if token expired', async () => {
      const uniqueEmail = generateUniqueEmail('john.expired')
      const user = await prisma.user.create({
        data: {
          name: 'John Expired',
          email: uniqueEmail,
          password_hash: 'hash',
        },
      })

      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() - 1)

      const expiredToken = await prisma.token.create({
        data: {
          type: TokenType.REFRESH_TOKEN,
          userId: user.id,
          expiresAt: expiredDate,
        },
      })

      // Ajustado para a mensagem real do seu serviço
      await expect(refreshUserToken(expiredToken.id)).rejects.toThrow('Refresh token expired.')
    })

    it('should fail if token type invalid', async () => {
      const uniqueEmail = generateUniqueEmail('john.invalid')
      const user = await prisma.user.create({
        data: {
          name: 'John Invalid',
          email: uniqueEmail,
          password_hash: 'hash',
        },
      })

      const invalidToken = await prisma.token.create({
        data: {
          type: TokenType.PASSWORD_RESET,
          userId: user.id,
          expiresAt: new Date(Date.now() + 86400000),
        },
      })

      // Ajustado para a mensagem real do seu serviço
      await expect(refreshUserToken(invalidToken.id)).rejects.toThrow('Invalid token type.')
    })
  })
})
