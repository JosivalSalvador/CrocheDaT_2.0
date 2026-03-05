"use server";

import { chatsService } from "../services/chats.service";
import { revalidatePath } from "next/cache";
import {
  CreateChatInput,
  SendMessageInput,
  ChatResponse,
  MessageResponse,
  HttpError,
} from "../types/index";

type ActionResponse<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ==========================================
// 🔍 ACTIONS DE BUSCA (GET - Para os Hooks / React Query)
// ==========================================

export async function getMyChatsAction() {
  try {
    return await chatsService.listMyChats();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(httpError.message || "Falha ao carregar os seus chats.");
  }
}

export async function getChatDetailsAction(chatId: string) {
  try {
    return await chatsService.getDetails(chatId);
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar as mensagens do chat.",
    );
  }
}

export async function getAllChatsAction() {
  try {
    return await chatsService.listAll();
  } catch (error: unknown) {
    const httpError = error as HttpError;
    throw new Error(
      httpError.message || "Falha ao carregar a fila de atendimento.",
    );
  }
}

// ==========================================
// 💬 ACTIONS DO CLIENTE (Mutações / Usuário Logado)
// ==========================================

export async function createChatAction(
  data: CreateChatInput,
): Promise<ActionResponse<{ chat: ChatResponse }>> {
  try {
    const response = await chatsService.create(data);

    // Atualiza a lista de chats do cliente e avisa o painel do Admin sobre o novo ticket
    revalidatePath("/home");
    revalidatePath("/dashboard/chats");

    return {
      success: true,
      data: { chat: response.chat },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao criar chat.",
    };
  }
}

export async function sendMessageAction(
  chatId: string,
  data: SendMessageInput,
): Promise<ActionResponse<{ message: MessageResponse }>> {
  try {
    // Note que aqui o backend devolve a mensagem criada dentro da propriedade 'message'
    const response = await chatsService.sendMessage(chatId, data);

    // Revalida as rotas onde as mensagens podem estar sendo exibidas
    revalidatePath("/home");
    revalidatePath("/dashboard/chats");

    return {
      success: true,
      data: { message: response.message },
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao enviar mensagem.",
    };
  }
}

// ==========================================
// 🛡️ STAFF ONLY (Mutações / ADMIN / SUPPORTER)
// ==========================================

export async function toggleChatStatusAction(
  chatId: string,
  isOpen: boolean,
): Promise<ActionResponse<{ chat: ChatResponse }>> {
  try {
    const response = await chatsService.toggleStatus(chatId, isOpen);

    // Atualiza o painel de atendimento e o status na tela do cliente
    revalidatePath("/dashboard/chats");
    revalidatePath("/home");

    return {
      success: true,
      data: { chat: response.chat },
      message: response.message,
    };
  } catch (error: unknown) {
    const httpError = error as HttpError;
    return {
      success: false,
      error: httpError.message || "Erro ao alterar status do chat.",
    };
  }
}
