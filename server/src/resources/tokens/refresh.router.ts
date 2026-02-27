import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import * as refreshController from './refresh.controller.js'

export async function refreshRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

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
    refreshController.refresh,
  )
}
