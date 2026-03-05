"use server";

import { productsService } from "../services/products.service";
import { revalidatePath } from "next/cache";
import {
  CreateProductInput,
  UpdateProductInput,
  AddImageInput,
  ProductResponse,
  ProductImageResponse,
  HttpError,
} from "../types/index";

type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para os Hooks / React Query)
// ==========================================

export async function getProductsListAction() {
  try {
    return await productsService.list();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar a vitrine de produtos.",
    );
  }
}

export async function getProductByIdAction(id: string) {
  try {
    return await productsService.getById(id);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar os detalhes do produto.",
    );
  }
}

// ==========================================
// 👑 ACTIONS DE PRODUTOS (Mutações / Staff Only)
// ==========================================

export async function createProductAction(
  data: CreateProductInput,
): Promise<ActionResponse<{ product: ProductResponse }>> {
  try {
    const response = await productsService.create(data);

    // Atualiza o painel do admin e a vitrine pública
    revalidatePath("/dashboard/products");
    revalidatePath("/");

    return {
      success: true,
      data: { product: response.product },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao criar produto.",
    };
  }
}

export async function updateProductAction(
  id: string,
  data: UpdateProductInput,
): Promise<ActionResponse<{ product: ProductResponse }>> {
  try {
    const response = await productsService.update(id, data);

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    // Se no futuro você tiver uma rota dinâmica para o produto, ela também é limpa:
    revalidatePath(`/product/${id}`);

    return {
      success: true,
      data: { product: response.product },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao atualizar produto.",
    };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  try {
    await productsService.remove(id);

    revalidatePath("/dashboard/products");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao excluir produto.",
    };
  }
}

// ==========================================
// 🖼️ ACTIONS DE IMAGENS (Mutações / Staff Only)
// ==========================================

export async function addProductImageAction(
  productId: string,
  data: AddImageInput,
): Promise<ActionResponse<{ image: ProductImageResponse }>> {
  try {
    // Note que a rota do Fastify esperava o productId na URL
    const response = await productsService.addImage(productId, data);

    revalidatePath("/dashboard/products");
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      data: { image: response.image },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao adicionar imagem.",
    };
  }
}

export async function removeProductImageAction(
  productId: string, // Passamos o productId aqui apenas para saber qual cache limpar
  imageId: string,
): Promise<ActionResponse> {
  try {
    await productsService.removeImage(imageId);

    revalidatePath("/dashboard/products");
    revalidatePath(`/product/${productId}`);

    return { success: true };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao remover imagem.",
    };
  }
}
