import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import * as cartsService from './carts.service.js'
import type { AddToCartInput, UpdateCartItemInput, CartItemParams } from './carts.types.js'

/**
 * ADICIONAR ITEM AO CARRINHO
 */
export async function addItem(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  // Ajuste aqui: cast de tipo na variável
  const body = request.body as AddToCartInput
  const { cart } = await cartsService.addItemToCart(userId, body)

  return reply.status(StatusCodes.CREATED).send({
    message: 'Item added to cart successfully.',
    cart,
  })
}

/**
 * BUSCAR CARRINHO (O próprio usuário logado)
 */
export async function getMyCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const { cart } = await cartsService.getCart(userId)

  return reply.status(StatusCodes.OK).send({ cart })
}

/**
 * ATUALIZAR QUANTIDADE DE UM ITEM
 */
export async function updateQuantity(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  // Ajuste aqui: cast de tipo nas variáveis
  const { itemId } = request.params as CartItemParams
  const body = request.body as UpdateCartItemInput

  const { cart } = await cartsService.updateItemQuantity(userId, itemId, body)

  return reply.status(StatusCodes.OK).send({
    message: 'Cart updated successfully.',
    cart,
  })
}

/**
 * REMOVER ITEM ESPECÍFICO
 */
export async function removeItem(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  // Ajuste aqui: cast de tipo na variável
  const { itemId } = request.params as CartItemParams

  const { cart } = await cartsService.removeItem(userId, itemId)

  return reply.status(StatusCodes.OK).send({
    message: 'Item removed from cart.',
    cart,
  })
}

/**
 * ESVAZIAR CARRINHO
 */
export async function clearMyCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  await cartsService.clearCart(userId)

  return reply.status(StatusCodes.OK).send({
    message: 'Cart cleared successfully.',
  })
}

/**
 * BUSCAR CARRINHO POR ID (Para Admin/Suporte via Chat)
 */
export async function getCartDetail(request: FastifyRequest, reply: FastifyReply) {
  // Ajuste aqui: cast de tipo na variável
  const { itemId: cartId } = request.params as CartItemParams
  const cart = await cartsService.getCartById(cartId)

  return reply.status(StatusCodes.OK).send({ cart })
}
