"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/query-client";
import { Toaster } from "sonner";
import { ReactNode, useState } from "react";

/**
 * Componente Global de Providers
 * Envolve a aplicação para fornecer QueryClient e Notificações (Sonner)
 */
export function Providers({ children }: { children: ReactNode }) {
  // AJUSTE: Usamos useState para garantir que o queryClient seja criado
  // APENAS UMA VEZ no lado do cliente.
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Configuração do Sonner:
          O richColors é essencial para as cores de erro/sucesso do Auth.
      */}
      <Toaster
        richColors
        closeButton
        position="top-right"
        // Removi o theme="dark" fixo para ele respeitar o sistema,
        // ou você pode manter se o seu design for 100% dark mode.
        theme="system"
      />
    </QueryClientProvider>
  );
}
