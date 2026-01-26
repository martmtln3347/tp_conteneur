const http = require("http");
const { Server } = require("socket.io");

const port = Number(process.env.PORT || 8080);

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function broadcastUserCount() {
  // Nombre de clients connectés (global)
  const count = io.engine.clientsCount;
  io.emit("user_count", count);
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  broadcastUserCount();

  socket.on("chat", (msg) => {
    console.log(`WS chat received from ${socket.id}: ${msg}`);

    const room = socket.data.room;
    if (room) {
      io.to(room).emit("chat", msg);
    } else {
      // fallback : global
      io.emit("chat", msg);
    }
  });

  socket.on("join_room", (room) => {
    const nextRoom = String(room || "").trim();
    if (!nextRoom) return;

    const prevRoom = socket.data.room;
    if (prevRoom && prevRoom !== nextRoom) {
      socket.leave(prevRoom);
    }

    socket.join(nextRoom);
    socket.data.room = nextRoom;

    console.log(`Client ${socket.id} joined room: ${nextRoom}`);
    socket.emit("room_joined", nextRoom);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    broadcastUserCount();
  });
});

server.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
