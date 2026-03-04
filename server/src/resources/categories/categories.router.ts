import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
// 1. Importamos o schema de resposta que criamos
import { categorySchema, categoryIdSchema, categoryResponseSchema } from './categories.schema.js'
import * as categoriesController from './categories.controller.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

export async function categoriesRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Listar todas as categorias
   * GET /categories (Público)
   */
  router.get(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        summary: 'List all categories',
        response: {
          [StatusCodes.OK]: z.object({
            categories: z.array(categoryResponseSchema), // 2. Trocamos o inline por ele aqui
          }),
        },
      },
    },
    categoriesController.list,
  )

  /**
   * ROTA: Buscar categoria por ID
   * GET /categories/:id (Público)
   */
  router.get(
    '/categories/:id',
    {
      schema: {
        tags: ['categories'],
        summary: 'Get category by ID',
        params: categoryIdSchema,
        response: {
          [StatusCodes.OK]: z.object({
            category: categoryResponseSchema, // 2. E aqui
          }),
        },
      },
    },
    categoriesController.getById,
  )

  /**
   * ROTA: Criar categoria
   * POST /categories (Admin only)
   */
  router.post(
    '/categories',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Create a new category (Admin only)',
        body: categorySchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            category: categoryResponseSchema, // 2. E aqui
          }),
        },
      },
    },
    categoriesController.create,
  )

  /**
   * ROTA: Atualizar categoria
   * PATCH /categories/:id (Admin only)
   */
  router.patch(
    '/categories/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Update category name (Admin only)',
        params: categoryIdSchema,
        body: categorySchema,
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
            category: categoryResponseSchema, // 2. E aqui
          }),
        },
      },
    },
    categoriesController.update,
  )

  /**
   * ROTA: Deletar categoria
   * DELETE /categories/:id (Admin only)
   */
  router.delete(
    '/categories/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Delete category (Admin only)',
        params: categoryIdSchema,
        response: {
          [StatusCodes.NO_CONTENT]: z.null().describe('No content'),
        },
      },
    },
    categoriesController.remove,
  )
}
