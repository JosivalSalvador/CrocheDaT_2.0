import type { FastifyInstance } from 'fastify'
import { categoriesRoutes } from '../resources/categories/categories.routes.js'
import { usersRoutes } from '../resources/users/users.routes.js' // Importar

export async function routesV1(app: FastifyInstance) {
  // Aqui você registra todos os recursos da versão 1
  app.register(categoriesRoutes)
  app.register(usersRoutes)
}
