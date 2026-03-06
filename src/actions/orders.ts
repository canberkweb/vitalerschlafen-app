"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { sendEmail, shippingNotificationEmail } from "@/lib/email";

export interface UpdateOrderStatusState {
  success?: boolean;
  error?: string;
  orderId?: string;
}

export async function updateOrderStatusAction(
  _prev: UpdateOrderStatusState,
  formData: FormData,
): Promise<UpdateOrderStatusState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const raw = {
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    trackingNumber: formData.get("trackingNumber"),
  };

  const parsed = updateOrderStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe.",
      orderId: String(raw.orderId ?? ""),
    };
  }

  const { orderId, status, trackingNumber } = parsed.data;

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { id: true, email: true, status: true, shippingName: true },
    });

    if (!order) {
      return { error: "Bestellung nicht gefunden.", orderId };
    }

    const updateData: Record<string, unknown> = { status };
    if (trackingNumber !== undefined && trackingNumber !== "") {
      updateData.trackingNumber = trackingNumber;
    }

    await db.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Send shipping notification if status changed to SHIPPED
    if (status === "SHIPPED" && order.status !== "SHIPPED") {
      const emailData = shippingNotificationEmail({
        orderId: order.id,
        email: order.email,
        shippingName: order.shippingName,
        trackingNumber: trackingNumber || null,
      });
      await sendEmail({ to: order.email, ...emailData });
    }

    revalidatePath("/admin/orders");
    return { success: true, orderId };
  } catch {
    return { error: "Fehler beim Aktualisieren der Bestellung.", orderId };
  }
}
