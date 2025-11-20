import Fastify from "fastify";
import orderRoute from "./api/orderRoute.js";

export function buildApp() {
  const app = Fastify();

  // Health route
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Order execution route
  app.register(orderRoute);

  return app;
}
