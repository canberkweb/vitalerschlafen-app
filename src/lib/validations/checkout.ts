import { z } from "zod";
import { EU_COUNTRIES } from "@/lib/shipping";

const euCountryCodes = EU_COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const checkoutSchema = z.object({
  shippingName: z
    .string()
    .min(2, "Bitte geben Sie Ihren vollständigen Namen ein.")
    .max(200, "Name darf maximal 200 Zeichen lang sein."),
  email: z
    .string()
    .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  shippingAddress1: z
    .string()
    .min(3, "Bitte geben Sie Ihre Adresse ein.")
    .max(300, "Adresse darf maximal 300 Zeichen lang sein."),
  shippingAddress2: z
    .string()
    .max(300, "Adresszusatz darf maximal 300 Zeichen lang sein.")
    .optional()
    .or(z.literal("")),
  shippingPostalCode: z
    .string()
    .min(3, "Bitte geben Sie eine gültige Postleitzahl ein.")
    .max(20, "Postleitzahl darf maximal 20 Zeichen lang sein."),
  shippingCity: z
    .string()
    .min(1, "Bitte geben Sie Ihren Ort ein.")
    .max(200, "Ort darf maximal 200 Zeichen lang sein."),
  shippingCountry: z.enum(euCountryCodes, {
    message: "Bitte wählen Sie ein EU-Land aus.",
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
