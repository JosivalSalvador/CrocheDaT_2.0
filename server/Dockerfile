# -------- deps --------
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json

RUN npm install

# -------- build --------
FROM node:24-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY server ./server
COPY package.json ./

WORKDIR /app/server
RUN npm run build

# -------- runtime --------
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/prisma ./prisma

# IMPORTANTE: copiar o Prisma Client gerado
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules ./node_modules

COPY server/package.json ./

EXPOSE 3333
CMD ["node", "dist/src/server.js"]

