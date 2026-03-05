"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui fica o log silencioso para você debugar ou ligar num Sentry da vida
    console.error("Erro capturado pela fronteira do Next.js:", error);
  }, [error]);

  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      {/* O seu background com os glows pink */}
      <GridBackground />

      <div className="animate-in fade-in zoom-in-95 relative z-10 flex min-h-screen flex-col items-center justify-center px-6 duration-700">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-primary text-6xl font-bold tracking-tight sm:text-7xl">
            Ops!
          </h1>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Desfiou algum ponto por aqui.
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 text-base leading-relaxed sm:text-lg">
            Um erro inesperado aconteceu no sistema. Nossa equipe técnica já foi
            notificada para reparar esse fio. Tente recarregar ou volte para o
            início.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Botão principal idêntico ao do seu Hero Section */}
            <Button
              onClick={() => reset()}
              size="lg"
              className="h-12 rounded-xl px-10 text-base font-semibold transition-all hover:scale-105"
            >
              Tentar novamente
            </Button>

            {/* Botão secundário idêntico ao do seu Hero Section */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hover:bg-muted h-12 rounded-xl px-10 text-base font-medium transition-all"
            >
              <Link href="/">Voltar para a vitrine</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
