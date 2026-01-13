import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as categoriesService from './categories.service.js'
import type { CreateCategoryInput } from './categories.schema.js'

export async function create(request: FastifyRequest<{ Body: CreateCategoryInput }>, reply: FastifyReply) {
  const { name } = request.body

  const category = await categoriesService.createCategory({ name })

  return reply.status(StatusCodes.CREATED).send({ categoryId: category.id })
}

export async function list(_: FastifyRequest, reply: FastifyReply) {
  const categories = await categoriesService.getAllCategories()

  return reply.status(StatusCodes.OK).send(categories)
}
