export default function registerEvents(socket: any) {
  const messageStore = useMessageStore();
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    socket.removeAllListeners();
    console.log("Socket disconnected");
  });

  socket.on("receivedMessage", (data: any) => {
    console.log("Received message", data);
    messageStore.receivedMessage(data);
  });
}
