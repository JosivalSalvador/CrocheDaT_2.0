"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/app/(customer)/_components/product-card";
import { CategoryNav } from "@/app/(customer)/_components/category-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, PackageX, X } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catData } = useCategories();

  // 1. Encontra a categoria atual para extrair o nome real
  const currentCategory = catData?.categories.find((cat) => {
    const catSlug = cat.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    return catSlug === slug;
  });

  // 2. Busca todos os produtos
  const { data, isLoading } = useProducts();

  // 3. Lógica de Filtro Combinada (Categoria + Busca)
  const filteredProducts =
    data?.products.filter((product) => {
      const matchesCategory = product.category?.name === currentCategory?.name;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <div className="relative flex w-full flex-1 flex-col">
      {/* Luz de fundo sutil (Específica desta página) */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-full max-w-2xl -translate-x-1/2 rounded-[100%] blur-[100px]" />

      <div className="container mx-auto flex-1 px-3 py-12 sm:px-4 md:py-20">
        {/* =========================================
            1. CABEÇALHO DIRETO E HUMANO
        ========================================= */}
        <header className="animate-in fade-in slide-in-from-top-4 mb-10 flex flex-col items-center text-center duration-700 md:mb-14">
          <div className="border-border/50 bg-background/50 text-muted-foreground mb-4 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            Design Autoral
          </div>

          <h1 className="text-foreground pb-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {currentCategory?.name || "Nossas Peças"}
          </h1>

          <p className="text-muted-foreground mt-3 max-w-xl text-base text-balance md:text-lg">
            Tudo o que criamos na linha de{" "}
            <span className="lowercase">
              {currentCategory?.name || "peças"}
            </span>
            . Feito à mão, sem frescura e com muita identidade para o seu dia a
            dia.
          </p>
        </header>

        {/* =========================================
            2. CENTRAL DE FILTROS: NAV + BUSCA FLUIDA
        ========================================= */}
        <div className="animate-in fade-in mb-12 flex flex-col items-center gap-6 delay-150 duration-700 md:mb-16 md:gap-8">
          <div className="w-full max-w-5xl">
            <CategoryNav />
          </div>

          <div className="relative w-full max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2" />

            <Input
              placeholder={`Procurar em ${currentCategory?.name || "categoria"}...`}
              className="border-border/60 bg-background/60 hover:border-border/80 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-primary/30 relative z-0 h-12 w-full rounded-full border pr-12 pl-11 text-sm shadow-sm backdrop-blur-md transition-all focus-visible:ring-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
                aria-label="Limpar pesquisa"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            3. LISTAGEM / GRID RESPONSIVO
        ========================================= */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="border-border/30 bg-card/10 flex h-full flex-col overflow-hidden rounded-2xl border p-3 shadow-sm backdrop-blur-sm sm:p-4"
              >
                <Skeleton className="bg-muted/40 mb-3 aspect-square w-full rounded-xl sm:mb-4" />
                <Skeleton className="bg-muted/40 mb-2 h-3 w-2/3 sm:h-4" />
                <Skeleton className="bg-muted/40 mb-2 h-2 w-full sm:h-3" />
                <Skeleton className="bg-muted/40 mt-auto h-2 w-4/5 sm:h-3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 grid grid-cols-2 gap-3 duration-700 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border-border/40 bg-card/20 animate-in zoom-in-95 mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-3xl border px-4 py-16 text-center shadow-sm backdrop-blur-md duration-500">
            <PackageX className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <h3 className="text-xl font-bold tracking-tight">
              Nenhuma peça por aqui
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm text-balance md:text-base">
              Não achamos nada com o termo{" "}
              <span className="text-foreground font-semibold">{`"${searchTerm}"`}</span>
              . Que tal tentar outra palavra?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
