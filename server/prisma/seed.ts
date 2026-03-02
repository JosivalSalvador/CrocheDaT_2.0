import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role, TokenType, CartStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.info('Iniciando Seed do Ecossistema Crochê...')
  const start = Date.now()

  // 1. Limpeza de dados
  // O onDelete: Cascade no Schema cuidará das tabelas dependentes
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  console.info('Banco de dados limpo.')

  // 2. Credenciais padrão
  const DEFAULT_PASSWORD = 'password123'
  const passwordHash = await hash(DEFAULT_PASSWORD, 10)

  // 3. Categorias
  console.info('Criando categorias...')
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Tapetes' } }),
    prisma.category.create({ data: { name: 'Amigurumis' } }),
    prisma.category.create({ data: { name: 'Sousplats' } }),
  ])

  // 4. Personas (Admin, Suporte e Cliente)
  console.info('Criando usuários...')
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Sistema',
      email: 'admin@crochedat.com',
      password_hash: passwordHash,
      role: Role.ADMIN,
    },
  })

  const supporter = await prisma.user.create({
    data: {
      name: 'Suporte Maria',
      email: 'support@crochedat.com',
      password_hash: passwordHash,
      role: Role.SUPPORTER,
    },
  })

  const client = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo',
      email: 'user@crochedat.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  // 5. Produtos e Imagens (Nested Writes)
  console.info('Populando catálogo de produtos...')
  const product1 = await prisma.product.create({
    data: {
      name: 'Tapete Oval Russo',
      description: 'Tapete luxuoso com detalhes em relevo.',
      material: 'Barbante Fio 6 - 100% Algodão',
      productionTime: 5,
      price: 120.5,
      categoryId: categories[0].id,
      images: {
        create: [
          { name: 'Principal', url: 'https://link.com/tapete1.jpg' },
          { name: 'Detalhe', url: 'https://link.com/tapete1-zoom.jpg' },
        ],
      },
    },
  })

  // 6. Simulação de Carrinho e Chat
  console.info('Criando interações iniciais...')
  await prisma.cart.create({
    data: {
      userId: client.id,
      status: CartStatus.ACTIVE,
      items: {
        create: [{ productId: product1.id, quantity: 1 }],
      },
    },
  })

  await prisma.chat.create({
    data: {
      userId: client.id,
      isOpen: true,
      messages: {
        create: [
          { content: 'Olá, qual o prazo de entrega?', senderId: client.id },
          { content: 'Olá! O prazo é de 5 dias úteis.', senderId: supporter.id },
        ],
      },
    },
  })

  // 7. Token de Sessão
  await prisma.token.create({
    data: {
      type: TokenType.REFRESH_TOKEN,
      userId: admin.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  })

  const end = Date.now()
  console.info(`Seed finalizado em ${end - start}ms`)
  console.info('Admin: admin@crochedat.com | Senha: ' + DEFAULT_PASSWORD)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error('Erro no Seed:', e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
