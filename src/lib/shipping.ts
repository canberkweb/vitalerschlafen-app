// ─── Shipping Calculation ───────────────────────────────────────────────────
// Server-side only. Never trust client-side shipping values.

export const EU_COUNTRIES = [
  { code: "DE", name: "Deutschland" },
  { code: "AT", name: "Österreich" },
  { code: "BE", name: "Belgien" },
  { code: "BG", name: "Bulgarien" },
  { code: "HR", name: "Kroatien" },
  { code: "CY", name: "Zypern" },
  { code: "CZ", name: "Tschechien" },
  { code: "DK", name: "Dänemark" },
  { code: "EE", name: "Estland" },
  { code: "FI", name: "Finnland" },
  { code: "FR", name: "Frankreich" },
  { code: "GR", name: "Griechenland" },
  { code: "HU", name: "Ungarn" },
  { code: "IE", name: "Irland" },
  { code: "IT", name: "Italien" },
  { code: "LV", name: "Lettland" },
  { code: "LT", name: "Litauen" },
  { code: "LU", name: "Luxemburg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Niederlande" },
  { code: "PL", name: "Polen" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Rumänien" },
  { code: "SK", name: "Slowakei" },
  { code: "SI", name: "Slowenien" },
  { code: "ES", name: "Spanien" },
  { code: "SE", name: "Schweden" },
] as const;

export type EUCountryCode = (typeof EU_COUNTRIES)[number]["code"];

const EU_COUNTRY_CODES = new Set<string>(EU_COUNTRIES.map((c) => c.code));

/** Shipping cost in cents */
const SHIPPING_DE_CENTS = 499; // 4,99 €
const SHIPPING_EU_CENTS = 999; // 9,99 €
const FREE_SHIPPING_THRESHOLD_DE_CENTS = 5000; // 50,00 €

export function isValidEUCountry(code: string): boolean {
  return EU_COUNTRY_CODES.has(code);
}

/**
 * Calculate shipping cost in cents.
 * @param countryCode ISO 3166-1 alpha-2 code
 * @param subtotalCents Cart subtotal in cents
 */
export function calculateShippingCents(
  countryCode: string,
  subtotalCents: number,
): number {
  if (!isValidEUCountry(countryCode)) {
    throw new Error(`Versand nur innerhalb der EU möglich. Land "${countryCode}" wird nicht unterstützt.`);
  }

  if (countryCode === "DE") {
    return subtotalCents >= FREE_SHIPPING_THRESHOLD_DE_CENTS ? 0 : SHIPPING_DE_CENTS;
  }

  return SHIPPING_EU_CENTS;
}

/**
 * Get a human-readable description of shipping for a country.
 */
export function getShippingDescription(countryCode: string, subtotalCents: number): string {
  if (countryCode === "DE") {
    if (subtotalCents >= FREE_SHIPPING_THRESHOLD_DE_CENTS) {
      return "Kostenloser Versand (Deutschland)";
    }
    return "Versand Deutschland: 4,99 €";
  }
  return "Versand EU: 9,99 €";
}
