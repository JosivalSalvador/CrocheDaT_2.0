# ---------- base ----------
FROM node:22-alpine AS base

WORKDIR /app

# Prisma precisa disso no Alpine
RUN apk add --no-cache libc6-compat openssl

# ---------- deps ----------
FROM base AS deps

# Copiamos SOMENTE manifests (cache máximo)
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Instala apenas dependências do workspace server
ENV HUSKY=0
RUN npm ci --ignore-scripts --workspace=server

# ---------- build ----------
FROM base AS build

ENV NODE_ENV=production

# Dependências resolvidas
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Código-fonte do server
COPY server ./server

WORKDIR /app/server

# Prisma + build TS
RUN npx prisma generate
RUN npm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=3333

COPY --from=build /app/node_modules /app/node_modules

# Só o necessário em runtime
COPY --from=build /app/server/package.json ./
COPY --from=build /app/server/node_modules ./node_modules
COPY --from=build /app/server/prisma ./prisma
COPY --from=build /app/server/dist ./dist

EXPOSE 3333

CMD ["node", "dist/src/server.js"]
