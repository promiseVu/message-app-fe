import { useAxiosProxy } from "~/server/utils/axios";

export default defineEventHandler(async (event) => {
  const Authorization = getRequestAuthorization(event);
  try {
    const response = await useAxiosProxy({
      Authorization,
    }).get("/api/users");
    return response.data;
  } catch (error: any) {
    setResponseStatus(event, error.status);
    return error;
  }
});
