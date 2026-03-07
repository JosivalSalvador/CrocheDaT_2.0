"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductCard } from "../../_components/product-card";
import { CategoryNav } from "../../_components/category-nav";
import { useProducts } from "@/hooks/use-products";
import { AlertCircle, PackageOpen, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PublicHomePage() {
  const { data, isLoading, isError } = useProducts();
  const products = data?.products || [];

  // ====================================================================
  // 🧠 LÓGICA DE AGRUPAMENTO
  // ====================================================================
  const groupedProducts = products.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || "Destaques";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    },
    {} as Record<string, typeof products>,
  );

  return (
    <div className="container mx-auto flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
      {/* =========================================
          1. CABEÇALHO DA VITRINE
      ========================================= */}
      <header className="animate-in fade-in slide-in-from-bottom-4 mb-8 flex flex-col items-center text-center duration-1000 md:mb-12">
        <span className="text-primary mb-3 text-[10px] font-semibold tracking-widest uppercase md:mb-4 md:text-xs">
          Design Autoral & Exclusivo
        </span>

        <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Nossas Peças Artesanais
        </h1>

        <p className="text-muted-foreground mt-4 max-w-2xl text-sm text-balance md:mt-6 md:text-lg">
          Descubra o cuidado em cada detalhe. Explore coleções exclusivas
          criadas para trazer aconchego, sofisticação e estilo ao seu dia a dia.
        </p>
      </header>

      {/* =========================================
          2. MENU RÁPIDO DE CATEGORIAS
      ========================================= */}
      <div className="animate-in fade-in mb-10 delay-150 duration-1000 md:mb-16">
        <CategoryNav />
      </div>

      {/* =========================================
          3. ESTADO DE ERRO
      ========================================= */}
      {isError && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive animate-in zoom-in-95 mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl border p-8 text-center backdrop-blur-sm duration-500 md:p-12">
          <AlertCircle className="mb-4 h-10 w-10 opacity-80 md:h-12 md:w-12" />
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">
            Não foi possível carregar o catálogo
          </h2>
          <p className="mt-2 text-xs text-balance opacity-80 md:text-sm">
            Tivemos um problema temporário de conexão. Por favor, recarregue a
            página para tentar novamente.
          </p>
        </div>
      )}

      {/* =========================================
          4. ESTADO DE LOADING (CLONE DO NOVO CARD)
      ========================================= */}
      {isLoading && (
        <div className="space-y-10 md:space-y-16">
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <div key={rowIndex} className="w-full overflow-hidden">
              <div className="border-border/40 mb-4 flex items-end justify-between border-b pb-3 md:mb-6 md:pb-4">
                <Skeleton className="bg-muted/50 h-6 w-32 rounded-md md:h-8 md:w-48" />
                <Skeleton className="bg-muted/50 h-4 w-16 rounded-md md:h-5 md:w-24" />
              </div>

              <div className="flex flex-nowrap gap-3 sm:gap-4 md:gap-6">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Card
                    key={colIndex}
                    className="border-border/40 bg-card/20 flex h-full min-w-[55%] flex-col overflow-hidden rounded-xl border shadow-none backdrop-blur-sm sm:min-w-[33.333%] sm:rounded-2xl md:min-w-[25%] lg:min-w-[20%]"
                  >
                    <div className="aspect-square w-full shrink-0">
                      <Skeleton className="bg-muted/50 h-full w-full rounded-none" />
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                      <Skeleton className="bg-muted/50 h-3 w-2/3 rounded-md sm:h-4" />
                      <Skeleton className="bg-muted/50 h-2 w-full rounded-md sm:h-3" />
                      <Skeleton className="bg-muted/50 h-2 w-4/5 rounded-md sm:h-3" />
                    </CardContent>

                    <CardFooter className="mt-auto flex flex-row items-center justify-between gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
                      <Skeleton className="bg-muted/50 h-4 w-12 rounded-md sm:h-5 sm:w-16" />
                      <Skeleton className="bg-muted/50 h-7 w-14 shrink-0 rounded-md sm:h-8 sm:w-20 sm:rounded-lg" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================
          5. LISTAGEM DE PRODUTOS (CARROSSÉIS)
      ========================================= */}
      {!isLoading && !isError && products.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 space-y-10 duration-700 md:space-y-16">
          {Object.entries(groupedProducts).map(
            ([categoryName, categoryProducts]) => {
              const categorySlug = categoryName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-");

              return (
                <section key={categoryName} className="w-full">
                  <div className="border-border/40 mb-4 flex items-end justify-between border-b pb-3 md:mb-6 md:pb-4">
                    <h2 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
                      {categoryName}
                    </h2>
                    <Link
                      href={`/home/category/${categorySlug}`}
                      className="group text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors md:text-sm"
                    >
                      Ver todas
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                    </Link>
                  </div>

                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-3 pb-2 sm:-ml-4 md:-ml-6">
                      {categoryProducts.map((product) => (
                        <CarouselItem
                          key={product.id}
                          className="basis-[55%] pl-3 sm:basis-1/3 sm:pl-4 md:basis-1/4 md:pl-6 lg:basis-1/5"
                        >
                          <div className="h-full">
                            <ProductCard product={product} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <div className="hidden md:block">
                      <CarouselPrevious className="bg-background/80 hover:bg-background -left-4 backdrop-blur-sm" />
                      <CarouselNext className="bg-background/80 hover:bg-background -right-4 backdrop-blur-sm" />
                    </div>
                  </Carousel>
                </section>
              );
            },
          )}
        </div>
      )}

      {/* =========================================
          6. ESTADO VAZIO
      ========================================= */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="border-border/60 bg-card/30 animate-in zoom-in-95 mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center backdrop-blur-sm duration-500 md:p-16">
          <PackageOpen className="text-muted-foreground mb-4 h-10 w-10 opacity-50 md:mb-6 md:h-14 md:w-14" />
          <h2 className="text-foreground text-xl font-semibold tracking-tight md:text-2xl">
            Coleção em Produção
          </h2>
          <p className="text-muted-foreground mt-2 text-sm text-balance md:mt-3 md:text-base">
            Nossas peças são únicas e feitas à mão. No momento, nossa vitrine
            está sendo renovada. Volte em breve para conferir as novidades.
          </p>
        </div>
      )}
    </div>
  );
}
