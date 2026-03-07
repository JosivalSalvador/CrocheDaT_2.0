"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Trash2,
  Edit2,
  Plus,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

import { categorySchema } from "@/schemas/categories.schema";
import { type CategoryInput } from "@/types/categories.types";
import { useCategories, useCategoryMutations } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteConflict {
  categoryId: string;
  products: { id: string; name: string }[];
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesResponse?.categories || [];

  const { data: productsResponse } = useProducts();
  const allProducts = productsResponse?.products || [];

  const { create, update, remove } = useCategoryMutations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConflict, setDeleteConflict] = useState<DeleteConflict | null>(
    null,
  );

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const handleClose = () => {
    form.reset();
    setEditingId(null);
    setDeletingId(null);
    setDeleteConflict(null);
    onClose();
  };

  const onSubmitCreate = async (data: CategoryInput) => {
    try {
      await create.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      await update.mutateAsync({ id, data: { name: editValue } });
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setDeleteConflict(null);

    const linkedProducts = allProducts.filter((p) => p.categoryId === id);

    if (linkedProducts.length > 0) {
      setDeleteConflict({
        categoryId: id,
        products: linkedProducts.map((p) => ({ id: p.id, name: p.name })),
      });
      return;
    }

    try {
      await remove.mutateAsync(id);
      setDeletingId(null);
    } catch (error) {
      console.error("Erro inesperado ao deletar:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* 📱 Responsividade do Modal: Usa 95% da tela no mobile (w-[95vw]) e trava no max-w-md no Desktop */}
      <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription className="text-sm">
            Adicione, renomeie ou remova as categorias do seu catálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 mb-2 shrink-0 border-b pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCreate)}
              className="flex items-start gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="min-w-0 flex-1">
                    {" "}
                    {/* min-w-0 impede que o input estoure o container */}
                    <FormControl>
                      <Input
                        placeholder="Nova categoria..."
                        className="h-10 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-10 shrink-0 px-3 sm:px-4"
                disabled={create.isPending}
              >
                {create.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Adicionar</span>
              </Button>
            </form>
          </Form>
        </div>

        {/* 📜 Responsividade da Lista: Rola internamente sem crescer o modal inteiro */}
        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1 sm:pr-2">
          {isLoadingCategories ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            categories.map((category) => {
              const isEditingThis = editingId === category.id;
              const isDeletingThis = deletingId === category.id;
              const conflictForThis =
                deleteConflict?.categoryId === category.id
                  ? deleteConflict
                  : null;

              return (
                <div
                  key={category.id}
                  className={`flex flex-col rounded-md border p-2 shadow-sm transition-all ${
                    conflictForThis
                      ? "border-destructive/50 bg-destructive/5"
                      : "bg-card text-card-foreground"
                  }`}
                >
                  {/* ESTADO 1: EDITANDO */}
                  {isEditingThis ? (
                    <div className="flex w-full items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 min-w-0 flex-1 text-sm"
                        autoFocus
                      />
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                          onClick={() => handleSaveEdit(category.id)}
                          disabled={update.isPending}
                        >
                          {update.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setEditingId(null)}
                          disabled={update.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : // ESTADO 2: CONFIRMANDO EXCLUSÃO OU MOSTRANDO CONFLITO
                  isDeletingThis ? (
                    <div className="flex flex-col gap-3 p-1">
                      {conflictForThis ? (
                        <>
                          <div className="text-destructive flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="text-sm leading-tight font-medium">
                              Não é possível excluir. Existem produtos
                              vinculados:
                            </span>
                          </div>

                          <div className="bg-background/50 border-destructive/20 rounded border p-2">
                            {/* max-h-24 garante que uma lista gigante de produtos não tome a tela toda */}
                            <ul className="text-muted-foreground custom-scrollbar max-h-24 list-inside list-disc space-y-0.5 overflow-y-auto text-xs">
                              {conflictForThis.products.map((p) => (
                                <li
                                  key={p.id}
                                  className="truncate"
                                  title={p.name}
                                >
                                  {p.name}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-1 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs sm:text-sm"
                              onClick={() => {
                                setDeletingId(null);
                                setDeleteConflict(null);
                              }}
                            >
                              Entendi
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                          <span className="text-destructive pl-1 text-center text-sm font-medium sm:text-left">
                            Excluir categoria?
                          </span>
                          <div className="flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto sm:justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-muted h-8 flex-1 text-xs sm:flex-none sm:text-sm"
                              onClick={() => setDeletingId(null)}
                              disabled={remove.isPending}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 flex-1 text-xs sm:flex-none sm:text-sm"
                              onClick={() => handleConfirmDelete(category.id)}
                              disabled={remove.isPending}
                            >
                              {remove.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Confirmar"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // ESTADO 3: VISUALIZAÇÃO NORMAL
                    <div className="flex w-full items-center justify-between">
                      {/* truncate impede que um nome enorme empurre os botões pra fora da tela */}
                      <span className="flex-1 truncate pr-2 pl-2 text-sm font-medium">
                        {category.name}
                      </span>
                      <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-50 sm:hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingId(category.id);
                            setEditValue(category.name);
                            setDeletingId(null);
                            setDeleteConflict(null);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => {
                            setDeletingId(category.id);
                            setEditingId(null);
                            setDeleteConflict(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
