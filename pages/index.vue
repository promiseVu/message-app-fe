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

const { data, pending } = useFetch("/api/coversation");
</script>
<template lang="html">
  <div v-loading="pending" class="flex flex-col h-full">
    <div class="flex-grow">
      <nuxt-link
        v-for="conversation in data"
        :to="{ name: 'cid', params: { cid: conversation._id } }"
        ><el-card shadow="hover"
          >Conversation {{ conversation._id }}</el-card
        ></nuxt-link
      >
    </div>
    <footer class="h-16 w-full bg-slate-600 flex justify-around items-center">
      <div class="w-12 h-12" />
      <div class="text-2xl text-white">CONVERSATIONS</div>
      <nuxt-img
        @click="handleLogout"
        class="rounded-[50%] w-12 h-12 cursor-pointer"
        src="/avatar.jpg"
        alt=""
      />
    </footer>
  </div>
</template>
<style lang="scss"></style>
