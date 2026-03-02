import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as productsService from './products.service.js'
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductParams,
  AddImageInput,
  ImageParams,
} from './products.types.js'

/**
 * CRIAR PRODUTO (Admin)
 */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateProductInput
  const { product } = await productsService.createProduct(body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Product created successfully.',
    product,
  })
}

/**
 * BUSCAR POR ID (Público)
 */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams
  const { product } = await productsService.getProductById(id)

  return reply.status(StatusCodes.OK).send({ product })
}

/**
 * LISTAR TODOS (Público)
 */
export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { products } = await productsService.listAllProducts()

  return reply.status(StatusCodes.OK).send({ products })
}

/**
 * ATUALIZAR DADOS DO PRODUTO (Admin)
 */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams
  const body = request.body as UpdateProductInput
  const { product } = await productsService.updateProduct(id, body)

  return reply.status(StatusCodes.OK).send({
    message: 'Product updated successfully.',
    product,
  })
}

/**
 * ADICIONAR NOVA IMAGEM AO PRODUTO (Admin)
 */
export async function addImage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams
  const body = request.body as AddImageInput

  const { image } = await productsService.addProductImage(id, body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Image added successfully.',
    image,
  })
}

/**
 * REMOVER IMAGEM ESPECÍFICA (Admin)
 */
export async function removeImage(request: FastifyRequest, reply: FastifyReply) {
  const { imageId } = request.params as ImageParams

  await productsService.removeProductImage(imageId)

  return reply.status(StatusCodes.NO_CONTENT).send()
}

/**
 * DELETAR PRODUTO COMPLETO (Admin)
 */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as ProductParams
  await productsService.deleteProduct(id)

  return reply.status(StatusCodes.NO_CONTENT).send()
}
