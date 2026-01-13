import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

describe('Users & Auth E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // Garante isolamento: limpa os usuários antes de cada teste
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be able to register a new user', async () => {
    const response = await request(app.server).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toEqual(StatusCodes.CREATED)
    expect(response.body).toEqual({
      userId: expect.any(String),
    })
  })

  it('should not be able to register with duplicated email', async () => {
    // Cria o primeiro
    await request(app.server).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    // Tenta criar o segundo igual
    const response = await request(app.server).post('/api/v1/users').send({
      name: 'John Duplicate',
      email: 'john@example.com',
      password: 'otherpassword',
    })

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT)
    expect(response.body.message).toEqual('User already exists')
  })

  it('should be able to authenticate (login) and get a JWT token', async () => {
    // 1. Cria o usuário
    await request(app.server).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    // 2. Faz login
    const response = await request(app.server).post('/api/v1/sessions').send({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to login with wrong credentials', async () => {
    // 1. Cria o usuário
    await request(app.server).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    // 2. Tenta login com senha errada
    const response = await request(app.server).post('/api/v1/sessions').send({
      email: 'john@example.com',
      password: 'WRONG_PASSWORD',
    })

    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
  })
})
