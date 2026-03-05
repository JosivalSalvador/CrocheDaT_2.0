// web/services/products.service.ts

import { httpClient } from "../lib/api/http-client";
import {
  CreateProductInput,
  UpdateProductInput,
  AddImageInput,
  ProductResponse,
  ProductImageResponse,
} from "../types/index";

export const productsService = {
  // ==========================================
  // 🌍 VITRINE (Público)
  // ==========================================

  /**
   * Lista todos os produtos (vitrine pública)
   */
  list: async () => {
    // Retorno mapeado exatamente com o schema do backend
    return httpClient<{ products: ProductResponse[] }>("/products", {
      method: "GET",
    });
  },

  /**
   * Busca detalhes de um produto específico pelo ID
   */
  getById: async (id: string) => {
    return httpClient<{ product: ProductResponse }>(`/products/${id}`, {
      method: "GET",
    });
  },

  // ==========================================
  // 👑 ADMINISTRAÇÃO (Staff Only)
  // ==========================================

  /**
   * Cria um novo produto (apenas ADMIN)
   */
  create: async (data: CreateProductInput) => {
    return httpClient<{ message: string; product: ProductResponse }>(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Atualiza informações e/ou categoria do produto (apenas ADMIN)
   */
  update: async (id: string, data: UpdateProductInput) => {
    return httpClient<{ message: string; product: ProductResponse }>(
      `/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Deleta um produto e apaga todas as imagens em cascata (apenas ADMIN)
   */
  remove: async (id: string) => {
    // Retorna 204 No Content
    return httpClient<void>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // 🖼️ GERENCIAMENTO DE IMAGENS (Admin)
  // ==========================================

  /**
   * Adiciona uma nova imagem a um produto existente
   */
  addImage: async (productId: string, data: AddImageInput) => {
    return httpClient<{ message: string; image: ProductImageResponse }>(
      `/products/${productId}/images`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Remove uma imagem específica pelo ID da imagem
   */
  removeImage: async (imageId: string) => {
    // Retorna 204 No Content
    return httpClient<void>(`/products/images/${imageId}`, {
      method: "DELETE",
    });
  },
};
