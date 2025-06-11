<script setup lang="ts">
import { useRoute } from "vue-router";
import Login from "@/components/Modules/Auth/Login.vue";
import Register from "@/components/Modules/Auth/Register.vue";

type AuthMethod = "login" | "register";

const route = useRoute();

definePageMeta({
  requireAuth: false,
  layout: 'blank',
  validate: async (route): Promise<boolean> => {
    return ["login", "register"].includes(route.params.method as string);
  },
});

type ComponentMap = {
  [key in AuthMethod]: any;
};

const componentName: ComponentMap = {
  login: Login,
  register: Register,
};

const activeComponent = computed(
  () => componentName[route.params.method as AuthMethod]
);
</script>

<template>
  <div class="h-full">
    <div class="flex items-center justify-center h-full">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<style lang="scss"></style>
