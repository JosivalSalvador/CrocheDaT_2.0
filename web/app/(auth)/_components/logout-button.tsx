"use client";

import { useTransition } from "react";
import { logoutAction } from "../_actions/logout.action";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react"; // Padronizando ícones

/**
 * Botão de Logout Reutilizável.
 * Pode ser usado tanto no Header da Landing Page quanto no Dashboard.
 */
export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    // startTransition lida com o estado pendente da Server Action de logout
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
      className="h-8 gap-2 rounded-lg px-3 text-xs font-medium transition-all active:scale-95"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}

      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
