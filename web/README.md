# CrocheDaT 2.0 - Web Client

Este diretório contém a aplicação Frontend da plataforma, desenvolvida para oferecer uma experiência de usuário moderna, responsiva e performática. A arquitetura utiliza as versões mais recentes do ecossistema React, incluindo Next.js 16 (App Router), React 19 e Tailwind CSS 4.

## Stack Tecnológica

A aplicação é construída sobre um conjunto robusto de ferramentas:

- **Framework**: Next.js 16.1 (App Router & Server Actions).
- **Core**: React 19 & React DOM 19.
- **Linguagem**: TypeScript (v5).
- **Estilização**: Tailwind CSS v4 (com PostCSS), `clsx` e `tailwind-merge`.
- **Componentes UI**: Primitivos do Radix UI (`@radix-ui`) e padrão Shadcn/ui.
- **Animações**: Framer Motion e `tailwindcss-animate`.
- **Gerenciamento de Estado/Cache**: TanStack React Query v5.
- **Validação de Ambiente**: T3 Env (`@t3-oss/env-nextjs`).
- **Testes**: Vitest, React Testing Library e MSW (Mock Service Worker).

## Estrutura de Diretórios e Arquitetura

O projeto adota uma arquitetura modular baseada em funcionalidades (Feature-based Architecture) dentro do diretório `app/`, co-localizando arquivos relacionados para facilitar a manutenção.

- **app/**: Contém as rotas, layouts e módulos da aplicação.
  - **[feature]/** (ex: `users/`):
    - `page.tsx`: A rota pública (Server Component).
    - `components/`: Componentes visuais específicos desta funcionalidade.
    - `hooks/`: Hooks customizados (lógica de UI/estado).
    - `services/`: Funções de interação direta com a API.
    - `types.ts`: Tipagem local específica do módulo.
  - `globals.css`: Estilos globais e diretivas do Tailwind.
  - `providers.tsx`: Wrapper de contextos globais (React Query, Temas, etc).
- **components/ui/**: Componentes reutilizáveis e agnósticos de negócio (Botões, Inputs, Modais), seguindo o padrão de design system.
- **lib/**: Utilitários e configurações centrais.
  - `animations/`: Configurações de variantes do Framer Motion.
  - `api/`: Cliente HTTP (Fetch wrapper) configurado com interceptors.
  - `query/`: Configuração do `QueryClient` e estratégias de cache.
  - `utils/`: Funções auxiliares e validação de variáveis de ambiente (`env.ts`).

## Variáveis de Ambiente

A segurança e tipagem das variáveis de ambiente são garantidas pela biblioteca T3 Env. O arquivo `lib/utils/env.ts` define o esquema de validação (Zod).

| Variável              | Descrição                                                                        | Exemplo                 |
| :-------------------- | :------------------------------------------------------------------------------- | :---------------------- |
| `NEXT_PUBLIC_API_URL` | URL pública da API acessível pelo navegador (Client-side).                       | `http://localhost:3333` |
| `API_INTERNAL_URL`    | URL da API acessível internamente pelo container Docker (Server-side rendering). | `http://api:3333`       |

O build falhará caso as variáveis obrigatórias não estejam definidas.

## Scripts Disponíveis

Os comandos podem ser executados via `npm run` dentro da pasta `web` ou via Turbo na raiz.

### Desenvolvimento

- `dev`: Inicia o servidor de desenvolvimento do Next.js com Hot Reload.
- `start`: Inicia o servidor de produção (requer build prévio).

### Build e Qualidade

- `build`: Cria a versão otimizada para produção.
- `lint`: Executa o ESLint com regras para Next.js e React Hooks.
- `type-check`: Valida a tipagem TypeScript sem emitir arquivos.

### Testes (Vitest)

- `test`: Executa a suíte de testes unitários e de integração.
- `test:watch`: Executa os testes em modo de observação.
- `test:ui`: Abre a interface gráfica do Vitest para visualização dos testes.

## Integração com API (React Query)

A comunicação com o Backend é gerenciada pelo TanStack Query.

1.  **Services**: As chamadas HTTP cruas ficam em `services/`.
2.  **Hooks**: Hooks customizados (ex: `useUser`) encapsulam o `useQuery` ou `useMutation`.
3.  **Client**: O `http-client.ts` centraliza a configuração de headers (como Auth Bearer token) e tratamento de erros de rede.

## Estilização e Design System

A interface utiliza **Tailwind CSS 4**. A combinação de classes é gerenciada pela função utilitária `cn` (classnames), que une `clsx` e `tailwind-merge` para permitir a sobrescrita segura de estilos em componentes reutilizáveis.

Exemplo de uso:

```tsx
import { cn } from "@/lib/utils/utils";

export function Button({ className, ...props }) {
  return (
    <button className={cn("bg-blue-500 px-4 py-2", className)} {...props} />
  );
}
```

## Estratégia de Testes

O ambiente de testes utiliza **Vitest** com **JSDOM**.

- **Componentes**: Testados com `@testing-library/react` para garantir acessibilidade e comportamento do usuário.
- **Integração**: Utiliza **MSW (Mock Service Worker)** para interceptar requisições de rede. Isso permite testar cenários de sucesso e erro sem depender do Backend estar rodando.
- **Configuração**: Arquivos `vitest.config.ts` e `vitest.setup.ts` garantem que os mocks e matchers do DOM estejam carregados globalmente.

## Docker e Deploy

O `Dockerfile` utiliza um build multi-estágio para otimizar o tamanho da imagem final. Ele considera o modo `standalone` do Next.js, copiando apenas os arquivos necessários para a pasta `.next/standalone`, reduzindo drasticamente o tamanho da imagem em produção.
