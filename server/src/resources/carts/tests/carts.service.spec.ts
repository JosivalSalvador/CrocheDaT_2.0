import { describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../../lib/prisma.js'
import { addItemToCart, getCart, updateItemQuantity, removeItem, clearCart } from '../carts.service.js'

/**
 * Helpers para isolamento e unicidade
 */
const generateId = () => randomBytes(4).toString('hex')
const createEmail = (base: string) => `${base}-${generateId()}@test.com`

async function createTestUser() {
  return await prisma.user.create({
    data: {
      name: 'Test User',
      email: createEmail('cart-test'),
      password_hash: 'hash_123',
    },
  })
}

async function createTestProduct(price: number) {
  const category = await prisma.category.upsert({
    where: { name: 'Amigurumi' },
    update: {},
    create: { name: 'Amigurumi' },
  })

  return await prisma.product.create({
    data: {
      name: `Product-${generateId()}`,
      description: 'Handmade Crochet',
      material: 'Cotton 100%',
      productionTime: 7,
      price,
      categoryId: category.id,
    },
  })
}

describe('Carts Service (Integration)', () => {
  describe('addItemToCart()', () => {
    it('should create a new cart and add an item', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(150.0)

      const response = await addItemToCart(user.id, {
        productId: product.id,
        quantity: 2,
      })

      // Validação de existência sem usar '!'
      if (!response.cart) throw new Error('Cart should not be null')

      expect(response.cart.status).toBe('ACTIVE')
      expect(response.cart.items).toHaveLength(1)
      expect(response.cart.totalAmount).toBe(300.0)
    })

    it('should increment quantity when adding the same product again', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(50.0)

      await addItemToCart(user.id, { productId: product.id, quantity: 1 })
      const { cart } = await addItemToCart(user.id, { productId: product.id, quantity: 2 })

      if (!cart || !cart.items[0]) throw new Error('Cart setup failed')

      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].quantity).toBe(3)
      expect(cart.totalAmount).toBe(150.0)
    })

    it('should throw NOT_FOUND for invalid product ID', async () => {
      const user = await createTestUser()
      const invalidId = '00000000-0000-0000-0000-000000000000'

      await expect(addItemToCart(user.id, { productId: invalidId, quantity: 1 })).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('getCart()', () => {
    it('should return null if user has no active cart', async () => {
      const user = await createTestUser()
      const { cart } = await getCart(user.id)
      expect(cart).toBeNull()
    })

    it('should return the active cart with correct structure', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(100.0)
      await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      const { cart } = await getCart(user.id)

      if (!cart) throw new Error('Cart should exist')

      expect(cart.items[0]).toMatchObject({
        name: product.name,
        price: 100.0,
        subtotal: 100.0,
      })
    })
  })

  describe('updateItemQuantity()', () => {
    it('should update the quantity of a cart item', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(10.0)
      const { cart: initialCart } = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      if (!initialCart || !initialCart.items[0]) throw new Error('Setup failed')

      const { cart } = await updateItemQuantity(user.id, initialCart.items[0].id, { quantity: 10 })

      if (!cart || !cart.items[0]) throw new Error('Update failed')
      expect(cart.items[0].quantity).toBe(10)
      expect(cart.totalAmount).toBe(100.0)
    })

    it('should remove the item when quantity is updated to 0', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(10.0)
      const { cart: initialCart } = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      if (!initialCart || !initialCart.items[0]) throw new Error('Setup failed')

      const itemId = initialCart.items[0].id
      const { cart } = await updateItemQuantity(user.id, itemId, { quantity: 0 })

      if (!cart) throw new Error('Cart should still exist')
      expect(cart.items).toHaveLength(0)

      const itemInDb = await prisma.cartItem.findUnique({ where: { id: itemId } })
      expect(itemInDb).toBeNull()
    })
  })

  describe('removeItem()', () => {
    it('should remove a specific item from the cart', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(10.0)
      const { cart: initialCart } = await addItemToCart(user.id, { productId: product.id, quantity: 1 })

      if (!initialCart || !initialCart.items[0]) throw new Error('Setup failed')

      const { cart } = await removeItem(user.id, initialCart.items[0].id)

      if (!cart) throw new Error('Cart should still exist')
      expect(cart.items).toHaveLength(0)
    })

    it('should prevent deleting items from other users', async () => {
      const userA = await createTestUser()
      const userB = await createTestUser()
      const product = await createTestProduct(10.0)

      const { cart: cartA } = await addItemToCart(userA.id, { productId: product.id, quantity: 1 })
      if (!cartA || !cartA.items[0]) throw new Error('Setup failed')

      await expect(removeItem(userB.id, cartA.items[0].id)).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
      })
    })
  })

  describe('clearCart()', () => {
    it('should remove all items from the active cart', async () => {
      const user = await createTestUser()
      const product = await createTestProduct(10.0)
      await addItemToCart(user.id, { productId: product.id, quantity: 5 })

      await clearCart(user.id)

      const { cart } = await getCart(user.id)
      if (!cart) throw new Error('Cart should exist')
      expect(cart.items).toHaveLength(0)
      expect(cart.totalAmount).toBe(0)
    })
  })
})
