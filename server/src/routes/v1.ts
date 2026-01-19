import type { FastifyInstance } from 'fastify'
import { usersRoutes } from '../resources/users/users.router.js' // Importar

export async function routesV1(app: FastifyInstance) {
  // Aqui você registra todos os recursos da versão 1
  app.register(usersRoutes)
}
