import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { TokenType } from '@prisma/client'
import { prisma } from '../../../lib/prisma.js' // Prisma REAL
import { AppError } from '../../../errors/app-error.js'
import { registerUser, authenticateUser, refreshUserToken } from '../users.service.js'

describe('Users Service (Integration)', () => {
  // LIMPEZA DO BANCO
  // Garante que cada teste comece do zero, sem lixo de testes anteriores.
  beforeEach(async () => {
    // A ordem importa: deletar Tokens antes de Users (embora o Cascade resolva, é mais seguro assim)
    await prisma.token.deleteMany()
    await prisma.user.deleteMany()
  })

  // --- SUITE: REGISTER ---
  describe('registerUser', () => {
    it('should be able to register a new user', async () => {
      const { user } = await registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // Verifica retorno da função
      expect(user.id).toBeDefined()
      expect(user.role).toEqual('USER') // Valor default do Schema
      expect(user).not.toHaveProperty('password_hash') // Garante que não vazamos o hash

      // PROVA REAL: Verifica se salvou no Postgres
      const userInDb = await prisma.user.findUnique({
        where: { email: 'john@example.com' },
      })
      expect(userInDb).toBeTruthy()
      expect(userInDb?.name).toEqual('John Doe')
    })

    it('should not register user with duplicate email', async () => {
      // 1. Cria o primeiro usuário
      await registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // 2. Tenta criar o segundo com mesmo e-mail
      await expect(() =>
        registerUser({
          name: 'Another John',
          email: 'john@example.com',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })
  })

  // --- SUITE: AUTHENTICATE ---
  describe('authenticateUser', () => {
    it('should be able to authenticate and save refresh token in DB', async () => {
      // 1. Setup: Inserir usuário no banco (simulando um user já registrado)
      const passwordHash = await hash('Password123!', 6)
      await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password_hash: passwordHash,
        },
      })

      // 2. Act: Tentar logar
      const result = await authenticateUser({
        email: 'john@example.com',
        password: 'Password123!',
      })

      // 3. Assert: Verificar retorno
      expect(result.user.id).toBeDefined()
      expect(result.refreshToken).toBeDefined()

      // PROVA REAL: Verificar se o token foi salvo na tabela 'Token'
      const tokenInDb = await prisma.token.findUnique({
        where: { id: result.refreshToken },
      })

      expect(tokenInDb).toBeTruthy()
      expect(tokenInDb?.type).toEqual(TokenType.REFRESH_TOKEN)
      expect(tokenInDb?.userId).toEqual(result.user.id)
    })

    it('should not authenticate with wrong password', async () => {
      // 1. Setup
      const passwordHash = await hash('Password123!', 6)
      await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password_hash: passwordHash,
        },
      })

      // 2. Act & Assert
      await expect(() =>
        authenticateUser({
          email: 'john@example.com',
          password: 'WrongPassword',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })

    it('should not authenticate with non-existing email', async () => {
      await expect(() =>
        authenticateUser({
          email: 'ghost@example.com',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(AppError)
    })
  })

  // --- SUITE: REFRESH TOKEN ---
  describe('refreshUserToken', () => {
    it('should be able to refresh a token (rotate strategy)', async () => {
      // 1. Setup: Criar Usuário
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password_hash: 'hash',
        },
      })

      // 2. Setup: Criar Token Antigo no Banco
      const oldToken = await prisma.token.create({
        data: {
          type: TokenType.REFRESH_TOKEN,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // +7 dias
        },
      })

      // 3. Act: Executar Refresh
      const result = await refreshUserToken(oldToken.id)

      // 4. Assert: Verificar novo token
      expect(result.refreshToken).toBeDefined()
      expect(result.refreshToken).not.toEqual(oldToken.id) // Deve ser diferente (Rotação)

      // PROVA REAL: O token antigo deve ter sido DELETADO do banco
      const oldTokenCheck = await prisma.token.findUnique({
        where: { id: oldToken.id },
      })
      expect(oldTokenCheck).toBeNull()

      // PROVA REAL: O novo token deve existir
      const newTokenCheck = await prisma.token.findUnique({
        where: { id: result.refreshToken },
      })
      expect(newTokenCheck).toBeTruthy()
      expect(newTokenCheck?.userId).toEqual(user.id)
    })

    it('should not refresh if token does not exist', async () => {
      await expect(() => refreshUserToken('non-existing-uuid-123')).rejects.toBeInstanceOf(AppError)
    })

    it('should not refresh if token is expired', async () => {
      // 1. Setup: Criar Usuário
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password_hash: 'hash',
        },
      })

      // 2. Setup: Criar Token VENCIDO no Banco (Ontem)
      const expiredToken = await prisma.token.create({
        data: {
          type: TokenType.REFRESH_TOKEN,
          userId: user.id,
          expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // -1 dia
        },
      })

      // 3. Act & Assert: Deve dar erro
      await expect(() => refreshUserToken(expiredToken.id)).rejects.toBeInstanceOf(AppError)

      // 4. Verificação extra: A função deve limpar o token expirado do banco
      const tokenCheck = await prisma.token.findUnique({
        where: { id: expiredToken.id },
      })
      expect(tokenCheck).toBeNull()
    })
  })
})
