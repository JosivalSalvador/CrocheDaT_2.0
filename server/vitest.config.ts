import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Permite usar describe, it, expect sem importar em cada arquivo (se quiser)
    globals: true,
    // Define que estamos testando um ambiente Node.js
    environment: 'node',
    // Indica onde estão os arquivos de teste
    include: ['src/**/*.test.ts'],
    // Ignora pastas de build
    exclude: ['node_modules', 'dist'],

    // Tempo limite para cada teste (útil se o banco demorar um pouco)
    testTimeout: 10000,
  },
})
