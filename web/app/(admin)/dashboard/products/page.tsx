"use client";

import { useState } from "react";
import { Plus, FolderCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "../../_components/products/product-grid";
import { ProductSheet } from "../../_components/products/product-sheet";
import { CategoryModal } from "../../_components/products/category-modal";

import { type ProductResponse } from "@/types/products.types";

export default function ProductsPage() {
  // ==========================================
  // ESTADOS DO PRODUTO
  // ==========================================
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(
    null,
  );

  // ==========================================
  // ESTADO DA CATEGORIA
  // ==========================================
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // ==========================================
  // AÇÕES DO PRODUTO
  // ==========================================
  const handleOpenNewProduct = () => {
    setProductToEdit(null); // Reseta para null = Modo Criação
    setIsProductSheetOpen(true);
  };

  const handleOpenEditProduct = (product: ProductResponse) => {
    setProductToEdit(product); // Preenche com o produto = Modo Edição
    setIsProductSheetOpen(true);
  };

  return (
    // container principal responsivo: p-4 no mobile, p-6 no tablet, p-8 no desktop
    <div className="z-0 flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-4 sm:p-6 md:gap-8 md:p-8">
      {/* 🏷️ CABEÇALHO */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Produtos
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie seu catálogo e categorias de produtos.
          </p>
        </div>

        {/* AJUSTE DEFINITIVO: 'grid grid-cols-2' no mobile força os botões a ficarem lado a lado (50/50).
          No desktop (md:), ele usa o flex-row para voltar ao tamanho natural sem esticar.
        */}
        <div className="grid w-full grid-cols-2 items-center gap-2 sm:gap-3 md:flex md:w-auto md:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsCategoryManagerOpen(true)}
            className="w-full px-1.5 text-[11px] sm:px-4 sm:text-sm md:w-auto"
          >
            <FolderCog className="mr-1 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="truncate">Gerenciar Categorias</span>
          </Button>
          <Button
            onClick={handleOpenNewProduct}
            className="w-full px-1.5 text-[11px] sm:px-4 sm:text-sm md:w-auto"
          >
            <Plus className="mr-1 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="truncate">Novo Produto</span>
          </Button>
        </div>
      </div>

      {/* 📦 CONTEÚDO PRINCIPAL (Grid + Filtros) */}
      <div className="relative z-10 flex-1">
        <ProductGrid onEditProduct={handleOpenEditProduct} />
      </div>

      {/* 🛠️ MODAIS E GAVETAS */}
      <ProductSheet
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        product={productToEdit}
      />

      <CategoryModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />
    </div>
  );
}
