export default function registerEvents(socket: any) {
  const messageStore = useMessageStore();
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    socket.removeAllListeners();
    console.log("Socket disconnected");
  });

  socket.on("receivedMessage", (payload: any) => {
    console.log("Received message", payload);
    messageStore.receivedMessage(payload);
  });

  socket.on("onlineUsers", (payload: string[]) => {
    console.log("User online status changed", payload);
    messageStore.setUserOnline(payload);
  });
}
