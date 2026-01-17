# CrocheDaT 2.0 - Server API

Este diretório contém a API RESTful da plataforma Crochê da T 2.0. A aplicação é construída sobre o framework Fastify, utilizando TypeScript para tipagem estática, Prisma ORM para interação com o banco de dados PostgreSQL e Zod para validação de esquemas e inferência de tipos.

## Stack Tecnológica

A arquitetura baseia-se nas seguintes bibliotecas principais:

* **Core**: Fastify (v5).
* **Linguagem**: TypeScript (v5.9).
* **ORM**: Prisma Client e Prisma Migrate (Adapter PostgreSQL).
* **Validação**: Zod + fastify-type-provider-zod (Tipagem ponta a ponta).
* **Testes**: Vitest + Supertest.
* **Documentação**: Scalar API Reference (Swagger).
* **Autenticação**: JWT (@fastify/jwt) e Bcryptjs.
* **Logging**: Pino (com pino-pretty em desenvolvimento).

## Estrutura de Diretórios e Arquitetura

O projeto segue uma arquitetura baseada em recursos (Resource-based), onde cada domínio da aplicação possui seus próprios controladores, serviços e rotas isolados.

* **prisma/**: Contém o esquema do banco de dados (`schema.prisma`) e scripts de seed.
* **src/app.ts**: Configuração inicial da aplicação Fastify, registro de plugins e middlewares globais.
* **src/server.ts**: Ponto de entrada que inicia o servidor HTTP.
* **src/errors/**: Classes de erro customizadas (`AppError`) para tratamento centralizado de exceções.
* **src/lib/**: Configurações de serviços de terceiros e instâncias compartilhadas (ex: cliente do Prisma).
* **src/middlewares/**: Interceptadores de requisição, como verificação de autenticação JWT.
* **src/resources/**: Módulos da aplicação organizados por domínio (ex: `users`).
    * **controller.ts**: Gerencia entrada/saída HTTP (Request/Reply).
    * **service.ts**: Contém a regra de negócio e chamadas ao banco.
    * **schema.ts**: Definições Zod para validação de rotas.
    * **routes.ts**: Registro das rotas do recurso no Fastify.
    * **tests/**: Testes unitários e de integração (E2E) específicos do recurso.
* **src/router/**: Agregador de rotas e versionamento da API (v1).
* **src/validateEnv/**: Validação das variáveis de ambiente necessárias para o startup.

## Variáveis de Ambiente

O sistema utiliza arquivos `.env` para configuração. As variáveis são validadas na inicialização do serviço.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Define o ambiente de execução (`dev`, `test`, `production`). | `dev` |
| `PORT` | Porta onde o servidor será executado. | `3333` |
| `DATABASE_URL` | String de conexão com o PostgreSQL. | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Chave secreta para assinatura de tokens. | `super-secret-key` |

Arquivos de ambiente incluídos no repositório:
* `.env.example`: Modelo de configuração.
* `.env.test`: Configuração específica para execução de testes (aponta para porta 5433).
* `.env.prod`: Configuração usada nos builds de produção/docker.

## Scripts Disponíveis

Os scripts podem ser executados via `npm run <script>` dentro da pasta `server` ou via `turbo run <script> --filter=server` na raiz.

### Desenvolvimento
* `dev`: Gera o cliente Prisma, carrega variáveis do `.env` e inicia o servidor com `tsx watch`. Inclui formatação de logs com `pino-pretty`.
* `start`: Inicia a aplicação compilada (requer build prévio). Aponta para `dist/src/server.js`.

### Build e Qualidade
* `build`: Compila o código TypeScript usando `tsc`.
* `lint`: Executa o ESLint para verificar padrões de código.
* `lint:fix`: Corrige automaticamente problemas de linting.
* `type-check`: Executa o compilador TypeScript sem emitir arquivos, apenas para validar tipos.

### Banco de Dados (Prisma)
* `db:gen`: Gera os tipos do Prisma Client (`node_modules`). Deve ser rodado após alterações no schema.
* `db:migrate`: Aplica migrações pendentes no banco de dados de desenvolvimento.
* `db:studio`: Abre uma interface web para visualização e edição direta dos dados.
* `db:seed`: Popula o banco de dados com informações iniciais definidas em `prisma/seed.ts`.

### Testes (Vitest)
O ambiente de testes é isolado e utiliza um banco de dados separado (definido em `.env.test`).

* `test`: Executa todos os testes uma única vez.
* `test:watch`: Executa testes em modo observação (rerun on save).
* `test:setup`: Script de utilidade que reseta o banco de testes (`migrate reset --force`) antes da execução.

## Fluxo de Desenvolvimento

1.  **Modelagem de Dados**: Alterações na estrutura do banco devem ser feitas em `prisma/schema.prisma`.
2.  **Migração**: Execute `npm run db:migrate` para criar a migração SQL e atualizar o banco local.
3.  **Tipagem**: O Prisma Client é atualizado automaticamente no comando de dev, mas pode ser forçado com `npm run db:gen`.
4.  **Criação de Recurso**:
    * Defina os esquemas Zod (`schema.ts`).
    * Implemente a lógica de negócio (`service.ts`).
    * Crie o controlador (`controller.ts`).
    * Registre as rotas (`router.ts`).
    * Adicione o router ao arquivo principal (`src/router/index.ts`).

## Tratamento de Erros e Validação

O projeto utiliza `fastify-type-provider-zod`. Isso garante que:
1.  Os dados de entrada (body, query, params) são validados automaticamente antes de chegarem ao controlador.
2.  Erros de validação retornam status `400` com detalhes formatados.
3.  Erros de negócio devem lançar a classe `AppError` (ex: `throw new AppError('User not found', 404)`), que é capturada pelo `error-handler.ts` global.

## Docker e Deploy

O `Dockerfile` na raiz deste diretório é otimizado para produção. Ele realiza o build em múltiplos estágios (multi-stage build) para reduzir o tamanho da imagem final.

Para execução local em contêineres, verifique os arquivos `docker-compose` na raiz do monorepo.