"use server";

import { categoriesService } from "../services/categories.service";
import { revalidatePath } from "next/cache";
import { CategoryInput, CategoryResponse, HttpError } from "../types/index";

type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para os Hooks / React Query)
// ==========================================

export async function getCategoriesListAction() {
  try {
    return await categoriesService.list();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar a lista de categorias.",
    );
  }
}

export async function getCategoryByIdAction(id: string) {
  try {
    return await categoriesService.getById(id);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar os detalhes da categoria.",
    );
  }
}

// ==========================================
// 👑 ACTIONS DE CATEGORIAS (Mutações / Staff Only)
// ==========================================

export async function createCategoryAction(
  data: CategoryInput,
): Promise<ActionResponse<{ category: CategoryResponse }>> {
  try {
    const response = await categoriesService.create(data);

    // Atualiza a tabela do admin e o menu de navegação da vitrine
    revalidatePath("/dashboard/categories");
    revalidatePath("/");

    return {
      success: true,
      data: { category: response.category },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao criar categoria.",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  data: CategoryInput,
): Promise<ActionResponse<{ category: CategoryResponse }>> {
  try {
    const response = await categoriesService.update(id, data);

    revalidatePath("/dashboard/categories");
    revalidatePath("/");

    return {
      success: true,
      data: { category: response.category },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao atualizar categoria.",
    };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<ActionResponse> {
  try {
    await categoriesService.remove(id);

    revalidatePath("/dashboard/categories");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao excluir categoria.",
    };
  }
}
