"use client";

import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductCard } from "./_components/product-card";
import { CategoryNav } from "./_components/category-nav";
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
  // Separa os produtos em "prateleiras" baseando-se no nome da categoria.
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
    <div className="selection:bg-primary/30 relative flex min-h-screen flex-col">
      {/* Background Isolado */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Conteúdo Principal */}
      <main className="relative z-10 container mx-auto flex-1 overflow-hidden px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        {/* =========================================
            1. CABEÇALHO DA VITRINE (Minimalista e Elegante)
        ========================================= */}
        <header className="animate-in fade-in slide-in-from-bottom-4 mb-10 flex flex-col items-center text-center duration-1000">
          <span className="text-primary mb-4 text-xs font-semibold tracking-widest uppercase">
            Design Autoral & Exclusivo
          </span>

          <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Nossas Peças Artesanais
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance">
            Descubra o cuidado em cada detalhe. Explore coleções exclusivas
            criadas para trazer aconchego, sofisticação e estilo ao seu dia a
            dia.
          </p>
        </header>

        {/* =========================================
            2. MENU RÁPIDO DE CATEGORIAS
        ========================================= */}
        <div className="animate-in fade-in mb-16 delay-150 duration-1000">
          <CategoryNav />
        </div>

        {/* =========================================
            3. ESTADO DE ERRO
        ========================================= */}
        {isError && (
          <div className="border-destructive/20 bg-destructive/5 text-destructive animate-in zoom-in-95 mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl border p-12 text-center backdrop-blur-sm duration-500">
            <AlertCircle className="mb-4 h-12 w-12 opacity-80" />
            <h2 className="text-xl font-semibold tracking-tight">
              Não foi possível carregar o catálogo
            </h2>
            <p className="mt-2 text-sm text-balance opacity-80">
              Tivemos um problema temporário de conexão. Por favor, recarregue a
              página para tentar novamente.
            </p>
          </div>
        )}

        {/* =========================================
            4. ESTADO DE LOADING (SKELETONS EM PRATELEIRAS)
        ========================================= */}
        {isLoading && (
          <div className="space-y-16">
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <div key={rowIndex} className="w-full">
                {/* Skeleton do Título da Prateleira */}
                <div className="border-border/40 mb-6 flex items-end justify-between border-b pb-4">
                  <Skeleton className="bg-muted/50 h-8 w-48 rounded-md" />
                  <Skeleton className="bg-muted/50 h-5 w-24 rounded-md" />
                </div>

                {/* Skeletons dos Cards (Com o CardFooter incluído) */}
                <div className="flex gap-4 overflow-hidden md:gap-6">
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <Card
                      key={colIndex}
                      className="border-border/40 bg-card/20 min-w-70 flex-1 flex-col overflow-hidden rounded-xl shadow-none backdrop-blur-sm"
                    >
                      <Skeleton className="bg-muted/50 aspect-square w-full rounded-none" />

                      <CardContent className="flex flex-1 flex-col p-5 pt-6">
                        <Skeleton className="bg-muted/50 mb-3 h-5 w-2/3 rounded-md" />
                        <Skeleton className="bg-muted/50 h-4 w-full rounded-md" />
                      </CardContent>

                      <CardFooter className="flex items-center justify-between p-5 pt-0">
                        <Skeleton className="bg-muted/50 h-6 w-20 rounded-md" />
                        <Skeleton className="bg-muted/50 h-9 w-24 rounded-lg" />
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
          <div className="animate-in fade-in slide-in-from-bottom-8 space-y-16 duration-700">
            {Object.entries(groupedProducts).map(
              ([categoryName, categoryProducts]) => {
                // Simula um slug básico para a URL (ex: "Bolsas Exclusivas" vira "bolsas-exclusivas")
                const categorySlug = categoryName
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                return (
                  <section key={categoryName} className="w-full">
                    {/* Cabeçalho da Categoria */}
                    <div className="border-border/40 mb-6 flex items-end justify-between border-b pb-4">
                      <h2 className="text-foreground text-2xl font-bold tracking-tight">
                        {categoryName}
                      </h2>
                      <Link
                        href={`/category/${categorySlug}`}
                        className="group text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        Ver todas
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Carrossel de Produtos */}
                    <Carousel
                      opts={{
                        align: "start",
                        loop: false,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4 md:-ml-6">
                        {categoryProducts.map((product) => (
                          <CarouselItem
                            key={product.id}
                            className="basis-[75%] pl-4 sm:basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4"
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
            6. ESTADO VAZIO (SEM PRODUTOS)
        ========================================= */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="border-border/60 bg-card/30 animate-in zoom-in-95 mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center backdrop-blur-sm duration-500">
            <PackageOpen className="text-muted-foreground mb-6 h-14 w-14 opacity-50" />
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Coleção em Produção
            </h2>
            <p className="text-muted-foreground mt-3 text-base text-balance">
              Nossas peças são únicas e feitas à mão. No momento, nossa vitrine
              está sendo renovada. Volte em breve para conferir as novidades.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
