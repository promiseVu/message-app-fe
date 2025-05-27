export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthentication();
  if (to.meta?.requireLogin && !auth.value.isLogin) {
      const authorized = await useAuthorization()
      // if (!authorized) {
      //   assistance.setFunction({
      //     name: AssistanceFunction.REQUIRE_LOGIN,
      //     props: {
      //       goto: to.path,
      //       to,
      //     },
      //   })
      //   if (from.meta.requireLogin) {
      //     return navigateTo({ name: 'index' })
      //   }
      //   return false
      // }
    }
  }
  else {
    const isLogin = useCookie(Cookie.ACCESS_TOKEN_KEY)
    if (to.meta?.requireLogin && !isLogin) {
      return navigateTo({ name: 'auth', query: { redirect: to.path } })
    }
  }
});
