// src/services/orderService.ts
import { sendUpdate } from "../utils/wsManager.js";
import { findBestRoute } from "./routingService.js";
import { buildTransaction, submitTransaction } from "./transactionBuilder.js";
import { saveOrderUpdate } from "../database/orders.js";

export async function processOrder(orderId: string, payload: any) {
  // small delay to allow WebSocket connections
  await new Promise((res) => setTimeout(res, 400));

  // Pending
  await saveOrderUpdate(orderId, "pending");
  sendUpdate(orderId, { status: "pending", message: "Order received." });

  await new Promise((res) => setTimeout(res, 600));

  // Routing
  const route = findBestRoute(
    payload.fromToken,
    payload.toToken,
    parseFloat(payload.amount)
  );

  await saveOrderUpdate(orderId, "routing", {
    protocol: route.chosen,
    raydiumPrice: route.raydiumPrice,
    meteoraPrice: route.meteoraPrice,
  });

  sendUpdate(orderId, {
    status: "routing",
    route: route.chosen,
    expectedOut: route.expectedOut,
  });

  await new Promise((res) => setTimeout(res, 600));

  // Building
  await saveOrderUpdate(orderId, "building");
  sendUpdate(orderId, { status: "building" });

  const tx = buildTransaction(route);

  await new Promise((res) => setTimeout(res, 500));

  // Submitting
  await saveOrderUpdate(orderId, "submitting", { transaction: tx.tx });
  sendUpdate(orderId, { status: "submitting", transaction: tx.tx });

  const submission = await submitTransaction(tx.tx);

  await new Promise((res) => setTimeout(res, 500));

  // Random success / failure
  const success = Math.random() > 0.2;

  if (success) {
    await saveOrderUpdate(orderId, "confirmed", {
      signature: submission.signature,
    });

    sendUpdate(orderId, {
      status: "confirmed",
      signature: submission.signature,
    });
  } else {
    await saveOrderUpdate(orderId, "failed", { reason: "simulation error" });

    sendUpdate(orderId, {
      status: "failed",
      message: "Order failed during simulation.",
    });
  }
}
