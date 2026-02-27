import { compare } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { TokenType } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { LoginInput } from './sessions.types.js'
import { REFRESH_TOKEN_TTL_DAYS } from '../tokens/tokens.config.js' // ← ADICIONADO: política centralizada de tokens

/**
 * Autentica um usuário existente e gera Refresh Token
 */
export async function authenticateUser(input: LoginInput) {
  const { email, password } = input

  // 1. Busca usuário
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // 2. Validação
  if (!user) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
  }

  // 3. Comparação de Hash
  const doesPasswordMatch = await compare(password, user.password_hash)

  if (!doesPasswordMatch) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
  }

  // 4. Geração do Refresh Token
  const expirationDate = new Date()
  expirationDate.setDate(
    expirationDate.getDate() + REFRESH_TOKEN_TTL_DAYS, // ← ALTERADO: remove valor mágico
  )

  const refreshToken = await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: user.id,
      expiresAt: expirationDate,
    },
  })

  // 5. Retorno sanitizado + Refresh Token
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
 */
export async function signOut(refreshTokenId: string) {
  // Deleta o token se ele existir. Se não existir, não faz nada (idempotência)
  try {
    await prisma.token.delete({
      where: { id: refreshTokenId },
    })
  } catch {
    // Se o token já não existia, apenas ignoramos
  }
}
