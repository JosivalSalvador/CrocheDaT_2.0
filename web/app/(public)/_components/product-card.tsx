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
  // Estado para controlar se a imagem quebrou no carregamento
  const [imgError, setImgError] = useState(false);

  // Pega a primeira imagem do array. Se não existir, fica undefined.
  const mainImage = product.images?.[0]?.url;

  // Formata o número para Moeda (R$ 150,50)
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <Card className="border-border/50 bg-card/50 flex h-full flex-col overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* =========================================
            1. IMAGEM DO PRODUTO & BADGE
        ========================================= */}
        <div className="bg-muted relative aspect-square w-full overflow-hidden">
          {/* Renderiza a imagem apenas se tiver URL E não tiver dado erro */}
          {mainImage && !imgError ? (
            <Image
              src={mainImage}
              alt={`Foto de ${product.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)} // Dispara se o link estiver quebrado/404
            />
          ) : (
            // Fallback para quando não tem imagem ou o link quebrou
            <div className="bg-secondary/30 text-muted-foreground flex h-full w-full flex-col items-center justify-center">
              <ImageIcon className="mb-2 h-10 w-10 opacity-40 transition-transform duration-500 group-hover:scale-110" />
              <span className="text-xs font-semibold tracking-wider uppercase opacity-60">
                {imgError ? "Imagem Indisponível" : "Sem Imagem"}
              </span>
            </div>
          )}

          {/* Badge flutuante com a Categoria */}
          {product.category?.name && (
            <Badge className="bg-background/90 text-foreground hover:bg-background absolute top-3 left-3 z-10 backdrop-blur-md">
              {product.category.name}
            </Badge>
          )}
        </div>

        {/* =========================================
            2. INFORMAÇÕES (TÍTULO E DESCRIÇÃO)
        ========================================= */}
        <CardContent className="flex flex-1 flex-col p-4">
          <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-semibold tracking-tight transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {product.description}
          </p>
        </CardContent>

        {/* =========================================
            3. RODAPÉ (PREÇO E AÇÃO)
        ========================================= */}
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-primary text-lg font-bold">
            {formattedPrice}
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="group-hover:bg-primary group-hover:text-primary-foreground rounded-xl transition-all"
          >
            Detalhes
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
