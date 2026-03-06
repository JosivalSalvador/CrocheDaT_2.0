import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      {/* Background com Grid - Mantemos idêntico para não piscar */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Efeito Criativo: Glow centralizado */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-100 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      {/* Botão de Voltar Solto (Skeleton) - Desktop Only */}
      <div className="absolute top-6 left-4 z-20 hidden md:top-8 md:left-8 md:block">
        <Skeleton className="bg-muted/50 h-5 w-36 rounded-md" />
      </div>

      {/* Container Principal */}
      <main className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Form Skeleton Wrapper (max-w-md imitando o RegisterForm) */}
        <div className="mx-auto w-full max-w-md px-4 sm:px-0">
          {/* Cabeçalho Skeleton */}
          <div className="mb-6 flex flex-col items-center space-y-3 sm:mb-8">
            <Skeleton className="bg-muted/60 h-8 w-48 rounded-lg sm:h-10" />
            <Skeleton className="bg-muted/40 h-4 w-full max-w-75 rounded-md sm:h-5" />
          </div>

          {/* Card Principal Skeleton */}
          <div className="border-border/40 bg-card/20 space-y-4 rounded-4xl border p-5 shadow-2xl backdrop-blur-xl sm:space-y-5 sm:p-6 md:p-8">
            {/* Campo 1 (Nome) */}
            <div className="space-y-1.5">
              <Skeleton className="bg-muted/50 h-3 w-24 rounded-md" />
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Campo 2 (Email) */}
            <div className="space-y-1.5">
              <Skeleton className="bg-muted/50 h-3 w-16 rounded-md" />
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Campo 3 (Senha) */}
            <div className="space-y-1.5">
              <Skeleton className="bg-muted/50 h-3 w-16 rounded-md" />
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Campo 4 (Confirmar Senha) */}
            <div className="space-y-1.5">
              <Skeleton className="bg-muted/50 h-3 w-32 rounded-md" />
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Botão Submit */}
            <Skeleton className="bg-primary/20 mt-4 h-11 w-full rounded-xl sm:mt-6 sm:h-12" />
          </div>

          {/* Footer Skeleton */}
          <div className="mt-6 flex justify-center sm:mt-8">
            <Skeleton className="bg-muted/40 h-4 w-48 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  );
}
