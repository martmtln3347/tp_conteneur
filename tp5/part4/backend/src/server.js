import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const port = Number(process.env.PORT || 8080);
const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

const httpServer = createServer();

// IMPORTANT: on sert socket.io sur /socket/
const io = new Server(httpServer, {
  path: "/socket/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));

console.log(`Redis adapter enabled via ${redisUrl}`);
console.log("Socket.io served at /socket/");

function broadcastUserCount() {
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

httpServer.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
