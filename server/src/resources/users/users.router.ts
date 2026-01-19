import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { registerUserSchema, loginSchema } from './users.schema.js'
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

  /**
   * ROTA: Autenticação (Login)
   * POST /sessions
   */
  router.post(
    '/sessions',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with email and password',
        body: loginSchema,
        response: {
          [StatusCodes.OK]: z.object({
            token: z.string(),
            user: z.object({
              name: z.string(),
              email: z.email(),
              role: z.string(),
            }),
          }),
          [StatusCodes.UNAUTHORIZED]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    usersController.authenticate,
  )

  /**
   * ROTA: Refresh Token
   * PATCH /token/refresh
   * Recebe o cookie 'refreshToken', valida e retorna um novo JWT.
   */
  router.patch(
    '/token/refresh',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh User Token',
        description: 'Receives the HttpOnly Cookie with Refresh Token and returns a new JWT Access Token.',
        response: {
          [StatusCodes.OK]: z.object({
            token: z.string(),
          }),
          [StatusCodes.UNAUTHORIZED]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    usersController.refresh,
  )
}
