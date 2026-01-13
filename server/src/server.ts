import { app } from './app.js'
import { env } from './validateEnv/index.js'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    // .info é semanticamente correto para informar que o sistema subiu
    console.info(`HTTP Server running on http://localhost:${env.PORT}`)
  })
