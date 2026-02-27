import { hash } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { RegisterUserInput } from './users.types.js'

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

  const passwordHash = await hash(password, 10)

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
