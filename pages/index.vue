
<script lang="ts" setup>
import { useLogout } from '#imports'

const auth = useAuthentication()
const router = useRouter()
const { data } = useFetch('/api/coversation')
definePageMeta({
  requireAuth: true,
});

function handleLogout() {
  useLogout()
}
onMounted(() => {
  if(!auth.value.isLogin){
    router.push('login')
  }
})
</script>
<template lang="html">
<div class="flex flex-col h-full">
    <div class="flex-grow">
    <nuxt-link :to="{ name: 'cid', params: { cid: 'conversation 1' } }"
      ><el-card shadow="hover">Conversation 1</el-card></nuxt-link
    >
    <nuxt-link :to="{ name: 'cid', params: { cid: 'conversation 2' } }"
      ><el-card shadow="hover">Conversation 2</el-card></nuxt-link
    >
    <nuxt-link :to="{ name: 'cid', params: { cid: 'conversation 3' } }"
      ><el-card shadow="hover">Conversation 3</el-card></nuxt-link
    >
  </div>
  <footer class="h-16 w-full bg-slate-600 flex justify-around items-center">
    <div class="w-12 h-12"/>
    <div class="text-2xl text-white">CONVERSATIONS</div>
    <nuxt-img @click="handleLogout" class="rounded-[50%] w-12 h-12 cursor-pointer" src="/avatar.jpg" alt=""/>
  </footer>
</div>
</template>
<style lang="scss"></style>
