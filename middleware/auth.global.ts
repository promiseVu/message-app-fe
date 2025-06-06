export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthentication();
  const accessToken = useCookie("accessToken").value;
  const backlistWhenLoggedIn = ["auth-method", "forgot-password"];
  if (backlistWhenLoggedIn.includes(String(to.name)) && accessToken) {
    return navigateTo("/");
  }

  if (process.client) {
    console.log("Client-side middleware is running.");
    if (to.meta?.requireAuth && !auth.value.isLogin) {
      const authorized = await useAuthorization();
      if (!authorized) {
        if (from.meta.requireAuth) {
          return navigateTo({
            name: "auth-method",
            params: { method: "login" },
          });
        }
      }
    }
  } else {
    if (to.meta?.requireAuth && !accessToken) {
      return navigateTo({ name: "auth-method", params: { method: "login" } });
    }
  }
});
