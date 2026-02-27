"use client";

import { useTransition } from "react";
import { logoutAction } from "../_actions/logout.action";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50"
    >
      {isPending ? (
        <span className="border-primary h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      )}
      {isPending ? "Saindo..." : "Sair"}
    </button>
  );
}
