const escapeHtml = (value = '') => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

const buildEmailLayout = ({ title, previewText, bodyHtml }) => {
  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          ${escapeHtml(previewText || title)}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px;background:linear-gradient(90deg,#ecfeff,#f8fafc,#eff6ff);border-bottom:1px solid #e2e8f0;">
                    <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:#0891b2;text-transform:uppercase;">
                      PETNOVA
                    </div>
                    <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;color:#0f172a;">
                      ${escapeHtml(title)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    ${bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px;border-top:1px solid #e2e8f0;color:#64748b;font-size:13px;line-height:1.6;">
                    Este es un correo automático de PETNOVA. Por favor, no respondas directamente a este mensaje.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

module.exports = {
  escapeHtml,
  buildEmailLayout,
};