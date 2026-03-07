"use client";

import { Search, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/hooks/use-categories";
import { type CategoryResponse } from "@/types/categories.types";

interface ProductFiltersProps {
  /** Valor atual da busca por texto */
  searchValue: string;
  /** Função que atualiza o texto no componente pai */
  onSearchChange: (value: string) => void;
  /** ID da categoria selecionada (ou "all" para todas) */
  categoryId: string;
  /** Função que atualiza a categoria no componente pai */
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({
  searchValue,
  onSearchChange,
  categoryId,
  onCategoryChange,
}: ProductFiltersProps) {
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories: CategoryResponse[] = categoriesResponse?.categories || [];

  return (
    <div className="flex w-full flex-row items-center gap-2 sm:gap-4">
      {/* 🔍 BARRA DE BUSCA */}
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar produtos por nome..."
          className="bg-background h-10 rounded-xl pl-9 text-sm sm:h-11"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 🏷️ FILTRO DE CATEGORIA */}
      <div className="shrink-0">
        <Select
          value={categoryId}
          onValueChange={onCategoryChange}
          disabled={isLoadingCategories}
        >
          {/* Voltei para sm:w-[220px] aqui para evitar que o layout quebre no desktop */}
          <SelectTrigger
            className="bg-background h-10 w-10 justify-center rounded-xl px-0 text-sm sm:h-11 sm:w-55 sm:justify-between sm:px-3 [&>svg:last-child]:hidden sm:[&>svg:last-child]:block"
            aria-label="Filtrar por categoria"
          >
            <Filter className="text-foreground h-4 w-4 sm:hidden" />

            <div className="hidden sm:block">
              <SelectValue placeholder="Todas as categorias" />
            </div>
          </SelectTrigger>

          {/* MUDANÇA AQUI: Trocado bg-popover por bg-background e adicionado z-50 */}
          <SelectContent
            position="popper"
            sideOffset={6}
            className="bg-background text-foreground z-50 rounded-xl border shadow-md"
          >
            {isLoadingCategories ? (
              <div className="text-muted-foreground flex items-center justify-center p-4 text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </div>
            ) : (
              <>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
