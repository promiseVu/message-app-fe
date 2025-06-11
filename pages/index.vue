<script lang="ts" setup>
import type { Conversation } from '~/types/conversation';

definePageMeta({
  requireAuth: true,
});

const messageStore = useMessageStore();
const router = useRouter();
const auth = useAuthentication();

const { data, pending } = useFetch(
  `/api/conversation/${auth.value.userData?._id}`
);
const searchQuery = ref("");

function navigateConversation(id: string) {
  messageStore.joinConversation(id);
  router.push({ name: "cid", params: { cid: id } });
}

// Mock function to get timestamp (you can replace with actual data)
function getLastMessageTime(conversationId: string) {
  // Using conversationId to generate different times
  const times = ["2m", "5m", "1h", "3h", "1d"];
  return times[conversationId.length % times.length];
}

// Mock function to check if conversation has unread messages
function hasUnreadMessages(conversationId: string) {
  // Using conversationId for consistent results
  return conversationId.length % 3 === 0;
}

// Mock function to get unread count
function getUnreadCount(conversationId: string) {
  // Using conversationId for consistent results
  return (conversationId.length % 5) + 1;
}

// Mock function to check if user is online
function isUserOnline(conversationId: string) {
  // Using conversationId for consistent results
  return conversationId.length % 2 === 0;
}

function getConversationName(conversation: Conversation) {
    const user =  conversation.members.find((member) => member.user._id !== auth.value.userData?._id)
    return `${user?.user.lastName} ${user?.user.firstName}`;
}

watch(
  data,
  (newData) => {
    messageStore.setListCoversations(newData);
  },
  { immediate: true }
);
</script>
<template lang="html">
  <div v-loading="pending" class="flex flex-col h-full bg-white">
    <!-- Conversations List -->
    <div class="flex-grow overflow-y-auto">
      <div
        v-if="!messageStore.listCoversations?.length && !pending"
        class="flex flex-col items-center justify-center h-64 text-gray-500"
      >
        <Icon
          name="material-symbols:chat-bubble-outline"
          class="w-16 h-16 mb-4 text-gray-300"
        />
        <p class="text-lg">No conversations found</p>
        <p class="text-sm">Start a new conversation to get started</p>
      </div>

      <div
        v-for="conversation in messageStore.listCoversations"
        :key="conversation._id"
        @click="navigateConversation(conversation._id)"
        class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
      >
      {{ console.log(conversation) }}
        <!-- Avatar with Online Status -->
        <div class="relative mr-3">
          <nuxt-img
            class="w-14 h-14 rounded-full object-cover"
            src="/avatar.jpg"
            :alt="`Conversation ${conversation._id}`"
          />
          <div
            v-if="isUserOnline(conversation._id)"
            class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></div>
        </div>

        <!-- Conversation Info -->
        <div class="flex-grow min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-semibold text-gray-900 truncate">
              {{ getConversationName(conversation) }}
            </h3>
            <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
              {{ getLastMessageTime(conversation._id) }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 truncate">
              {{ conversation.lastMessage?.content }}
            </p>

            <!-- Unread Badge -->
            <div
              v-if="hasUnreadMessages(conversation._id)"
              class="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2"
            >
              {{ getUnreadCount(conversation._id) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
