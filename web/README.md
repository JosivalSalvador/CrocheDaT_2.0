# CrocheDaT 2.0 - Web (Front-end)

Este é o pacote de front-end do sistema CrocheDaT. A aplicação fornece a interface do usuário para consumidores (e-commerce) e administradores (dashboard), sendo responsável pelo consumo da API RESTful desenvolvida na pasta `/server`.

## Stack Tecnológica

- **Framework:** Next.js 16 (utilizando o paradigma do App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS v4
- **Componentes de UI:** Radix UI primitivos e Shadcn UI (componentes localizados em `/components/ui`)
- **Gerenciamento de Estado/Fetch:** React Query (`@tanstack/react-query`)
- **Formulários e Validação:** React Hook Form + Zod (`@hookform/resolvers`)
- **Testes (E2E):** Playwright
- **Testes (Unitários/Componentes):** Vitest + React Testing Library + MSW para mock de rotas

## Arquitetura de Roteamento (`/app`)

O Next.js App Router foi estruturado utilizando Route Groups (`(...)`) para separar o layout e as lógicas de negócio sem afetar a URL pública.

- **`(public)`**: Rotas acessíveis por qualquer visitante. Inclui:
  - `/`: Home (vitrine de produtos).
  - `/login`, `/register`: Fluxo de autenticação.
  - `/product/[id]`, `/category/[slug]`: Visualização de produtos e filtragem.
- **`(customer)`**: Rotas protegidas voltadas para clientes autenticados. Inclui:
  - `/home`, `/profile`: Gerenciamento da conta e histórico.
  - `/chats`: Sistema de suporte/atendimento.
- **`(admin)`**: Painel administrativo protegido, acessível apenas por usuários com a role `ADMIN`. Inclui:
  - `/dashboard`: Visão geral do negócio.
  - `/dashboard/products`, `/dashboard/users`: Gerenciamento do catálogo e permissões.
  - `/dashboard/chats`: Resposta aos chamados de suporte dos clientes.

## Estrutura de Diretórios Auxiliares

- `/actions`: Server Actions do Next.js para manipulação de dados sensíveis diretamente no servidor.
- `/services` e `/lib/api`: Camada de consumo da API externa (`/server`), utilizando uma instância centralizada do HTTP Client (`http-client.ts`).
- `/hooks`: Custom hooks abstratos para gerenciar a lógica de queries (React Query) de produtos, carrinhos, etc.
- `/schemas`: Tipagens de Zod compartilhadas que refletem a estrutura de dados esperada pela API.

## Instalação e Execução

Para rodar apenas a interface web (certifique-se de que a API `/server` já está rodando para os dados aparecerem corretamente):

1. Crie o arquivo `.env` baseado no `.env.example` na pasta `/web` para apontar para a URL local da API.

2. Inicie o servidor do Next.js:
   npm run dev

A aplicação estará acessível em `http://localhost:3000`.

## Testes

O projeto front-end possui uma cobertura ampla, dividida em duas frentes:

**Testes End-to-End (E2E) com Playwright:**
Simulam a jornada completa do usuário navegando pelas páginas.

- Rodar os testes E2E em background:
  npm run test:e2e
- Abrir a interface visual do Playwright:
  npm run test:e2e:ui
- Iniciar o gerador de código do Playwright (grava seus cliques na tela e transforma em código):
  npm run test:e2e:codegen

**Testes Unitários/Componentes com Vitest:**
Testam componentes React e funções de negócio de forma isolada.

- Executar testes unitários:
  npm run test
- Abrir interface visual do Vitest no navegador:
  npm run test:ui
