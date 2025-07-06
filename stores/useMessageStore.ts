import type { Conversation } from "~/types/conversation";
import type { Message } from "~/types/message";

export const useMessageStore = defineStore("useMessageStore", () => {
  const auth = useAuthentication();
  const listCoversations = ref<Conversation[]>([]);
  const conversationCache = reactive(new Map<string, Message[]>());
  const onlineUsers = ref<string[]>([]);
  const currentConversation = ref<string | null>(null);
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
          setCoversationCache(conversationId, response.data);
        }
      );
      // updateUnreadCount(conversationId);
    }
  };

  const updateUnreadCount = (conversationId: string) => {
    const index = listCoversations.value?.findIndex(
      (conversation) => conversation._id === conversationId
    );
    if (index !== -1) {
      listCoversations.value[index].unreadCount = 0;
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
    const listMessage = conversationCache.get(message.data.conversation);
    if (listMessage) {
      listMessage.push(message.data);
      setCoversationCache(message.data.conversation, listMessage);
    }

    // Find index conversation
    const conversationIndex = listCoversations.value.findIndex(
      (conversation) => conversation._id === message.data.conversation
    );

    if (conversationIndex !== -1) {
      // Update last message in conversation
      listCoversations.value[conversationIndex].lastMessage = message.data;
      // Push conversation in top
      if (conversationIndex > 0) {
        const conversationWithNewMessage = listCoversations.value.splice(
          conversationIndex,
          1
        )[0];
        listCoversations.value.unshift(conversationWithNewMessage);
      }
      // Update unread count for received
      if (message.data.sender._id !== auth.value.userData._id) {
        listCoversations.value[conversationIndex].unreadCount++;
      }
    }
  };

  const setUserOnline = (userIdArray: string[]) => {
    onlineUsers.value = userIdArray;
  };

  const handleFocusEvent = (conversationId: string) => {
    updateUnreadCount(conversationId);
    if (socket?.value) {
      socket.value.emit("focusInput", {
        conversationId,
      });
    }
  };

  return {
    listCoversations,
    conversationCache,
    onlineUsers,
    setListCoversations,
    joinConversation,
    sendMessage,
    receivedMessage,
    setUserOnline,
    handleFocusEvent,
    currentConversation,
    updateUnreadCount,
  };
});
