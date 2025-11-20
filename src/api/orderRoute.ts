// src/api/orderRoute.ts
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { addOrder } from "../queue/orderQueue.js";
import { createOrderRecord } from "../database/orders.js";

export default async function orderRoute(app: FastifyInstance) {
  app.post("/orders/execute", async (req, reply) => {
    const payload = req.body as any;
    const orderId = randomUUID();

    // Save order entry into PostgreSQL
    await createOrderRecord(orderId, payload);

    // Add job to BullMQ queue
    await addOrder(orderId, payload);

    return { orderId };
  });
}
