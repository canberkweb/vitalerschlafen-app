/**
 * Invoice PDF download route.
 * GET /api/invoice/[orderId]
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/invoice";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: { select: { title: true } } },
          },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
  }

  // Only owner or admin can download
  if (order.userId !== user.userId && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 });
  }

  // Only paid orders have invoices
  if (!order.invoiceNumber) {
    return NextResponse.json(
      { error: "Keine Rechnung vorhanden" },
      { status: 404 },
    );
  }

  const pdfBuffer = await generateInvoicePdf({
    invoiceNumber: order.invoiceNumber,
    orderId: order.id,
    createdAt: order.createdAt,
    shippingName: order.shippingName,
    shippingAddress1: order.shippingAddress1,
    shippingAddress2: order.shippingAddress2,
    shippingPostalCode: order.shippingPostalCode,
    shippingCity: order.shippingCity,
    shippingCountry: order.shippingCountry,
    email: order.email,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    totalCents: order.totalCents,
    items: order.items.map((item) => ({
      productTitle: item.variant.product.title,
      variantLabel: item.variant.label,
      quantity: item.quantity,
      unitCents: item.unitCents,
    })),
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Rechnung-${order.invoiceNumber}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
