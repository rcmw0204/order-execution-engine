// src/server.ts
import { buildApp } from "./app.js";
import { startWsServer } from "./wsServer.js";
import { startOrderWorker } from "./queue/orderWorker.js";
import { initDb } from "./database/orders.js";

async function startServer() {
  // Initialize PostgreSQL tables
  await initDb();

  const app = buildApp();
  await app.ready();

  // Start background worker
  startOrderWorker();

  // Start WebSocket server
  const server = app.server;
  startWsServer(server);

  app.listen({ port: 3000, host: "0.0.0.0" }, () => {
    console.log("HTTP server running at http://localhost:3000");
    console.log("WS server running at ws://localhost:3000/ws/<orderId>");
  });
}

startServer();
