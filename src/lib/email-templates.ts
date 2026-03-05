/**
 * Email-client-safe HTML templates for Brevo.
 * Uses only inline styles, table layouts, and light backgrounds.
 * Dark-mode CSS variables won't work in email clients — keep it light.
 */

const ACCENT = '#6366f1';
const ACCENT_DARK = '#4f46e5';
const TEXT_PRIMARY = '#0f172a';
const TEXT_MUTED = '#64748b';
const BG_WHITE = '#ffffff';
const BG_LIGHT = '#f8fafc';
const BORDER = '#e2e8f0';

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message from Utkarsh Gupta</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BG_LIGHT};-webkit-text-size-adjust:100%;font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:${BG_LIGHT};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;width:100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function logoRow(websiteUrl: string) {
  return `<tr>
    <td align="center" style="padding:0 0 28px;">
      <a href="${websiteUrl}" style="text-decoration:none;display:inline-block;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background-color:${ACCENT};border-radius:10px;padding:9px 20px;
              font-size:18px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;
              font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
              &lt;utkristi /&gt;
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>`;
}

function cardRow(headerBar: string, body: string) {
  return `<tr>
    <td style="background-color:${BG_WHITE};border-radius:12px;
      border:1px solid ${BORDER};overflow:hidden;
      box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <!-- accent bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,${ACCENT},${ACCENT_DARK});"></td></tr>
        <!-- label -->
        <tr>
          <td style="padding:28px 32px 0;">
            ${headerBar}
          </td>
        </tr>
        <!-- body -->
        <tr>
          <td style="padding:16px 32px 32px;">
            ${body}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function footerRow(websiteUrl: string, toEmail: string) {
  return `<tr>
    <td align="center" style="padding:24px 0 0;">
      <p style="margin:0 0 6px;font-size:12px;color:${TEXT_MUTED};font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
        You are receiving this email because you contacted
        <a href="${websiteUrl}" style="color:${ACCENT};text-decoration:none;">${websiteUrl}</a>.
      </p>
      <p style="margin:0;font-size:12px;color:#94a3b8;font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
        To stop receiving replies,
        <a href="mailto:${toEmail}?subject=Unsubscribe from Utkristi replies"
          style="color:${ACCENT};text-decoration:underline;">click here to unsubscribe</a>.
      </p>
      <p style="margin:14px 0 0;font-size:11px;color:#cbd5e1;font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
        &copy; ${new Date().getFullYear()} Utkarsh Gupta &mdash; All rights reserved
      </p>
    </td>
  </tr>`;
}

/**
 * Branded reply email sent from admin to the person who contacted.
 */
export function buildReplyEmailHtml({
  recipientName,
  message,
  adminName = 'Utkarsh Gupta',
  adminTitle = 'Full-Stack Developer & Designer',
  websiteUrl = 'https://utkristi.com',
  replyToEmail = 'utkarshofficial1912@gmail.com',
}: {
  recipientName: string;
  message: string;
  adminName?: string;
  adminTitle?: string;
  websiteUrl?: string;
  replyToEmail?: string;
}) {
  const messageHtml = message
    .split('\n')
    .map(line => `<p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${TEXT_PRIMARY};">${line || '&nbsp;'}</p>`)
    .join('');

  const header = `<p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;
    letter-spacing:1.5px;color:${ACCENT};">Personal reply</p>
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${TEXT_PRIMARY};
    font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
    Hi ${recipientName},
  </h1>`;

  const body = `
    <!-- quoted message -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="border-left:3px solid ${ACCENT};padding:12px 16px;background-color:#f8f7ff;border-radius:0 6px 6px 0;">
          ${messageHtml}
        </td>
      </tr>
    </table>

    <!-- divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr><td style="height:1px;background-color:${BORDER};"></td></tr>
    </table>

    <!-- signature -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="width:44px;height:44px;border-radius:50%;background-color:${ACCENT};
          text-align:center;vertical-align:middle;font-size:18px;font-weight:800;color:#fff;
          font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;padding-right:14px;">
          U
        </td>
        <td style="vertical-align:middle;padding-left:14px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:${TEXT_PRIMARY};">${adminName}</p>
          <p style="margin:2px 0 0;font-size:12px;color:${TEXT_MUTED};">${adminTitle}</p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr>
        <td style="border-radius:8px;background-color:${ACCENT};">
          <a href="${websiteUrl}" style="display:inline-block;padding:11px 24px;
            font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;
            font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
            Visit My Portfolio &rarr;
          </a>
        </td>
      </tr>
    </table>`;

  const content = `
    ${logoRow(websiteUrl)}
    ${cardRow(header, body)}
    ${footerRow(websiteUrl, replyToEmail)}
  `;

  return emailWrapper(content);
}

/**
 * Admin notification email sent when someone fills in the contact form.
 */
export function buildContactNotificationHtml({
  senderName,
  senderEmail,
  message,
  websiteUrl = 'https://utkristi.com',
}: {
  senderName: string;
  senderEmail: string;
  message: string;
  websiteUrl?: string;
}) {
  const messageHtml = message
    .split('\n')
    .map(line => `<p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${TEXT_PRIMARY};">${line || '&nbsp;'}</p>`)
    .join('');

  const header = `<p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;
    letter-spacing:1.5px;color:#e11d48;">New inquiry</p>
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${TEXT_PRIMARY};
    font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
    Message from ${senderName}
  </h1>`;

  const body = `
    <!-- sender info pill -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:${BG_LIGHT};border:1px solid ${BORDER};border-radius:8px;padding:12px 16px;">
          <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;
            letter-spacing:1px;color:${TEXT_MUTED};">From</p>
          <p style="margin:4px 0 0;font-size:14px;color:${TEXT_PRIMARY};">
            <strong>${senderName}</strong> &bull;
            <a href="mailto:${senderEmail}" style="color:${ACCENT};text-decoration:none;">${senderEmail}</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- message -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="border-left:3px solid #e11d48;padding:12px 16px;
          background-color:#fff1f2;border-radius:0 6px 6px 0;">
          ${messageHtml}
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-radius:8px;background-color:${ACCENT};">
          <a href="${websiteUrl}/admin?tab=contacts" style="display:inline-block;padding:11px 24px;
            font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;
            font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
            Open Admin Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>`;

  const content = `
    ${logoRow(websiteUrl)}
    ${cardRow(header, body)}
    <tr>
      <td align="center" style="padding:24px 0 0;">
        <p style="margin:0;font-size:12px;color:#94a3b8;font-family:ui-sans-serif,'Helvetica Neue',Arial,sans-serif;">
          This is an automated notification from your portfolio contact form.
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content);
}
