export default defineEventHandler(async (event) => {
  const Authorization = getRequestAuthorization(event);
  try {
    const response = await useAxiosProxy({
      Authorization,
    }).get("/api/auth/verify");
    return response.data;
  } catch (error: any) {
    setResponseStatus(event, error.status);
    return error;
  }
});
