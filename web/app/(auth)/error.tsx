"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react"; // Ícones para melhorar a UI

/**
 * Componente de Error Boundary para o grupo (auth).
 * Captura erros em tempo de execução dentro de /login ou /register.
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logamos o erro (pode ser enviado para um Sentry no futuro)
    console.error("Auth Critical Error:", error);
  }, [error]);

  return (
    <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center space-y-6 py-4 duration-300">
      {/* Ícone de alerta sutil */}
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Ops! Algo deu errado
        </h2>
        <p className="text-muted-foreground mx-auto max-w-62.5 text-sm">
          Não conseguimos processar sua solicitação de acesso no momento.
        </p>
      </div>

      {/* Botão de reset com ícone de refresh */}
      <Button
        onClick={() => reset()}
        variant="secondary"
        className="flex w-full items-center gap-2 rounded-xl font-medium"
      >
        <RefreshCcw className="h-4 w-4" />
        Tentar novamente
      </Button>

      {/* Link de suporte ou volta à home opcional */}
      <p className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">
        Erro ID: {error.digest?.slice(0, 8) || "Internal"}
      </p>
    </div>
  );
}
