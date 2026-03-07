"use client";

import { useState, useEffect, useMemo } from "react";
import { PackageX } from "lucide-react";

import { useProducts } from "@/hooks/use-products";
import { type ProductResponse } from "@/types/products.types";

import { ProductFilters } from "./product-filters";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  onEditProduct: (product: ProductResponse) => void;
}

export function ProductGrid({ onEditProduct }: ProductGridProps) {
  // 1. Estados dos filtros
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  // 2. Lógica de Debounce (espera 500ms após o usuário parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // 3. Busca de Dados
  const { data, isLoading } = useProducts({
    search: debouncedSearch,
    categoryId: categoryId === "all" ? undefined : categoryId,
  });

  // 4. Filtro Client-side (Fallback)
  const filteredProducts = useMemo(() => {
    // Extrai o array aqui dentro para não gerar nova referência na memória em cada render
    const rawProducts: ProductResponse[] =
      data?.products || (Array.isArray(data) ? data : []);

    return rawProducts.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchCategory =
        categoryId === "all" || product.categoryId === categoryId;

      return matchSearch && matchCategory;
    });
  }, [data, debouncedSearch, categoryId]);

  return (
    <div className="flex flex-col gap-6">
      {/* 🎛️ FILTROS */}
      <ProductFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
      />

      {/* 📦 GRID DE PRODUTOS */}
      {isLoading ? (
        // 👇 Agora espelha exatamente as 2 colunas no mobile e o gap-3
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        // 👇 O Grid agora nasce com 2 colunas e tem um gap um pouco menor no mobile
        <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
            />
          ))}
        </div>
      ) : (
        /* 📭 ESTADO VAZIO */
        <div className="bg-muted/10 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-12 text-center sm:py-20">
          <div className="bg-muted mb-4 shrink-0 rounded-full p-4">
            <PackageX className="text-muted-foreground h-8 w-8 opacity-50" />
          </div>
          <p className="text-foreground text-lg font-medium">
            Nenhum produto encontrado
          </p>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Não encontramos nenhum produto com os filtros atuais. Tente buscar
            por outro nome ou limpar a categoria.
          </p>
        </div>
      )}
    </div>
  );
}
