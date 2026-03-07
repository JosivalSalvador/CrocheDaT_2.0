"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ShoppingBag,
  MessageCircle, // Ícone novo pro botão principal
  Loader2,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useCart, useCartMutations } from "@/hooks/use-cart";
// Importando as mutações e tipos do chat
import { useChatMutations } from "@/hooks/use-chats";
import { ChatType } from "@/types/enums";
import type { CreateChatInput } from "@/types/index";

import { CartItem } from "./card-item";

import type { CartResponse, CartItemResponse } from "@/types/index";

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data, isLoading: isLoadingCart } = useCart();
  const { clearCart } = useCartMutations();
  const { create: createChat } = useChatMutations();

  const cart = (data && "cart" in data ? data.cart : data) as
    | CartResponse
    | null
    | undefined;
  const items: CartItemResponse[] = cart?.items || [];

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const safeTotalAmount = Number(cart?.totalAmount || 0);
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(safeTotalAmount);

  const handleClearCart = () => {
    clearCart.mutate();
  };

  // Função para criar o chat e redirecionar
  const handleCheckoutToChat = () => {
    if (!cart?.id) return;

    // Monta a mensagem inicial com os itens do carrinho
    let messageBody =
      "Olá! Gostaria de encomendar as seguintes peças do meu carrinho:\n\n";
    items.forEach((item) => {
      messageBody += `- ${item.quantity}x ${item.name}\n`;
    });
    messageBody += `\n**Valor Total Estimado: ${formattedTotal}**\n\nPodemos conversar sobre as medidas e detalhes?`;

    const chatData: CreateChatInput = {
      type: ChatType.ORDER,
      cartId: cart.id,
      firstMessage: messageBody,
    };

    createChat.mutate(chatData, {
      onSuccess: () => {
        // Fecha a gaveta
        setIsOpen(false);
        // Redireciona o usuário para a tela de chats com o ID recém-criado
        // Assumindo que a rota de chat seja /home/chats ou algo do tipo
        router.push("/home/chats");
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50 relative rounded-full transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />

          {totalItemsCount > 0 && (
            <Badge className="bg-primary text-primary-foreground border-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 px-1 text-[10px] font-bold shadow-sm">
              {totalItemsCount}
            </Badge>
          )}
          <span className="sr-only">Abrir Carrinho</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-background flex w-[75vw] flex-col border-l p-0 shadow-2xl sm:max-w-md"
      >
        <SheetHeader className="border-b px-3 py-4 pr-10 sm:px-6 sm:py-5 sm:pr-12">
          <SheetTitle className="flex items-center gap-2 text-base font-bold sm:text-lg">
            <ShoppingBag className="text-primary h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <span className="truncate">Seu Carrinho</span>
            {totalItemsCount > 0 && (
              <span className="text-muted-foreground shrink-0 text-xs font-medium sm:text-sm">
                ({totalItemsCount})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {isLoadingCart ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 py-2">
                  <Skeleton className="h-16 w-16 rounded-lg sm:h-20 sm:w-20" />
                  <div className="flex flex-1 flex-col gap-2 pt-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="mt-auto flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-1/4 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center opacity-80">
              <div className="bg-primary/10 text-primary rounded-full p-4 sm:p-6">
                <ShoppingCart className="h-8 w-8 opacity-80 sm:h-12 sm:w-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-foreground text-base font-bold sm:text-lg">
                  Carrinho vazio
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Você ainda não adicionou produtos.
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="mt-4 rounded-full px-6 text-xs font-semibold sm:text-sm"
              >
                Explorar Vitrine
              </Button>
            </div>
          ) : (
            <div className="divide-border/50 flex flex-col gap-1 divide-y">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-muted/10 border-t px-3 py-4 sm:px-6 sm:py-5">
            <div className="mb-4">
              <div className="text-foreground flex items-center justify-between text-base font-extrabold sm:text-lg">
                <span>Total</span>
                <span className="text-primary">{formattedTotal}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                size="lg"
                onClick={handleCheckoutToChat}
                disabled={createChat.isPending || !cart?.id}
                className="shadow-primary/20 h-11 w-full rounded-xl text-sm font-bold shadow-md transition-transform active:scale-95 sm:h-12 sm:text-base"
              >
                {createChat.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Combinar Encomenda
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={clearCart.isPending || createChat.isPending}
                className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground h-10 w-full rounded-xl text-xs font-semibold transition-all duration-200 sm:h-11 sm:text-sm"
              >
                {clearCart.isPending ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                ) : (
                  <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
                Esvaziar Carrinho
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
