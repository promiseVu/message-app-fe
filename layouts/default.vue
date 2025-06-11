<script setup lang="ts">
import { useLogout } from "#imports";

const router = useRouter();
const menu = ref([
  {
    name: "Chats",
    icon: "material-symbols:chat-bubble",
    active: true,
    key: "chats",
    path: "/",
  },
  {
    name: "People",
    icon: "ic:twotone-people-outline",
    active: false,
    key: "people",
    path: "/people",
  },
  {
    name: "Stories",
    icon: "material-symbols:auto-stories-outline",
    active: false,
    key: "stories",
    path: "/stories",
  },
  {
    name: "Calls",
    icon: "material-symbols:call-outline",
    active: false,
    key: "calls",
    path: "/calls",
  },
]);

function handleLogout() {
  useLogout();
}

function handleActiveMenu(item: any) {
  menu.value = menu.value.map((i) => {
    i.active = i.key === item.key;
    return i;
  });
  router.push(item.path);
}
</script>
<template lang="html">
  <main class="flex items-center justify-center">
    <div class="w-[768px] bg-white h-[100vh] flex flex-col">
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
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </header>
      <!-- Main -->
      <div class="flex-1">
        <slot />
      </div>
      <!-- Bottom Navigation -->
      <footer class="bg-white border-t border-gray-200 px-4 py-2">
        <div class="flex justify-around items-center">
          <div
            v-for="item in menu"
            :key="item.key"
            @click="handleActiveMenu(item)"
            class="flex flex-col items-center py-2 px-4 cursor-pointer"
          >
            <Icon
              :name="item.icon"
              class="w-6 h-6 mb-1"
              :class="item.active ? 'text-blue-500' : 'text-gray-400'"
            />
            <span
              class="text-xs font-medium"
              :class="item.active ? 'text-blue-500' : 'text-gray-400'"
              >{{ item.name }}</span
            >
          </div>
        </div>
      </footer>
    </div>
  </main>
</template>

<style setup lang="scss"></style>
