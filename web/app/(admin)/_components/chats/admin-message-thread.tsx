"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./admin-message-bubble";
import type { MessageResponse } from "@/types/index";
import { BotMessageSquare } from "lucide-react";

interface MessageThreadProps {
  messages?: MessageResponse[];
}

export function MessageThread({ messages = [] }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Usando setTimeout para garantir que o DOM renderizou a última mensagem
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="animate-in fade-in zoom-in-95 flex h-full flex-1 flex-col items-center justify-center p-6 text-center duration-300">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <BotMessageSquare className="text-primary h-10 w-10 opacity-60" />
        </div>
        <p className="text-foreground text-sm font-bold">Inicie a conversa</p>
        <p className="text-muted-foreground max-w-50 text-xs">
          Estamos aqui para ajudar com seu pedido de crochê!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="bg-background relative flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:px-6"
      style={{
        scrollbarWidth: "thin",
        // O fundo agora é aplicado diretamente aqui para não "sumir" nunca
        backgroundImage: `radial-gradient(circle at center, #e5e7eb 0.8px, transparent 0.8px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Ajuste de cor do fundo para Dark Mode sem usar <style jsx> que pode bugar */}
      <div className="pointer-events-none absolute inset-0 dark:hidden" />

      <div className="mx-auto flex w-full max-w-4xl flex-col pb-8">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* ESSE É O SEGREDO: Um spacer no final para a última mensagem não colar no fundo 
            e o fundo continuar aparecendo abaixo dela */}
        <div className="h-12 w-full shrink-0" />
      </div>

      {/* CSS Injetado para garantir que o padrão de pontos mude no Dark Mode */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dark [ref="scrollRef"], .dark .relative.flex-1 {
          background-image: radial-gradient(circle at center, #27272a 0.8px, transparent 0.8px) !important;
        }
      `,
        }}
      />
    </div>
  );
}
