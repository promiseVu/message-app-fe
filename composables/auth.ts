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
  userData: any,
  accessToken: any,
  expires = new Date(Date.now() + 60 * 60 * 1000)
) => {
  const authCookie = useCookie("accessToken", {
    expires,
  });
  authCookie.value = accessToken
  const auth = useAuthentication();
  auth.value.accessToken = accessToken;
  auth.value.userData = userData;
  auth.value.isLogin = true;
};

export const useLogout = () => {
  const auth = useAuthentication();
  auth.value.accessToken = "";
  auth.value.userData = null;
  auth.value.isLogin = false;
  const authCookie = useCookie("accessToken");
  authCookie.value = "";
};