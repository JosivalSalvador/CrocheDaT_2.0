import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../categories.service.js'
import { prisma } from '../../../lib/prisma.js'

/**
 * Helper para garantir que os nomes das categorias não colidam entre testes
 */
const createUniqueName = (base: string) => `${base}-${randomBytes(4).toString('hex')}`

describe('Categories Service (Integration)', () => {
  describe('createCategory()', () => {
    it('should create a new category with a valid name', async () => {
      const name = createUniqueName('Category')
      const { category } = await createCategory({ name })

      const categoryInDb = await prisma.category.findUnique({ where: { id: category.id } })

      expect(categoryInDb).not.toBeNull()
      expect(categoryInDb?.name).toBe(name)
    })

    it('should throw CONFLICT if category name already exists', async () => {
      const name = createUniqueName('Duplicate')
      await createCategory({ name })

      await expect(createCategory({ name })).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
        message: 'Category already exists.',
      })
    })
  })

  describe('listCategories()', () => {
    it('should return a list of categories ordered by name', async () => {
      // Criando categorias com nomes que facilitam testar a ordem (B e A)
      await createCategory({ name: 'B - Category' })
      await createCategory({ name: 'A - Category' })

      const { categories } = await listCategories()

      expect(categories.length).toBeGreaterThanOrEqual(2)

      // Encontrar os índices para garantir que A vem antes de B
      const indexA = categories.findIndex((c) => c.name === 'A - Category')
      const indexB = categories.findIndex((c) => c.name === 'B - Category')

      expect(indexA).toBeLessThan(indexB)
    })
  })

  describe('getCategoryById()', () => {
    it('should return a category when a valid ID is provided', async () => {
      const { category: created } = await createCategory({ name: createUniqueName('FindMe') })

      const { category } = await getCategoryById(created.id)

      expect(category.id).toBe(created.id)
      expect(category.name).toBe(created.name)
    })

    it('should throw NOT_FOUND for non-existing category ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      await expect(getCategoryById(fakeId)).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('updateCategory()', () => {
    it('should update the category name correctly', async () => {
      const { category: created } = await createCategory({ name: 'Old Name' })
      const newName = createUniqueName('New Name')

      const { category: updated } = await updateCategory(created.id, { name: newName })

      expect(updated.name).toBe(newName)

      const dbCategory = await prisma.category.findUnique({ where: { id: created.id } })
      expect(dbCategory?.name).toBe(newName)
    })

    it('should throw CONFLICT when updating to a name that already exists', async () => {
      const name1 = createUniqueName('Name 1')
      const name2 = createUniqueName('Name 2')

      const { category: catToUpdate } = await createCategory({ name: name1 })
      await createCategory({ name: name2 })

      await expect(updateCategory(catToUpdate.id, { name: name2 })).rejects.toMatchObject({
        statusCode: StatusCodes.CONFLICT,
      })
    })
  })

  describe('deleteCategory()', () => {
    it('should remove the category from the database', async () => {
      const { category } = await createCategory({ name: createUniqueName('DeleteMe') })

      await deleteCategory(category.id)

      const dbCategory = await prisma.category.findUnique({ where: { id: category.id } })
      expect(dbCategory).toBeNull()
    })

    it('should throw NOT_FOUND when trying to delete a non-existing category', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      await expect(deleteCategory(fakeId)).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })
})
