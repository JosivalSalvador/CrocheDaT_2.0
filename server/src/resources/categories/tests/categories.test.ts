import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

describe('Categories E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // Garante isolamento dos testes
  beforeEach(async () => {
    await prisma.category.deleteMany()
  })

  it('should be able to create a new category', async () => {
    const response = await request(app.server).post('/api/v1/categories').send({
      name: 'Amigurumi',
    })

    expect(response.statusCode).toEqual(StatusCodes.CREATED)
    expect(response.body).toEqual({
      categoryId: expect.any(String),
    })
  })

  it('should not be able to create a duplicated category', async () => {
    // Cria a primeira
    await request(app.server).post('/api/v1/categories').send({ name: 'Amigurumi' })

    // Tenta criar a segunda igual
    const response = await request(app.server).post('/api/v1/categories').send({
      name: 'Amigurumi',
    })

    expect(response.statusCode).toEqual(StatusCodes.CONFLICT)
    expect(response.body.message).toEqual('Category already exists')
  })

  it('should be able to list categories', async () => {
    await prisma.category.create({ data: { name: 'Barbante' } })

    const response = await request(app.server).get('/api/v1/categories')

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toEqual(expect.objectContaining({ name: 'Barbante' }))
  })
})
