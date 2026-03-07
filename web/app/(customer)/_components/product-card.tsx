"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon, ShoppingCart, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductResponse } from "@/types/products.types";

import { useCartMutations } from "@/hooks/use-cart";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const mainImage = product.images?.[0]?.url;

  const { addItem } = useCartMutations();

  const safePrice = Number(product.price || 0);
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(safePrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link
      href={`/home/product/${product.id}`}
      className="group focus-visible:ring-primary block h-full rounded-xl outline-none focus-visible:ring-2 sm:rounded-2xl"
    >
      <Card className="border-border/50 bg-card/50 flex h-full flex-col overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* =========================================
            1. IMAGEM DO PRODUTO 
        ========================================= */}
        <div className="bg-muted relative aspect-square w-full shrink-0 overflow-hidden">
          {mainImage && !imgError ? (
            <Image
              src={mainImage}
              alt={`Foto de ${product.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="bg-secondary/30 text-muted-foreground flex h-full w-full flex-col items-center justify-center p-2 text-center">
              <ImageIcon className="mb-1 h-6 w-6 opacity-40 transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10" />
              <span className="text-[9px] font-semibold tracking-wider uppercase opacity-60 sm:text-[10px]">
                {imgError ? "Indisponível" : "Sem Imagem"}
              </span>
            </div>
          )}

          {product.category?.name && (
            <Badge className="bg-background/95 text-foreground hover:bg-background absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[8px] font-medium shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px]">
              {product.category.name}
            </Badge>
          )}
        </div>

        {/* =========================================
            2. INFORMAÇÕES (COM RESPIRO)
        ========================================= */}
        <CardContent className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-4">
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-xs font-semibold tracking-tight transition-colors sm:text-sm">
            {product.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-[10px] leading-relaxed sm:text-xs">
            {product.description}
          </p>
        </CardContent>

        {/* =========================================
            3. RODAPÉ E BOTÃO DE CARRINHO
        ========================================= */}
        <CardFooter className="mt-auto flex flex-row items-center justify-between gap-1.5 p-2.5 pt-0 sm:gap-2 sm:p-4 sm:pt-0">
          <span className="text-primary truncate text-xs font-bold tracking-tight sm:text-base">
            {formattedPrice}
          </span>

          {/* O SEGREDO ESTÁ AQUI: 
              - px-2 no mobile (só pra caber o ícone suavemente).
              - sm:px-4 no desktop para caber o ícone + texto.
              - <span> escondido no mobile (hidden sm:inline).
          */}
          <Button
            onClick={handleAddToCart}
            disabled={addItem.isPending}
            title="Adicionar ao Carrinho"
            className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary relative z-10 flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold shadow-none transition-all duration-200 active:scale-95 disabled:opacity-50 sm:h-8 sm:rounded-lg sm:px-4 sm:text-xs"
          >
            {addItem.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}

            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
