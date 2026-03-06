import { SITE } from "@/config/site";

/**
 * Format cents to EUR string in de-DE locale.
 * e.g. 9900 → "99,00 €"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(SITE.locale, {
    style: "currency",
    currency: SITE.currency,
  }).format(cents / 100);
}

/**
 * Short price without decimals when .00
 * e.g. 9900 → "99 €", 9950 → "99,50 €"
 */
export function formatPriceShort(cents: number): string {
  const euros = cents / 100;
  if (Number.isInteger(euros)) {
    return new Intl.NumberFormat(SITE.locale, {
      style: "currency",
      currency: SITE.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(euros);
  }
  return formatPrice(cents);
}
