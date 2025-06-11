import { useAxiosProxy } from "~/server/utils/axios";
export default defineEventHandler(async (event) => {
  const Authorization = getRequestAuthorization(event);
  const params = getRouterParams(event);
  try {
    const response = await useAxiosProxy({ Authorization }).get(
      `api/conversations/user/${params.userId}`
    );
    return response.data;
  } catch (error: any) {
    setResponseStatus(event, error.status);
    return error;
  }
});
