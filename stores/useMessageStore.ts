import type { Conversation } from "~/types/conversation";
import type { Message } from "~/types/message";

export const useMessageStore = defineStore("useMessageStore", () => {
  const listCoversations = ref<Conversation[]>([]);
  const conversationCache = reactive(new Map<string, Message[]>());
  const socket = computed(() => useNuxtApp().$socket.value);

  const setListCoversations = (conversations: Conversation[]) => {
    listCoversations.value = conversations;
  };

  const setCoversationCache = (conversationId: string, message: Message[]) => {
    conversationCache.set(conversationId, message);
  };

  const joinConversation = (conversationId: string) => {
    if (socket?.value) {
      socket.value.emit(
        "joinConversation",
        { conversationId },
        (response: any) => {
          console.log("response", response);
          setCoversationCache(conversationId, response.data);
        }
      );
    }
  };

  const sendMessage = (conversationId: string, content: string) => {
    const message = {
      conversation: conversationId,
      type: "TEXT",
      content,
    };
    if (socket?.value) {
      socket.value.emit("sendMessage", {
        message,
      });
    }
  };

  const receivedMessage = (message: { status: string; data: Message }) => {
    console.log("Received data", message);
    const listMessage = conversationCache.get(message.data.conversation);
    if (listMessage) {
      listMessage.push(message.data);
      setCoversationCache(message.data.conversation, listMessage);
    }
  };

  watch(conversationCache, (newCache) => {
    console.log("conversationCache", newCache);
  });

  return {
    listCoversations,
    conversationCache,
    setListCoversations,
    joinConversation,
    sendMessage,
    receivedMessage,
  };
});
