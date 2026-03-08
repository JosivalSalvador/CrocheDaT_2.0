"use client";

import { Role } from "@/types/enums";
import type { MessageResponse } from "@/types/index";

interface MessageBubbleProps {
  message: MessageResponse;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender.role === Role.USER;

  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.createdAt));

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 mb-3 px-2 duration-300`}
    >
      <div
        className={`relative flex max-w-[85%] flex-col shadow-sm transition-all sm:max-w-[70%] lg:max-w-[60%] ${
          isUser
            ? "bg-primary rounded-[18px] rounded-tr-xs text-white"
            : "rounded-[18px] rounded-tl-xs border border-zinc-100 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        } px-3.5 py-2`}
      >
        {/* Nome do Suporte - Apenas se não for o usuário */}
        {!isUser && (
          <span className="text-primary/90 mb-0.5 text-[11px] font-bold tracking-wide uppercase">
            {message.sender.name}
          </span>
        )}

        <div className="flex flex-col">
          {/* Texto: Foco total em legibilidade */}
          <p className="wrap:anywhere text-[15px] leading-relaxed font-normal tracking-tight whitespace-pre-wrap sm:text-[16px]">
            {message.content}
          </p>

          {/* Hora: Alinhada mas sem opacidade exagerada para não sumir */}
          <div className="mt-1 flex items-center justify-end">
            <span
              className={`text-[10px] font-medium select-none ${
                isUser ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
