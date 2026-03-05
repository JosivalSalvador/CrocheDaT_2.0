// web/hooks/use-chats.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChatAction,
  sendMessageAction,
  toggleChatStatusAction,
  getAllChatsAction,
  getChatDetailsAction,
  getMyChatsAction,
} from "../actions/chats.actions";
import { CreateChatInput, SendMessageInput } from "../types/index";
import { toast } from "sonner";

// ==========================================
// 🔍 QUERIES (Buscas Diretas via Service)
// ==========================================

// Lista os chats do cliente logado (Role: USER)
export function useMyChats() {
  return useQuery({
    queryKey: ["myChats"],
    queryFn: () => getMyChatsAction(),
  });
}

// Lista todos os chats (Role: ADMIN / SUPPORTER)
export function useAllChats() {
  return useQuery({
    queryKey: ["allChats"],
    queryFn: () => getAllChatsAction(),
  });
}

// Traz os detalhes de um chat específico (mensagens e status)
export function useChatDetails(id: string) {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatDetailsAction(id),
    enabled: !!id, // O React Query só faz a busca se o ID não for vazio
  });
}

// ==========================================
// ✍️ MUTAÇÕES (Modificações via Actions)
// ==========================================

export function useChatMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: CreateChatInput) => {
      const response = await createChatAction(data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Atendimento iniciado!");
      // Limpa os dois caches para garantir que a lista atualize para clientes e admins
      queryClient.invalidateQueries({ queryKey: ["myChats"] });
      queryClient.invalidateQueries({ queryKey: ["allChats"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const sendMessage = useMutation({
    mutationFn: async ({
      chatId,
      data,
    }: {
      chatId: string;
      data: SendMessageInput;
    }) => {
      const response = await sendMessageAction(chatId, data);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (_, variables) => {
      // Deixamos sem toast propositalmente para não poluir a tela a cada "Oi!" enviado
      // Apenas recarregamos o cache das mensagens daquele chat específico
      queryClient.invalidateQueries({ queryKey: ["chat", variables.chatId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({
      chatId,
      isOpen,
    }: {
      chatId: string;
      isOpen: boolean;
    }) => {
      const response = await toggleChatStatusAction(chatId, isOpen);
      if (!response.success) throw new Error(response.error);
      return response;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Status do atendimento atualizado.");
      // Invalida o chat aberto e as listas para refletir o novo status
      queryClient.invalidateQueries({ queryKey: ["chat", variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ["myChats"] });
      queryClient.invalidateQueries({ queryKey: ["allChats"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    create,
    sendMessage,
    toggleStatus,
  };
}
