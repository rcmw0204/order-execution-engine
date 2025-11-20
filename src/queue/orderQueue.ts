
import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const orderQueue = new Queue("order-queue", {
  connection: redisConnection,
});

export async function addOrder(orderId: string, payload: any) {
  // Add job with retry attempts and exponential backoff (1000ms -> 2000ms -> 4000ms)
  await orderQueue.add(
    "execute",
    { orderId, payload },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}
