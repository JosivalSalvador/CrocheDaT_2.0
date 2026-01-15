# CrocheDaT 2.0

Repositório monorepo da plataforma de e-commerce CrocheDaT. O projeto integra uma API REST de alta performance e um frontend moderno, utilizando conteinerização para padronização de ambientes.

## Stack Tecnológica

### Server (Backend)
Microsserviço de API construído sobre o ecossistema Node.js (v22+).
* **Core Framework:** Fastify v5 (Foco em performance e baixo overhead).
* **Validação & Tipagem:** Zod + `fastify-type-provider-zod` (Inferência de tipos automática e validação de runtime).
* **Banco de Dados:** PostgreSQL interagido via Prisma ORM v7.
* **Documentação:** Swagger (OpenAPI) visualizado via Scalar API Reference.
* **Testes:** Vitest + Supertest (Testes de integração e unitários).
* **Segurança:** JWT para autenticação, Bcryptjs para hashing, Helmet e Rate Limit.

### Web (Frontend)
Aplicação renderizada via Server Components e Client Components.
* **Framework:** Next.js 16 (App Router).
* **Library:** React 19 (RC/Latest).
* **Estilização:** TailwindCSS v4 + `tailwindcss-animate` + `clsx`/`tailwind-merge`.
* **State Management/Fetching:** TanStack Query v5.
* **Testes:** Vitest, React Testing Library e MSW (Mock Service Worker).
* **Componentes:** Radix UI Primitives, Lucide React, Framer Motion.

### DevOps & Tooling
* **Linting/Formatting:** ESLint 9 (Flat Config), Prettier.
* **Hooks:** Husky + Lint-staged.
* **Containerização:** Docker e Docker Compose.
* **CI/CD:** GitHub Actions.

---

## Estrutura do Monorepo

```text
/
├── .github/                # Workflows de CI/CD
├── server/                 # Aplicação Backend (Fastify)
│   ├── src/                # Código fonte
│   ├── prisma/             # Schemas e Migrations
│   └── ...
├── web/                    # Aplicação Frontend (Next.js)
│   ├── src/                # Componentes, Hooks, Pages
│   └── ...
├── docker-compose.yml      # Infraestrutura de desenvolvimento (Postgres)
└── docker-compose.prod.yml # Orquestração para produção
```

---

## Configuração e Execução

### 1. Pré-requisitos
* Node.js v22+ (Gerenciado via NVM recomendado).
* Docker & Docker Compose (Para o banco de dados).
* NPM ou PNPM.

### 2. Variáveis de Ambiente
Duplique os arquivos de exemplo (`.env.example` se existirem) ou crie novos `.env` em cada diretório.

**server/.env**
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/crochedat?schema=public"
JWT_SECRET="seu_segredo_jwt_super_seguro"
PORT=3333
# NODE_ENV é setado automaticamente pelos scripts
```

**web/.env**
```ini
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

### 3. Infraestrutura (Banco de Dados)
Antes de iniciar as aplicações, suba o serviço de persistência:
```bash
docker compose up -d
```
Isso iniciará o PostgreSQL na porta `5432`.

### 4. Executando o Backend (Server)
O servidor utiliza `tsx` para execução e `prisma` para gerenciamento de esquema.

```bash
cd server
npm install

# Aplica as migrações no banco de dados
npx prisma migrate dev

# Inicia o servidor em modo watch (com logs formatados pelo pino-pretty)
npm run dev
```
* API: `http://localhost:3333`
* Documentação Swagger/Scalar: `http://localhost:3333/docs` (se configurado na rota padrão).

### 5. Executando o Frontend (Web)
```bash
cd web
npm install

# Inicia o servidor de desenvolvimento Next.js
npm run dev
```
* Aplicação: `http://localhost:3000`

---

## Rotinas de Testes e Qualidade

O projeto utiliza **Vitest** em ambos os ambientes para paridade de ferramentas.

### Backend (Server)
Os testes do servidor exigem um banco de dados de teste limpo. O script `test:setup` cuida de resetar o banco antes de rodar.

* **Rodar testes (Single Run):** Utiliza um arquivo `.env.test` específico.
    ```bash
    cd server
    npm run test
    ```
* **Modo Watch:**
    ```bash
    cd server
    npm run test:watch
    ```
* **Type Check:**
    ```bash
    cd server
    npm run type-check
    ```

### Frontend (Web)
Inclui testes de componentes e mocks de API via MSW.

* **Rodar testes (Headless):**
    ```bash
    cd web
    npm run test:run
    ```
* **Interface Gráfica (Vitest UI):**
    ```bash
    cd web
    npm run test:ui
    ```

### Hooks de Git (Husky)
Ao realizar um commit, o **lint-staged** é acionado automaticamente:
1.  **Server:** Roda `eslint --fix` em arquivos `.ts` e `.js`.
2.  **Web:** Roda `eslint --fix` e `prettier --write` em arquivos `.tsx`, `.ts`, `.json`, etc.

---

## Build e Produção

Para gerar os artefatos otimizados para produção:

**Server:**
Compila o TypeScript para JavaScript puro na pasta `dist/`.
```bash
cd server
npm run build
npm start # Roda node dist/server.js
```

**Web:**
Gera o build otimizado do Next.js.
```bash
cd web
npm run build
npm start
```

**Docker:**
Para subir todo o ambiente simulando produção (utilizando `docker-compose.prod.yml`):
```bash
docker compose -f docker-compose.prod.yml up --build
```