# --- ESTÁGIO 1: BUILDER (Base completa para DEV e Build) ---
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências (inclusive devDependencies)
RUN npm ci

COPY . .

# Gera o client do Prisma
RUN npx prisma generate

# Compila (caso vá para produção)
RUN npm run build

# --- ESTÁGIO 2: RUNNER (Apenas Produção) ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/dist ./dist
# Opcional: Copiar prisma schema se precisar rodar migrations no start
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3333
CMD ["node", "dist/server.js"]