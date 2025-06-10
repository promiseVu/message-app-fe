<script lang="ts" setup>
import { useLogout } from "#imports";

const auth = useAuthentication();
const router = useRouter();
definePageMeta({
  requireAuth: true,
});

function handleLogout() {
  useLogout();
}
const messageStore = useMessageStore();

const { data, pending } = useFetch("/api/coversation");
const searchQuery = ref("");

function navigateConversation(id: string) {
  messageStore.joinConversation(id);
  router.push({ name: "cid", params: { cid: id } });
}

// Filter conversations based on search query
const filteredConversations = computed(() => {
  if (!data.value) return [];
  if (!searchQuery.value.trim()) return data.value;

  return data.value.filter((conversation: any) =>
    conversation._id.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Mock function to get last message (you can replace with actual data)
function getLastMessage(conversationId: string) {
  // Using conversationId to generate different messages
  const messages = [
    "Hey, how are you doing?",
    "See you later!",
    "Thanks for the help",
    "Let's meet tomorrow",
    "Good morning!",
  ];
  return messages[conversationId.length % messages.length];
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
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-2xl font-bold text-gray-900">Chats</h1>
        <div class="flex items-center space-x-3">
          <Icon
            name="material-symbols:edit-outline"
            class="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          />
          <nuxt-img
            @click="handleLogout"
            class="rounded-full w-8 h-8 cursor-pointer ring-2 ring-blue-500"
            src="/avatar.jpg"
            alt="Profile"
          />
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <Icon
          name="material-symbols:search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search conversations..."
          class="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </header>

    <!-- Conversations List -->
    <div class="flex-grow overflow-y-auto">
      <div
        v-if="!filteredConversations.length && !pending"
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
        v-for="conversation in filteredConversations"
        :key="conversation._id"
        @click="navigateConversation(conversation._id)"
        class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
      >
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
              Conversation {{ conversation._id.slice(-6) }}
            </h3>
            <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
              {{ getLastMessageTime(conversation._id) }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 truncate">
              {{ getLastMessage(conversation._id) }}
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

    <!-- Bottom Navigation -->
    <footer class="bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-around items-center">
        <!-- Chats Tab (Active) -->
        <div class="flex flex-col items-center py-2 px-4">
          <Icon
            name="material-symbols:chat-bubble"
            class="w-6 h-6 text-blue-500 mb-1"
          />
          <span class="text-xs text-blue-500 font-medium">Chats</span>
        </div>

        <!-- People Tab -->
        <div class="flex flex-col items-center py-2 px-4">
          <Icon
            name="ic:twotone-people-outline"
            class="w-6 h-6 text-gray-400 mb-1"
          />
          <span class="text-xs text-gray-400">People</span>
        </div>

        <!-- Stories Tab -->
        <div class="flex flex-col items-center py-2 px-4">
          <Icon
            name="material-symbols:auto-stories-outline"
            class="w-6 h-6 text-gray-400 mb-1"
          />
          <span class="text-xs text-gray-400">Stories</span>
        </div>

        <!-- Calls Tab -->
        <div class="flex flex-col items-center py-2 px-4">
          <Icon
            name="material-symbols:call-outline"
            class="w-6 h-6 text-gray-400 mb-1"
          />
          <span class="text-xs text-gray-400">Calls</span>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss"></style>
