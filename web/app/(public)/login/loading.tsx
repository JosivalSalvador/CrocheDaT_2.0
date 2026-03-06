import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      {/* Background com Grid idêntico ao page.tsx */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Efeito Criativo: Glow centralizado exato */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-75 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      {/* Botão de Voltar Solto (Skeleton) - Desktop Only */}
      <div className="absolute top-6 left-4 z-20 hidden md:top-8 md:left-8 md:block">
        <Skeleton className="bg-muted/50 h-5 w-36 rounded-md" />
      </div>

      {/* Container Principal */}
      <main className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Form Skeleton Wrapper imitando o LoginForm */}
        <div className="mx-auto w-full max-w-md px-4 sm:px-0">
          {/* Cabeçalho Skeleton */}
          <div className="mb-6 flex flex-col items-center space-y-3 sm:mb-8">
            <Skeleton className="bg-muted/60 h-8 w-56 rounded-lg sm:h-10" />
            <Skeleton className="bg-muted/40 h-4 w-full max-w-70 rounded-md sm:h-5" />
          </div>

          {/* Card Principal Skeleton */}
          <div className="border-border/40 bg-card/20 space-y-4 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl sm:space-y-5 sm:rounded-4xl sm:p-6 md:p-8">
            {/* Campo 1 (E-mail) */}
            <div className="space-y-1.5">
              <Skeleton className="bg-muted/50 h-3 w-14 rounded-md" />
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Campo 2 (Senha) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="bg-muted/50 h-3 w-14 rounded-md" />
                <Skeleton className="bg-muted/30 h-3 w-24 rounded-md" />{" "}
                {/* Esqueceu a senha */}
              </div>
              <Skeleton className="bg-muted/30 h-11 w-full rounded-xl sm:h-12" />
            </div>

            {/* Botão Submit */}
            <Skeleton className="bg-primary/20 mt-4 h-11 w-full rounded-xl sm:mt-6 sm:h-12" />
          </div>

          {/* Footer Skeleton */}
          <div className="mt-6 flex justify-center sm:mt-8">
            <Skeleton className="bg-muted/40 h-4 w-52 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  );
}
