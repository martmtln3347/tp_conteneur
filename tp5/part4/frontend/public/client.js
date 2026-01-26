const chat = document.getElementById("chat");
const userCount = document.getElementById("userCount");
const status = document.getElementById("status");
const currentRoom = document.getElementById("currentRoom");

function appendLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  chat.appendChild(line);
  chat.scrollTop = chat.scrollHeight;
}

// IMPORTANT: on se connecte au même host que la page (Traefik), sur /socket/
const socket = io({
  path: "/socket/",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
  status.textContent = "connected";
  joinRoom("cats");
});

socket.on("chat", (msg) => {
  console.log("Chat received:", msg);
  appendLine(msg);
});

socket.on("user_count", (count) => {
  console.log("User count:", count);
  userCount.textContent = String(count);
});

socket.on("room_joined", (room) => {
  currentRoom.textContent = room;
  appendLine(`(joined room: ${room})`);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
  status.textContent = "disconnected";
});

function joinRoom(room) {
  socket.emit("join_room", room);
}

for (const btn of document.querySelectorAll("#rooms button[data-room]")) {
  btn.addEventListener("click", () => joinRoom(btn.dataset.room));
}

function send() {
  const input = document.getElementById("msg");
  const value = input.value;

  if (value.trim() !== "") {
    socket.emit("chat", value);
    input.value = "";
  }
}

window.send = send;
