import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import * as cartsController from './carts.controller.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'
// Importando os schemas estruturados
import { addToCartSchema, updateCartItemSchema, cartItemParamsSchema, cartResponseSchema } from './carts.schema.js'

export async function cartsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Adicionar item ao carrinho
   */
  router.post(
    '/carts',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['carts'],
        summary: 'Add a product to the cart',
        body: addToCartSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            cart: cartResponseSchema, // Tipado!
          }),
        },
      },
    },
    cartsController.addItem,
  )

  /**
   * ROTA: Buscar carrinho do usuário logado
   */
  router.get(
    '/carts/me',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['carts'],
        summary: 'Get current user active cart',
        response: {
          [StatusCodes.OK]: z.object({
            cart: cartResponseSchema.nullable(), // Tipado e permite nulo
          }),
        },
      },
    },
    cartsController.getMyCart,
  )

  /**
   * ROTA: Atualizar quantidade de um item
   */
  router.patch(
    '/carts/item/:itemId',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['carts'],
        summary: 'Update item quantity in cart',
        params: cartItemParamsSchema,
        body: updateCartItemSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            cart: cartResponseSchema, // Tipado!
          }),
        },
      },
    },
    cartsController.updateQuantity,
  )

  /**
   * ROTA: Remover item específico
   */
  router.delete(
    '/carts/item/:itemId',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
      schema: {
        tags: ['carts'],
        summary: 'Remove an item from the cart',
        params: cartItemParamsSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            cart: cartResponseSchema, // Tipado!
          }),
        },
      },
    },
    cartsController.removeItem,
  )

  /**
   * ROTA: Esvaziar carrinho
   */
  router.delete(
    '/carts/me',
    {
      onRequest: [verifyJwt, verifyUserRole('USER')],
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

  /**
   * ROTA: Buscar detalhes de um carrinho específico (Admin/Suporte)
   */
  router.get(
    '/carts/:itemId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN', 'SUPPORTER')],
      schema: {
        tags: ['admin'],
        summary: 'Get specific cart details (Admin/Support only)',
        params: cartItemParamsSchema,
        response: {
          [StatusCodes.OK]: z.object({
            cart: cartResponseSchema, // Tipado!
          }),
        },
      },
    },
    cartsController.getCartDetail,
  )
}
