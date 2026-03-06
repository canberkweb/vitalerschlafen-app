import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1, "Produkt-ID ist erforderlich."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Bewertung muss mindestens 1 Stern sein.")
    .max(5, "Bewertung darf maximal 5 Sterne sein."),
  body: z
    .string()
    .max(2000, "Bewertung darf maximal 2000 Zeichen lang sein.")
    .optional()
    .or(z.literal("")),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const adminReviewSchema = z.object({
  reviewId: z.string().min(1, "Bewertungs-ID ist erforderlich."),
  action: z.enum(["approve", "reject"], {
    message: "Ungültige Aktion.",
  }),
});

export type AdminReviewInput = z.infer<typeof adminReviewSchema>;
