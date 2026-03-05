"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/use-products"; // Hook que você me mandou
import { GridBackground } from "@/components/ui/grid-background";
import { ProductGallery } from "../../_components/product-gallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Usando o hook específico que você mandou
  const { data, isLoading, isError } = useProduct(id);

  // O seu hook retorna a estrutura baseada no seu Action
  const product = data?.product;

  // Formatação de preço (Moeda Brasileira)
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product?.price || 0);

  // =========================================
  // 1. TRATAMENTO DE ERRO OU PRODUTO INEXISTENTE
  // =========================================
  if (isError || (!isLoading && !product)) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-4">
        <GridBackground />
        <div className="animate-in fade-in zoom-in-95 relative z-10 flex max-w-md flex-col items-center text-center duration-500">
          <AlertCircle className="text-destructive h-16 w-16 opacity-50" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            Ops! Produto não encontrado.
          </h2>
          <p className="text-muted-foreground mt-2">
            A peça que você procura pode ter sido removida ou o link está
            incorreto.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="mt-8 rounded-xl"
            variant="default"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a vitrine
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="selection:bg-primary/30 relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Navegação Voltar */}
        <button
          onClick={() => router.back()}
          className="group text-muted-foreground hover:text-primary mb-8 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* =========================================
              COLUNA ESQUERDA: GALERIA (USA SEU COMPONENTE)
          ========================================= */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            {isLoading ? (
              <Skeleton className="bg-muted/40 aspect-square w-full rounded-3xl" />
            ) : (
              <ProductGallery images={product?.images} />
            )}
          </div>

          {/* =========================================
              COLUNA DIREITA: INFORMAÇÕES E COMPRA
          ========================================= */}
          <div className="animate-in fade-in slide-in-from-right-4 flex flex-col delay-150 duration-700">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="bg-muted/40 h-6 w-24 rounded-full" />
                <Skeleton className="bg-muted/40 h-12 w-3/4 rounded-lg" />
                <Skeleton className="bg-muted/40 h-24 w-full rounded-xl" />
                <Skeleton className="bg-muted/40 h-12 w-40 rounded-lg" />
              </div>
            ) : (
              <>
                <div className="border-border/40 mb-6 space-y-4 border-b pb-6">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/15 px-3 py-1"
                  >
                    {product?.category?.name || "Artesanato"}
                  </Badge>
                  <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    {product?.name}
                  </h1>
                  <p className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
                    {formattedPrice}
                  </p>
                </div>

                <div className="mb-10">
                  <h3 className="text-muted-foreground/80 mb-3 text-sm font-bold tracking-widest uppercase">
                    Sobre a peça
                  </h3>
                  <p className="text-muted-foreground/90 text-lg leading-relaxed">
                    {product?.description}
                  </p>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="shadow-primary/20 h-16 flex-1 gap-3 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <ShoppingBag className="h-6 w-6" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border bg-card/40 hover:bg-accent h-16 flex-1 gap-3 rounded-2xl text-lg font-semibold backdrop-blur-md transition-all active:scale-95"
                  >
                    <MessageCircle className="h-6 w-6" />
                    Tirar Dúvida
                  </Button>
                </div>

                {/* TRUST BADGES (Estilo Enterprise) */}
                <div className="border-border/40 bg-card/20 grid grid-cols-3 gap-2 rounded-2xl border p-6 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-primary/5 rounded-full p-2">
                      <ShieldCheck className="text-primary/70 h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tighter uppercase sm:text-xs">
                      Seguro
                    </span>
                  </div>
                  <div className="border-border/40 flex flex-col items-center gap-2 border-x px-2 text-center">
                    <div className="bg-primary/5 rounded-full p-2">
                      <Truck className="text-primary/70 h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tighter uppercase sm:text-xs">
                      Envio Rápido
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-primary/5 rounded-full p-2">
                      <RotateCcw className="text-primary/70 h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tighter uppercase sm:text-xs">
                      Troca Grátis
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
