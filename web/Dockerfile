# --- BUILDER ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

# Captura variáveis de ambiente necessárias no build (para o Next.js "assar" no código)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

# Desabilita telemetria durante o build (opcional, mas recomendado)
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- RUNNER ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cria um grupo e usuário do sistema para não rodar como root (Segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public

# Cria a pasta .next e ajusta permissões
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia a saída "standalone" com as permissões do usuário criado
# Se essa linha falhar, veja o aviso importante abaixo!
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Muda para o usuário seguro
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]