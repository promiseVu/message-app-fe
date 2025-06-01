export default function registerEvents(socket: any) {
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    socket.removeAllListeners();
    console.log("Socket disconnected", );
  });

}
