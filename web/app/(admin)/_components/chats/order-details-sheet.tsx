"use client";

import { useCartDetail } from "@/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  AlertCircle,
  PackageOpen,
  LayoutList,
  ReceiptText,
} from "lucide-react";

import type { CartResponse } from "@/types/index";

interface OrderDetailsSheetProps {
  cartId: string;
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export function OrderDetailsSheet({ cartId }: OrderDetailsSheetProps) {
  const { data, isLoading, isError } = useCartDetail(cartId);
  const cart = data?.cart as CartResponse | undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Trigger mantendo o requinte, ajustado para telas menores */}
        <Button
          variant="secondary"
          size="sm"
          className="group border-border/40 bg-background hover:border-primary/50 hover:bg-primary/5 hover:text-primary h-9 gap-2 rounded-xl border shadow-sm transition-all hover:shadow-md sm:h-10 sm:gap-2.5 sm:px-5"
        >
          <ShoppingBag className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4" />
          <span className="hidden text-[13px] font-bold tracking-wide sm:inline-block">
            Visualizar Encomenda
          </span>
        </Button>
      </SheetTrigger>

      {/* 75vw cravado no mobile, max-w-md no desktop. O blur-2xl dá o aspecto Glassmorphism Premium */}
      <SheetContent className="border-border/40 bg-background/95 [&>button]:bg-muted/50 hover:[&>button]:bg-muted hover:[&>button]:text-foreground flex w-[75vw] flex-col border-l p-0 backdrop-blur-2xl sm:w-full sm:max-w-md [&>button]:top-4 [&>button]:right-4 [&>button]:z-50 [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:transition-all sm:[&>button]:top-6 sm:[&>button]:right-6">
        {/* HEADER: Paddings bem menores no mobile para economizar espaço valioso */}
        <SheetHeader className="border-border/40 bg-card/50 z-10 border-b p-4 shadow-sm sm:p-7">
          <SheetTitle className="flex flex-col items-start gap-2 sm:gap-3">
            <div className="from-primary/20 to-primary/5 text-primary ring-primary/10 flex h-10 w-10 items-center justify-center rounded-[14px] bg-linear-to-br shadow-inner ring-1 sm:h-14 sm:w-14 sm:rounded-2xl">
              <PackageOpen className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div className="space-y-0.5 text-left sm:space-y-1">
              <span className="text-foreground block text-lg font-black tracking-tight sm:text-2xl">
                Detalhes do Pedido
              </span>
              <SheetDescription className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase sm:text-xs">
                ID do Pedido{" "}
                <span className="text-primary">#{cartId.split("-")[0]}</span>
              </SheetDescription>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* CORPO: Fundo sutil para destacar os cards brancos */}
        <div className="bg-muted/10 flex-1 overflow-y-auto p-3 sm:p-6">
          {isLoading && (
            <div className="flex flex-col gap-3 sm:gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-background ring-border/50 flex items-center gap-3 rounded-xl p-3 ring-1 sm:gap-4 sm:rounded-2xl sm:p-4"
                >
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg sm:h-14 sm:w-14 sm:rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2 sm:gap-2.5">
                    <Skeleton className="h-3 w-3/4 rounded-full sm:h-4" />
                    <Skeleton className="h-2 w-1/3 rounded-full sm:h-3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="bg-destructive/5 ring-destructive/20 flex min-h-50 flex-col items-center justify-center rounded-2xl p-5 ring-1 sm:min-h-62.5 sm:rounded-3xl sm:p-8">
              <div className="bg-destructive/10 text-destructive mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <p className="text-foreground text-center text-[13px] font-bold tracking-tight sm:text-base">
                Falha ao Buscar Dados
              </p>
              <p className="text-muted-foreground mt-1 text-center text-[10px] font-medium sm:text-sm">
                Os itens desta encomenda não puderam ser carregados.
              </p>
            </div>
          )}

          {cart && !isLoading && !isError && (
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <LayoutList className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <h4 className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase sm:text-xs">
                  Lista de Itens ({cart.items.length})
                </h4>
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-background ring-border/50 hover:ring-primary/40 relative flex items-center justify-between rounded-xl p-2.5 shadow-xs ring-1 transition-all hover:shadow-md sm:rounded-2xl sm:p-4 dark:bg-zinc-950/50"
                  >
                    {/* min-w-0 no flex garante que o truncate do texto do item funcione perfeitamente */}
                    <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
                      {/* Caixa de Quantidade menor no mobile */}
                      <div className="bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-12 sm:w-12 sm:rounded-xl">
                        <span className="text-[10px] font-black sm:text-xs">
                          {item.quantity}x
                        </span>
                      </div>

                      {/* Textos fluídos com truncate */}
                      <div className="flex min-w-0 flex-col gap-0.5 pr-2 sm:gap-1 sm:pr-3">
                        <span className="text-foreground truncate text-[12px] leading-tight font-bold sm:text-[15px]">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground truncate text-[9px] font-semibold sm:text-xs">
                          {formatBRL(item.price)}{" "}
                          <span className="text-muted-foreground/50">/ un</span>
                        </span>
                      </div>
                    </div>

                    {/* Valor Total da Linha - Fonte ajustada no mobile para não espremer */}
                    <span className="text-foreground shrink-0 text-right text-[12px] font-black tracking-tight sm:text-base">
                      {formatBRL(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Recibo de Totais */}
        {cart && !isLoading && !isError && (
          <div className="bg-background ring-border/40 z-10 mt-auto p-4 ring-1 sm:p-6">
            <div className="bg-muted/30 ring-border/50 flex items-center justify-between rounded-xl p-3.5 ring-1 sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-inner sm:h-12 sm:w-12 sm:rounded-xl">
                  <ReceiptText className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-0 sm:gap-0.5">
                  <span className="text-muted-foreground truncate text-[9px] font-black tracking-[0.15em] uppercase sm:text-[11px] sm:tracking-[0.2em]">
                    Total Estimado
                  </span>
                  <span className="text-foreground truncate text-[16px] font-black tracking-tighter sm:text-2xl">
                    {formatBRL(cart.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
