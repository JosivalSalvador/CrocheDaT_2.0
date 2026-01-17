# CrocheDaT API Server

Este diretório contém o microsserviço de Backend da plataforma, responsável pela lógica de negócios, persistência de dados e autenticação. A aplicação é construída sobre o framework **Fastify**, priorizando performance, validação estrita de dados via **Zod** e arquitetura modular.

## Stack Tecnológica

* **Runtime:** Node.js (v22+) & TypeScript.
* **Framework:** Fastify v5.
* **Validação:** Zod + `fastify-type-provider-zod` (Inferência automática de schemas HTTP).
* **Banco de Dados:** PostgreSQL.
* **ORM:** Prisma v7 (com `@prisma/adapter-pg` para performance serverless).
* **Autenticação:** JWT (`@fastify/jwt`) e Bcrypt.js.
* **Documentação:** Swagger (OpenAPI) via Scalar Reference.
* **Testes:** Vitest + Supertest.

## Arquitetura e Estrutura

O projeto adota uma arquitetura baseada em **Recursos** (Resource-based Architecture) dentro de `src/resources`. Cada entidade do domínio possui seu próprio diretório contendo todas as camadas necessárias, isolando responsabilidades.

```text
src/
├── app.ts                  # Configuração da instância do Fastify e plugins globais
├── server.ts               # Ponto de entrada (Entrypoint) e escuta de porta
├── validateEnv/            # Validação estrita das variáveis de ambiente ao iniciar
├── lib/
│   ├── prisma.ts           # Instância singleton do Prisma Client
│   └── error-handler.ts    # Handler global de exceções (Zod Error vs App Error)
├── middlewares/            # Middlewares reutilizáveis (ex: Auth Guard)
├── router/                 # Definição das rotas principais (API Gateway interno)
└── resources/              # Módulos de Domínio
    └── users/
        ├── users.controller.ts # Camada HTTP (Request/Response)
        ├── users.service.ts    # Regras de Negócio (Lógica pura sem HTTP)
        ├── users.schema.ts     # Schemas Zod para validação de Input/Output
        ├── users.types.ts      # Tipos estáticos inferidos
        ├── users.router.ts     # Definição das rotas do recurso
        └── tests/              # Testes unitários/integração específicos do recurso
```

## Configuração do Ambiente

O serviço depende de variáveis de ambiente para conectar ao banco e configurar a segurança. A validação dessas variáveis ocorre em `src/validateEnv/index.ts`. Se uma variável crítica estiver faltando, a aplicação falhará imediatamente ao iniciar (Fail Fast).

Crie um arquivo `.env` na raiz de `/server`:

```ini
# Conexão com o PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/crochedat?schema=public"

# Configuração do Servidor
PORT=3333
NODE_ENV="development"

# Segurança
JWT_SECRET="seu-segredo-jwt-aqui"
```

## Instalação e Execução

Certifique-se de que o container do banco de dados (definido na raiz do monorepo) esteja rodando.

```bash
# 1. Instalar dependências
npm install

# 2. Executar migrações do banco
npx prisma migrate dev

# 3. Rodar servidor em desenvolvimento (Watch Mode)
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.
A documentação interativa (Swagger/Scalar) estará em `http://localhost:3333/docs`.

## Scripts Disponíveis

| Script | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor com `tsx watch` e logs formatados (`pino-pretty`). |
| `npm run build` | Compila o TypeScript para JavaScript na pasta `dist/`. |
| `npm start` | Executa o código compilado em produção (`dist/server.js`). |
| `npm run lint` | Executa ESLint para análise estática. |
| `npm run type-check` | Executa checagem de tipos do TypeScript (sem emitir arquivos). |
| `npm run test` | Roda a suíte de testes uma única vez. |

## Banco de Dados (Prisma)

Comandos úteis para o dia a dia:

* **Criar nova migration:** `npx prisma migrate dev` (Rode sempre que alterar o `schema.prisma`).
* **Visualizar dados (GUI):** `npx prisma studio`.
* **Resetar banco de dados:** `npx prisma migrate reset` (Apaga todos os dados e recria tabelas).

## Fluxo de Desenvolvimento de Features

Ao criar uma nova funcionalidade, siga o padrão estabelecido:

1.  **Schema (`.schema.ts`):** Defina os schemas Zod para Body, Params e Response. Isso garante a tipagem.
2.  **Service (`.service.ts`):** Implemente a lógica de negócio. O service **não deve saber** o que é HTTP (não receba `request`/`reply` aqui). Lance `AppError` em caso de falhas lógicas.
3.  **Controller (`.controller.ts`):** Receba a requisição, chame o Service e retorne a resposta.
4.  **Router (`.router.ts`):** Registre a rota utilizando o `fastify-type-provider-zod`.

Exemplo de rota tipada:
```typescript
app.withTypeProvider<ZodTypeProvider>().post('/', {
  schema: {
    body: createUserSchema,
    response: { 201: userResponseSchema }
  }
}, UsersController.create)
```

## Testes Automatizados

Os testes utilizam **Vitest**. Existe uma configuração de ambiente isolado para garantir integridade.

* **Setup:** O script `test:setup` reseta o banco de dados definido em `.env.test` antes de rodar os testes.
* **Execução:**
    ```bash
    npm run test        # Rodar todos
    npm run test:watch  # Rodar em modo assistido
    ```

## Tratamento de Erros

Erros são centralizados no `src/lib/error-handler.ts`.
* **ZodError:** Retorna status `400` com os campos inválidos.
* **AppError:** Erros de regra de negócio (ex: "Email já existe"). Retorna o status code definido na classe.
* **Erro Genérico:** Qualquer outro erro retorna `500` (Internal Server Error) e não expõe detalhes ao cliente.