import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as usersService from './users.service.js'
import type { RegisterUserInput } from './users.types.js'

/**
 * Registro de Usuário
 */
export async function register(request: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) {
  const { name, email, password } = request.body
  const { user } = await usersService.registerUser({ name, email, password })

  return reply.status(StatusCodes.CREATED).send({
    message: 'User created successfully.',
    userId: user.id,
  })
}
