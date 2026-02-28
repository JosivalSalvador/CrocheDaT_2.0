import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { hash } from 'bcryptjs'
import { randomBytes } from 'node:crypto'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

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

  describe('POST /api/v1/sessions/logout (Logout)', () => {
    it('should clear refreshToken cookie and delete token from database', async () => {
      const email = generateUniqueEmail('logout.test')
      const password = 'Password123!'

      // 1. Criar usuário para o teste
      const user = await prisma.user.create({
        data: {
          name: 'Logout User',
          email,
          password_hash: await hash(password, 6),
        },
      })

      const agent = request.agent(app.server)

      // 2. Realizar Login
      const loginResponse = await agent.post('/api/v1/sessions').send({ email, password })

      expect(loginResponse.statusCode).toBe(StatusCodes.OK)

      // 3. Buscar o token gerado para validar o ID
      const tokenBefore = await prisma.token.findFirst({
        where: { userId: user.id },
      })

      // Validação de segurança para o TypeScript:
      // Se não houver token, o teste falha aqui e não tenta acessar .id
      if (!tokenBefore) {
        throw new Error('Token was not created in database during login')
      }

      // Agora o TS sabe que tokenId é obrigatoriamente uma string
      const tokenId: string = tokenBefore.id

      // 4. Executar Logout
      const logoutResponse = await agent.post('/api/v1/sessions/logout')

      // Asserções
      expect(logoutResponse.statusCode).toBe(StatusCodes.NO_CONTENT)

      // Verifica se o cookie de limpeza foi enviado no header
      const cookiesHeader = logoutResponse.headers['set-cookie']
      expect(cookiesHeader?.[0]).toContain('refreshToken=;')

      // 5. Verificar se o token sumiu do banco de dados
      const tokenAfter = await prisma.token.findUnique({
        where: { id: tokenId }, // O erro de "string | undefined" sumiu!
      })

      expect(tokenAfter).toBeNull()
    })

    it('should return NO_CONTENT even if cookie is missing (idempotency)', async () => {
      // Testa se o sistema aguenta um logout "vazio" sem dar erro 500
      const response = await request(app.server).post('/api/v1/sessions/logout')

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
    })
  })
})
