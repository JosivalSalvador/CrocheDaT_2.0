import type { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verifica se o token JWT no header Authorization é válido
    // Se funcionar, ele popula o request.user com os dados do token
    await request.jwtVerify()
  } catch (err) {
    // Se der erro (token inválido, expirado ou ausente), retorna 401
    request.log.warn({ err }, 'JWT verification failed')
    return reply.status(StatusCodes.UNAUTHORIZED).send({
      message: 'Unauthorized: Invalid or missing token.',
    })
  }
}
