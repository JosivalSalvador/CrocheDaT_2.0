// web/hooks/use-categories.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getCategoriesListAction,
  getCategoryByIdAction,
} from "../actions/categories.actions";
import { CategoryInput } from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Service)
// ==========================================

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesListAction(),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryByIdAction(id),
    enabled: !!id,
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: CategoryInput) => {
      const response = await createCategoryAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryInput }) => {
      const response = await updateCategoryAction(id, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Categoria atualizada!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCategoryAction(id);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    create,
    update,
    remove,
  };
}
