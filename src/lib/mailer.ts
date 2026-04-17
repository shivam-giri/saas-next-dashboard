import nodemailer from "nodemailer";

// Singleton transporter — re-used across hot-reloads in development.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendInvitationEmailOptions {
  toEmail: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
}

export async function sendInvitationEmail({
  toEmail,
  workspaceName,
  inviterName,
  role,
  inviteUrl,
}: SendInvitationEmailOptions) {
  const roleBadge = role === "ADMIN" ? "Admin" : "Member";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>You're invited to ${workspaceName}</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:36px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                    You're invited to join a workspace
                  </h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                    Hi there 👋
                  </p>
                  <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                    <strong>${inviterName}</strong> has invited you to join
                    <strong>${workspaceName}</strong> as a
                    <span style="display:inline-block;background:#ede9fe;color:#5b21b6;font-size:12px;font-weight:700;padding:2px 8px;border-radius:99px;vertical-align:middle;">${roleBadge}</span>.
                  </p>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                    <tr>
                      <td style="border-radius:8px;background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);">
                        <a href="${inviteUrl}"
                           target="_blank"
                           style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.1px;">
                          Accept Invitation →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.5;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin:0 0 28px;word-break:break-all;">
                    <a href="${inviteUrl}" style="color:#6366f1;font-size:13px;">${inviteUrl}</a>
                  </p>

                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

                  <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    This invitation expires in <strong>7 days</strong>. If you didn't expect this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                    Sent via <strong>${workspaceName}</strong> on SaaS Dashboard
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${workspaceName}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${inviterName} invited you to join ${workspaceName}`,
    html,
  });
}
