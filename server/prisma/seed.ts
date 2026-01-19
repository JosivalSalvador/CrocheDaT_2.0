import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role, TokenType } from '@prisma/client'
import { hash } from 'bcryptjs'

// Setup do Adapter (Prisma 7)
const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.info('Iniciando Seed de Respeito...')
  const start = Date.now()

  // 1. Limpeza
  await prisma.user.deleteMany()
  console.info('Banco de dados limpo.')

  // 2. Hash padrão
  const passwordHash = await hash('123456', 6)

  // 3. Criar Personas
  // Mantemos o "admin" em variável pois usaremos o ID dele para criar o token abaixo
  const admin = await prisma.user.create({
    data: {
      name: 'Master Admin',
      email: 'admin@crochedat.com',
      password_hash: passwordHash,
      role: Role.ADMIN,
    },
  })

  // Removemos a atribuição de variável aqui para não dar erro de "unused variable"
  await prisma.user.create({
    data: {
      name: 'Suporte Técnico',
      email: 'support@crochedat.com',
      password_hash: passwordHash,
      role: Role.SUPPORTER,
    },
  })

  await prisma.user.create({
    data: {
      name: 'Cliente Comum',
      email: 'user@crochedat.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  console.info('Personas criadas: Admin, Support e User.')

  // 4. Massa de Dados
  console.info('Gerando massa de dados (20 usuários aleatórios)...')
  const randomUsersPromises = Array.from({ length: 20 }).map((_, i) => {
    const userNumber = i + 1
    return prisma.user.create({
      data: {
        name: `User Teste ${userNumber}`,
        email: `teste${userNumber}@crochedat.com`,
        password_hash: passwordHash,
        role: Role.USER,
      },
    })
  })

  await Promise.all(randomUsersPromises)

  // 5. Popular Tabela de Tokens (Usando o ID do admin capturado acima)
  await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: admin.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
    },
  })

  const end = Date.now()
  console.info(`Seed finalizado em ${end - start}ms`)
  console.info(`Resumo:`)
  console.info(`   - Admin: admin@crochedat.com (123456)`)
  console.info(`   - Support: support@crochedat.com (123456)`)
  console.info(`   - User: user@crochedat.com (123456)`)
  console.info(`   - +20 usuários genéricos criados.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erro Fatal no Seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
