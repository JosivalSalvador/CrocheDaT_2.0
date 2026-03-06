"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import type { CategoryResponse } from "@/types/categories.types";
import type { ProductResponse } from "@/types/products.types";

export function CategoryNav() {
  const pathname = usePathname();

  const {
    data: catData,
    isLoading: catLoading,
    isError: catError,
  } = useCategories();
  const {
    data: prodData,
    isLoading: prodLoading,
    isError: prodError,
  } = useProducts();

  const categories: CategoryResponse[] = catData?.categories || [];
  const products: ProductResponse[] = prodData?.products || [];

  const activeCategoryNames = new Set(
    products
      .map((product) => product.category?.name)
      .filter((name): name is string => name !== undefined),
  );

  const activeCategories = categories.filter((category) =>
    activeCategoryNames.has(category.name),
  );

  const isLoading = catLoading || prodLoading;
  const isError = catError || prodError;

  if (isError) return null;

  // Lógica para extrair as classes de estilo para não repetir código
  const getButtonStyles = (isActive: boolean) =>
    cn(
      "shrink-0 rounded-full transition-all duration-300 ease-out text-sm md:text-base h-9 md:h-11 px-5 md:px-7",
      isActive
        ? "shadow-lg shadow-primary/30 scale-105 font-semibold ring-1 ring-primary/20"
        : "opacity-80 hover:opacity-100 hover:scale-105 hover:shadow-md hover:border-primary/40 bg-background/50 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground",
    );

  return (
    <nav className="relative w-full">
      <div className="flex w-full items-center gap-3 overflow-x-auto px-2 pt-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center md:gap-4 [&::-webkit-scrollbar]:hidden">
        {/* ESTADO DE LOADING */}
        {isLoading && (
          <>
            <Skeleton className="bg-muted/50 h-9 w-20 shrink-0 rounded-full md:h-11 md:w-24" />
            <Skeleton className="bg-muted/50 h-9 w-28 shrink-0 rounded-full md:h-11 md:w-32" />
            <Skeleton className="bg-muted/50 h-9 w-32 shrink-0 rounded-full md:h-11 md:w-36" />
            <Skeleton className="bg-muted/50 h-9 w-24 shrink-0 rounded-full md:h-11 md:w-28" />
          </>
        )}

        {/* LISTAGEM DE CATEGORIAS (SUCESSO) */}
        {!isLoading && (
          <>
            {/* Botão "Todas" */}
            <Button
              asChild
              variant={pathname === "/" ? "default" : "outline"}
              className={getButtonStyles(pathname === "/")}
            >
              <Link href="/">Todas</Link>
            </Button>

            {/* Mapeando as categorias */}
            {activeCategories.map((category: CategoryResponse) => {
              const slug = category.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-");

              const href = `/category/${slug}`;
              const isActive = pathname === href;

              return (
                <Button
                  key={category.id}
                  asChild
                  // Usamos 'outline' no inativo para aproveitar o controle de bordas do estilo acima
                  variant={isActive ? "default" : "outline"}
                  className={getButtonStyles(isActive)}
                >
                  <Link href={href}>{category.name}</Link>
                </Button>
              );
            })}
          </>
        )}
      </div>
    </nav>
  );
}
