import { compare } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { TokenType } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { LoginInput } from './sessions.types.js'
import { REFRESH_TOKEN_TTL_DAYS } from '../tokens/tokens.config.js'

/**
 * Autentica um usuário existente e gera Refresh Token
 */
export async function authenticateUser(input: LoginInput) {
  const { email, password } = input

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
  }

  const doesPasswordMatch = await compare(password, user.password_hash)

  if (!doesPasswordMatch) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
  }

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + REFRESH_TOKEN_TTL_DAYS)

  const refreshToken = await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: user.id,
      expiresAt: expirationDate,
    },
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    refreshToken: refreshToken.id,
  }
}

/**
 * Remove a sessão (Logout)
 * Recebe o UUID puro vindo do unsignCookie do controller
 */
export async function signOut(refreshTokenId: string) {
  // Solução de mercado: Deletamos o token e tratamos a idempotência
  await prisma.token
    .deleteMany({
      where: {
        id: refreshTokenId,
      },
    })
    .catch((error) => {
      // P2025: Erro do Prisma para "Registro não encontrado"
      // Se o token já não existe, o objetivo (logout) foi alcançado, então ignoramos.
      if (error.code !== 'P2025') {
        throw error
      }
    })
}
