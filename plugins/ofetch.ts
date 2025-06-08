import { ofetch } from "ofetch";
export default defineNuxtPlugin((_nuxtApp) => {
  // @ts-ignore
  globalThis.$fetch = ofetch.create({
    baseURL: useRuntimeConfig().public.baseUrl,
    async onRequest({ request, options }) {
      options.headers = options.headers || {};
      const accessToken = useCookie("accessToken")?.value;
      if (accessToken) {
        options.headers = options.headers || {};
        // @ts-ignore
        options.headers.Authorization = `Bearer ${accessToken}`;
      }
    },
  });
});
