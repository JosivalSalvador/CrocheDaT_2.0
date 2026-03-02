import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as categoriesService from './categories.service.js'
import type { CategoryInput } from './categories.types.js'

/**
 * CRIAR CATEGORIA (Admin)
 */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CategoryInput
  const { category } = await categoriesService.createCategory(body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Category created successfully.',
    category,
  })
}

/**
 * LISTAR TODAS (Público)
 */
export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { categories } = await categoriesService.listCategories()
  return reply.status(StatusCodes.OK).send({ categories })
}

/**
 * BUSCAR POR ID (Público/Admin)
 */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const { category } = await categoriesService.getCategoryById(id)

  return reply.status(StatusCodes.OK).send({ category })
}

/**
 * ATUALIZAR CATEGORIA (Admin)
 */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const body = request.body as CategoryInput
  const { category } = await categoriesService.updateCategory(id, body)

  return reply.status(StatusCodes.OK).send({
    message: 'Category updated successfully.',
    category,
  })
}

/**
 * DELETAR CATEGORIA (Admin)
 */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  await categoriesService.deleteCategory(id)

  return reply.status(StatusCodes.NO_CONTENT).send()
}
