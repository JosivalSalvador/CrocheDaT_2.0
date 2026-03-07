"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartMutations } from "@/hooks/use-cart";

// 👇 Importando diretamente a tipagem real que o Zod gerou!
import type { CartItemResponse } from "@/types/index";

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItem({ item }: CartItemProps) {
  const [imgError, setImgError] = useState(false);
  const { updateQuantity, removeItem } = useCartMutations();

  // Agora pegamos direto da raiz do item, graças ao seu schema flat!
  const mainImage = item.imageUrl;
  const safePrice = Number(item.price || 0);

  // Opcional: Se quiser mostrar o subtotal do item em vez do preço unitário,
  // basta trocar para Number(item.subtotal || 0)
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(safePrice);

  // =========================================
  // LÓGICA DE ATUALIZAÇÃO E REMOÇÃO
  // =========================================

  // Usa o updateQuantity para somar unidades
  const handleIncrease = () => {
    updateQuantity.mutate({
      itemId: item.id,
      data: { quantity: item.quantity + 1 },
    });
  };

  // Usa o updateQuantity para subtrair unidades
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity.mutate({
        itemId: item.id,
        data: { quantity: item.quantity - 1 },
      });
    }
  };

  // Usa o removeItem para jogar a linha inteira no lixo
  const handleRemove = () => {
    removeItem.mutate(item.id);
  };

  // =========================================
  // ESTADOS DE CARREGAMENTO (Bloqueia cliques duplos)
  // =========================================
  const isUpdating =
    updateQuantity.isPending && updateQuantity.variables?.itemId === item.id;
  const isRemoving = removeItem.isPending && removeItem.variables === item.id;
  const isProcessing = isUpdating || isRemoving;

  return (
    <div
      className={`group hover:bg-muted/50 relative flex items-start gap-3 rounded-xl p-2 transition-all duration-200 sm:gap-4 sm:p-3 ${
        isRemoving
          ? "pointer-events-none scale-[0.98] opacity-40"
          : "opacity-100"
      }`}
    >
      {/* =========================================
          1. IMAGEM DA OBRA 
      ========================================= */}
      <div className="bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm sm:h-20 sm:w-20 md:h-24 md:w-24">
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 4rem, (max-width: 768px) 5rem, 6rem"
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-muted-foreground bg-muted/30 flex h-full w-full flex-col items-center justify-center p-2 text-center">
            <ImageIcon className="h-4 w-4 opacity-40 sm:h-6 sm:w-6" />
          </div>
        )}
      </div>

      {/* =========================================
          2. CONTEÚDO (Nome, Preço e Botões)
      ========================================= */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          {/* Nome vindo direto da raiz do schema */}
          <h4 className="text-foreground line-clamp-2 pr-2 text-xs leading-tight font-semibold sm:text-sm md:text-base">
            {item.name}
          </h4>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isProcessing}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive -mt-2 -mr-2 h-8 w-8 shrink-0 transition-colors"
            title="Remover do carrinho"
          >
            {isRemoving ? (
              <Loader2 className="text-destructive h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Remover</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-primary truncate text-xs font-bold sm:text-sm md:text-base">
            {formattedPrice}
          </span>

          <div className="border-border bg-background flex h-7 items-center rounded-md border shadow-sm sm:h-8 sm:rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrease}
              // Bloqueia no 1 para forçar o uso da lixeira caso a pessoa queira deletar de vez
              disabled={item.quantity <= 1 || isProcessing}
              className="hover:bg-muted h-full w-7 rounded-none rounded-l-md sm:w-8 sm:rounded-l-lg"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <div className="flex w-6 items-center justify-center text-[11px] font-semibold sm:w-8 sm:text-xs">
              {isUpdating ? (
                <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />
              ) : (
                item.quantity
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrease}
              disabled={isProcessing}
              className="hover:bg-muted h-full w-7 rounded-none rounded-r-md sm:w-8 sm:rounded-r-lg"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
