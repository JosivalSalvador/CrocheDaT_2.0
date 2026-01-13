import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { registerUserSchema, loginSchema } from './users.schema.js'
import * as usersController from './users.controller.js'

export async function usersRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  // Rota de Cadastro
  router.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Registrar novo usuário',
        body: registerUserSchema,
        response: {
          [StatusCodes.CREATED]: z.object({ userId: z.string().uuid() }),
          [StatusCodes.CONFLICT]: z.object({ message: z.string() }),
        },
      },
    },
    usersController.register,
  )

  // Rota de Login (Gera o Token)
  router.post(
    '/sessions',
    {
      schema: {
        tags: ['users'],
        summary: 'Autenticar usuário (Login)',
        body: loginSchema,
        response: {
          [StatusCodes.OK]: z.object({ token: z.string() }),
          [StatusCodes.UNAUTHORIZED]: z.object({ message: z.string() }),
        },
      },
    },
    usersController.authenticate,
  )
}
