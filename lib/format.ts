export function formatCurrency(nominal: number, currency = "IDR"): string {
  if (currency === "IDR") {
    return `IDR ${new Intl.NumberFormat("id-ID").format(nominal)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    trailingZeroDisplay: "stripIfInteger",
  }).format(nominal);
}

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-GB", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}
