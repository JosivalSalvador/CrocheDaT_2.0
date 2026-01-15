# --- Estágio 1: Build ---
FROM node:22-alpine AS builder

# Adicionado openssl (importante para o Prisma no Alpine)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src/app

# O ARG e ENV aqui são opcionais se você usar o truque do "dummy" abaixo,
# mas mal não faz deixar.
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./ 

# Instala tudo (incluindo devDependencies para rodar o build)
RUN npm ci

COPY . .

# Gera o client do Prisma sem precisar do banco real
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Compila o TypeScript
RUN npm run build

# --- Estágio 2: Execução (Runner) ---
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Adicionado openssl aqui também para o binário de execução
RUN apk add --no-cache libc6-compat openssl

# Copia apenas o necessário do estágio anterior
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
# O prisma.config.ts geralmente não é necessário na execução se já foi compilado, 
# mas se seu código lê ele em tempo de execução, mantenha.
COPY --from=builder /usr/src/app/prisma.config.ts ./

EXPOSE 3333

# Usei a sintaxe de array para garantir que o processo receba sinais de stop corretamente
# ATENÇÃO: Confirme se o seu build gera "dist/src/server.js" ou apenas "dist/server.js"
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]