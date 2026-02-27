import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as refreshService from './refresh.service.js'
import { REFRESH_TOKEN_TTL_DAYS } from './tokens.config.js' // ← Import necessário

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
  const { refreshToken, user } = await refreshService.refreshUserToken(oldRefreshTokenId)

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
      secure: process.env.NODE_ENV === 'production' && String(process.env.NODE_ENV) !== 'test',
      sameSite: 'strict', // ← Alinhado com o Login
      httpOnly: true,
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60, // ← Converte dias em segundos
    })
    .status(StatusCodes.OK)
    .send({
      token, // O frontend pega esse token novo e volta a ser feliz
    })
}
