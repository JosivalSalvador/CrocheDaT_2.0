import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import type { FastifySchemaValidationError } from 'fastify'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

describe('Users Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // Limpeza em ordem para respeitar FKs
    await prisma.token.deleteMany()
    await prisma.user.deleteMany()
  })

  // --- 1. REGISTRO (REGISTER) ---
  describe('POST /users (Register)', () => {
    it('should be able to register a new user', async () => {
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      expect(response.statusCode).toEqual(StatusCodes.CREATED)
      expect(response.body).toEqual({
        message: 'User created successfully.',
        userId: expect.any(String),
      })
    })

    it('should not register with duplicate email', async () => {
      // Cria o primeiro
      await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // Tenta o segundo
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'Another John',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // O ErrorHandler pega o erro P2002 do Prisma e retorna 409
      expect(response.statusCode).toEqual(StatusCodes.CONFLICT)
      expect(response.body.message).toContain('already exists')
    })

    it('should not register with weak password (Zod Validation)', async () => {
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak', // Falha no regex e no length
      })

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body.message).toEqual('Validation error')

      // Usando o tipo oficial do Fastify para garantir tipagem correta
      const errors = response.body.errors as FastifySchemaValidationError[]
      expect(Array.isArray(errors)).toBe(true)

      const passwordError = errors.find((err) => err.instancePath.includes('password'))

      expect(passwordError).toBeDefined()
    })

    // --- NOVO TESTE DE SEGURANÇA (CORRIGIDO) ---
    it('should register as USER even if role ADMIN is provided (Security Check)', async () => {
      const email = 'hacker@example.com'

      // Tenta injetar role: 'ADMIN' no corpo da requisição
      const response = await request(app.server).post('/api/v1/users').send({
        name: 'Hacker User',
        email,
        password: 'Password123!',
        role: 'ADMIN', // O Zod ignora isso e o Prisma usa o default
      })

      // O cadastro deve ocorrer com sucesso (201)
      expect(response.statusCode).toEqual(StatusCodes.CREATED)

      // Verificação direta no banco de dados
      const userInDb = await prisma.user.findUnique({
        where: { email },
      })

      expect(userInDb).toBeDefined()
      // CORREÇÃO: O seu banco usa 'USER' como padrão (definido no schema.prisma)
      expect(userInDb?.role).toEqual('USER')
    })
  })

  // --- 2. LOGIN (AUTHENTICATE) ---
  describe('POST /sessions (Login)', () => {
    it('should be able to authenticate and receive a JWT + Cookie', async () => {
      // 1. Setup: Criar usuário
      await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // 2. Act: Login
      const response = await request(app.server).post('/api/v1/sessions').send({
        email: 'john@example.com',
        password: 'Password123!',
      })

      expect(response.statusCode).toEqual(StatusCodes.OK)

      // Verifica JWT no corpo
      expect(response.body.token).toEqual(expect.any(String))

      // Captura os cookies
      const cookies = response.headers['set-cookie']

      // Type Guard: Garante que 'cookies' existe
      if (!cookies) {
        throw new Error('Cookies are missing from response headers')
      }

      // Agora o TS sabe que cookies é string[]
      expect(cookies).toHaveLength(1)

      const refreshTokenCookie = cookies[0]
      expect(refreshTokenCookie).toContain('refreshToken=')
      expect(refreshTokenCookie).toContain('HttpOnly')
      expect(refreshTokenCookie).toContain('Path=/')
    })

    it('should not authenticate with wrong password', async () => {
      // 1. Setup
      await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // 2. Act
      const response = await request(app.server).post('/api/v1/sessions').send({
        email: 'john@example.com',
        password: 'WrongPassword',
      })

      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    })
  })

  // --- 3. REFRESH TOKEN ---
  describe('PATCH /token/refresh', () => {
    it('should be able to refresh token using cookie (and rotate it)', async () => {
      // 1. Registro
      await request(app.server).post('/api/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })

      // 2. Login para ganhar o cookie
      const loginResponse = await request(app.server).post('/api/v1/sessions').send({
        email: 'john@example.com',
        password: 'Password123!',
      })

      const cookies = loginResponse.headers['set-cookie']

      // Type Guard antes de usar no .set()
      if (!cookies) {
        throw new Error('Cookies are missing from login response')
      }

      // 3. Chamada de Refresh enviando o Cookie
      const refreshResponse = await request(app.server).patch('/api/v1/token/refresh').set('Cookie', cookies).send()

      // Assert
      expect(refreshResponse.statusCode).toEqual(StatusCodes.OK)
      expect(refreshResponse.body.token).toEqual(expect.any(String)) // Novo JWT

      // Verifica se veio um NOVO cookie (Rotação)
      const newCookies = refreshResponse.headers['set-cookie']

      // Type Guard para novos cookies
      if (!newCookies) {
        throw new Error('New cookies are missing from refresh response')
      }

      expect(newCookies[0]).toContain('refreshToken=')
    })

    it('should not be able to refresh without cookie', async () => {
      const response = await request(app.server).patch('/api/v1/token/refresh').send()

      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body.message).toEqual('Refresh token missing.')
    })
  })
})
