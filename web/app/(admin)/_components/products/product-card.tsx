"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Clock, Scissors, PackageX, ImageOff } from "lucide-react";
import { type ProductResponse } from "@/types/products.types";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ProductCardProps {
  product: ProductResponse;
  onEdit?: (product: ProductResponse) => void;
  className?: string;
}

export function ProductCard({ product, onEdit, className }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const coverImage = product.images?.[0]?.url;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className={cn("group transition-all hover:shadow-md", className)}>
      {/* 🖼️ ÁREA DA IMAGEM */}
      {/* MUDANÇA: Substituído aspect-3/4 por aspect-square para acabar com o "alto e magro" */}
      <div className="bg-muted relative aspect-square w-full shrink-0 border-b">
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : imgError ? (
          <div className="bg-destructive/5 text-destructive flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center sm:gap-2 sm:p-4">
            <ImageOff className="h-6 w-6 opacity-50 sm:h-8 sm:w-8" />
            <span className="text-[10px] font-medium sm:text-xs">
              Link inválido
            </span>
          </div>
        ) : (
          <div className="bg-muted/30 text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center sm:gap-2 sm:p-4">
            <PackageX className="h-6 w-6 opacity-40 sm:h-8 sm:w-8" />
            <span className="text-[10px] font-medium sm:text-xs">Sem foto</span>
          </div>
        )}

        {product.category?.name && (
          <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
            <Badge
              variant="secondary"
              className="bg-secondary/90 max-w-25 truncate px-1.5 py-0 text-[10px] shadow-sm backdrop-blur-md sm:max-w-37.5 sm:px-2.5 sm:py-0.5 sm:text-xs"
            >
              {product.category.name}
            </Badge>
          </div>
        )}
      </div>

      {/* 📝 CABEÇALHO */}
      {/* MUDANÇA: Adicionado pb-2 sm:pb-3 para dar respiro entre a descrição e os ícones abaixo */}
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle
          className="line-clamp-1 text-sm sm:text-base"
          title={product.name}
        >
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-8 text-[10px] leading-snug sm:min-h-10 sm:text-xs">
          {product.description}
        </CardDescription>
      </CardHeader>

      {/* 🛠️ CONTEÚDO */}
      <CardContent className="flex flex-col gap-1.5 pt-0 sm:gap-2 sm:pt-0 md:pt-0">
        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
          <Scissors className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          <span className="truncate" title={product.material}>
            {product.material}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
          <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          <span className="truncate">
            Produção: {product.productionTime} dias
          </span>
        </div>
      </CardContent>

      {/* 💰 RODAPÉ */}
      <CardFooter className="bg-muted/10 flex-nowrap items-center justify-between gap-2 border-t pt-3 sm:pt-4 md:pt-4">
        <span className="text-foreground truncate text-xs font-semibold sm:text-sm md:text-base">
          {formatCurrency(product.price)}
        </span>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 shrink-0 rounded-md px-2 text-[10px] sm:h-8 sm:px-3 sm:text-xs"
          onClick={() => onEdit?.(product)}
        >
          <Edit className="mr-1 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
}
