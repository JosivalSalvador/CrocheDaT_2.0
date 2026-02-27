"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/query-client";
import { Toaster } from "sonner"; // Importação do Sonner (padrão atual Shadcn)
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Nota: No App Router, o QueryClientProvider DEVE ficar dentro de um componente 'use client'
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* O Toaster do Sonner é o que permite as notificações de 
          sucesso/erro no Login e Registro.
      */}
      <Toaster
        richColors
        closeButton
        position="top-right"
        theme="dark" // Como o seu layout é dark fixo
      />
    </QueryClientProvider>
  );
}
