<script lang="ts" setup>
import type { Message } from "~/types/message";

definePageMeta({
  requireAuth: true,
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const text = ref<string>("");
const auth = useAuthentication();
const messageStore = useMessageStore();
const messagesContainer = ref<HTMLElement>();

// Get conversation ID
const conversationId = computed(() => route.params.cid as string);
const conversation = computed(() => {
  return messageStore.listCoversations?.find(
    (conversation) => conversation._id === conversationId.value
  );
});

// Get messages for this conversation
const messages = computed(
  () => messageStore.conversationCache.get(conversationId.value) || []
);

const conversationName = computed(() => {
  const user = conversation.value?.members.find(
    (member) => member.user._id !== auth.value.userData?._id
  );
  return `${user?.user.lastName} ${user?.user.firstName}`;
});

const isContactOnline = computed(() => {
  const conversation = messageStore.listCoversations?.find(
    (conversation) => conversation._id === conversationId.value
  );
  const user = conversation?.members.find(
    (member) => member.user._id !== auth.value.userData?._id
  );
  return user && messageStore.onlineUsers.includes(user?.user._id);
});

// Send message function
function sendMessage() {
  if (!text.value?.trim()) return;

  messageStore.sendMessage(conversationId.value, text.value.trim());
  text.value = "";

  // Scroll to bottom after sending
  nextTick(() => {
    scrollToBottom();
  });
}

// Scroll to bottom of messages
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// Format message time
function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

// Check if message is from current user
function isMyMessage(message: Message) {
  return message.sender._id === auth.value.userData?._id;
}

// Get sender name
function getSenderName(message: Message) {
  return `${message.sender.lastName} ${message.sender.firstName}`;
}

function handleFocus() {
  messageStore.handleFocusEvent(conversationId.value);
}

// Auto-scroll to bottom when new messages arrive
watch(
  messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

// Scroll to bottom on mount
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>
<template lang="html">
  <div class="flex flex-col h-full bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Icon
            @click="router.back()"
            name="material-symbols:arrow-back-ios"
            class="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          />

          <!-- Contact Info -->
          <div class="flex items-center space-x-3">
            <div class="relative">
              <nuxt-img
                class="w-10 h-10 rounded-full object-cover"
                src="/avatar.jpg"
                :alt="conversationName"
              />
              <div
                v-if="isContactOnline"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
              ></div>
            </div>

            <div>
              <h2 class="font-semibold text-gray-900 text-lg">
                {{ conversationName }}
              </h2>
              <p class="text-xs text-gray-500">
                {{ isContactOnline ? "Active now" : "Last seen recently" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center space-x-4">
          <Icon
            name="material-symbols:call-outline"
            class="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          />
          <Icon
            name="material-symbols:videocam-outline"
            class="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          />
          <Icon
            name="material-symbols:info-outline"
            class="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
          />
        </div>
      </div>
    </header>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-grow overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
    >
      <!-- Empty State -->
      <div
        v-if="!messages.length"
        class="flex flex-col items-center justify-center h-full text-gray-500"
      >
        <Icon
          name="material-symbols:chat-bubble-outline"
          class="w-16 h-16 mb-4 text-gray-300"
        />
        <p class="text-lg font-medium">No messages yet</p>
        <p class="text-sm">Send a message to start the conversation</p>
      </div>

      <!-- Messages -->
      <div
        v-for="(message, index) in messages"
        :key="message._id || index"
        class="flex"
        :class="isMyMessage(message) ? 'justify-end' : 'justify-start'"
      >
        <div class="flex items-end space-x-2 max-w-xs lg:max-w-md">
          <!-- Sender Avatar (for received messages) -->
          <div v-if="!isMyMessage(message)" class="flex-shrink-0">
            <nuxt-img
              class="w-8 h-8 rounded-full object-cover"
              src="/avatar.jpg"
              :alt="getSenderName(message)"
            />
          </div>

          <!-- Message Bubble -->
          <div
            class="relative px-4 py-2 rounded-2xl max-w-full break-words"
            :class="[
              isMyMessage(message)
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md',
            ]"
          >
            <!-- Sender Name (for received messages in group chats) -->
            <div
              v-if="!isMyMessage(message)"
              class="text-xs text-gray-500 mb-1 font-medium"
            >
              {{ getSenderName(message) }}
            </div>

            <!-- Message Content -->
            <p class="text-sm leading-relaxed">{{ message.content }}</p>

            <!-- Message Time -->
            <div
              class="text-xs mt-1 opacity-70"
              :class="isMyMessage(message) ? 'text-blue-100' : 'text-gray-500'"
            >
              {{ formatMessageTime(message.createdAt) }}
            </div>
          </div>

          <!-- Message Status (for sent messages) -->
          <div v-if="isMyMessage(message)" class="flex-shrink-0 self-end mb-1">
            <Icon
              name="material-symbols:check-circle-outline"
              class="w-4 h-4 text-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <footer class="bg-white border-t border-gray-200 px-4 py-3">
      <div class="flex items-center space-x-3">
        <!-- Attachment Button -->
        <Icon
          name="material-symbols:add-circle-outline"
          class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-blue-500 transition-colors"
        />

        <!-- Message Input -->
        <div class="flex-grow relative">
          <input
            v-model="text"
            @keydown.enter="sendMessage"
            @focus="handleFocus"
            type="text"
            placeholder="Type a message..."
            class="w-full px-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />

          <!-- Emoji Button -->
          <Icon
            name="material-symbols:sentiment-satisfied-outline"
            class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
          />
        </div>

        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!text?.trim()"
          class="flex-shrink-0 p-2 rounded-full transition-all flex items-center"
          :class="[
            text?.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          ]"
        >
          <Icon name="material-symbols:send" class="w-5 h-5" />
        </button>
      </div>
    </footer>
  </div>
</template>
<style lang="scss"></style>
