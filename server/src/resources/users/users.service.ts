import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js' // [cite: 8]
import { AppError } from '../../errors/app-error.js' // [cite: 5]
import type { LoginInput, RegisterUserInput } from './users.schema.js'

export async function registerUser(input: RegisterUserInput) {
  const userExists = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (userExists) {
    throw new AppError('User already exists', StatusCodes.CONFLICT)
  }

  // Criptografa a senha antes de salvar
  const passwordHash = await bcrypt.hash(input.password, 6)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: passwordHash,
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export async function authenticateUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED)
  }

  // Compara a senha enviada com o hash do banco
  const doesPasswordMatch = await bcrypt.compare(input.password, user.password)

  if (!doesPasswordMatch) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED)
  }

  return user
}
