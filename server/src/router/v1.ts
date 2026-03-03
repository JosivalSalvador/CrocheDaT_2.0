import type { FastifyInstance } from 'fastify'
import { usersRoutes } from '../resources/users/users.router.js' // Importar
import { sessionsRoutes } from '../resources/auth/sessions.router.js' // Importar
import { refreshRoutes } from '../resources/tokens/refresh.router.js' // Importar
import { categoriesRoutes } from '../resources/categories/categories.router.js'
import { productsRoutes } from '../resources/products/products.router.js'
import { cartsRoutes } from '../resources/carts/carts.router.js'
import { chatsRoutes } from '../resources/chats/chats.router.js'

export async function routesV1(app: FastifyInstance) {
  // Aqui você registra todos os recursos da versão 1
  app.register(usersRoutes)
  app.register(sessionsRoutes)
  app.register(refreshRoutes)
  app.register(categoriesRoutes)
  app.register(productsRoutes)
  app.register(cartsRoutes)
  app.register(chatsRoutes)
}
