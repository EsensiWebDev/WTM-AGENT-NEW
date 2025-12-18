/**
 * Gets the price for a specific currency from a prices object.
 * Falls back to the deprecated price field if prices object doesn't have the currency.
 * 
 * @param prices - Multi-currency prices object, e.g. {"IDR": 500000, "USD": 200}
 * @param price - Deprecated single price value (fallback)
 * @param currency - Currency code to get price for (e.g. "IDR", "USD")
 * @returns The price for the specified currency, or the fallback price if currency not found
 */
export function getPriceForCurrency(
  prices: Record<string, number> | undefined,
  price: number,
  currency: string
): number {
  // If prices object exists and has the currency, use it
  if (prices && typeof prices === 'object' && currency in prices) {
    return prices[currency];
  }
  
  // Otherwise fall back to the deprecated price field
  return price;
}

