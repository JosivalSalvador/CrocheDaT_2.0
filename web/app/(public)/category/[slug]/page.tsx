"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { GridBackground } from "@/components/ui/grid-background";
import { ProductCard } from "../../_components/product-card";
import { CategoryNav } from "../../_components/category-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, PackageX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catData } = useCategories();

  // 1. Encontra a categoria atual para extrair o nome real (ex: "Bolsas Exclusivas")
  const currentCategory = catData?.categories.find((cat) => {
    const catSlug = cat.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    return catSlug === slug;
  });

  // 2. Busca todos os produtos (conforme sua arquitetura de filtro no client)
  const { data, isLoading } = useProducts();

  // 3. Lógica de Filtro Combinada (Categoria + Busca)
  const filteredProducts =
    data?.products.filter((product) => {
      // Como seu tipo de produto só tem { name: string } na categoria, comparamos por nome
      const matchesCategory = product.category?.name === currentCategory?.name;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <div className="selection:bg-primary/30 relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        {/* Navegação superior */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o Início
        </Link>

        {/* Cabeçalho dinâmico */}
        <header className="mb-10 space-y-4">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
            {currentCategory?.name || "Categoria"}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore nossa seleção de{" "}
            {currentCategory?.name.toLowerCase() || "peças"} feitas à mão com
            exclusividade.
          </p>
        </header>

        {/* Filtros e Busca */}
        <div className="mb-12 space-y-6">
          <CategoryNav />

          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={`Buscar em ${currentCategory?.name || "categoria"}...`}
              className="bg-card/50 border-border/40 focus:ring-primary/20 rounded-xl pl-10 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Listagem / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="bg-muted/40 aspect-square w-full rounded-2xl" />
                <Skeleton className="bg-muted/40 h-4 w-2/3" />
                <Skeleton className="bg-muted/40 h-4 w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-700 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border-border/60 bg-card/20 flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center backdrop-blur-sm">
            <PackageX className="text-muted-foreground mb-4 h-12 w-12 opacity-40" />
            <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mt-2">
              Não encontramos resultados para &quot;{searchTerm}&quot; nesta
              categoria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
