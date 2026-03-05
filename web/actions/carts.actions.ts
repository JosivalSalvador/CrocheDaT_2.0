"use server";

import { cartsService } from "../services/carts.service";
import { revalidatePath } from "next/cache";
import {
  AddToCartInput,
  UpdateCartItemInput,
  CartResponse,
  HttpError,
} from "../types/index";

type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para os Hooks / React Query)
// ==========================================

export async function getMyCartAction() {
  try {
    return await cartsService.getMyCart();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao carregar o seu carrinho.");
  }
}

export async function getCartDetailAction(itemId: string) {
  try {
    return await cartsService.getCartDetail(itemId);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar os detalhes deste carrinho.",
    );
  }
}

// ==========================================
// 🛒 ACTIONS DO CARRINHO (Mutações / Usuário Logado)
// ==========================================

export async function addCartItemAction(
  data: AddToCartInput,
): Promise<ActionResponse<{ cart: CartResponse }>> {
  try {
    const response = await cartsService.addItem(data);

    // Revalida o layout principal para atualizar o contador do carrinho no Header
    revalidatePath("/", "layout");

    return {
      success: true,
      data: { cart: response.cart },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao adicionar item ao carrinho.",
    };
  }
}

export async function updateCartItemQuantityAction(
  itemId: string,
  data: UpdateCartItemInput,
): Promise<ActionResponse<{ cart: CartResponse }>> {
  try {
    const response = await cartsService.updateQuantity(itemId, data);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: { cart: response.cart },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao atualizar quantidade.",
    };
  }
}

export async function removeCartItemAction(
  itemId: string,
): Promise<ActionResponse<{ cart: CartResponse }>> {
  try {
    const response = await cartsService.removeItem(itemId);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: { cart: response.cart },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao remover item do carrinho.",
    };
  }
}

export async function clearCartAction(): Promise<ActionResponse> {
  try {
    const response = await cartsService.clearMyCart();

    revalidatePath("/", "layout");

    return { success: true, message: response.message };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao esvaziar o carrinho.",
    };
  }
}
