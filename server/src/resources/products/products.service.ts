import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { CreateProductInput, UpdateProductInput, AddImageInput } from './products.types.js'
import { Prisma } from '@prisma/client'

/**
 * CRIAR PRODUTO (Global)
 * Cria o produto e as imagens iniciais em uma única transação atômica.
 */
export async function createProduct(data: CreateProductInput) {
  const categoryExists = await prisma.category.findUnique({
    where: { id: data.categoryId },
  })

  if (!categoryExists) {
    throw new AppError('Category not found.', StatusCodes.BAD_REQUEST)
  }

  const createData: Prisma.ProductCreateInput = {
    name: data.name,
    description: data.description,
    material: data.material,
    productionTime: data.productionTime,
    price: new Prisma.Decimal(data.price),
    category: { connect: { id: data.categoryId } },
  }

  if (data.images && data.images.length > 0) {
    createData.images = {
      create: data.images.map((img) => ({
        name: img.name,
        url: img.url,
      })),
    }
  }

  const product = await prisma.product.create({
    data: createData,
    include: {
      category: { select: { name: true } },
      images: true,
    },
  })

  return { product }
}

/**
 * ATUALIZAR PRODUTO (Dados e Categoria)
 * Atualiza apenas os campos de texto/valor e troca a categoria se necessário.
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  const productExists = await prisma.product.findUnique({ where: { id } })

  if (!productExists) {
    throw new AppError('Product not found.', StatusCodes.NOT_FOUND)
  }

  const { categoryId, ...rest } = data

  const updateData: Prisma.ProductUpdateInput = Object.fromEntries(
    Object.entries(rest).filter(([_, v]) => v !== undefined),
  )

  if (categoryId) {
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!categoryExists) throw new AppError('Category not found.', StatusCodes.BAD_REQUEST)

    updateData.category = { connect: { id: categoryId } }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: { select: { name: true } },
      images: true,
    },
  })

  return { product: updatedProduct }
}

/**
 * ADICIONAR IMAGEM (Granular)
 * Adiciona uma nova imagem a um produto já existente.
 */
export async function addProductImage(productId: string, data: AddImageInput) {
  const productExists = await prisma.product.findUnique({ where: { id: productId } })
  if (!productExists) throw new AppError('Product not found.', StatusCodes.NOT_FOUND)

  const image = await prisma.productImage.create({
    data: {
      name: data.name,
      url: data.url,
      productId,
    },
  })

  return { image }
}

/**
 * REMOVER IMAGEM (Granular)
 * Remove uma imagem específica pelo ID dela (o "X" no front).
 */
export async function removeProductImage(imageId: string) {
  const imageExists = await prisma.productImage.findUnique({ where: { id: imageId } })
  if (!imageExists) throw new AppError('Image not found.', StatusCodes.NOT_FOUND)

  await prisma.productImage.delete({ where: { id: imageId } })
}

/**
 * BUSCAR POR ID
 */
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  })

  if (!product) throw new AppError('Product not found.', StatusCodes.NOT_FOUND)

  return { product }
}

/**
 * LISTAR TODOS
 */
export async function listAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      images: { take: 1 },
    },
  })

  return { products }
}

/**
 * DELETAR PRODUTO
 */
export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) throw new AppError('Product not found.', StatusCodes.NOT_FOUND)

  await prisma.product.delete({ where: { id } })
}
