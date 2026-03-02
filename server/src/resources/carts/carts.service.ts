import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../errors/app-error.js'
import type { AddToCartInput, UpdateCartItemInput, CartResponse } from './carts.types.js'

/**
 * RECUPERA OU CRIA UM CARRINHO ATIVO
 * Garante que o usuário sempre tenha apenas um carrinho 'ACTIVE'
 */
async function getOrCreateActiveCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, status: 'ACTIVE' },
    })
  }

  return cart
}

/**
 * ADICIONAR ITEM AO CARRINHO
 * Lógica de Upsert: Se o produto já existe no carrinho, incrementa a quantidade.
 */
export async function addItemToCart(userId: string, input: AddToCartInput) {
  const { productId, quantity } = input

  // 1. Verificar se o produto existe no catálogo
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new AppError('Product not found.', StatusCodes.NOT_FOUND)
  }

  // 2. Garantir que temos um carrinho ativo
  const cart = await getOrCreateActiveCart(userId)

  // 3. Verificar se o item já está no carrinho
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  })

  if (existingItem) {
    // Incrementa a quantidade existente
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    })
  } else {
    // Cria um novo item no carrinho
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })
  }

  return getCart(userId)
}

/**
 * BUSCAR CARRINHO COMPLETO
 * Retorna os itens com preços atualizados e calcula o total geral.
 */
export async function getCart(userId: string): Promise<{ cart: CartResponse | null }> {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1 } },
          },
        },
      },
    },
  })

  if (!cart) {
    return { cart: null }
  }

  // Mapeia os itens para o formato de resposta com cálculos de preço
  const items = cart.items.map((item) => {
    const price = Number(item.product.price)
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price,
      quantity: item.quantity,
      subtotal: price * item.quantity,
      imageUrl: item.product.images[0]?.url || null,
    }
  })

  const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0)

  const response: CartResponse = {
    id: cart.id,
    status: cart.status,
    items,
    totalAmount,
    updatedAt: cart.updatedAt,
  }

  return { cart: response }
}

/**
 * ATUALIZAR QUANTIDADE DE UM ITEM
 * Se a nova quantidade for 0, remove o item conforme discutido.
 */
export async function updateItemQuantity(userId: string, itemId: string, data: UpdateCartItemInput) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  })

  // Segurança: Verifica se o item existe e se pertence ao usuário logado
  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new AppError('Cart item not found.', StatusCodes.NOT_FOUND)
  }

  // Regra de Negócio: Quantidade 0 remove o item
  if (data.quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } })
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity },
    })
  }

  return getCart(userId)
}

/**
 * REMOVER ITEM DO CARRINHO
 */
export async function removeItem(userId: string, itemId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  })

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new AppError('Cart item not found.', StatusCodes.NOT_FOUND)
  }

  await prisma.cartItem.delete({ where: { id: itemId } })

  return getCart(userId)
}

/**
 * LIMPAR CARRINHO
 * Útil para o status ABANDONED ou reset manual
 */
export async function clearCart(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: 'ACTIVE' },
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }
}
