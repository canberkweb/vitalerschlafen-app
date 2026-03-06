/**
 * Email templates — German, branded, legal-compliant.
 */

import { emailLayout } from "./layout";
import { SITE } from "@/config/site";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// ─── Order Confirmation ──────────────────────────────────────────────────────

interface OrderConfirmationData {
  orderId: string;
  shippingName: string;
  email: string;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  items: Array<{
    quantity: number;
    unitCents: number;
    variant: { label: string };
    productTitle?: string;
  }>;
  invoiceNumber?: string | null;
}

export function orderConfirmationEmail(data: OrderConfirmationData) {
  const itemRows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#1C1C1C;border-bottom:1px solid #F0EDE8;">
            ${item.productTitle ?? "Hirsekissen"} — ${item.variant.label} × ${item.quantity}
          </td>
          <td style="padding:8px 0;font-size:14px;color:#1C1C1C;text-align:right;border-bottom:1px solid #F0EDE8;">
            ${formatCents(item.unitCents * item.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  const html = emailLayout(`
    <h2 style="margin:0 0 4px;font-size:20px;color:#1C1C1C;">Vielen Dank für Ihre Bestellung!</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8A8A8A;">
      Hallo ${data.shippingName}, Ihre Bestellung wurde erfolgreich aufgenommen.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
      <tr>
        <td style="padding:12px 16px;background-color:#F7F5F2;border-radius:8px;">
          <p style="margin:0;font-size:12px;color:#8A8A8A;">Bestellnummer</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1C1C1C;font-family:monospace;">${data.orderId}</p>
          ${data.invoiceNumber ? `<p style="margin:4px 0 0;font-size:12px;color:#8A8A8A;">Rechnungsnr.: ${data.invoiceNumber}</p>` : ""}
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${itemRows}
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#8A8A8A;">Zwischensumme</td>
        <td style="padding:8px 0;font-size:13px;color:#8A8A8A;text-align:right;">${formatCents(data.subtotalCents)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#8A8A8A;">Versand</td>
        <td style="padding:8px 0;font-size:13px;color:#8A8A8A;text-align:right;">
          ${data.shippingCents === 0 ? "Kostenlos" : formatCents(data.shippingCents)}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#1C1C1C;border-top:2px solid #1C1C1C;">Gesamtbetrag</td>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#1C1C1C;text-align:right;border-top:2px solid #1C1C1C;">${formatCents(data.totalCents)}</td>
      </tr>
    </table>
    <p style="margin:4px 0 20px;font-size:11px;color:#8A8A8A;text-align:right;">inkl. MwSt.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:8px 0;">
          <a href="${SITE.url}/account/orders/${data.orderId}" style="display:inline-block;padding:12px 28px;background-color:#1C1C1C;color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
            Bestellung ansehen
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-size:12px;color:#8A8A8A;text-align:center;">
      Sie haben Fragen? Antworten Sie einfach auf diese E-Mail.
    </p>
  `);

  return {
    subject: `Bestellbestätigung — ${data.orderId}`,
    html,
    text: `Vielen Dank für Ihre Bestellung (${data.orderId})! Gesamtbetrag: ${formatCents(data.totalCents)} inkl. MwSt. Details: ${SITE.url}/account/orders/${data.orderId}`,
  };
}

// ─── Shipping Notification ──────────────────────────────────────────────────

interface ShippingNotificationData {
  orderId: string;
  email: string;
  shippingName: string;
  trackingNumber: string | null;
}

export function shippingNotificationEmail(data: ShippingNotificationData) {
  const trackingBlock = data.trackingNumber
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
        <tr>
          <td style="padding:12px 16px;background-color:#F7F5F2;border-radius:8px;">
            <p style="margin:0;font-size:12px;color:#8A8A8A;">Sendungsverfolgung</p>
            <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1C1C1C;font-family:monospace;">${data.trackingNumber}</p>
          </td>
        </tr>
      </table>`
    : "";

  const html = emailLayout(`
    <h2 style="margin:0 0 4px;font-size:20px;color:#1C1C1C;">Ihre Bestellung ist unterwegs! 📦</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8A8A8A;">
      Hallo ${data.shippingName}, Ihre Bestellung <strong>${data.orderId}</strong> wurde versandt.
    </p>

    ${trackingBlock}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:8px 0;">
          <a href="${SITE.url}/account/orders/${data.orderId}" style="display:inline-block;padding:12px 28px;background-color:#1C1C1C;color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
            Bestellung ansehen
          </a>
        </td>
      </tr>
    </table>
  `);

  return {
    subject: `Ihre Bestellung ${data.orderId} wurde versandt`,
    html,
    text: `Ihre Bestellung ${data.orderId} wurde versandt.${data.trackingNumber ? ` Sendungsnr.: ${data.trackingNumber}` : ""} Details: ${SITE.url}/account/orders/${data.orderId}`,
  };
}

// ─── Review Request ─────────────────────────────────────────────────────────

interface ReviewRequestData {
  orderId: string;
  email: string;
  shippingName: string;
  productSlug: string;
  productTitle: string;
}

export function reviewRequestEmail(data: ReviewRequestData) {
  const html = emailLayout(`
    <h2 style="margin:0 0 4px;font-size:20px;color:#1C1C1C;">Wie gefällt Ihnen Ihr neues Kissen?</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8A8A8A;">
      Hallo ${data.shippingName}, wir hoffen, dass Sie mit Ihrem <strong>${data.productTitle}</strong> zufrieden sind.
      Ihre Meinung hilft anderen Kunden bei der Entscheidung.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:8px 0;">
          <a href="${SITE.url}/product/${data.productSlug}#bewertung" style="display:inline-block;padding:12px 28px;background-color:#E6BE91;color:#1C1C1C;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
            Jetzt bewerten ★
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-size:12px;color:#8A8A8A;text-align:center;">
      Ihre Bewertung dauert nur eine Minute und hilft uns, noch besser zu werden.
    </p>
  `);

  return {
    subject: `Wie gefällt Ihnen Ihr ${data.productTitle}?`,
    html,
    text: `Hallo ${data.shippingName}, wie gefällt Ihnen Ihr ${data.productTitle}? Bewerten Sie es hier: ${SITE.url}/product/${data.productSlug}#bewertung`,
  };
}
