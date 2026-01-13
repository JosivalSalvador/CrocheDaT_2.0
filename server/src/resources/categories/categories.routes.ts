import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { createCategorySchema, categoryResponseSchema } from './categories.schema.js'
import * as categoriesController from './categories.controller.js'

export async function categoriesRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  router.post(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        summary: 'Criar uma nova categoria',
        body: createCategorySchema,
        response: {
          [StatusCodes.CREATED]: z.object({ categoryId: z.string().uuid() }),
          [StatusCodes.CONFLICT]: z.object({ message: z.string() }), // Documentando o erro
        },
      },
    },
    categoriesController.create,
  )

  router.get(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        summary: 'Listar todas as categorias',
        response: {
          [StatusCodes.OK]: z.array(categoryResponseSchema),
        },
      },
    },
    categoriesController.list,
  )
}
