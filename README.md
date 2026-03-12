# CrocheDaT

Sistema de e-commerce completo voltado para a venda de produtos de crochê. O projeto é estruturado em uma arquitetura de Monorepo utilizando NPM Workspaces e Turborepo, separando a aplicação em dois pacotes principais: o front-end web e a API de back-end.

## Estrutura do Monorepo

O repositório está dividido nos seguintes diretórios principais:

* `/web`: Aplicação front-end desenvolvida com Next.js 16 (App Router), React, TailwindCSS v4 e integração com React Query. Inclui a área do cliente e o painel administrativo.
* `/server`: API RESTful desenvolvida com Node.js, Fastify, Prisma ORM e PostgreSQL, utilizando arquitetura baseada em recursos e validação com Zod.

Para detalhes técnicos específicos de cada ambiente, consulte as documentações individuais:
* [Documentação do Web (Front-end)](./web/README.md)
* [Documentação do Server (API)](./server/README.md)

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente local:

* Node.js (v20 ou superior recomendado)
* NPM (v11+)
* Docker e Docker Compose

## Configuração do Ambiente

1. Clone o repositório:
    git clone [https://github.com/JosivalSalvador/CrocheDaT_2.0.git](https://github.com/JosivalSalvador/CrocheDaT_2.0.git)
    cd CrocheDaT_2.0

2. Instale as dependências na raiz (o NPM cuidará dos workspaces automaticamente):
    npm install

3. Configure as variáveis de ambiente:
    Navegue até as pastas `/web` e `/server` e crie os arquivos `.env` baseados nos arquivos de exemplo disponibilizados no projeto.
    
    cp web/.env.example web/.env
    cp server/.env.example server/.env

## Executando o Projeto com Docker

O projeto possui dois arquivos de orquestração do Docker, dependendo da sua necessidade:

**Opção A: Ambiente de Desenvolvimento (Apenas Banco de Dados)**
Sobe apenas o banco de dados PostgreSQL principal e o banco de testes. Ideal para quando você quer rodar a aplicação localmente pelo terminal para ver os logs diretamente.
    
    docker compose -f docker-compose.dev.yml up -d

**Opção B: Sistema Completo**
Sobe todo o ecossistema do projeto (Banco de dados, API e Front-end) em containers.
    
    docker compose up -d

## Inicializando a Aplicação Localmente

Se você optou por rodar apenas o banco de dados via Docker (Opção A), siga os passos abaixo para preparar o banco e rodar a aplicação via Turborepo:

1. Execute as migrations e popule o banco de dados:
    npm run db:migrate
    npm run db:seed

2. Inicie os servidores em modo de desenvolvimento:
    npm run dev

Este comando utiliza o Turborepo para iniciar simultaneamente o servidor Fastify e a aplicação Next.js.

## Acesso à Aplicação

Com os servidores rodando, você pode acessar os serviços através dos seguintes endereços:

* **Aplicação Web (Front-end):** http://localhost:3000
* **API (Back-end):** http://localhost:3333 (Verifique a porta exata no seu arquivo .env)
* **Documentação da API (Scalar/Swagger):** http://localhost:3333/docs

## Comandos Úteis (Raiz)

O `package.json` na raiz do projeto exporta vários scripts unificados:

* `npm run build`: Executa o build de todos os pacotes do monorepo.
* `npm run lint`: Executa o linter (ESLint) em todo o código.
* `npm run test`: Roda a suíte de testes em todo o projeto.
* `npm run test:e2e:ui`: Abre a interface do Playwright para testes End-to-End no front-end.
* `npm run db:studio`: Abre o Prisma Studio para visualização e edição direta dos dados no banco.

## Integração e Entrega Contínuas (CI/CD)

O projeto utiliza **GitHub Actions** para garantir a qualidade do código e automatizar a publicação das imagens de produção. O fluxo está dividido em dois pipelines principais:

### 1. Continuous Integration (CI)
Acionado automaticamente em *pushes* ou *pull requests* nas branches `dev` e `main`. Ele atua como nossa barreira de qualidade:

* **Checks do Server e Web:** Executa paralelamente o Linter, Type-check e testes locais para o back-end (com banco de dados de teste em memória) e front-end.
* **Testes End-to-End (E2E):** Após a aprovação dos testes rápidos, o ambiente completo é levantado via Docker e testado na interface utilizando **Playwright**. Relatórios de erro em HTML são salvos como artefatos caso algo falhe.
* **Validação de Build:** Simula o build dos Dockerfiles de produção para garantir que não há erros de compilação.
* **Pull Request Automático:** Se um *push* for feito na branch `dev` e todos os testes passarem, o pipeline abre automaticamente um Pull Request para a branch `main`.

### 2. Continuous Deployment (CD)
Acionado exclusivamente ao realizar um merge (push) na branch `main`. 

* **Build e Push (Docker Hub):** O pipeline constrói as imagens otimizadas para a API e Web, utilizando cache inteligente do GitHub Actions.
* **Múltiplas Arquiteturas:** As imagens são geradas para `linux/amd64` e `linux/arm64`.
* **Versionamento:** As imagens são publicadas no Docker Hub com a tag `latest` e uma tag específica com o hash do commit (`github.sha`), garantindo rastreabilidade e facilitando rollbacks.