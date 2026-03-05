"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import type { CategoryResponse } from "@/types/categories.types";

export function CategoryNav() {
  const pathname = usePathname();
  const { data, isLoading, isError } = useCategories();

  // Agora o TypeScript sabe exatamente o que tem dentro desse array
  const categories: CategoryResponse[] = data?.categories || [];

  // Se der erro ao carregar as categorias, não quebra a tela, apenas oculta o menu
  if (isError) return null;

  return (
    <nav className="relative w-full">
      {/* Container com scroll horizontal oculto (no mobile) 
        A classe 'scrollbar-hide' precisaria estar no seu globals.css, 
        mas usamos truques do Tailwind para esconder a barra
      */}
      <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
        {/* ESTADO DE LOADING */}
        {isLoading && (
          <>
            <Skeleton className="bg-muted/50 h-10 w-20 shrink-0 rounded-full" />
            <Skeleton className="bg-muted/50 h-10 w-28 shrink-0 rounded-full" />
            <Skeleton className="bg-muted/50 h-10 w-32 shrink-0 rounded-full" />
            <Skeleton className="bg-muted/50 h-10 w-24 shrink-0 rounded-full" />
          </>
        )}

        {/* LISTAGEM DE CATEGORIAS (SUCESSO) */}
        {!isLoading && (
          <>
            {/* Botão "Todas" que leva para a Home */}
            <Button
              asChild
              variant={pathname === "/" ? "default" : "secondary"}
              className={cn(
                "shrink-0 rounded-full transition-all",
                pathname === "/" ? "shadow-md" : "opacity-80 hover:opacity-100",
              )}
            >
              <Link href="/">Todas</Link>
            </Button>

            {/* Mapeando as categorias fortemente tipadas */}
            {categories.map((category: CategoryResponse) => {
              // Pegamos o 'name' e transformamos numa URL amigável (slug).
              // Adicionei o normalize para tirar acentos (ex: "Decoração" vira "decoracao")
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
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "shrink-0 rounded-full transition-all",
                    isActive ? "shadow-md" : "opacity-80 hover:opacity-100",
                  )}
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
