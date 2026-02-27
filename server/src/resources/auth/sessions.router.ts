import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { loginSchema } from './sessions.schema.js'
import * as sessionsController from './sessions.controller.js'

export async function sessionsRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

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
    sessionsController.authenticate,
  )
  /**
   * ROTA: Logout
   * POST /sessions/logout
   */
  router.post(
    '/sessions/logout',
    {
      schema: {
        tags: ['auth'],
        summary: 'Sign out and invalidate refresh token',
        response: {
          [StatusCodes.NO_CONTENT]: z.null(), // Logout bem-sucedido não retorna corpo
        },
      },
    },
    sessionsController.logout,
  )
}
