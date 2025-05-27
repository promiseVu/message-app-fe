import { useAxiosProxy } from "~/server/utils/axios";
export default defineEventHandler(async (event) => {
  try {
    const response = await useAxiosProxy().get("api/conversations");
    return response.data;
  } catch (error: any) {
    setResponseStatus(event, error.status);
    return error;
  }
});
