// web/services/chats.service.ts

import { httpClient } from "../lib/api/http-client";
import {
  CreateChatInput,
  SendMessageInput,
  ChatResponse,
  MessageResponse,
} from "../types/index";

export const chatsService = {
  // ==========================================
  // 💬 CHAT DO CLIENTE (Usuário Logado)
  // ==========================================

  /**
   * Cria um novo chat (Suporte ou Encomenda)
   */
  create: async (data: CreateChatInput) => {
    return httpClient<{ message: string; chat: ChatResponse }>("/chats", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Lista os chats ativos e passados do usuário atual
   */
  listMyChats: async () => {
    return httpClient<{ chats: ChatResponse[] }>("/chats/me", {
      method: "GET",
    });
  },

  /**
   * Busca os detalhes de um chat específico (incluindo as mensagens dele)
   */
  getDetails: async (chatId: string) => {
    return httpClient<{ chat: ChatResponse }>(`/chats/${chatId}`, {
      method: "GET",
    });
  },

  /**
   * Envia uma nova mensagem dentro de um chat
   */
  sendMessage: async (chatId: string, data: SendMessageInput) => {
    // O backend retorna a mensagem criada dentro da propriedade 'message'
    return httpClient<{ message: MessageResponse }>(
      `/chats/${chatId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  // ==========================================
  // 🛡️ STAFF ONLY (ADMIN / SUPPORTER)
  // ==========================================

  /**
   * Lista TODOS os chats do sistema (Fila de atendimento do painel)
   */
  listAll: async () => {
    return httpClient<{ chats: ChatResponse[] }>("/chats", {
      method: "GET",
    });
  },

  /**
   * Abre ou fecha um chat (Toggle Status)
   */
  toggleStatus: async (chatId: string, isOpen: boolean) => {
    // O Zod espera { isOpen: boolean } no body
    return httpClient<{ message: string; chat: ChatResponse }>(
      `/chats/${chatId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isOpen }),
      },
    );
  },
};
