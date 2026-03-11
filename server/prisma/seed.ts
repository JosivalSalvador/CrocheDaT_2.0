import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role, TokenType, CartStatus, ChatType } from '@prisma/client'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.info('🔥 Iniciando Seed COMPLETO do Ecossistema...')
  const start = Date.now()

  // Ordem correta por causa das FKs
  await prisma.message.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.token.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.info('🧹 Banco limpo.')

  const DEFAULT_PASSWORD = '@Js92434212'
  const passwordHash = await hash(DEFAULT_PASSWORD, 10)

  /*
   |--------------------------------------------------------------------------
   | CATEGORIAS
   |--------------------------------------------------------------------------
   */

  const [tapetes, amigurumis, , , sousplats] = await Promise.all([
    prisma.category.create({ data: { name: 'Tapetes' } }),
    prisma.category.create({ data: { name: 'Amigurumis' } }),
    prisma.category.create({ data: { name: 'Saias' } }),
    prisma.category.create({ data: { name: 'Tops' } }),
    prisma.category.create({ data: { name: 'Sousplats' } }),
  ])

  /*
   |--------------------------------------------------------------------------
   | USUÁRIOS
   |--------------------------------------------------------------------------
   */

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Sistema',
      email: 'josivaladm@gmail.com',
      password_hash: passwordHash,
      role: Role.ADMIN,
    },
  })

  const supporter = await prisma.user.create({
    data: {
      name: 'Suporte Maria',
      email: 'josivalsup@gmail.com',
      password_hash: passwordHash,
      role: Role.SUPPORTER,
    },
  })

  const client = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo',
      email: 'josivaluser@gmail.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  const client2 = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo2',
      email: 'josivaluser2@gmail.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  /*
   |--------------------------------------------------------------------------
   | PRODUTOS + IMAGENS
   |--------------------------------------------------------------------------
   */

  const tapeteOval = await prisma.product.create({
    data: {
      name: 'Tapete Oval Russo',
      description: 'Tapete luxuoso com detalhes em relevo.',
      material: 'Barbante Fio 6 - 100% Algodão',
      productionTime: 5,
      price: 120.5,
      categoryId: tapetes.id,
      images: {
        create: [
          { name: 'Principal', url: 'https://res.cloudinary.com/derzus8uh/image/upload/v1755108410/topCa5_cwe8hh.jpg' },
          {
            name: 'Detalhe',
            url: 'https://res.cloudinary.com/derzus8uh/image/upload/v1754340600/WhatsApp_Image_2025-08-04_at_14.31.21_2_zuyonf.jpg',
          },
        ],
      },
    },
  })

  const ursoAmigurumi = await prisma.product.create({
    data: {
      name: 'Urso Amigurumi',
      description: 'Urso artesanal feito à mão.',
      material: 'Linha 100% algodão + enchimento antialérgico',
      productionTime: 3,
      price: 89.9,
      categoryId: amigurumis.id,
      images: {
        create: [], // SEM IMAGEM PROPOSITALMENTE
      },
    },
  })

  const sousplatLuxo = await prisma.product.create({
    data: {
      name: 'Sousplat Floral Luxo',
      description: 'Sousplat sofisticado para mesas elegantes.',
      material: 'Barbante Fio 4',
      productionTime: 2,
      price: 35.0,
      categoryId: sousplats.id,
      images: {
        create: [{ name: 'Principal', url: 'https://img.com/sousplat.jpg' }], // IMAGEM QUEBRADA PROPOSITALMENTE
      },
    },
  })

  const sousplat = await prisma.product.create({
    data: {
      name: 'Sousplat Floral Luxo',
      description: 'Sousplat sofisticado para mesas elegantes.',
      material: 'Barbante Fio 4',
      productionTime: 2,
      price: 35.0,
      categoryId: sousplats.id,
      images: {
        create: [
          { name: 'Principal', url: 'https://res.cloudinary.com/derzus8uh/image/upload/v1755108410/topCa5_cwe8hh.jpg' },
        ],
      },
    },
  })

  /*
   |--------------------------------------------------------------------------
   | CARRINHOS
   |--------------------------------------------------------------------------
   */

  // Carrinho ativo
  const activeCart = await prisma.cart.create({
    data: {
      userId: client.id,
      status: CartStatus.ACTIVE,
      items: {
        create: [
          { productId: tapeteOval.id, quantity: 1 },
          { productId: sousplatLuxo.id, quantity: 4 },
          { productId: sousplat.id, quantity: 4 },
        ],
      },
    },
  })

  await prisma.chat.create({
    data: {
      userId: client.id,
      type: ChatType.ORDER,
      cartId: activeCart.id,
      isOpen: true,
      messages: {
        create: [
          {
            content: 'Quero confirmar o prazo desse tapete.',
            senderId: client.id,
          },
          {
            content: 'Produção em 5 dias + envio.',
            senderId: supporter.id,
          },
        ],
      },
    },
  })

  // Carrinho finalizado (simulando pedido)
  const finishedCart = await prisma.cart.create({
    data: {
      userId: client.id,
      status: CartStatus.FINISHED,
      items: {
        create: [{ productId: ursoAmigurumi.id, quantity: 2 }],
      },
    },
  })

  // Carrinho abandonado
  await prisma.cart.create({
    data: {
      userId: client.id,
      status: CartStatus.ABANDONED,
      items: {
        create: [{ productId: sousplatLuxo.id, quantity: 1 }],
      },
    },
  })

  /*
   |--------------------------------------------------------------------------
   | CHAT DE SUPORTE
   |--------------------------------------------------------------------------
   */

  await prisma.chat.create({
    data: {
      userId: client.id,
      type: ChatType.SUPPORT,
      isOpen: true,
      messages: {
        create: [
          {
            content: 'Vocês fazem sob medida?',
            senderId: client.id,
          },
          {
            content: 'Sim! Nos envie as dimensões desejadas.',
            senderId: supporter.id,
          },
        ],
      },
    },
  })

  /*
   |--------------------------------------------------------------------------
   | CHAT DE PEDIDO (ORDER) VINCULADO AO CARRINHO
   |--------------------------------------------------------------------------
   */

  await prisma.chat.create({
    data: {
      userId: client.id,
      type: ChatType.ORDER,
      cartId: finishedCart.id,
      isOpen: false,
      messages: {
        create: [
          {
            content: 'Gostaria de confirmar o endereço.',
            senderId: supporter.id,
          },
          {
            content: 'Confirmado! Pode enviar.',
            senderId: client.id,
          },
        ],
      },
    },
  })

  /*
   |--------------------------------------------------------------------------
   | TOKENS
   |--------------------------------------------------------------------------
   */

  await prisma.token.createMany({
    data: [
      {
        type: TokenType.REFRESH_TOKEN,
        userId: admin.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        type: TokenType.PASSWORD_RESET,
        userId: client.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        type: TokenType.EMAIL_VERIFY,
        userId: supporter.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        type: TokenType.EMAIL_VERIFY,
        userId: client2.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ],
  })

  const end = Date.now()
  console.info(`✅ Seed finalizado em ${end - start}ms`)
  console.info('--------------------------------------------------')
  console.info('🧪 CREDENCIAIS PARA O E2E / CODEGEN:')
  console.info(`👤 Admin:   josivaladm@gmail.com   | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🎧 Suporte: josivalsup@gmail.com | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🛒 Cliente: josivaluser@gmail.com    | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🛒 Cliente: josivaluser2@gmail.com    | Senha: ${DEFAULT_PASSWORD}`)
  console.info('--------------------------------------------------')
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
