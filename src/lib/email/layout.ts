/**
 * Shared email layout wrapper — German branding, legal footer.
 */

import { SITE, COMPANY } from "@/config/site";

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${SITE.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F5F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F7F5F2;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;background-color:#1C1C1C;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#E6BE91;letter-spacing:0.5px;">${SITE.name}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#FAFAF9;border-top:1px solid #F0EDE8;">
              <p style="margin:0 0 8px;font-size:11px;color:#8A8A8A;line-height:1.5;">
                ${COMPANY.legalName}<br/>
                ${COMPANY.owner} · ${COMPANY.address}<br/>
                USt-IdNr.: ${COMPANY.vatId}
              </p>
              <p style="margin:0;font-size:11px;color:#8A8A8A;line-height:1.5;">
                <a href="${SITE.url}/impressum" style="color:#8A8A8A;text-decoration:underline;">Impressum</a> ·
                <a href="${SITE.url}/datenschutz" style="color:#8A8A8A;text-decoration:underline;">Datenschutz</a> ·
                <a href="${SITE.url}/widerruf" style="color:#8A8A8A;text-decoration:underline;">Widerrufsbelehrung</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
