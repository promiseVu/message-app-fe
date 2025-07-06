<script lang="ts" setup>
import type { User } from "~/types/user";

definePageMeta({
  requireAuth: true,
});

const router = useRouter();
const auth = useAuthentication();
const messageStore = useMessageStore();

const { data: users, pending } = useFetch<User>("/api/users/infomation");

const userComputed = computed<User | null>(() => {
  return users.value;
});

function getUserName(user: User) {
  return `${user.firstName} ${user.lastName}`;
}

function isUserOnline(userId: string) {
  return messageStore.onlineUsers.includes(userId);
}
</script>

<template lang="html">
  <div class="w-full h-full bg-white">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Users List -->
    <div
      v-else-if="userComputed?.sentRequests && userComputed?.sentRequests?.length > 0"
      class="flex-1 overflow-y-auto"
    >
      <div
        v-for="user in userComputed?.sentRequests"
        :key="user._id"
        class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
      >
        <!-- Avatar with Online Status -->
        <div class="relative mr-3">
          <nuxt-img
            class="w-14 h-14 rounded-full object-cover"
            :src="user.avatar || '/avatar.jpg'"
            :alt="getUserName(user)"
          />
          <div
            v-if="isUserOnline(user._id)"
            class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></div>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900 truncate">
              {{ getUserName(user) }}
            </h3>
          </div>

          <p class="text-xs text-gray-500 truncate mt-1">
            {{ user.email }}
          </p>

          <!-- Online Status Text -->
          <div class="flex items-center mt-1">
            <span class="text-xs text-gray-400"> Offline </span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Icon
            name="material-symbols:send"
            class="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4">
      <Icon
        name="material-symbols:person-search"
        class="w-16 h-16 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No people available
      </h3>
      <p class="text-sm text-gray-500 text-center max-w-sm">
        There are no people to display at the moment.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Custom scrollbar for the users list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
