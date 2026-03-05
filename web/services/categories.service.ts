// web/services/categories.service.ts

import { httpClient } from "../lib/api/http-client";
import { CategoryInput, CategoryResponse } from "../types/index";

export const categoriesService = {
  // ==========================================
  // 🌍 VITRINE (Público)
  // ==========================================

  /**
   * Lista todas as categorias cadastradas
   */
  list: async () => {
    return httpClient<{ categories: CategoryResponse[] }>("/categories", {
      method: "GET",
    });
  },

  /**
   * Busca detalhes de uma categoria específica pelo ID
   */
  getById: async (id: string) => {
    return httpClient<{ category: CategoryResponse }>(`/categories/${id}`, {
      method: "GET",
    });
  },

  // ==========================================
  // 👑 ADMINISTRAÇÃO (Staff Only)
  // ==========================================

  /**
   * Cria uma nova categoria (Apenas ADMIN)
   */
  create: async (data: CategoryInput) => {
    return httpClient<{ message: string; category: CategoryResponse }>(
      "/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Atualiza o nome de uma categoria (Apenas ADMIN)
   */
  update: async (id: string, data: CategoryInput) => {
    return httpClient<{ message: string; category: CategoryResponse }>(
      `/categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Deleta uma categoria do sistema (Apenas ADMIN)
   */
  remove: async (id: string) => {
    // Retorna 204 No Content
    return httpClient<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
