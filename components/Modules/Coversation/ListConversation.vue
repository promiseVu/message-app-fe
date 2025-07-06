<script lang="ts" setup>
import type { Conversation } from "~/types/conversation";

const messageStore = useMessageStore();
const auth = useAuthentication();

function getLastMessageTime(conversationId: string) {
  // Using conversationId to generate different times
  const times = ["2m", "5m", "1h", "3h", "1d"];
  return times[conversationId.length % times.length];
}

const isUserOnline = computed(() => {
  return (conversation: Conversation) => {
    const user = getReceiver(conversation);
    return user && messageStore.onlineUsers.includes(user?.user._id);
  };
});

function getConversationName(conversation: Conversation) {
  const user = getReceiver(conversation);
  return `${user?.user.lastName} ${user?.user.firstName}`;
}

const getLastMessage = computed(() => {
  return (conversation: Conversation) => {
    const sender =
      conversation.lastMessage?.sender._id === auth.value.userData?._id
        ? "You"
        : `${conversation.lastMessage?.sender?.firstName} ${conversation.lastMessage?.sender?.lastName}`;
    return `${sender}: ${conversation.lastMessage?.content}`;
  };
});

function getReceiver(conversation: Conversation) {
  return conversation.members.find(
    (member) => member.user._id !== auth.value.userData?._id
  );
}

function getUrlAvatar(conversation: Conversation) {
  return conversation.members[0].user.avatar || "/default-avatar.svg";
}

function handleClickConversation(id: string) {
  messageStore.updateUnreadCount(id);
  if (messageStore.currentConversation === id) return;
  messageStore.currentConversation = id;
  messageStore.joinConversation(id);
}
</script>
<template lang="">
  <div class="flex flex-col">
    <div
      class="w-full h-24 flex flex-col justify-between border-b border-[rgba(0,0,0,0.15)]"
    >
      <div class="w-[70%]">
        <el-input class="m-3" placeholder="Tìm kiếm" />
      </div>
      <div class="flex text-white text-sm gap-2 mx-3 font-medium">
        <span class="text-[#005ae0] border-b-2 border-[#005ae0]">Tất cả</span>
        <span class="text-[#5a6981]">Chưa đọc</span>
      </div>
    </div>
    <div class="w-full">
      <div
        v-for="conversation in messageStore.listCoversations"
        @click="handleClickConversation(conversation._id)"
        class="flex justify-between p-3 hover:bg-slate-100 cursor-pointer"
      >
        <div class="flex">
          <div class="relative mr-3">
            <nuxt-img
              class="w-12 h-12 rounded-full object-cover"
              :src="getUrlAvatar(conversation)"
              :alt="`Conversation ${conversation._id}`"
            />
            <div
              v-if="isUserOnline(conversation)"
              class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
            ></div>
          </div>
          <div class="ml-3 text-base flex flex-col justify-between">
            <div>{{ getConversationName(conversation) }}</div>
            <div>{{ getLastMessage(conversation) }}</div>
          </div>
        </div>

        <div class="text-sm flex flex-col justify-between">
          <div>{{ getLastMessageTime(conversation._id) }}</div>
          <div>
            <span
              v-show="conversation.unreadCount"
              class="bg-[#5a6981] text-white py-[2px] px-1 rounded-lg text-[11px]"
            >
              {{ conversation.unreadCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=""></style>
