import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../../lib/prisma.js'
import { AppError } from '../../../errors/app-error.js'
import {
  addItemToCart,
  getCart,
  updateItemQuantity,
  removeItem,
  clearCart,
  getCartById,
  finishCart,
  markAsAbandoned,
} from '../carts.service.js'

/**
 * Helpers para garantir unicidade e isolamento
 */
const createEmail = (base: string) => `${base}-${randomBytes(4).toString('hex')}@test.com`

async function createUser() {
  return await prisma.user.create({
    data: {
      name: 'Cart Tester',
      email: createEmail('cartuser'),
      password_hash: 'hashedpassword',
    },
  })
}

async function createTestProduct(price: number = 100.0) {
  const category = await prisma.category.upsert({
    where: { name: 'Amigurumi' },
    update: {},
    create: { name: `Amigurumi-${randomBytes(2).toString('hex')}` },
  })

  return await prisma.product.create({
    data: {
      name: `Product-${randomBytes(2).toString('hex')}`,
      description: 'Handmade item',
      material: 'Cotton',
      productionTime: 5,
      price,
      categoryId: category.id,
    },
  })
}

describe('Carts Service (Integration)', () => {
  describe('addItemToCart()', () => {
    it('should create an active cart and add a new item', async () => {
      const user = await createUser()
      const product = await createTestProduct(150.0)

      const { cart } = await addItemToCart(user.id, {
        productId: product.id,
        quantity: 2,
      })

      if (!cart) throw new Error('Cart not returned after adding item')

      // Extraindo para uma variável para o TS ter certeza que existe
      const firstItem = cart.items[0]
      if (!firstItem) throw new Error('Item not added to cart')

      expect(cart.status).toBe('ACTIVE')
      expect(cart.items).toHaveLength(1)
      expect(firstItem.productId).toBe(product.id)
      expect(firstItem.subtotal).toBe(300.0)
      expect(cart.totalAmount).toBe(300.0)
    })

    it('should increment quantity if item already exists in the cart (Upsert)', async () => {
      const user = await createUser()
      const product = await createTestProduct(50.0)

      await addItemToCart(user.id, { productId: product.id, quantity: 1 })
      const { cart } = await addItemToCart(user.id, { productId: product.id, quantity: 2 })

      if (!cart) throw new Error('Cart missing')

      const firstItem = cart.items[0]
      if (!firstItem) throw new Error('Item missing')

      expect(cart.items).toHaveLength(1)
      expect(firstItem.quantity).toBe(3)
      expect(cart.totalAmount).toBe(150.0)
    })

    it('should throw NOT_FOUND if product does not exist', async () => {
      const user = await createUser()
      const fakeProductId = '00000000-0000-0000-0000-000000000000'

      const promise = addItemToCart(user.id, { productId: fakeProductId, quantity: 1 })

      await expect(promise).rejects.toBeInstanceOf(AppError)
      await expect(promise).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('getCart()', () => {
    it('should return null if user has no active cart', async () => {
      const user = await createUser()
      const { cart } = await getCart(user.id)
      expect(cart).toBeNull()
    })

    it('should return complete cart with calculated totals', async () => {
      const user = await createUser()
      const product1 = await createTestProduct(20.0)
      const product2 = await createTestProduct(30.0)

      await addItemToCart(user.id, { productId: product1.id, quantity: 2 })
      const { cart } = await addItemToCart(user.id, { productId: product2.id, quantity: 1 })

      if (!cart) throw new Error('Cart not found')

      expect(cart.items).toHaveLength(2)
      expect(cart.totalAmount).toBe(70.0)
      expect(cart.id).toBeDefined()
    })
  })

  describe('updateItemQuantity()', () => {
    it('should update item quantity and recalculate total', async () => {
      const user = await createUser()
      const product = await createTestProduct(100.0)
      const addRes = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const itemId = addRes.cart?.items[0]?.id
      if (!itemId) throw new Error('Setup failed')

      const { cart } = await updateItemQuantity(user.id, itemId, { quantity: 5 })

      if (!cart) throw new Error('Update failed')

      const firstItem = cart.items[0]
      if (!firstItem) throw new Error('Item missing after update')

      expect(firstItem.quantity).toBe(5)
      expect(cart.totalAmount).toBe(500.0)
    })

    it('should remove item if new quantity is 0', async () => {
      const user = await createUser()
      const product = await createTestProduct()
      const addRes = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const itemId = addRes.cart?.items[0]?.id
      if (!itemId) throw new Error('Setup failed')

      const { cart } = await updateItemQuantity(user.id, itemId, { quantity: 0 })

      if (!cart) throw new Error('Cart disappeared')

      expect(cart.items).toHaveLength(0)
      expect(cart.totalAmount).toBe(0)
    })

    it('should throw NOT_FOUND if item does not belong to user', async () => {
      const user1 = await createUser()
      const user2 = await createUser()
      const product = await createTestProduct()

      const addRes = await addItemToCart(user1.id, { productId: product.id, quantity: 1 })

      const itemToUpdate = addRes.cart?.items[0]?.id
      if (!itemToUpdate) throw new Error('Setup failed')

      await expect(updateItemQuantity(user2.id, itemToUpdate, { quantity: 2 })).rejects.toBeInstanceOf(AppError)
    })
  })

  describe('removeItem() & clearCart()', () => {
    it('removeItem() should delete specific item', async () => {
      const user = await createUser()
      const product = await createTestProduct()
      const addRes = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const itemId = addRes.cart?.items[0]?.id
      if (!itemId) throw new Error('Setup failed')

      const { cart } = await removeItem(user.id, itemId)
      if (!cart) throw new Error('Cart disappeared')

      expect(cart.items).toHaveLength(0)
    })

    it('clearCart() should remove all items but keep the cart active', async () => {
      const user = await createUser()
      const product = await createTestProduct()
      await addItemToCart(user.id, { productId: product.id, quantity: 2 })

      await clearCart(user.id)
      const { cart } = await getCart(user.id)

      if (!cart) throw new Error('Cart disappeared after clearing')

      expect(cart.items).toHaveLength(0)
      expect(cart.status).toBe('ACTIVE')
    })
  })

  describe('getCartById()', () => {
    it('should retrieve a cart directly by ID (Admin flow)', async () => {
      const user = await createUser()
      const product = await createTestProduct(125.5)
      const { cart: createdCart } = await addItemToCart(user.id, { productId: product.id, quantity: 2 })

      if (!createdCart) throw new Error('Setup failed')

      const cart = await getCartById(createdCart.id)

      const firstItem = cart.items[0]
      if (!firstItem) throw new Error('Items not returned')

      expect(cart.id).toBe(createdCart.id)
      expect(cart.totalAmount).toBe(251.0)
      expect(firstItem.productId).toBe(product.id)
    })

    it('should throw NOT_FOUND for invalid Cart ID', async () => {
      await expect(getCartById('00000000-0000-0000-0000-000000000000')).rejects.toBeInstanceOf(AppError)
    })
  })

  describe('Status Transitions (finishCart & markAsAbandoned)', () => {
    it('finishCart() should change status to FINISHED', async () => {
      const user = await createUser()
      const product = await createTestProduct()
      await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const updatedCart = await finishCart(user.id)
      expect(updatedCart.status).toBe('FINISHED')
    })

    it('finishCart() should throw BAD_REQUEST if no active cart exists', async () => {
      const user = await createUser()
      await expect(finishCart(user.id)).rejects.toBeInstanceOf(AppError)
    })

    it('markAsAbandoned() should change status to ABANDONED', async () => {
      const user = await createUser()
      const product = await createTestProduct()
      await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const updatedCart = await markAsAbandoned(user.id)
      if (!updatedCart) throw new Error('Cart disappeared')

      expect(updatedCart.status).toBe('ABANDONED')
    })
  })
})
