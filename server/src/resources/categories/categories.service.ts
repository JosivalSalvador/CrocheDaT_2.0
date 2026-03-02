import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { CategoryInput } from './categories.types.js'

/**
 * Cria uma nova categoria
 */
export async function createCategory(input: CategoryInput) {
  const { name } = input

  const categoryExists = await prisma.category.findUnique({
    where: { name },
  })

  if (categoryExists) {
    throw new AppError('Category already exists.', StatusCodes.CONFLICT)
  }

  const category = await prisma.category.create({
    data: { name },
  })

  return { category }
}

/**
 * Lista todas as categorias
 */
export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }, // Categorias geralmente ficam melhor em ordem alfabética
  })

  return { categories }
}

/**
 * Busca uma categoria pelo ID
 */
export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw new AppError('Category not found.', StatusCodes.NOT_FOUND)
  }

  return { category }
}

/**
 * Atualiza o nome de uma categoria
 */
export async function updateCategory(id: string, data: CategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) {
    throw new AppError('Category not found.', StatusCodes.NOT_FOUND)
  }

  // Se o nome for mudar, verifica se o novo nome já está ocupado
  if (data.name !== category.name) {
    const nameExists = await prisma.category.findUnique({ where: { name: data.name } })
    if (nameExists) {
      throw new AppError('Category name already in use.', StatusCodes.CONFLICT)
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name: data.name },
  })

  return { category: updatedCategory }
}

/**
 * Deleta uma categoria
 */
export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } })

  if (!category) {
    throw new AppError('Category not found.', StatusCodes.NOT_FOUND)
  }

  // Nota: Se houver produtos vinculados, o Prisma impedirá a deleção
  // por falta de 'onDelete: Cascade' no schema (o que é bom para segurança aqui).
  await prisma.category.delete({ where: { id } })
}
