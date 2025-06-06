export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const response = await useAxiosProxy().post("/api/auth/register", {
      ...body,
    });
    return response.data;
  } catch (error: any) {
    setResponseStatus(event, error.status);
    return error;
  }
});
