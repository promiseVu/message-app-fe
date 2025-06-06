import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const token = useCookie("accessToken");
  const socket = ref<ReturnType<typeof io> | null>(null);

  // Hàm kết nối WebSocket
  function connectWebsocket() {
    if (socket.value) {
      console.warn("Socket already initialized");
      return;
    }
    const socketUrl = config.public.socketUrl || "http://localhost:8080";
    try {
      socket.value = io(socketUrl, {
        auth: {
          token: token.value || null,
        },
        autoConnect: false, // Tắt autoConnect để kiểm soát kết nối thủ công
        reconnection: true, // Bật reconnect tự động
        reconnectionAttempts: 5, // Số lần thử kết nối lại
        reconnectionDelay: 1000, // Thời gian chờ giữa các lần thử (ms)
      });

      socket.value.connect();
      registerEvents(socket.value);
    } catch (error) {
      console.error("Failed to create socket connection:", error);
    }
  }

  // Kết nối nếu có token
  if (token.value) {
    connectWebsocket();
  }

  // Theo dõi thay đổi token để reconnect nếu cần
  watch(token, (newToken) => {
    if (newToken && !socket.value) {
      connectWebsocket();
    } else if (!newToken && socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  });

  return {
    provide: {
      socket: computed(() => socket.value), // Trả về computed để đảm bảo reactive
      connectWebsocket,
    },
  };
});
