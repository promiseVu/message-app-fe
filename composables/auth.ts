import type { UserInfo } from "~/types/auth";

export const useAuthentication = () => {
  return useState<{ accessToken: string; isLogin: boolean; userData: any }>(
    "auth",
    () => ({
      accessToken: "",
      isLogin: false,
      userData: null,
    })
  );
};

export const useLogin = (
  userData: UserInfo,
  accessToken: string,
  expires = new Date(Date.now() + 60 * 60 * 1000)
) => {
  const authCookie = useCookie("accessToken", {
    expires,
  });
  authCookie.value = accessToken;
  const auth = useAuthentication();
  auth.value.accessToken = accessToken;
  auth.value.userData = userData;
  auth.value.isLogin = true;
};

export const useAuthorization = async (options = { force: false }) => {
  const accessToken = useCookie("accessToken");
  if (!accessToken.value && accessToken.value !== "") {
    return false;
  }
  const auth = useAuthentication();
  if (auth.value.isLogin && !options.force) {
    return true;
  }
  try {
    const userData = await $fetch("/api/auth/verify");
    if (userData) {
      const auth = useAuthentication();
      auth.value.accessToken = accessToken.value!;
      auth.value.userData = userData;
      auth.value.isLogin = true;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Authorization error:", error);
    await useLogout();
    return false;
  }
};

export const useLogout = () => {
  const auth = useAuthentication();
  auth.value.accessToken = "";
  auth.value.userData = null;
  auth.value.isLogin = false;
  const authCookie = useCookie("accessToken");
  authCookie.value = null;
  return navigateTo({ name: "auth-method", params: { method: "login" } });
};
