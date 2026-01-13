import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import apiReference from '@scalar/fastify-api-reference'
import fastifyJwt from '@fastify/jwt'
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

// AQUI ESTÁ A MUDANÇA DO LOGGER
export const app = fastify({
  logger:
    env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z', // Formata a hora bonitinho
              ignore: 'pid,hostname', // Remove poluição visual no terminal
              colorize: true,
            },
          },
        }
      : true, // Em produção, usa JSON padrão (melhor para performance)
}).withTypeProvider<ZodTypeProvider>()

// --- COMPILADORES ZOD ---
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// --- SEGURANÇA (INFRA) ---

// 1. Helmet: Adiciona headers de segurança HTTP
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

// 2. Rate Limit: Protege contra abuso/DDoS
app.register(rateLimit, {
  max: 100, // Máximo de 100 requisições
  timeWindow: '1 minute', // Por minuto, por IP
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Você excedeu o limite de requisições. Tente novamente em ${context.after}.`,
    }
  },
})

// 3. CORS: Controla quem pode acessar a API
app.register(cors, {
  origin: '*', // DEV: '*', PROD: 'https://seu-site.com'
})

// 4. JWT: Autenticação
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
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
