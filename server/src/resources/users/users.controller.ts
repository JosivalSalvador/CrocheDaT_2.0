import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as usersService from './users.service.js'
import type { LoginInput, RegisterUserInput } from './users.schema.js'

export async function register(request: FastifyRequest<{ Body: RegisterUserInput }>, reply: FastifyReply) {
  const { name, email, password } = request.body
  const user = await usersService.registerUser({ name, email, password })

  return reply.status(StatusCodes.CREATED).send({ userId: user.id })
}

export async function authenticate(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
  const { email, password } = request.body

  // Valida usuário e senha
  const user = await usersService.authenticateUser({ email, password })

  // Gera o Token JWT usando o plugin configurado no app.ts
  const token = await reply.jwtSign(
    {}, // Payload extra (se quiser adicionar roles, etc)
    {
      sign: {
        sub: user.id, // O 'sub' (subject) guarda o ID do usuário no token
        expiresIn: '7d', // Token expira em 7 dias
      },
    },
  )

  return reply.status(StatusCodes.OK).send({ token })
}
