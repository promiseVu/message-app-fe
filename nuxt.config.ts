// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@element-plus/nuxt",
    "@pinia/nuxt",
  ],
  image: {
    dir: "assets/images",
  },
  runtimeConfig: {
    private: {
      baseUrl: process.env.BACKEND_URL || "http://localhost:8080",
    },
    public: {
      baseUrl: process.env.FRONTEND_URL || "http://localhost:3000",
      environment: process.env.ENVIRONMENT || "development",
      socketUrl: process.env.BACKEND_URL || "http://localhost:8080",
    },
  },
});
