// web/hooks/use-cart.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCartItemAction,
  updateCartItemQuantityAction,
  removeCartItemAction,
  clearCartAction,
  getMyCartAction,
  getCartDetailAction,
} from "../actions/carts.actions";
import { AddToCartInput, UpdateCartItemInput } from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Service)
// ==========================================

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getMyCartAction(),
  });
}

// NOVO HOOK ADICIONADO AQUI 👇
export function useCartDetail(itemId: string) {
  return useQuery({
    queryKey: ["cartDetail", itemId],
    queryFn: () => getCartDetailAction(itemId),
    enabled: !!itemId, // Garante que a query só rode se o itemId existir
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useCartMutations() {
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: async (data: AddToCartInput) => {
      const response = await addCartItemAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Item adicionado ao carrinho!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateQuantity = useMutation({
    mutationFn: async ({
      itemId,
      data,
    }: {
      itemId: string;
      data: UpdateCartItemInput;
    }) => {
      const response = await updateCartItemQuantityAction(itemId, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      // Deixamos sem toast no sucesso da quantidade para não poluir a tela
      // se o cliente clicar várias vezes rápidas no botão "+" ou "-"
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await removeCartItemAction(itemId);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Item removido do carrinho.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      const response = await clearCartAction();
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Carrinho esvaziado.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
