# CrocheDaT 2.0 - Monorepo

Este repositório centraliza o código-fonte da plataforma CrocheDaT, estruturada como um monorepo que agrega o backend (API), frontend (Web) e configurações de infraestrutura. A arquitetura visa a separação de responsabilidades mantendo um fluxo de desenvolvimento unificado via Docker e Scripts NPM!.

## Arquitetura do Sistema

O projeto é composto por três pilares principais localizados na raiz:

1.  **Orquestração de Containers:** Arquivos Docker Compose para gerenciar o ciclo de vida da aplicação em diferentes ambientes.
2.  **Automação de Qualidade (Git Hooks):** Configuração do Husky para garantir integridade do código antes do versionamento.
3.  **Workflows de CI/CD:** Pipelines do GitHub Actions para integração e entrega contínua.

## Estrutura de Diretórios

```text
/
├── .github/                # Definições de pipelines (CI/CD)
├── .husky/                 # Scripts de Git Hooks (Pre-commit)
├── server/                 # Microsserviço API (Fastify/Node.js)
├── web/                    # Aplicação Frontend (Next.js/React)
├── docker-compose.dev.yml  # Definição de infraestrutura para Desenvolvimento
├── docker-compose.yml      # Definição de infraestrutura para Produção
└── package.json            # Scripts de orquestração global
```

## Estratégia de Conteinerização (Docker)

O projeto utiliza dois arquivos de composição distintos para atender aos requisitos específicos de desenvolvimento e produção.

### 1. Ambiente de Desenvolvimento (`docker-compose.dev.yml`)
Este arquivo é configurado para maximizar a experiência do desenvolvedor (DX).

* **Volumes (Bind Mounts):** Mapeia o código local para dentro dos containers. Alterações nos arquivos host refletem imediatamente no container.
* **Hot-Reload:** Os serviços são iniciados em modo de observação (`watch`), reiniciando ou atualizando automaticamente ao detectar mudanças.
* **Exposição de Portas:** O banco de dados e serviços expõem portas para acesso direto via localhost.

**Execução:**
```bash
docker compose -f docker-compose.dev.yml up --build
```

### 2. Ambiente de Produção (`docker-compose.yml`)
Este arquivo simula o ambiente final de implantação.

* **Imutabilidade:** Não utiliza volumes de código. As imagens são construídas copiando o código-fonte e gerando os artefatos de build (`dist/`, `.next/`).
* **Otimização:** Executa as versões transpiladas e minificadas das aplicações.
* **Isolamento:** A rede interna é restrita, expondo apenas o gateway necessário.

**Execução:**
```bash
docker compose -f docker-compose.yml up --build
```

## Controle de Qualidade e Git Hooks (Husky)

Para assegurar a estabilidade do repositório, foi implementado o **Husky** para gerenciar Git Hooks. O hook `pre-commit` está configurado para interceptar commits e executar validações automáticas.

Ao executar `git commit`, o sistema dispara:
1.  **Linting:** Executa o ESLint no diretório `server` e `web`.
2.  **Type-Check:** Executa a verificação do TypeScript em ambos os projetos.

Se qualquer verificação falhar, o commit é abortado. Isso impede que código com erros de sintaxe ou tipagem entre na branch de versionamento.

**Instalação dos Hooks:**
Ao clonar o projeto, é necessário instalar os hooks localmente:
```bash
npm install
npm run prepare
```

## Scripts de Orquestração (Root)

O arquivo `package.json` na raiz atua como um agregador de comandos, permitindo executar tarefas em múltiplos pacotes simultaneamente.

| Script | Função |
| :--- | :--- |
| `npm run prepare` | Instala as dependências do Husky e ativa os Git Hooks. |
| `npm run lint` | Dispara o processo de linting sequencialmente em `web` e `server`. |
| `npm run type-check` | Dispara a verificação de tipos do TypeScript em `web` e `server`. |
| `npm run build` | Executa o build de produção de ambas as aplicações para verificação local. |

## Pipeline de CI/CD

A automação está definida no diretório `.github/workflows`:

1.  **Continuous Integration (ci.yml):**
    * Gatilho: Push ou Pull Request na branch de desenvolvimento.
    * Tarefas: Instalação de dependências, execução de Linter, Type-Check e Testes Unitários.
    * Verificação de Build: Garante que o Dockerfile de produção é compilável.

2.  **Continuous Delivery (cd.yml):**
    * Gatilho: Merge na branch principal (`main`).
    * Tarefas: Build das imagens Docker de produção e push para o registro de container (Docker Hub).

## Documentação dos Módulos

Para informações específicas sobre instalação de dependências, variáveis de ambiente e testes unitários de cada serviço, consulte a documentação interna:

* [Documentação do Backend (Server)](./server/README.md)
* [Documentação do Frontend (Web)](./web/README.md)