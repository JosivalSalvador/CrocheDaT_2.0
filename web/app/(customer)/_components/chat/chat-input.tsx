"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { SendHorizontal, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMutations } from "@/hooks/use-chats";

interface ChatInputProps {
  chatId: string;
  isOpen: boolean;
}

export function ChatInput({ chatId, isOpen }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChatMutations();

  // Ajuste automático de altura baseado no conteúdo
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      const scrollHeight = textarea.scrollHeight;
      // Limita o crescimento a 160px
      textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [content]);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || sendMessage.isPending) return;

    sendMessage.mutate(
      { chatId, data: { content: trimmed } },
      {
        onSuccess: () => {
          setContent("");
          if (textareaRef.current) textareaRef.current.style.height = "40px";
        },
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-muted/20 border-t p-4 backdrop-blur-md sm:p-6">
        <div className="border-border bg-background/50 text-muted-foreground mx-auto flex max-w-4xl items-center justify-center gap-3 rounded-2xl border border-dashed p-4 shadow-sm">
          <LockKeyhole className="h-5 w-5 opacity-70" />
          <p className="text-sm font-semibold tracking-tight">
            Atendimento encerrado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/80 z-20 border-t p-3 backdrop-blur-lg sm:p-4 md:border-t-0 md:bg-transparent">
      <div className="mx-auto flex max-w-5xl items-end gap-2 md:px-4">
        {/* CONTAINER DO INPUT - Limpo e sem ícones inúteis */}
        <div className="border-border bg-background focus-within:border-primary/50 focus-within:ring-primary/5 relative flex flex-1 items-end gap-2 rounded-3xl border px-4 py-1.5 shadow-sm transition-all focus-within:ring-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mensagem..."
            className="placeholder:text-muted-foreground/70 w-full resize-none overflow-x-hidden bg-transparent py-2.5 text-[15px] leading-5 outline-none sm:text-base"
            rows={1}
            disabled={sendMessage.isPending}
          />
        </div>

        {/* BOTÃO DE ENVIAR - Redondo e reativo */}
        <Button
          onClick={handleSend}
          disabled={!content.trim() || sendMessage.isPending}
          size="icon"
          className={`h-12 w-12 shrink-0 rounded-full shadow-lg transition-all duration-300 ${
            content.trim()
              ? "bg-primary hover:bg-primary/90 scale-100"
              : "bg-muted text-muted-foreground scale-90 opacity-50"
          }`}
        >
          {sendMessage.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="ml-0.5 h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      <p className="text-muted-foreground/50 mt-2 hidden text-center text-[10px] font-medium tracking-[0.15em] uppercase md:block">
        Shift + Enter para quebrar linha
      </p>
    </div>
  );
}
