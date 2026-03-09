import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function ChatIndividualLoading() {
  // A mesma classe utilitária do page.tsx para garantir 100% de alinhamento
  const containerClasses =
    "relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl transition-all h-dvh md:h-[90vh] md:my-8 md:rounded-2xl md:border md:border-border/50";

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-transparent">
      <div className={containerClasses}>
        {/* =========================================
            1. SKELETON DO CABEÇALHO (ChatHeader)
        ========================================= */}
        <div className="bg-background sticky top-0 z-20 flex min-h-15 w-full items-center gap-2 border-b px-1.5 py-2 shadow-sm sm:px-4 sm:py-3">
          {/* Botão Voltar + Avatar */}
          <div className="flex shrink-0 items-center gap-1.5 py-1 pr-2 pl-1">
            <ArrowLeft className="text-muted-foreground/30 h-6 w-6" />
            <Skeleton className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
          </div>

          {/* Textos: Nome e Status */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <Skeleton className="h-4 w-40 sm:w-48" />
            <Skeleton className="h-3 w-28 sm:w-32" />
          </div>
        </div>

        {/* =========================================
            2. SKELETON DO CORPO (MessageThread)
        ========================================= */}
        <div
          className="bg-background relative flex flex-1 flex-col space-y-1 overflow-hidden px-3 py-4 sm:px-6"
          style={{
            backgroundImage: `radial-gradient(circle at center, #e5e7eb 0.8px, transparent 0.8px)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* Fundo escuro via Skeleton sem quebrar o layout no Tailwind */}
          <div className="pointer-events-none absolute inset-0 dark:bg-zinc-950/20" />

          <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 pb-8">
            {/* Balão 1: Outra Pessoa (Esquerda) */}
            <div className="flex w-full justify-start px-2">
              <div className="rounded-[18px] rounded-tl-xs border border-zinc-100 bg-white px-3.5 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <Skeleton className="bg-muted-foreground/10 mb-2 h-2 w-16" />
                <Skeleton className="bg-muted-foreground/10 h-4 w-48 sm:w-64" />
              </div>
            </div>

            {/* Balão 2: Usuário (Direita) */}
            <div className="flex w-full justify-end px-2">
              <div className="bg-primary/50 rounded-[18px] rounded-tr-xs px-3.5 py-2 shadow-sm">
                <Skeleton className="bg-background/20 h-4 w-56 sm:w-72" />
                <Skeleton className="bg-background/20 mt-1.5 h-4 w-32" />
              </div>
            </div>

            {/* Balão 3: Outra Pessoa (Esquerda) curtinho */}
            <div className="flex w-full justify-start px-2">
              <div className="rounded-[18px] rounded-tl-xs border border-zinc-100 bg-white px-3.5 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <Skeleton className="bg-muted-foreground/10 mb-2 h-2 w-16" />
                <Skeleton className="bg-muted-foreground/10 h-4 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            3. SKELETON DO INPUT (ChatInput)
        ========================================= */}
        <div className="bg-background/80 z-20 border-t p-3 backdrop-blur-lg sm:p-4 md:border-t-0 md:bg-transparent">
          <div className="mx-auto flex max-w-5xl items-end gap-2 md:px-4">
            {/* Input Wrapper */}
            <div className="border-border bg-background relative flex h-12 flex-1 items-center rounded-3xl border px-4 py-2 shadow-sm">
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Botão Redondo */}
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
