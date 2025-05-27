export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const response = await axiosInstance().post("/api/auth/login", { ...body });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi api", error);
  }
});
