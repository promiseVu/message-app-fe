import { io } from "socket.io-client";

export class SocketConnection {
  SOCKET_URL = useRuntimeConfig().public.socketUrl || "http://localhost:8080";
  socket: ReturnType<typeof io> | undefined;
  handleConnection = () => {
    if (!this.socket) {
      this.socket = io(this.SOCKET_URL);
    }
  };
}
