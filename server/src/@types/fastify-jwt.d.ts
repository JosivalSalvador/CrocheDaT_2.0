import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    // O que vai dentro do payload do token
    user: {
      sub: string // O ID do usuário (padrão JWT é chamar de 'sub')
      role: 'ADMIN' | 'SUPPORTER' | 'USER' // Igual ao seu schema.prisma
    }
  }
}
