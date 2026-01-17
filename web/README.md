# CrocheDaT Web Client

Este diretório contém a interface de usuário (Frontend) da plataforma. A aplicação é construída sobre o **Next.js 16 (App Router)** e **React 19**, utilizando uma arquitetura modular focada em funcionalidades (Feature-First) e estilização moderna com **TailwindCSS v4**.

## Stack Tecnológica

O projeto utiliza as versões mais recentes do ecossistema React.

- **Framework:** Next.js 16.1 (App Router & Server Components).
- **Core:** React 19 & React DOM 19.
- **Gerenciamento de Estado/Cache:** TanStack Query v5.
- **Estilização:** TailwindCSS v4 + `tailwindcss-animate`.
- **Componentes:** Radix UI (Headless) + Lucide React (Ícones).
- **Animações:** Framer Motion.
- **Testes:** Vitest, React Testing Library e MSW (Mock Service Worker).

## Arquitetura e Estrutura

O projeto adota o padrão **Colocation** (Co-localização). Em vez de separar arquivos por "tipo" (ex: todos os hooks em uma pasta global), agrupamos arquivos por **Funcionalidade/Domínio** dentro do diretório `app/`.

```text
src/
├── app/
│   ├── layout.tsx              # Root Layout e Providers Globais
│   ├── globals.css             # Configurações do Tailwind v4
│   └── users/                  # [Feature Module]: Usuários
│       ├── page.tsx            # A Rota (Server Component)
│       ├── loading.tsx         # Estado de carregamento (Suspense)
│       ├── components/         # Componentes visuais exclusivos desta feature
│       ├── hooks/              # Hooks customizados (ex: useUser)
│       ├── services/           # Chamadas à API (TanStack Query fetchers)
│       └── types.ts            # Tipagens locais
├── components/
│   └── ui/                     # Design System (Botões, Inputs, Modais genéricos)
├── lib/
│   ├── api/                    # Cliente HTTP (Axios/Fetch Wrapper)
│   ├── query/                  # Configuração do QueryClient
│   └── utils/                  # Utilitários globais (cn, formatters)
└── ...
```

### Por que essa estrutura?

Se você excluir a pasta `app/users`, toda a funcionalidade de usuários desaparece sem deixar "lixo" ou arquivos órfãos em outras pastas. Isso facilita a manutenção e escalabilidade.

## Configuração do Ambiente

O frontend precisa saber onde a API está rodando. Crie um arquivo `.env` na raiz de `/web`.

```ini
# URL da API Backend (Fastify)
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

## Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar em Desenvolvimento

Inicia o servidor Next.js com Turbopack (se disponível) ou Webpack.

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### 3. Build de Produção

Gera os arquivos estáticos e otimiza as imagens.

```bash
npm run build
npm start
```

## Scripts Disponíveis

| Script               | Descrição                                            |
| :------------------- | :--------------------------------------------------- |
| `npm run dev`        | Inicia o ambiente de desenvolvimento.                |
| `npm run build`      | Cria a build otimizada para produção.                |
| `npm run start`      | Inicia o servidor de produção (requer build prévio). |
| `npm run lint`       | Roda o ESLint (Next.js Config).                      |
| `npm run type-check` | Valida tipagem TypeScript em todo o projeto.         |
| `npm run test`       | Roda os testes em modo watch.                        |
| `npm run test:ui`    | Abre a interface gráfica do Vitest no navegador.     |

## Fluxo de Desenvolvimento (Features)

Para criar uma nova tela/funcionalidade, siga este fluxo:

1.  **Service (`services/`):** Crie a função que busca os dados na API.
    - _Ex:_ `getProducts()` que chama `httpClient.get('/products')`.
2.  **Hook (`hooks/`):** Crie um hook do React Query para gerenciar o cache e estado de loading.
    - _Ex:_ `useProducts()` que usa `useQuery`.
3.  **Components (`components/`):** Crie os componentes de UI (Cards, Listas) que consomem os dados.
4.  **Page (`page.tsx`):** Monte a página final.
    - Se for uma rota pública, pode ser estática.
    - Se precisar de SEO, faça o pre-fetch no Server Component (Hydration Boundary).

## Estilização (Tailwind v4)

Utilizamos a função utilitária `cn` (classnames) localizada em `lib/utils.ts`. Ela combina `clsx` e `tailwind-merge` para permitir sobrescrita de classes de forma segura.

**Exemplo correto:**

```tsx
// Permite passar className extra que sobrescreve o bg-red-500 se necessário
<div className={cn("bg-red-500 p-4", className)}>
```

## Testes Automatizados

A estratégia de testes no frontend foca em **Testes de Integração de Componentes** e **Unitários**.

- **Ferramentas:** Vitest + React Testing Library.
- **Mocking de API (MSW):** Utilizamos o **MSW (Mock Service Worker)** para interceptar as chamadas HTTP durante os testes. Isso significa que **não precisamos do Backend rodando** para testar o Frontend.
- **Vitest UI:** Para visualizar os testes graficamente:
  ```bash
  npm run test:ui
  ```

### Como rodar

```bash
# Rodar bateria completa (Headless)
npm run test:run

# Rodar em modo interativo
npm run test
```
