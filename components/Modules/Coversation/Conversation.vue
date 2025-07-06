<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import type { Message } from "~/types/message";
import MessageInput from "./MessageInput.vue";

const messagesContainer = ref<HTMLElement>();

const messageStore = useMessageStore();
const { currentConversation } = storeToRefs(messageStore);
const auth = useAuthentication();

const conversation = computed(() => {
  return messageStore.listCoversations?.find(
    (conversation) => conversation._id === currentConversation.value
  );
});

const messages = computed(() => {
  if (!currentConversation.value) return;
  return messageStore.conversationCache.get(currentConversation.value) || [];
});

const conversationName = computed(() => {
  const user = conversation.value?.members.find(
    (member) => member.user._id !== auth.value.userData?._id
  );
  return `${user?.user.lastName} ${user?.user.firstName}`;
});

const isContactOnline = computed(() => {
  const conversation = messageStore.listCoversations?.find(
    (conversation) => conversation._id === currentConversation.value
  );
  const user = conversation?.members.find(
    (member) => member.user._id !== auth.value.userData?._id
  );
  return user && messageStore.onlineUsers.includes(user?.user._id);
});

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

function isMyMessage(message: Message) {
  return message.sender._id === auth.value.userData?._id;
}

function getSenderName(message: Message) {
  return `${message.sender.lastName} ${message.sender.firstName}`;
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

watch(
  messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template lang="html">
  <div class="flex flex-col h-full">
    <div class="flex justify-between p-3 border-b border-[rgba(0,0,0,0.15)]">
      <div class="flex items-center gap-2">
        <div class="relative">
          <nuxt-img
            class="w-12 h-12 rounded-full object-cover"
            src="/avatar.jpg"
            :alt="conversationName"
          />
          <div
            v-if="isContactOnline"
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
          ></div>
        </div>
        <div class="text-lg font-medium">
          {{ conversationName }}
          <p class="text-xs text-gray-500">
            {{ isContactOnline ? "Active now" : "Last seen recently" }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Icon
          class="text-white"
          size="24"
          name="material-symbols:android-messages"
        />
        <Icon
          class="text-white"
          size="24"
          name="material-symbols:android-messages"
        />
      </div>
    </div>
    <div class="overflow-y-auto p-4 flex-1" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="message._id || index"
        class="flex"
        :class="isMyMessage(message) ? 'justify-end' : 'justify-start'"
      >
        <div class="flex items-end space-x-2 max-w-xs lg:max-w-md my-2">
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
    <!-- Message Input -->
    <div class="bg-white border-t border-gray-200 px-4 py-3">
      <MessageInput />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
