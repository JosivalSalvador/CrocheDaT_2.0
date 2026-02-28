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
   * O Fastify lerá automaticamente o cookie 'refreshToken' assinado.
   */
  router.patch(
    '/token/refresh',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh User Token',
        description: 'Troca o Refresh Token (via HttpOnly Cookie) por um novo Access Token (JWT).',
        response: {
          [StatusCodes.OK]: z.object({
            token: z.string().describe('Novo JWT Access Token'),
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
