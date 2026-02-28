import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as refreshService from './refresh.service.js'
import { REFRESH_TOKEN_TTL_DAYS } from './tokens.config.js'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // 1. Tenta ler e desassinar o cookie
  const cookie = request.unsignCookie(request.cookies.refreshToken || '')
  const oldRefreshTokenId = cookie.value

  // 2. Se o cookie não existe ou a assinatura for inválida
  if (!oldRefreshTokenId || !cookie.valid) {
    return reply.status(StatusCodes.UNAUTHORIZED).send({
      message: 'Refresh token missing or invalid.',
    })
  }

  // 3. Chama o Service para Rotacionar
  const { refreshToken, user } = await refreshService.refreshUserToken(oldRefreshTokenId)

  // 4. Gera um NOVO JWT
  const token = await reply.jwtSign(
    { role: user.role },
    {
      sign: {
        sub: user.id,
        expiresIn: '10m',
      },
    },
  )

  // 5. Devolve renovado (com o signed: true para manter o padrão)
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true,
      signed: true, // ← Mantém o padrão de segurança que definimos
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
    })
    .status(StatusCodes.OK)
    .send({
      token,
    })
}
