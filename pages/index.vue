<script lang="ts" setup>
import SideBar from "~/components/Modules/Coversation/SideBar.vue";
import type { Message } from "~/types/message";
import MessageInput from "~/components/Modules/Coversation/MessageInput.vue";
import Conversation from "~/components/Modules/Coversation/Conversation.vue";
import ListConversation from "~/components/Modules/Coversation/ListConversation.vue";

definePageMeta({
  requireAuth: true,
});

const messageStore = useMessageStore();
const auth = useAuthentication();

const { data, pending } = useLazyFetch(
  `/api/conversation/${auth.value.userData?._id}`
);

watch(
  data,
  (newData) => {
    messageStore.setListCoversations(newData);
  },
  { immediate: true }
);
</script>
<template>
  <div class="h-full flex">
    <SideBar />
    <div class="w-[344px] border-r border-border-[rgba(0,0,0,0.15)]">
      <ListConversation />
    </div>
    <div v-if="messageStore.currentConversation" class="flex-1 flex">
      <div class="w-[687px] border-r border-border-[rgba(0,0,0,0.15)]">
        <Conversation />
      </div>
      <div class="flex-1"></div>
    </div>
    <div class="h-full flex-1 flex items-center justify-center" v-else>
      <p>Wellcome Message Application</p>
    </div>
  </div>
</template>

<style lang="scss"></style>
