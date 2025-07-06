<script lang="ts" setup>
const text = ref<string>("");
const messageStore = useMessageStore();

function sendMessage() {
  if (!messageStore.currentConversation || !text.value?.trim()) return;
  messageStore.sendMessage(messageStore.currentConversation, text.value.trim());
  text.value = "";
}

function handleFocus() {
  if (!messageStore.currentConversation) return;
  messageStore.handleFocusEvent(messageStore.currentConversation);
}
</script>
<template lang="">
  <div class="flex items-center space-x-3">
    <Icon
      name="material-symbols:add-circle-outline"
      class="w-6 h-6 flex-shrink-0 text-gray-500 hover:text-blue-500 transition-colors"
    />
    <div class="flex-grow relative">
      <input
        v-model="text"
        @keydown.enter="sendMessage"
        @focus="handleFocus"
        type="text"
        placeholder="Type a message..."
        class="w-full px-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm"
      />

      <Icon
        name="material-symbols:sentiment-satisfied-outline"
        class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
      />
    </div>

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
</template>

<style lang=""></style>
