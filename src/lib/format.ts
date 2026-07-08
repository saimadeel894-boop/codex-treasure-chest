export function formatPrice(cents: number, listingType: string, rentPeriod: string | null): string {
  const dollars = Math.round(cents / 100);
  const nice = dollars.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
  if (listingType === "rent") return `${nice}/${rentPeriod === "month" ? "month" : "week"}`;
  if (listingType === "sold") return `Sold for ${nice}`;
  return nice;
}

export function formatCompactPrice(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(dollars >= 10_000_000 ? 0 : 1)}m`;
  if (dollars >= 1_000) return `$${Math.round(dollars / 1_000)}k`;
  return `$${dollars}`;
}
