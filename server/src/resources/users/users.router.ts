import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { registerUserSchema } from './users.schema.js'
import * as usersController from './users.controller.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'
import { verifyUserRole } from '../../middlewares/verify-user-role.js'

export async function usersRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>()

  /**
   * ROTA: Cadastro de Usuário
   * POST /users
   */
  router.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Create a new account',
        body: registerUserSchema,
        response: {
          [StatusCodes.CREATED]: z.object({
            message: z.string(),
            userId: z.uuid(),
          }),
          [StatusCodes.CONFLICT]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    usersController.register,
  )

  /**
   * ROTA: Buscar perfil do usuário logado
   * GET /users/me
   */
  router.get(
    '/users/me',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['users'],
        summary: 'Get current user profile',
        response: {
          [StatusCodes.OK]: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    usersController.getProfile,
  )

  /**
   * ROTA: Atualizar perfil
   * PATCH /users/me
   */
  router.patch(
    '/users/me',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['users'],
        summary: 'Update profile info',
        body: z.object({
          name: z.string().optional(),
          email: z.email().optional(),
        }),
      },
    },
    usersController.updateProfile,
  )
  /**
   * ROTA: Alterar senha
   * POST /users/me/password
   */
  router.post(
    '/users/me/password',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['users'],
        summary: 'Change account password',
        body: z.object({
          oldPassword: z.string(),
          newPassword: z.string(),
        }),
      },
    },
    usersController.changePassword,
  )

  /**
   * ROTA: Deletar própria conta (Usuário Logado)
   * DELETE /users/me
   */
  router.delete(
    '/users/me',
    {
      onRequest: [verifyJwt], // Apenas verifica se está logado
      schema: {
        tags: ['users'],
        summary: 'Delete my own account',
        response: {
          [StatusCodes.NO_CONTENT]: z.null(),
        },
      },
    },
    usersController.deleteAccount,
  )

  /**
   * ROTA: Listar todos (Admin)
   * GET /users
   */
  router.get(
    '/users',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'List all users (Admin only)',
      },
    },
    usersController.listAll,
  )

  /**
   * ROTA: Mudar Role (Admin)
   * PATCH /users/:id/role
   */
  router.patch(
    '/users/:id/role',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Change user role (Admin only)',
        params: z.object({ id: z.uuid() }),
        body: z.object({ role: z.enum(['ADMIN', 'SUPPORTER', 'USER']) }),
      },
    },
    usersController.updateRole,
  )

  /**
   * ROTA: Deletar Usuário (Admin)
   * DELETE /users/:id
   */
  router.delete(
    '/users/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['admin'],
        summary: 'Delete any user (Admin only)',
        params: z.object({ id: z.uuid() }),
      },
    },
    usersController.adminDelete,
  )
}
