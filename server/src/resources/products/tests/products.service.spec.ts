import { describe, it, expect, beforeAll } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../../lib/prisma.js'
import * as productsService from '../products.service.js'
import { Prisma } from '@prisma/client'
import { AppError } from '../../../errors/app-error.js' // ← ADICIONADO: Para checagem estrita de erro

/**
 * Helper para garantir unicidade e isolamento
 */
const createUniqueName = (base: string): string => `${base}-${randomBytes(4).toString('hex')}`

describe('Products Service (Integration)', () => {
  let categoryId: string

  beforeAll(async () => {
    // Criamos uma categoria base para os testes de produto
    const category = await prisma.category.create({
      data: { name: createUniqueName('Category') },
    })
    categoryId = category.id
  })

  describe('createProduct()', () => {
    it('should create a product with a valid Decimal price and images', async () => {
      const productName = createUniqueName('Product')
      const { product } = await productsService.createProduct({
        name: productName,
        description: 'Descrição válida com mais de 10 caracteres',
        material: 'Algodão',
        productionTime: 5,
        price: 150.0,
        categoryId,
        images: [{ name: 'Principal', url: 'https://cdn.com/p.jpg' }],
      })

      expect(product.id).toBeDefined()
      expect(product.name).toBe(productName)

      // Verificação no Banco (Excelência: Checando o tipo Decimal do Prisma)
      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: true },
      })

      // Bloqueio duro para o TS
      if (!dbProduct) {
        throw new Error('Product not found in DB after creation')
      }

      expect(dbProduct.price).toBeInstanceOf(Prisma.Decimal)
      expect(dbProduct.price.toNumber()).toBe(150.0)
      expect(dbProduct.images).toHaveLength(1)
    })

    it('should throw BAD_REQUEST if category does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'

      const promise = productsService.createProduct({
        name: 'Erro Name', // Ajustado para bater com a regra Zod (min 3)
        description: 'Descricao valida',
        material: 'Material', // Ajustado para bater com a regra Zod (min 3)
        productionTime: 1,
        price: 10,
        categoryId: fakeId,
      })

      await expect(promise).rejects.toBeInstanceOf(AppError)
      await expect(promise).rejects.toMatchObject({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Category not found.',
      })
    })
  })

  describe('updateProduct()', () => {
    it('should update text fields and ignore undefined properties', async () => {
      const { product: created } = await productsService.createProduct({
        name: createUniqueName('Original'),
        description: 'Descricao valida original',
        material: 'Material 1', // Ajustado
        productionTime: 1,
        price: 50,
        categoryId,
      })

      // Atualiza apenas o nome, mantendo o resto
      const { product: updated } = await productsService.updateProduct(created.id, {
        name: 'Updated Name',
      })

      expect(updated.name).toBe('Updated Name')
      expect(updated.material).toBe('Material 1') // Manteve o original
    })

    it('should allow changing category to a new valid one', async () => {
      // ← ATUALIZADO: Helper para evitar colisão
      const newCat = await prisma.category.create({ data: { name: createUniqueName('New Cat') } })

      const { product: created } = await productsService.createProduct({
        name: 'Prod 1', // Ajustado
        description: 'Descricao valida',
        material: 'Material 1', // Ajustado
        productionTime: 1,
        price: 10,
        categoryId,
      })

      const { product: updated } = await productsService.updateProduct(created.id, {
        categoryId: newCat.id,
      })

      expect(updated.categoryId).toBe(newCat.id)
    })
  })

  describe('addProductImage() and removeProductImage()', () => {
    it('should manage images granularly without affecting product data', async () => {
      const { product } = await productsService.createProduct({
        name: createUniqueName('Granular'),
        description: 'Descricao valida',
        material: 'Material', // Ajustado
        productionTime: 1,
        price: 10,
        categoryId,
      })

      // 1. Adicionar
      const { image } = await productsService.addProductImage(product.id, {
        name: 'New Img',
        url: 'https://new.com/img.jpg', // Zod pede URL válida
      })

      expect(image.productId).toBe(product.id)

      // 2. Remover
      await productsService.removeProductImage(image.id)

      const dbImage = await prisma.productImage.findUnique({ where: { id: image.id } })
      expect(dbImage).toBeNull()
    })
  })

  describe('deleteProduct()', () => {
    it('should delete product and cascade delete images', async () => {
      const { product } = await productsService.createProduct({
        name: createUniqueName('To Delete'),
        description: 'Descricao valida',
        material: 'Material', // Ajustado
        productionTime: 1,
        price: 10,
        categoryId,
        images: [{ name: 'Img', url: 'https://img.com/delete.jpg' }], // URL válida
      })

      await productsService.deleteProduct(product.id)

      const dbProduct = await prisma.product.findUnique({ where: { id: product.id } })
      const dbImages = await prisma.productImage.findMany({ where: { productId: product.id } })

      expect(dbProduct).toBeNull()
      expect(dbImages).toHaveLength(0) // Cascade Check
    })
  })
})
