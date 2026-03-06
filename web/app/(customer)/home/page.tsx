"use client";

import Link from "next/link";
import { MessageCircle, Store } from "lucide-react";

export default function CustomerHomePage() {
  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12 duration-700 md:py-20">
      {/* Glow centralizado de fundo */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-75 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Bem-vindo ao seu espaço!
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-sm text-balance sm:text-base">
          Aqui você gerencia suas encomendas, conversa com a Thayssa e acompanha
          suas peças exclusivas ganhando vida.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Atalho: Vitrine */}
        <Link
          href="/"
          className="group border-border/40 bg-card/30 hover:bg-card/50 flex flex-col items-center rounded-4xl border p-6 backdrop-blur-md transition-all hover:-translate-y-1"
        >
          <div className="bg-primary/10 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="mb-1 text-lg font-bold">Explorar Vitrine</h2>
          <p className="text-muted-foreground text-center text-xs">
            Ver as novidades da Crochê da T
          </p>
        </Link>

        {/* Atalho: Chats */}
        <Link
          href="/home/chats"
          className="group border-border/40 bg-card/30 hover:bg-card/50 flex flex-col items-center rounded-4xl border p-6 backdrop-blur-md transition-all hover:-translate-y-1"
        >
          <div className="bg-primary/10 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="mb-1 text-lg font-bold">Meus Chats</h2>
          <p className="text-muted-foreground text-center text-xs">
            Acompanhe suas encomendas e dúvidas
          </p>
        </Link>
      </div>
    </div>
  );
}
