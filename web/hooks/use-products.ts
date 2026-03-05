// web/hooks/use-products.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  addProductImageAction,
  removeProductImageAction,
  getProductByIdAction,
  getProductsListAction,
} from "../actions/products.actions";
import {
  CreateProductInput,
  UpdateProductInput,
  AddImageInput,
} from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Service)
// ==========================================

// Hook para a lista (Vitrine ou Tabela do Admin)
export function useProducts(filters?: {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProductsListAction(),
  });
}

// Hook para a página de detalhes de 1 produto específico
export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductByIdAction(id),
    enabled: !!id, // O React Query só faz a busca se o ID não for vazio
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useProductMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await createProductAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Produto criado com sucesso!");
      // Força as tabelas/vitrines a buscarem os dados novos do backend na hora
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductInput;
    }) => {
      const response = await updateProductAction(id, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Produto atualizado!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProductAction(id);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      toast.success("Produto excluído com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // --- Mutações de Imagens ---

  const addImage = useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: string;
      data: AddImageInput;
    }) => {
      const response = await addProductImageAction(productId, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("Imagem adicionada!");
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeImage = useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => {
      const response = await removeProductImageAction(productId, imageId);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("Imagem removida.");
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    create,
    update,
    remove,
    addImage,
    removeImage,
  };
}
