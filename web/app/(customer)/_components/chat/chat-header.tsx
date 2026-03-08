"use client";

import Link from "next/link";
import { ArrowLeft, HeadphonesIcon, ShoppingBag } from "lucide-react";

import type { ChatResponse } from "@/types/index";
import { ChatType } from "@/types/enums";

interface ChatHeaderProps {
  chat: ChatResponse;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const isOrder = chat.type === ChatType.ORDER;

  return (
    <div className="bg-background sticky top-0 z-20 flex min-h-15 w-full items-center gap-2 border-b px-1.5 py-2 shadow-sm sm:px-4 sm:py-3">
      {/* Botão Voltar + Avatar (Estilo WhatsApp autêntico: colados e clicáveis juntos) */}
      <Link
        href="/home/chats"
        className="hover:bg-muted active:bg-muted/80 flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-2 pl-1 transition-colors"
      >
        <ArrowLeft className="text-foreground/80 h-6 w-6" />

        <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11">
          {isOrder ? (
            <ShoppingBag className="h-5 w-5 text-blue-500" />
          ) : (
            <HeadphonesIcon className="text-primary h-5 w-5" />
          )}

          {/* Bolinha de status */}
          {chat.isOpen && (
            <span className="border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 bg-emerald-500"></span>
          )}
        </div>
      </Link>

      {/* Textos: Nome e Status */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Título com o nome do sistema para dar cara de conta comercial */}
        <h2 className="text-foreground truncate text-[16px] leading-tight font-semibold sm:text-[17px]">
          {isOrder ? "Encomenda Crochê da T" : "Suporte Crochê da T"}
        </h2>

        {/* Subtítulo: Status realístico + Pedido */}
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 truncate text-[13px] leading-tight">
          {chat.isOpen ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-500">
              Em andamento
            </span>
          ) : (
            <span>Atendimento encerrado</span>
          )}

          {chat.cartId && (
            <>
              <span className="mx-1 opacity-50">•</span>
              <span className="truncate">
                Pedido #{chat.cartId.split("-")[0]}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
