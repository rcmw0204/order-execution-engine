// src/queue/orderWorker.ts
import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import { processOrder } from "../services/orderService.js";
import { saveOrderUpdate } from "../database/orders.js";

export function startOrderWorker() {
  const worker = new Worker(
    "order-queue",
    async (job) => {
      console.log(`Processing order: ${job.data.orderId}`);

      await saveOrderUpdate(job.data.orderId, "processing", {
        attempt: job.attemptsMade + 1,
      });

      await processOrder(job.data.orderId, job.data.payload);
    },
    {
      connection: redisConnection,
      concurrency: 10,
    }
  );

  worker.on("completed", async (job) => {
    await saveOrderUpdate(job.data.orderId, "completed");
    console.log(`Order completed: ${job.data.orderId}`);
  });

  worker.on("failed", async (job, err) => {
    await saveOrderUpdate(job?.data.orderId, "failed", {
      reason: err?.message || String(err),
    });
    console.error(`Order failed: ${job?.data.orderId}`, err);
  });

  console.log("Order worker started with concurrency = 10");
}
