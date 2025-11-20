
// Mock routing service for Raydium / Meteora with realistic price variance and logging

export type RouteResult = {
  protocol: "Raydium" | "Meteora";
  expectedOut: number;
  raydiumPrice: number;
  meteoraPrice: number;
  chosen: "Raydium" | "Meteora";
};

function baseMarketPrice(fromToken: string, toToken: string, amount: number) {
  // Very small mock base price: for example purpose only
  // For SOL → USDC assume base price 24 USDC per SOL
  if (fromToken === "SOL" && toToken === "USDC") {
    return 24;
  }
  // default
  return 1;
}

export function findBestRoute(fromToken: string, toToken: string, amount: number): RouteResult {
  const basePrice = baseMarketPrice(fromToken, toToken, amount);

  // Raydium: base * (0.98 + rand*0.04) => 98% to 102%
  const raydiumPrice = basePrice * (0.98 + Math.random() * 0.04);

  // Meteora: base * (0.97 + rand*0.05) => 97% to 102%
  const meteoraPrice = basePrice * (0.97 + Math.random() * 0.05);

  // Compute expected output amount for `amount` fromToken
  const expectedOutRay = amount * raydiumPrice;
  const expectedOutMete = amount * meteoraPrice;

  const chosen = expectedOutRay >= expectedOutMete ? "Raydium" : "Meteora";
  const expectedOut = chosen === "Raydium" ? expectedOutRay : expectedOutMete;

  // Log decision (console); these logs satisfy the "log routing decisions" requirement
  console.log(`[ROUTER] from=${fromToken} to=${toToken} amt=${amount} raydium=${raydiumPrice.toFixed(6)} meteora=${meteoraPrice.toFixed(6)} chosen=${chosen}`);

  return {
    protocol: chosen,
    expectedOut,
    raydiumPrice,
    meteoraPrice,
    chosen,
  };
}
