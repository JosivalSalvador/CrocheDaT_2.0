"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeadphonesIcon, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Importações estritas baseadas no seu hook e enums
import { useChatMutations } from "@/hooks/use-chats";
import { ChatType } from "@/types/enums";
import type { CreateChatInput } from "@/types/index";

export function NewSupportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { create } = useChatMutations();

  const handleCreateSupport = () => {
    if (!message.trim() || message.length > 2000) return;

    const data: CreateChatInput = {
      type: ChatType.SUPPORT,
      firstMessage: message,
    };

    create.mutate(data, {
      onSuccess: (response) => {
        setIsOpen(false);
        setMessage("");
        if (response.data?.chat?.id) {
          router.push(`/home/chats/${response.data.chat.id}`);
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 👇 AJUSTE 1: Botão responsivo (w-full no mobile, w-auto no desktop) */}
      <DialogTrigger asChild>
        <Button className="shadow-primary/20 w-full rounded-xl font-bold shadow-md transition-transform active:scale-95 sm:w-auto">
          <HeadphonesIcon className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </DialogTrigger>

      {/* 👇 AJUSTE 2: Garantindo a largura máxima no desktop e bordas arredondadas no mobile */}
      <DialogContent className="w-[95vw] rounded-xl sm:max-w-106.25 md:max-w-md">
        <DialogHeader className="text-left sm:text-center">
          <DialogTitle>Como podemos ajudar?</DialogTitle>
          <DialogDescription>
            Inicie um atendimento de suporte. Nossa equipe responderá o mais
            breve possível.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          {/* 👇 AJUSTE 3: Altura mínima garantida sem quebrar o Tailwind */}
          <Textarea
            placeholder="Digite aqui o seu problema, dúvida ou sugestão..."
            className="min-h-30 resize-none rounded-xl sm:min-h-37.5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={create.isPending}
            maxLength={2000}
          />
          <div className="text-muted-foreground text-right text-[10px]">
            {message.length}/2000
          </div>
        </div>

        {/* 👇 AJUSTE 4: Botões empilhados (flex-col) no mobile, lado a lado (sm:flex-row) no desktop */}
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={create.isPending}
            className="order-2 w-full sm:order-1 sm:w-auto" // O Cancelar fica por último no mobile
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSupport}
            disabled={create.isPending || !message.trim()}
            className="order-1 w-full sm:order-2 sm:w-auto" // A ação principal fica em cima no mobile
          >
            {create.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Iniciar Conversa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
