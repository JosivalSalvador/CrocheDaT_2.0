"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-destructive text-xl font-bold">Algo deu errado!</h2>
      <p className="text-muted-foreground text-sm">
        Não conseguimos processar sua solicitação de acesso.
      </p>
      <Button onClick={() => reset()} variant="outline" className="w-full">
        Tentar novamente
      </Button>
    </div>
  );
}
