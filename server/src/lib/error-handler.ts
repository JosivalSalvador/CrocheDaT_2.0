import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../errors/app-error.js'

export const errorHandler: FastifyInstance['errorHandler'] = (error, request, reply) => {
  // 1. Erros de Validação (Zod)
  if (error instanceof ZodError) {
    return reply.status(StatusCodes.BAD_REQUEST).send({
      message: 'Validation error',
      // CORREÇÃO: Passamos uma arrow function para dizer "quero apenas a mensagem"
      // Isso remove o aviso de deprecated da assinatura vazia.
      errors: error.flatten((issue) => issue.message).fieldErrors,
    })
  }

  // 2. Erros de Regra de Negócio (AppError)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  // 3. Erros não tratados (Internal Server Error)
  request.log.error({ err: error }, 'Unhandled error')

  return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    message: 'Internal server error',
  })
}
