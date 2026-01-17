# ---------- deps ----------
FROM node:24-alpine AS deps
WORKDIR /app

# Root workspace
COPY package.json package-lock.json turbo.json ./
COPY web/package.json web/package.json
COPY server/package.json server/package.json

RUN npm install --frozen-lockfile

# ---------- build ----------
FROM node:24-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build -w web

# ---------- runtime ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next standalone output
COPY --from=build /app/web/.next/standalone ./
COPY --from=build /app/web/.next/static ./web/.next/static
COPY --from=build /app/web/public ./web/public

EXPOSE 3000

CMD ["node", "web/server.js"]
