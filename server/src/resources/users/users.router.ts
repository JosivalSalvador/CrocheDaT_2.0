import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { registerUserSchema } from './users.schema.js'
import * as usersController from './users.controller.js'

export async function usersRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Cadastro de Usuário
   * POST /users
   */
  router.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Create a new account',
        body: registerUserSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            userId: z.uuid(),
          }),
          [StatusCodes.CONFLICT]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    usersController.register,
  )
}
