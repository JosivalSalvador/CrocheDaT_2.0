"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductResponse } from "@/types/products.types";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const mainImage = product.images?.[0]?.url;

  const safePrice = Number(product.price || 0);
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(safePrice);

  return (
    <Link
      href={`/product/${product.id}`}
      // h-full garante que todos os links ocupem a mesma altura no grid/carrossel
      className="group focus-visible:ring-primary block h-full rounded-xl outline-none focus-visible:ring-2 sm:rounded-2xl"
    >
      {/* A SOLUÇÃO DA ESTRUTURA:
        Tiramos o 'aspect-square' do Card inteiro. 
        Ele agora tem 'h-full' e 'flex-col' para crescer e acomodar o conteúdo com respiro.
      */}
      <Card className="border-border/50 bg-card/50 flex h-full flex-col overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* =========================================
            1. IMAGEM DO PRODUTO (O QUADRADO PERFEITO)
            A mágica mudou pra cá. A imagem SEMPRE será um quadrado (aspect-square),
            valorizando o produto artesanal sem cortar detalhes importantes.
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
            'flex-1' faz o container do texto preencher o espaço restante,
            empurrando o rodapé e o botão para o fundo. Mudei os line-clamp para 2
            pra dar mais folga aos textos longos.
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
            3. RODAPÉ E BOTÃO 
        ========================================= */}
        <CardFooter className="mt-auto flex flex-row items-center justify-between gap-1.5 p-2.5 pt-0 sm:gap-2 sm:p-4 sm:pt-0">
          <span className="text-primary truncate text-xs font-bold tracking-tight sm:text-base">
            {formattedPrice}
          </span>

          <Button className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary h-7 shrink-0 rounded-md border px-2.5 text-[10px] font-semibold shadow-none transition-all duration-200 active:scale-95 sm:h-8 sm:rounded-lg sm:px-4 sm:text-xs">
            Detalhes
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
