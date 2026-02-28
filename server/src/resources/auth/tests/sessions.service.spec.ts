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
      const password = 'Password123!'
      const uniqueEmail = generateUniqueEmail('john.session')

      // Criamos o usuário e guardamos o retorno para validar o ID depois
      const user = await prisma.user.create({
        data: {
          name: 'John Session',
          email: uniqueEmail,
          password_hash: await hash(password, 6),
        },
      })

      // Executamos a autenticação
      const result = await authenticateUser({
        email: uniqueEmail,
        password,
      })

      // Asserções
      expect(result.user.id).toEqual(user.id)
      expect(result.user.email).toEqual(uniqueEmail)

      const token = await prisma.token.findUnique({
        where: { id: result.refreshToken },
      })

      expect(token).not.toBeNull()
      expect(token?.userId).toEqual(user.id)
      expect(token?.type).toEqual(TokenType.REFRESH_TOKEN)
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

      await expect(
        authenticateUser({
          email: uniqueEmail,
          password: 'WrongPassword',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })
  })

  describe('signOut', () => {
    it('should delete token if it exists in database', async () => {
      const email = generateUniqueEmail('logout.success')
      const password = 'Password123!'

      // AJUSTE: Criamos o registro no banco sem declarar uma variável 'user'
      // que não seria lida, evitando o erro de lint/TS.
      await prisma.user.create({
        data: {
          name: 'Logout User',
          email,
          password_hash: await hash(password, 6),
        },
      })

      // 1. Gera um token através do login
      const { refreshToken } = await authenticateUser({
        email,
        password,
      })

      // 2. Tenta remover
      await signOut(refreshToken)

      // 3. Valida que sumiu do banco
      const token = await prisma.token.findUnique({
        where: { id: refreshToken },
      })

      expect(token).toBeNull()
    })

    it('should not throw error if token does not exist (idempotency)', async () => {
      /**
       * Este teste valida o bloco .catch que trata o erro P2025 do Prisma.
       * O signOut deve resolver com sucesso mesmo que o ID seja inválido.
       */
      const nonExistingTokenId = randomUUID()

      await expect(signOut(nonExistingTokenId)).resolves.not.toThrow()
    })
  })
})
