import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import apiReference from '@scalar/fastify-api-reference'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie' // <--- Import mantido
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'

import { routes } from './routes/index.js'
import { healthRoutes } from './routes/health.routes.js'
import { errorHandler } from './lib/error-handler.js'
import { env } from './validateEnv/index.js'

export const app = fastify({
  logger:
    env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        }
      : true,
}).withTypeProvider<ZodTypeProvider>()

// --- COMPILADORES ZOD ---
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// --- SEGURANÇA (INFRA) ---

// 1. Helmet
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'unpkg.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],
    },
  },
})

// 2. Rate Limit
app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Você excedeu o limite de requisições. Tente novamente em ${context.after}.`,
    }
  },
})

// 3. Cookie (MOVIDO PARA CÁ)
// Tem que vir antes do CORS e das Rotas para funcionar corretamente
app.register(fastifyCookie, {
  secret: env.JWT_SECRET, // (Opcional) Usa o mesmo segredo para assinar cookies se precisar no futuro
  hook: 'onRequest', // Garante que o parse acontece cedo
})

// 4. CORS (AJUSTADO PARA COOKIES)
app.register(cors, {
  // Em Dev, permitimos localhost. Em Prod, coloque a URL do seu Front (ex: https://meusite.com)
  origin: (origin, cb) => {
    // Permite requisições sem origin (como Postman ou Mobile Apps) e localhost
    if (!origin || origin.startsWith('http://localhost')) {
      cb(null, true)
      return
    }
    // Bloqueia outros (Segurança)
    // cb(new Error("Not allowed"), false) // Descomente em prod para ser restritivo
    cb(null, true) // Por enquanto em dev, libera geral
  },
  credentials: true, // <--- OBRIGATÓRIO: Permite que o navegador envie/receba cookies
})

// 5. JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  // Opcional: configura o cookie automático do fastify-jwt, mas estamos fazendo manual no controller
  sign: {
    expiresIn: '10m', // Token de acesso morre em 10 minutos
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

// --- DOCUMENTAÇÃO ---
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Crochê da T API',
      description: 'Base de API Profissional Node.js',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [{ name: 'Infra', description: 'Rotas de infraestrutura e monitoramento' }],
  },
  transform: jsonSchemaTransform,
})

app.register(apiReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'purple',
  },
})

// --- ROTAS ---
app.register(healthRoutes)
app.register(routes)

// --- ERROR HANDLER ---
app.setErrorHandler(errorHandler)
