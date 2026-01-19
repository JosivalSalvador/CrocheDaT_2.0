import { hash, compare } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { TokenType } from '@prisma/client' // <--- NOVO: Importar o Enum
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { LoginInput, RegisterUserInput } from './users.types.js'

/**
 * Cria um novo usuário no sistema
 */
export async function registerUser(input: RegisterUserInput) {
  const { name, email, password } = input

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) {
    throw new AppError('E-mail already exists.', StatusCodes.CONFLICT)
  }

  const passwordHash = await hash(password, 6)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return { user }
}

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

  // --- NOVO: Lógica do Refresh Token ---

  // Define expiração (ex: 7 dias a partir de agora)
  const expiresInDays = 7
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + expiresInDays)

  // Salva o Refresh Token no banco (Isso cumpre o Passo 3 do seu plano)
  const refreshToken = await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: user.id,
      expiresAt: expirationDate,
    },
  })

  // -------------------------------------

  // 4. Retorno Sanitizado + Refresh Token UUID
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    refreshToken: refreshToken.id, // Retornamos o UUID gerado
  }
}

/**
 * Renova o par de tokens (Access + Refresh)
 * Implementa Rotação de Token: O antigo é invalidado imediatamente.
 */
export async function refreshUserToken(refreshTokenId: string) {
  // 1. Busca o token no banco (e traz o usuário dono dele)
  const token = await prisma.token.findUnique({
    where: { id: refreshTokenId },
    include: { user: true }, // Precisamos da Role do usuário para o novo JWT
  })

  // 2. Se não existir, erro imediato (pode ter sido revogado ou nunca existiu)
  if (!token) {
    throw new AppError('Refresh token not found or expired.', StatusCodes.UNAUTHORIZED)
  }

  // 3. Verifica expiração (caso o banco não tenha limpado automático)
  if (token.expiresAt && token.expiresAt < new Date()) {
    // Limpa o lixo antes de dar erro
    await prisma.token.delete({ where: { id: refreshTokenId } })
    throw new AppError('Refresh token expired.', StatusCodes.UNAUTHORIZED)
  }

  // 4. ROTAÇÃO DE TOKEN (Segurança Crítica)
  // Apagamos o token antigo. Se o usuário tentar usar de novo (Replay Attack), falhará no passo 1.
  await prisma.token.delete({
    where: { id: refreshTokenId },
  })

  // 5. Gera um novo Refresh Token
  const expiresInDays = 7
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + expiresInDays)

  const newRefreshToken = await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: token.userId,
      expiresAt: expirationDate,
    },
  })

  // 6. Retorna o novo par
  return {
    refreshToken: newRefreshToken.id,
    user: {
      id: token.user.id,
      role: token.user.role, // Importante para o novo JWT
    },
  }
}
