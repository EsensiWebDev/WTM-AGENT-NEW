export function formatCurrency(nominal: number, currency = "IDR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    trailingZeroDisplay: "stripIfInteger",
  }).format(nominal);
}
