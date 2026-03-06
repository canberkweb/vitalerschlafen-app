/**
 * Site-wide constants — brand info, navigation, product data.
 * Safe to import on both client and server.
 */

export const SITE = {
  name: "Vitalerschlafen",
  url: "https://vitalerschlafen.de",
  locale: "de-DE",
  currency: "EUR",
  currencySymbol: "€",
  description:
    "Premium Hirsekissen für erholsamen Schlaf – 100% natürlich, handgefertigt in Deutschland.",
} as const;

export const COMPANY = {
  legalName: "Vitalerschlafen — Einzelunternehmen",
  owner: "Vural Polat",
  address: "Leutkircher Eck 3, 87700 Memmingen, Deutschland",
  vatId: "DE368113069",
} as const;

export const COLORS = {
  gold: "#E6BE91",
  dark: "#1C1C1C",
  bgSoft: "#F7F5F2",
  neutral: "#8A8A8A",
} as const;
