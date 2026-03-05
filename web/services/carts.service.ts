// web/services/carts.service.ts

import { httpClient } from "../lib/api/http-client";
import {
  AddToCartInput,
  UpdateCartItemInput,
  CartResponse,
} from "../types/index";

export const cartsService = {
  // ==========================================
  // 🛒 CARRINHO DO CLIENTE (Usuário Logado)
  // ==========================================

  /**
   * Busca o carrinho ativo do usuário logado [cite: 11, 12]
   */
  getMyCart: async () => {
    // Note que a tipagem permite 'null', pois o cliente pode não ter um carrinho ativo ainda [cite: 12]
    return httpClient<{ cart: CartResponse | null }>("/carts/me", {
      method: "GET",
    });
  },

  /**
   * Adiciona um produto ao carrinho [cite: 10]
   */
  addItem: async (data: AddToCartInput) => {
    return httpClient<{ message: string; cart: CartResponse }>("/carts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Atualiza a quantidade de um item específico [cite: 12, 13]
   */
  updateQuantity: async (itemId: string, data: UpdateCartItemInput) => {
    return httpClient<{ message: string; cart: CartResponse }>(
      `/carts/item/${itemId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Remove um item específico do carrinho [cite: 14, 15]
   */
  removeItem: async (itemId: string) => {
    return httpClient<{ message: string; cart: CartResponse }>(
      `/carts/item/${itemId}`,
      {
        method: "DELETE",
      },
    );
  },

  /**
   * Esvazia o carrinho inteiro do usuário [cite: 15, 16]
   */
  clearMyCart: async () => {
    return httpClient<{ message: string }>("/carts/me", {
      method: "DELETE",
    });
  },

  // ==========================================
  // 🛡️ ADMIN / SUPORTE (Staff Only)
  // ==========================================

  /**
   * Busca detalhes de um carrinho específico (Admin/Support) [cite: 17, 18]
   * Útil para o painel de atendimento quando um chat for do tipo ORDER.
   */
  getCartDetail: async (itemId: string) => {
    // Segue exatamente a rota e os parâmetros do backend [cite: 17, 18]
    return httpClient<{ cart: CartResponse }>(`/carts/${itemId}`, {
      method: "GET",
    });
  },
};
