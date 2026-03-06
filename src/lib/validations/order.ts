import { z } from "zod";

export const ADMIN_UPDATABLE_STATUSES = [
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Bestell-ID ist erforderlich."),
  status: z.enum(ADMIN_UPDATABLE_STATUSES, {
    message: "Ungültiger Bestellstatus.",
  }),
  trackingNumber: z
    .string()
    .max(200, "Sendungsnummer darf maximal 200 Zeichen lang sein.")
    .optional()
    .or(z.literal("")),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
