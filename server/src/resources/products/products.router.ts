import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  addImageSchema,
  imageIdParamSchema,
} from './products.schema.js'
import * as productsController from './products.controller.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

export async function productsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * GET /products - Vitrine pública
   */
  router.get(
    '/products',
    {
      schema: {
        tags: ['products'],
        summary: 'List all products with category and main image',
        response: {
          [StatusCodes.OK]: z.object({
            products: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                price: z.any(), // Decimal do Prisma
                category: z.object({ name: z.string() }),
                images: z.array(z.any()),
              }),
            ),
          }),
        },
      },
    },
    productsController.list,
  )

  /**
   * GET /products/:id - Detalhes públicos
   */
  router.get(
    '/products/:id',
    {
      schema: {
        tags: ['products'],
        summary: 'Get product details by ID',
        params: productIdSchema,
        response: {
          [StatusCodes.OK]: z.object({
            product: z.any(),
          }),
        },
      },
    },
    productsController.getById,
  )

  /**
   * POST /products - Criar Produto (Admin)
   */
  router.post(
    '/products',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Create a new product (Admin only)',
        body: createProductSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            product: z.object({
              id: z.uuid(),
              name: z.string(),
              images: z.array(z.any()).optional(),
            }),
          }),
        },
      },
    },
    productsController.create,
  )

  /**
   * PATCH /products/:id - Atualizar Dados/Categoria (Admin)
   */
  router.patch(
    '/products/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Update product information (Admin only)',
        params: productIdSchema,
        body: updateProductSchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            product: z.any(),
          }),
        },
      },
    },
    productsController.update,
  )

  /**
   * POST /products/:id/images - Adicionar Imagem (Admin)
   */
  router.post(
    '/products/:id/images',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Add a new image link to an existing product (Admin only)',
        params: productIdSchema,
        body: addImageSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            image: z.object({
              id: z.uuid(),
              name: z.string(),
              url: z.url(),
              productId: z.uuid(),
            }),
          }),
        },
      },
    },
    productsController.addImage,
  )

  /**
   * DELETE /products/images/:imageId - Remover Imagem (Admin)
   */
  router.delete(
    '/products/images/:imageId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Remove specific product image by ID (Admin only)',
        params: imageIdParamSchema,
        response: {
          [StatusCodes.NO_CONTENT]: z.null(),
        },
      },
    },
    productsController.removeImage,
  )

  /**
   * DELETE /products/:id - Deletar Produto (Admin)
   */
  router.delete(
    '/products/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Delete a product (Admin only)',
        params: productIdSchema,
        response: {
          [StatusCodes.NO_CONTENT]: z.null(),
        },
      },
    },
    productsController.remove,
  )
}
