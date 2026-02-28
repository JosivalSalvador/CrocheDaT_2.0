# CrocheDaT 2.0 (Base) - Arquitetura Monorepo

Este repositório armazena o código-fonte da plataforma Crochê da T (versão 2.0), utilizando uma arquitetura de Monorepo gerenciada pelo Turborepo. O projeto unifica o desenvolvimento da API (Server) e do Frontend (Web), garantindo consistência de código, tipagem e processos de deploy.

## Visão Geral da Estrutura

O projeto utiliza NPM Workspaces para gerenciamento de dependências. A estrutura de diretórios é organizada da seguinte forma:

* **.github/**: Contém os fluxos de trabalho do GitHub Actions para Integração Contínua (CI) e Entrega Contínua (CD).
* **.husky/**: Configuração de Git Hooks para validação automática de código antes do commit.
* **.turbo/**: Diretório de cache do Turborepo para acelerar builds e tarefas repetitivas.
* **server/**: Aplicação Backend desenvolvida com Fastify, TypeScript, Prisma ORM e PostgreSQL.
* **web/**: Aplicação Frontend desenvolvida com Next.js (App Router), Tailwind CSS e TypeScript.
* **docker-compose.dev.yml**: Orquestração de contêineres para o ambiente de desenvolvimento local (Bancos de dados).
* **docker-compose.yml**: Orquestração de contêineres simulando o ambiente de produção final.

## Pré-requisitos do Sistema

Para executar este projeto, o ambiente deve possuir as seguintes ferramentas instaladas:

* **Node.js**: Versão 22 (LTS) ou superior.
* **NPM**: Versão 10 ou superior.
* **Docker Engine & Docker Compose**: Para execução dos bancos de dados e simulação de produção.

## Instalação e Configuração

1.  **Instalação de Dependências**
    Execute o comando na raiz do projeto para instalar as dependências de todos os workspaces (root, server e web) simultaneamente:
    ```bash
    npm install
    ```

2.  **Configuração de Ambiente (Hooks)**
    O comando de instalação executará automaticamente a configuração do Husky (`prepare`), ativando as validações de `pre-commit`.

## Ambiente de Desenvolvimento

### 1. Banco de Dados (PostgreSQL)
O projeto utiliza dois contêineres de banco de dados isolados para evitar conflitos entre dados de desenvolvimento e execução de testes automatizados.

Execute o comando abaixo para iniciar os bancos:
```bash
docker compose -f docker-compose.dev.yml up -d
```

* **Instância de Desenvolvimento**: Acessível na porta `5432`.
* **Instância de Testes**: Acessível na porta `5433` (utilizada pelos testes de integração).

### 2. Execução da Aplicação
O Turborepo gerencia a execução paralela dos serviços. Para iniciar tanto o Backend quanto o Frontend em modo de desenvolvimento (watch mode):

```bash
npm run dev
```

Caso deseje executar os serviços individualmente:
* Frontend apenas: `npm run dev:web`
* Backend apenas: `npm run dev:server`

### 3. Gerenciamento do Banco de Dados (Prisma)
Os scripts de banco de dados são executados a partir da raiz, mas direcionados ao workspace do servidor:

* **Aplicar Migrations**: `npm run db:migrate` (Atualiza o esquema do banco de desenvolvimento).
* **Gerar Cliente Prisma**: `npm run db:gen` (Atualiza a tipagem do Prisma Client).
* **Prisma Studio**: `npm run db:studio` (Interface visual para gerenciamento de dados).
* **Seed Database**: `npm run db:seed` (Popula o banco com dados iniciais).

## Scripts Disponíveis (Raiz)

| Script | Função | Escopo |
| :--- | :--- | :--- |
| `dev` | Inicia o ambiente de desenvolvimento completo. | Global (Turbo) |
| `build` | Compila o Server e o Web para produção. | Global (Turbo) |
| `lint` | Executa verificação estática de código (ESLint). | Global (Turbo) |
| `type-check` | Verifica a integridade da tipagem TypeScript. | Global (Turbo) |
| `test` | Executa a suíte de testes (Vitest). | Global (Turbo) |

## Qualidade de Código e CI/CD

### Git Hooks (Husky)
Antes de cada commit, o Husky executa o Turborepo para validar apenas os arquivos modificados na branch atual (`dev`) em relação à branch principal. São executados:
* Linting
* Type Checking

Isso impede que código fora dos padrões seja enviado ao repositório.

### Integração Contínua (CI)
O arquivo `.github/workflows/ci.yml` é acionado em pushes para a branch `dev` ou Pull Requests. O fluxo consiste em:

1.  **Server Check**: Levanta um serviço Postgres temporário, gera o Prisma Client e executa Lint, Type-Check e Testes no Backend.
2.  **Web Check**: Executa Lint, Type-Check e Testes no Frontend.
3.  **Docker Build Check**: Verifica se os `Dockerfile` de produção de ambos os projetos são construídos com sucesso.
4.  **Auto PR**: Se todas as etapas anteriores passarem na branch `dev`, um Pull Request é criado automaticamente para a branch `main`.

### Entrega Contínua (CD)
O arquivo `.github/workflows/cd.yml` é acionado em pushes para a branch `main`. O fluxo consiste em:

1.  **Build Multi-arquitetura**: Constrói imagens Docker para arquiteturas `linux/amd64` e `linux/arm64`.
2.  **Publicação**: Envia as imagens para o Docker Hub com as tags `latest` e o hash do commit (`sha`).
    * API: `josivaljunior/croche-api`
    * Web: `josivaljunior/croche-web`
3.  **Injeção de Segredos**: As variáveis de ambiente do Frontend (URLs da API) são injetadas durante o build via GitHub Secrets.

## Simulação de Produção (Docker Local)

Para verificar o comportamento da aplicação final (exatamente como será implantada), utilize o Docker Compose de produção. Este comando irá compilar o código TypeScript, gerar os builds otimizados e subir os contêineres finais.

```bash
docker compose -f docker-compose.yml up --build
```

Acesse os serviços em:
* **Web**: http://localhost:3000
* **API**: http://localhost:3333