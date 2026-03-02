import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import * as cartsController from './carts.controller.js'
import { addToCartSchema, updateCartItemSchema, cartItemParamsSchema } from './carts.schema.js'

export async function cartsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Adicionar item ao carrinho
   * POST /carts
   */
  router.post(
    '/carts',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['carts'],
        summary: 'Add a product to the cart',
        body: addToCartSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            cart: z.any(), // O Service já retorna o CartResponse estruturado
          }),
        },
      },
    },
    cartsController.addItem,
  )

  /**
   * ROTA: Buscar carrinho do usuário logado
   * GET /carts/me
   */
  router.get(
    '/carts/me',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['carts'],
        summary: 'Get current user active cart',
        response: {
          [StatusCodes.OK]: z.object({
            cart: z.any().nullable(),
          }),
        },
      },
    },
    cartsController.getMyCart,
  )

  /**
   * ROTA: Atualizar quantidade de um item
   * PATCH /carts/item/:itemId
   */
  router.patch(
    '/carts/item/:itemId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['carts'],
        summary: 'Update item quantity in cart',
        params: cartItemParamsSchema,
        body: updateCartItemSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            cart: z.any(),
          }),
        },
      },
    },
    cartsController.updateQuantity,
  )

  /**
   * ROTA: Remover item específico
   * DELETE /carts/item/:itemId
   */
  router.delete(
    '/carts/item/:itemId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['carts'],
        summary: 'Remove an item from the cart',
        params: cartItemParamsSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            cart: z.any(),
          }),
        },
      },
    },
    cartsController.removeItem,
  )

  /**
   * ROTA: Esvaziar carrinho
   * DELETE /carts/me
   */
  router.delete(
    '/carts/me',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['carts'],
        summary: 'Clear all items from active cart',
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    cartsController.clearMyCart,
  )
}
