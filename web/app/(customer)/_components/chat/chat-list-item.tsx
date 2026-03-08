"use client";

import Link from "next/link";
import { ShoppingBag, HeadphonesIcon, CheckCheck } from "lucide-react";

import type { ChatResponse } from "@/types/index";
import { ChatType } from "@/types/enums";

interface ChatListItemProps {
  chat: ChatResponse;
}

export function ChatListItem({ chat }: ChatListItemProps) {
  // 1. Pegamos o objeto inteiro da última mensagem (se existir)
  const lastMessageObj =
    chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;

  // 2. Extraímos o texto ou o fallback
  const lastMessage = lastMessageObj
    ? lastMessageObj.content
    : "Novo atendimento iniciado...";

  // 3. A LÓGICA DO CHECK:
  const isSentByMe = lastMessageObj?.senderId === chat.userId;

  // 👇 NOVA LÓGICA: Se tem mensagem, não foi enviada por mim e o chat tá aberto, o Admin respondeu!
  const hasNewReply = lastMessageObj && !isSentByMe && chat.isOpen;

  // Lógica estilo WhatsApp: Se for hoje, mostra só a hora. Se for antigo, mostra a data.
  const messageDate = new Date(chat.lastMessageAt);
  const isToday = new Date().toDateString() === messageDate.toDateString();
  const formattedDate = new Intl.DateTimeFormat(
    "pt-BR",
    isToday
      ? { hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "2-digit", year: "2-digit" },
  ).format(messageDate);

  const isOrder = chat.type === ChatType.ORDER;

  return (
    <Link
      href={`/home/chats/${chat.id}`}
      className="group hover:bg-muted/50 focus-visible:bg-muted/50 flex w-full items-center gap-3 p-3 transition-colors focus-visible:outline-none sm:gap-4 sm:p-4"
    >
      {/* Avatar Redondo */}
      <div className="bg-muted relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14">
        {isOrder ? (
          <ShoppingBag className="h-6 w-6 text-blue-500" />
        ) : (
          <HeadphonesIcon className="text-primary h-6 w-6" />
        )}

        {/* Bolinha de Status do Chat Aberto */}
        {chat.isOpen && (
          <span className="border-background absolute right-0 bottom-0 block h-3.5 w-3.5 rounded-full border-2 bg-emerald-500"></span>
        )}
      </div>

      {/* Container Central */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Linha Superior: Nome e Tempo */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-foreground truncate text-[15px] font-semibold sm:text-base">
            {isOrder ? "Encomenda" : "Suporte"}
            {chat.cartId && (
              <span className="text-muted-foreground ml-1 font-normal opacity-80">
                #{chat.cartId.slice(0, 8)}
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2">
            {/* O horário ganha a cor primária se for uma nova mensagem */}
            <span
              className={`shrink-0 text-xs font-medium ${hasNewReply ? "text-primary" : "text-muted-foreground/80"}`}
            >
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Linha Inferior: Preview da Mensagem */}
        <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1">
          {/* Tag de "Resolvido" */}
          {!chat.isOpen && (
            <span className="bg-secondary text-secondary-foreground shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase">
              Resolvido
            </span>
          )}

          {/* Ícone de "lido/enviado" só se foi o usuário que mandou */}
          {isSentByMe && (
            <CheckCheck className="text-muted-foreground/50 h-4 w-4 shrink-0" />
          )}

          {/* A Preview da Mensagem fica mais escura e em negrito se o admin respondeu */}
          <p
            className={`truncate text-sm sm:text-[15px] ${hasNewReply ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            {lastMessage}
          </p>

          {/* Bolinha de Notificação Estilo WhatsApp para destacar a mensagem nova */}
          {hasNewReply && (
            <span className="bg-primary ml-auto flex h-2.5 w-2.5 shrink-0 rounded-full shadow-sm" />
          )}
        </div>
      </div>
    </Link>
  );
}
