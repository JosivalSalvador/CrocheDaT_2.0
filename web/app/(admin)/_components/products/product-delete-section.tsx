"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProductMutations } from "@/hooks/use-products"; // 👈 O seu hook exato

interface ProductDeleteSectionProps {
  productId: string;
  productName: string;
  onSuccess: () => void; // Função para fechar o Sheet pai
}

export function ProductDeleteSection({
  productId,
  productName,
  onSuccess,
}: ProductDeleteSectionProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { remove } = useProductMutations(); // Pegamos apenas a mutação de remover

  const handleDelete = async () => {
    try {
      // Como o seu hook já faz o throw new Error e mostra o toast,
      // só precisamos aguardar a execução aqui.
      await remove.mutateAsync(productId);
      onSuccess(); // Se passou daqui, deu sucesso! Fecha o Sheet.
    } catch (error) {
      // O toast.error já foi disparado pelo hook, então não precisamos fazer nada na tela
      console.error("Ação cancelada ou falha ao deletar:", error);
    }
  };

  // ESTADO 1: Botão de perigo aguardando clique
  if (!isConfirming) {
    return (
      <div className="border-destructive/20 bg-destructive/5 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h4 className="text-destructive flex items-center justify-center gap-2 text-sm font-semibold sm:justify-start">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </h4>
          <p className="text-muted-foreground text-xs">
            Excluir este produto removerá todos os seus dados permanentemente.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="w-full shrink-0 sm:w-auto"
          onClick={() => setIsConfirming(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Produto
        </Button>
      </div>
    );
  }

  // ESTADO 2: Confirmação aberta (Responsiva: empilha no celular, lado a lado no PC)
  return (
    <div className="border-border mt-8 border-t pt-6">
      <div className="border-destructive bg-destructive/10 animate-in fade-in zoom-in-95 flex flex-col gap-3 rounded-xl border p-4 duration-200">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h4 className="text-destructive text-sm font-bold">
            Tem certeza absoluta?
          </h4>
          <p className="text-destructive/80 text-xs leading-relaxed">
            Esta ação não pode ser desfeita. O produto{" "}
            <strong>{productName}</strong> será apagado do catálogo.
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full sm:flex-1"
            onClick={() => setIsConfirming(false)}
            disabled={remove.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-9 w-full sm:flex-1"
            onClick={handleDelete}
            disabled={remove.isPending}
          >
            {remove.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sim, excluir agora"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
