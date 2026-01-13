import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { CreateCategoryInput } from './categories.schema.js'
import { StatusCodes } from 'http-status-codes'

export async function createCategory(input: CreateCategoryInput) {
  // Verifica duplicidade case-insensitive
  const categoryExists = await prisma.category.findFirst({
    where: {
      name: { equals: input.name, mode: 'insensitive' },
    },
  })

  if (categoryExists) {
    throw new AppError('Category already exists', StatusCodes.CONFLICT)
  }

  const category = await prisma.category.create({
    data: { name: input.name },
  })

  return category
}

export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  })
}
