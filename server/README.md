# CrocheDaT - Server (API RESTful)

Este é o pacote de back-end do sistema CrocheDaT, responsável por toda a regra de negócio, autenticação e persistência de dados. A API foi projetada com uma arquitetura baseada em recursos (Resource-Based Architecture) para garantir escalabilidade e fácil manutenção.

## Stack Tecnológica

* **Framework Base:** Fastify (v5)
* **Linguagem:** TypeScript
* **Banco de Dados & ORM:** PostgreSQL com Prisma ORM
* **Validação e Tipagem:** Zod + `fastify-type-provider-zod`
* **Autenticação:** JWT (`@fastify/jwt`) e Cookies
* **Segurança:** `@fastify/helmet`, `@fastify/rate-limit`, CORS e proteção CSRF
* **Testes:** Vitest + Supertest
* **Documentação:** Swagger & Scalar API Reference (`@scalar/fastify-api-reference`)

## Arquitetura de Diretórios (`/src`)

A aplicação segue uma divisão clara de responsabilidades:

* `/resources`: Contém os domínios da aplicação (Auth, Carts, Categories, Chats, Products, Tokens, Users). Cada recurso é isolado e possui seus próprios:
    * `*.controller.ts`: Lida com o ciclo de vida da requisição/resposta do Fastify.
    * `*.service.ts`: Contém a regra de negócio central.
    * `*.router.ts`: Define as rotas do módulo e os schemas de validação.
    * `*.schema.ts`: Schemas do Zod para validação de entrada e saída.
    * `/tests`: Testes unitários focados nas funções do serviço e controller.
* `/middlewares`: Interceptadores globais, como `verify-jwt.ts` para checar tokens e `verify-user-role.ts` para controle de acesso (Admin/User).
* `/lib`: Configurações de terceiros, incluindo a instância do Prisma e o sistema global de tratamento de erros (`error-handler.ts`).
* `/router`: Arquivos de roteamento global (`v1.ts`) que agregam as rotas de todos os recursos.

## Variáveis de Ambiente

Antes de iniciar, crie um arquivo `.env` na raiz do pacote `/server` baseado no `.env.example`. Você precisará configurar:

    NODE_ENV=development
    PORT=3333
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/crochedat_db"
    JWT_SECRET="sua-chave-secreta"

*Para rodar os testes, crie também um arquivo `.env.test`.*

## Instalação e Execução

As dependências já devem estar instaladas via NPM Workspaces. Para rodar a API isoladamente:

1. Gere os artefatos do Prisma:
    npm run db:gen

2. Rode as migrations para criar as tabelas no banco de dados:
    npm run db:migrate

3. (Opcional) Popule o banco com dados iniciais (Seed):
    npm run db:seed

4. Inicie o servidor em modo de desenvolvimento:
    npm run dev

A API estará disponível em `http://localhost:3333`.

## Gerenciamento do Banco de Dados (Prisma)

O projeto utiliza comandos encapsulados no `package.json` para facilitar o uso do Prisma com o `.env` correto:

* `npm run db:studio`: Abre o painel visual do Prisma em `http://localhost:5555` para visualizar os dados.
* `npm run db:reset`: CUIDADO! Apaga o banco de dados atual, roda as migrations do zero e aplica o seed novamente. Útil para limpar o ambiente de dev.
* `npm run db:deploy`: Roda as migrations em ambiente de produção.

## Documentação Interativa (Swagger/Scalar)

O projeto utiliza geração dinâmica de documentação através do Zod. Com o servidor rodando, acesse a rota abaixo para ver todos os endpoints disponíveis, seus formatos de payload e testá-los diretamente no navegador:

    http://localhost:3333/docs

## Testes

A API possui uma suíte de testes unitários construída com Vitest. O ambiente de testes utiliza um banco de dados separado (definido no `.env.test`) que é resetado a cada execução para garantir isolamento.

* Rodar testes uma vez:
    npm run test

* Rodar testes em modo "watch" (desenvolvimento):
    npm run test:watch