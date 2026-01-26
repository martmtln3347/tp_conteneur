const WebSocket = require("ws");

const port = Number(process.env.WS_PORT || 8080);

const wss = new WebSocket.Server({ port });
console.log(`Backend running on ws://localhost:${port}`);

function broadcastJson(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function broadcastUserCount() {
  const count = [...wss.clients].filter((c) => c.readyState === WebSocket.OPEN).length;
  broadcastJson({ type: "user_count", value: count });
}

wss.on("connection", (ws) => {
  console.log("Client connected");
  broadcastUserCount();

  ws.on("message", (data) => {
    const raw = data.toString();
    console.log(`WS message received: ${raw}`);

    // On accepte soit du JSON {type,value}, soit une string brute
    let payload;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && typeof parsed.type === "string") {
        payload = parsed;
      }
    } catch {
      // ignore
    }

    if (!payload) {
      payload = { type: "message", value: raw };
    }

    // On diffuse à tous les clients connectés
    broadcastJson(payload);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    broadcastUserCount();
  });
});
