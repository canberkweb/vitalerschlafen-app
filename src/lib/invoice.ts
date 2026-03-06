/**
 * Invoice utilities — number generation and PDF creation.
 */

import PDFDocument from "pdfkit";
import { SITE, COMPANY } from "@/config/site";

// ─── Invoice Number Generation ───────────────────────────────────────────────

/**
 * Generate a sequential-looking invoice number: VS-YYYYMMDD-XXXX
 * Uses timestamp + random suffix for uniqueness without DB sequences.
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `VS-${datePart}-${rand}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCentsDE(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateDE(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Invoice PDF ─────────────────────────────────────────────────────────────

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  createdAt: Date;
  // Customer
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2?: string | null;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountry: string;
  email: string;
  // Amounts
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  // Items
  items: Array<{
    productTitle: string;
    variantLabel: string;
    quantity: number;
    unitCents: number;
  }>;
}

/**
 * Generate an invoice PDF as a Buffer.
 * Uses PDFKit, no external fonts required.
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = 595.28 - 100; // A4 width minus margins

    // ─── Header ──────────────────────────────────────────────────────
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(SITE.name, 50, 50);

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text(
        `${COMPANY.legalName} · ${COMPANY.owner} · ${COMPANY.address}`,
        50,
        78
      );

    // ─── RECHNUNG title ───────────────────────────────────────────────
    doc.moveDown(2);
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text("RECHNUNG", 50);

    // ─── Invoice details (right side) + Customer address (left side) ─
    const detailsY = doc.y + 10;

    // Customer address (left)
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#1C1C1C")
      .text(data.shippingName, 50, detailsY)
      .text(data.shippingAddress1)
      .text(
        data.shippingAddress2
          ? data.shippingAddress2
          : `${data.shippingPostalCode} ${data.shippingCity}`
      );
    if (data.shippingAddress2) {
      doc.text(`${data.shippingPostalCode} ${data.shippingCity}`);
    }
    doc.text(data.shippingCountry);

    // Invoice metadata (right)
    const rightX = 350;
    const lineH = 14;
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text("Rechnungsnummer:", rightX, detailsY, { continued: true })
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(` ${data.invoiceNumber}`)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text("Rechnungsdatum:", rightX, detailsY + lineH, { continued: true })
      .fillColor("#1C1C1C")
      .text(` ${formatDateDE(data.createdAt)}`)
      .fillColor("#8A8A8A")
      .text("Bestellnummer:", rightX, detailsY + lineH * 2, { continued: true })
      .fillColor("#1C1C1C")
      .text(` ${data.orderId}`);

    // ─── Line separator ──────────────────────────────────────────────
    const tableTop = Math.max(doc.y, detailsY + 80) + 20;
    doc
      .moveTo(50, tableTop)
      .lineTo(50 + pageWidth, tableTop)
      .strokeColor("#E0DDD8")
      .lineWidth(1)
      .stroke();

    // ─── Table header ─────────────────────────────────────────────────
    const headerY = tableTop + 10;
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor("#8A8A8A")
      .text("POSITION", 50, headerY)
      .text("MENGE", 300, headerY, { width: 50, align: "center" })
      .text("EINZELPREIS", 360, headerY, { width: 80, align: "right" })
      .text("GESAMT", 450, headerY, { width: 95, align: "right" });

    doc
      .moveTo(50, headerY + 15)
      .lineTo(50 + pageWidth, headerY + 15)
      .strokeColor("#E0DDD8")
      .stroke();

    // ─── Table rows ──────────────────────────────────────────────────
    let rowY = headerY + 25;
    for (const item of data.items) {
      const lineTotal = item.unitCents * item.quantity;
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#1C1C1C")
        .text(`${item.productTitle} — ${item.variantLabel}`, 50, rowY, {
          width: 240,
        })
        .text(String(item.quantity), 300, rowY, {
          width: 50,
          align: "center",
        })
        .text(`${formatCentsDE(item.unitCents)} €`, 360, rowY, {
          width: 80,
          align: "right",
        })
        .text(`${formatCentsDE(lineTotal)} €`, 450, rowY, {
          width: 95,
          align: "right",
        });
      rowY += 20;
    }

    // Separator before totals
    doc
      .moveTo(300, rowY + 5)
      .lineTo(50 + pageWidth, rowY + 5)
      .strokeColor("#E0DDD8")
      .stroke();

    // ─── Totals ──────────────────────────────────────────────────────
    rowY += 15;
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text("Zwischensumme", 360, rowY, { width: 80, align: "right" })
      .fillColor("#1C1C1C")
      .text(`${formatCentsDE(data.subtotalCents)} €`, 450, rowY, {
        width: 95,
        align: "right",
      });

    rowY += 16;
    doc
      .fillColor("#8A8A8A")
      .text("Versand", 360, rowY, { width: 80, align: "right" })
      .fillColor("#1C1C1C")
      .text(
        data.shippingCents === 0
          ? "Kostenlos"
          : `${formatCentsDE(data.shippingCents)} €`,
        450,
        rowY,
        { width: 95, align: "right" }
      );

    // VAT line (19% included)
    rowY += 16;
    const vatAmount = Math.round(data.totalCents - data.totalCents / 1.19);
    doc
      .fillColor("#8A8A8A")
      .text("davon 19% MwSt.", 360, rowY, { width: 80, align: "right" })
      .fillColor("#1C1C1C")
      .text(`${formatCentsDE(vatAmount)} €`, 450, rowY, {
        width: 95,
        align: "right",
      });

    // Grand total
    rowY += 22;
    doc
      .moveTo(360, rowY - 4)
      .lineTo(50 + pageWidth, rowY - 4)
      .strokeColor("#1C1C1C")
      .lineWidth(1.5)
      .stroke();

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text("Gesamtbetrag", 360, rowY, { width: 80, align: "right" })
      .text(`${formatCentsDE(data.totalCents)} €`, 450, rowY, {
        width: 95,
        align: "right",
      });

    rowY += 14;
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text("Alle Preise verstehen sich inkl. MwSt.", 360, rowY, {
        width: 185,
        align: "right",
      });

    // ─── Footer ──────────────────────────────────────────────────────
    const footerY = 750;
    doc
      .moveTo(50, footerY)
      .lineTo(50 + pageWidth, footerY)
      .strokeColor("#E0DDD8")
      .lineWidth(0.5)
      .stroke();

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#8A8A8A")
      .text(
        `${COMPANY.legalName} · ${COMPANY.owner}`,
        50,
        footerY + 10,
        { width: pageWidth, align: "center" }
      )
      .text(`${COMPANY.address} · USt-IdNr.: ${COMPANY.vatId}`, {
        width: pageWidth,
        align: "center",
      })
      .text(`${SITE.url}`, {
        width: pageWidth,
        align: "center",
      });

    doc.end();
  });
}
