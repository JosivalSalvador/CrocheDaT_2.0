import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'SUPPORTER' | 'USER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden: Insufficient privileges.' })
    }
  }
}
