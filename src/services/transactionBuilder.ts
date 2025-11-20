import crypto from "crypto";

// Build a mock transaction with a fake signature
export function buildTransaction(route: any): { tx: string } {
  // Create a fake transaction string
  const tx = `tx_${route.protocol}_${Date.now()}`;
  return { tx };
}

// Simulate sending transaction and returning a mock signature
export async function submitTransaction(tx: string): Promise<{ signature: string }> {
  await new Promise((res) => setTimeout(res, 300)); // simulate network delay

  const signature = crypto.randomBytes(16).toString("hex");
  return { signature };
}
