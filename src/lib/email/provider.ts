/**
 * Email provider — Resend SDK.
 * Falls back to console logging when RESEND_API_KEY is not set.
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Vitalerschlafen <noreply@vitalerschlafen.de>";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(RESEND_API_KEY);
  }
  return _resend;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  /** Optional plain text fallback */
  text?: string;
  /** Reply-to address */
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const resend = getResend();

  if (!resend) {
    // Dev fallback — log to console
    console.log("─── EMAIL (dev mode) ───────────────────────────");
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Text:    ${options.text ?? "(HTML only)"}`);
    console.log("────────────────────────────────────────────────");
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("[EMAIL] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[EMAIL] Failed to send:", err);
    return false;
  }
}
