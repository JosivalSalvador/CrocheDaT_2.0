import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL não definida no .env')
}

// --- AQUI ESTÁ A CORREÇÃO ---
// Usamos a mesma lógica do seu app principal para conectar no Seed
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
// ----------------------------

async function main() {
  console.info('Iniciando o seed...')

  // Limpa dados anteriores
  await prisma.user.deleteMany()

  // Cria o hash da senha
  const passwordHash = await hash('123456', 6)

  // Cria o Admin
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@crochedat.com',
      password: passwordHash,
    },
  })

  console.info('Banco de dados povoado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
