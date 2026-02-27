import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as sessionsService from './sessions.service.js'
import type { LoginInput } from './sessions.types.js'
import { REFRESH_TOKEN_TTL_DAYS } from '../tokens/tokens.config.js' // ← ADICIONADO

/**
 * Login (Gera JWT + Cookie Refresh)
 */
export async function authenticate(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
  const { email, password } = request.body

  const { user, refreshToken } = await sessionsService.authenticateUser({
    email,
    password,
  })

  const accessTokenExpiresIn = '10m' // ← EXPLÍCITO (política de access token)

  const token = await reply.jwtSign(
    { role: user.role },
    {
      sign: {
        sub: user.id,
        expiresIn: accessTokenExpiresIn,
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && String(process.env.NODE_ENV) !== 'test',
      sameSite: 'strict', // ← ALTERADO (explícito)
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60, // ← ADICIONADO
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
 * Logout (Limpa Cookie + Deleta do Banco)
 */
export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = request.cookies

  if (refreshToken) {
    await sessionsService.signOut(refreshToken)
  }

  return reply
    .clearCookie('refreshToken', { path: '/' }) // Manda o browser apagar o cookie
    .status(StatusCodes.NO_CONTENT)
    .send()
}
