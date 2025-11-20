import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { registerClient } from "./utils/wsManager.js";

export function startWsServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || "", "http://localhost");
    const orderId = url.pathname.replace("/ws/", "");

    registerClient(orderId, socket);

    console.log("Client connected:", orderId);

    socket.on("close", () => {
      console.log("Client disconnected:", orderId);
    });
  });

  console.log("🌐 WebSocket server running");
}
