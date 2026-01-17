# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---------- deps ----------
FROM base AS deps

# Copia manifests do monorepo
COPY package.json package-lock.json ./
COPY web/package.json ./web/package.json

# Instala apenas deps do workspace web
# --ignore-scripts evita husky/preinstall
RUN npm ci --ignore-scripts --workspace=web --include=dev


# ---------- build ----------
FROM base AS build

# node_modules do root + workspace
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules

# Código
COPY web ./web
COPY package.json package-lock.json ./

# Build A PARTIR DA RAIZ (crítico para monorepo)
RUN npm run build --workspace=web

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Standalone output
COPY --from=build /app/web/.next/standalone ./
COPY --from=build /app/web/.next/static ./web/.next/static
COPY --from=build /app/web/public ./web/public

EXPOSE 3000
CMD ["node", "web/server.js"]
