# CrocheDaT 2.0

Este repositório contém o código-fonte da plataforma CrocheDaT, estruturada como um monorepo que agrega tanto o serviço de backend (API) quanto o frontend (Aplicação Web). O projeto utiliza uma arquitetura baseada em microsserviços containerizados para produção e desenvolvimento local.

## Visão Geral da Arquitetura

O sistema é dividido em dois diretórios principais dentro da raiz:

* **server/**: API RESTful construída com NestJS. Responsável por regras de negócio, autenticação, integração com banco de dados e validação de dados.
* **web/**: Interface do usuário construída com Next.js (React). Consome a API do servidor e gerencia o estado da aplicação no lado do cliente.

A infraestrutura é orquestrada via Docker, garantindo paridade entre os ambientes de desenvolvimento e produção.

## Tecnologias e Ferramentas

### Frontend (Web)
* **Framework:** Next.js (React)
* **Linguagem:** TypeScript
* **Estilização:** TailwindCSS
* **Testes:** Vitest (Testes Unitários)
* **HTTP Client:** Axios ou Fetch API nativa

### Backend (Server)
* **Runtime:** Node.js v22
* **Framework:** NestJS
* **Banco de Dados:** PostgreSQL
* **ORM:** Prisma
* **Testes:** Jest (Unitários e Integração)
* **Autenticação:** JWT (JSON Web Tokens)

### Infraestrutura e DevOps
* **Containerização:** Docker & Docker Compose
* **CI/CD:** GitHub Actions
* **Controle de Qualidade:** Husky, Lint-staged, ESLint e Prettier
* **Registry:** DockerHub

---

## Configuração do Ambiente de Desenvolvimento

Para executar este projeto localmente, certifique-se de ter instalado:
* Node.js (versão 22 ou superior)
* Docker e Docker Compose
* Git

### 1. Variáveis de Ambiente

O projeto não funcionará sem as variáveis de ambiente configuradas. Crie os arquivos `.env` nas pastas respectivas baseando-se nos arquivos de exemplo.

**Backend (`server/.env`):**
```env
# Conexão com o banco de dados (exemplo para Docker local)
DATABASE_URL="postgresql://user:password@localhost:5432/crochedat?schema=public"

# Segredo para assinatura de tokens JWT
JWT_SECRET="segredo_desenvolvimento"
```

**Frontend (`web/.env`):**
```env
# URL base da API
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

### 2. Inicialização da Infraestrutura (Banco de Dados)

Antes de iniciar as aplicações, suba o container do banco de dados PostgreSQL definido na raiz do projeto.

```bash
docker compose up -d
```
Isso iniciará o serviço de banco de dados na porta `5432`.

### 3. Instalação e Execução

Recomenda-se executar o backend e o frontend em terminais separados para melhor visualização dos logs.

**Terminal 1 - Backend (Server):**
```bash
cd server
npm install

# Executar migrações do Prisma para criar as tabelas
npx prisma migrate dev

# Iniciar em modo de desenvolvimento (watch mode)
npm run start:dev
```
O servidor estará rodando em `http://localhost:3333`.

**Terminal 2 - Frontend (Web):**
```bash
cd web
npm install

# Iniciar em modo de desenvolvimento
npm run dev
```
A aplicação web estará acessível em `http://localhost:3000`.

---

## Padrões de Código e Hooks (Git)

Este projeto utiliza **Husky** para garantir a qualidade do código antes de cada commit.

Ao executar `git commit`, os seguintes processos são disparados automaticamente via `lint-staged`:
1.  **ESLint:** Verifica erros de sintaxe e padrões de código nos arquivos modificados.
2.  **Type-Check:** Verifica a consistência da tipagem TypeScript.
3.  **Prettier:** Formata o código automaticamente.

Se qualquer uma dessas etapas falhar, o commit será abortado. Corrija os erros apontados no terminal e tente novamente.

---

## Testes Automatizados

A suíte de testes é dividida por aplicação.

**Executando testes do Backend:**
```bash
cd server
npm run test        # Executa testes unitários
npm run test:e2e    # Executa testes de ponta a ponta (se configurado)
```
*Nota: Para ambientes de CI, utilize `npm run test -- --ci --forceExit` para evitar travamentos.*

**Executando testes do Frontend:**
```bash
cd web
npm run test:run
```

---

## Pipeline de CI/CD

O fluxo de integração e entrega contínua é gerenciado pelo GitHub Actions e segue o fluxo de trabalho abaixo:

### Pull Request (Branch `dev`)
Sempre que um push é feito na branch `dev` ou um Pull Request é aberto:
1.  Instalação de dependências.
2.  Execução de Linting e verificação de tipos.
3.  Execução dos testes do Server e Web em paralelo.
4.  Verificação de build do Docker (garante que a imagem de produção é montável).
5.  Se aprovado, um PR é criado automaticamente ou atualizado para a branch `main`.

### Deploy (Branch `main`)
Quando o código é mergeado na branch `main`:
1.  O workflow de CD é acionado.
2.  As imagens Docker de produção (`server` e `web`) são construídas.
3.  As imagens são enviadas (push) para o DockerHub com a tag `latest`.
4.  (Opcional) Trigger de atualização no ambiente de hospedagem.

## Docker em Produção

Para simular o ambiente de produção localmente ou para deploy, utilize o arquivo `docker-compose.prod.yml`. Este arquivo utiliza as imagens otimizadas geradas pelos Dockerfiles de produção.

```bash
# Construir e rodar as imagens de produção localmente
docker compose -f docker-compose.prod.yml up --build
```