<script lang="ts" setup>
definePageMeta({
  requireAuth: true,
});
const route = useRoute();
const router = useRouter();
const text = ref<string>();
</script>
<template lang="html">
  <div class="flex flex-col h-full">
    <header class="flex justify-between items-center px-10 h-16 bg-slate-600">
      <Icon
        class="w-7 h-7 cursor-pointer"
        @click="router.back()"
        name="material-symbols-light:arrow-back-ios-rounded"
        size="28"
      />
      <h2 class="text-lg">{{ route.params.cid }}</h2>
      <Icon
        class="w-7 h-7 cursor-pointer"
        name="material-symbols-light:format-list-bulleted-rounded"
        size="30"
      />
    </header>
    <div class="flex-grow">This this conversation {{ route.params.cid }}</div>
    <footer
      class="flex justify-between items-center px-10 h-16 bg-slate-600 gap-4"
    >
      <el-input
        v-model="text"
        :rows="1"
        type="textarea"
        placeholder="Enter message"
        resize="none"
      />
      <el-button type="danger">Send</el-button>
    </footer>
  </div>
</template>
<style lang="scss"></style>
