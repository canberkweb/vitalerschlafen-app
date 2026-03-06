import { z } from "zod";

export const updateStockSchema = z.object({
  variantId: z.string().min(1, "Variante ist erforderlich."),
  stock: z.coerce
    .number()
    .int("Bestand muss eine ganze Zahl sein.")
    .min(0, "Bestand darf nicht negativ sein.")
    .max(99999, "Bestand darf maximal 99.999 sein."),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
