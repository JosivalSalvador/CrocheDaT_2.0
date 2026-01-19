import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as usersService from './users.service.js'
import type { LoginInput, RegisterUserInput } from './users.types.js'

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

/**
 * Login (Gera JWT + Cookie Refresh)
 */
export async function authenticate(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
  const { email, password } = request.body

  const { user, refreshToken } = await usersService.authenticateUser({ email, password })

  const token = await reply.jwtSign(
    { role: user.role },
    {
      sign: {
        sub: user.id,
        expiresIn: '10m', // 10 minutos
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(StatusCodes.OK)
    .send({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
}

/**
 * Refresh Token (Troca o cookie antigo por um novo + novo JWT)
 */
export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // 1. Tenta ler o cookie 'refreshToken'
  const oldRefreshTokenId = request.cookies.refreshToken

  // 2. Se não veio cookie, bloqueia na porta
  if (!oldRefreshTokenId) {
    return reply.status(StatusCodes.UNAUTHORIZED).send({
      message: 'Refresh token missing.',
    })
  }

  // 3. Chama o Service para Rotacionar (Apaga o velho, cria o novo)
  const { refreshToken, user } = await usersService.refreshUserToken(oldRefreshTokenId)

  // 4. Gera um NOVO JWT (Access Token)
  const token = await reply.jwtSign(
    { role: user.role },
    {
      sign: {
        sub: user.id,
        expiresIn: '10m',
      },
    },
  )

  // 5. Devolve tudo renovado (Cookie novo sobrescreve o antigo)
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(StatusCodes.OK)
    .send({
      token, // O frontend pega esse token novo e volta a ser feliz
    })
}
