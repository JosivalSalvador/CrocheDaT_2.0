import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as sessionsService from './sessions.service.js'
import type { LoginInput } from './sessions.types.js'
import { REFRESH_TOKEN_TTL_DAYS } from '../tokens/tokens.config.js'

/**
 * Login (Gera JWT + Cookie Refresh)
 */
export async function authenticate(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
  const { email, password } = request.body

  const { user, refreshToken } = await sessionsService.authenticateUser({
    email,
    password,
  })

  const token = await reply.jwtSign(
    { role: user.role },
    {
      sign: {
        sub: user.id,
        expiresIn: '10m',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      signed: true, // OBRIGATÓRIO: Pois seu app.ts usa secret
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
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
  const rawCookie = request.cookies.refreshToken

  if (rawCookie) {
    // Desassina o cookie usando a secret global definida no app.ts
    const unsigned = request.unsignCookie(rawCookie)

    /**
     * Lógica de extração:
     * 1. Se a assinatura for válida, usamos o valor limpo (UUID).
     * 2. Se for inválida (ex: cookie antigo não assinado), usamos o rawCookie.
     */
    const tokenId = unsigned.valid && unsigned.value ? unsigned.value : rawCookie

    try {
      // Agora o Service recebe a string exata que está na coluna ID do banco
      await sessionsService.signOut(tokenId)
    } catch (error) {
      // Logamos o erro internamente, mas não barramos o logout do usuário
      request.log.error(error, 'Erro ao invalidar refresh token durante o logout')
    }
  }

  return reply
    .clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    })
    .status(StatusCodes.NO_CONTENT)
    .send()
}
