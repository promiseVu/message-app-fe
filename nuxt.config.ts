// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@element-plus/nuxt",
  ],
  image: {
    dir: 'assets/images',
  },
  runtimeConfig: {
    private: {
      baseUrl: process.env.BACKEND_URL || "http://localhost:8080",
    },
    public: {
      baseUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  },
});
