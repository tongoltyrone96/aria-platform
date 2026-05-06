import { Resend } from 'resend';
import { eq } from 'drizzle-orm';
import { profiles, type Db } from '@aria/db';

const resend = new Resend(process.env['RESEND_API_KEY'] ?? 'placeholder_disabled');
const FROM = process.env['EMAIL_FROM'] ?? 'ARIA <noreply@ariainterview.com>';
const WEB_URL = process.env['NEXT_PUBLIC_WEB_URL'] ?? 'https://www.ariainterview.com';
const CDN_URL = process.env['NEXT_PUBLIC_CDN_URL'] ?? 'https://cdn.ariainterview.com';

function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;background:#f6f6f6;margin:0;padding:0">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#1F6FEB;padding:24px;border-radius:8px 8px 0 0;text-align:center">
      <h1 style="color:white;margin:0;font-size:28px;font-weight:800">ARIA</h1>
    </div>
    <div style="background:white;padding:32px;border-radius:0 0 8px 8px">
      ${body}
    </div>
    <p style="text-align:center;font-size:12px;color:#888;margin-top:24px">
      &copy; 2026 ARIA AI &middot; <a href="${WEB_URL}/privacy">Privacy</a> &middot; <a href="${WEB_URL}/dashboard/settings">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

export const emailService = {
  async sendWelcome(userId: string, email: string) {
    const html = emailLayout('Welcome to ARIA', `
      <h2 style="color:#1F6FEB">Welcome to ARIA!</h2>
      <p>Your 14-day free trial has started. Download ARIA and start your first interview session.</p>
      <a href="${WEB_URL}/dashboard" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Go to Dashboard</a>
      <p style="color:#666;font-size:14px">Need help? Reply to this email or chat at ${WEB_URL}</p>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'Welcome to ARIA — your trial has started', html });
  },

  async sendLicenseDelivery(db: Db, userId: string, licenseKey: string) {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

    const email = profile?.email;
    const name = profile?.fullName ?? 'there';
    if (!email) return;

    const html = emailLayout('Your ARIA License Key', `
      <h2 style="color:#1F6FEB">You're all set, ${name}!</h2>
      <p>Your license key:</p>
      <div style="background:#f0f4f8;padding:16px;border-radius:8px;font-family:monospace;font-size:16px;letter-spacing:0.05em;text-align:center">${licenseKey}</div>
      <p>Save this key — you'll paste it once into ARIA on your computer.</p>
      <a href="${CDN_URL}/releases/ARIA-latest.exe" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Download ARIA for Windows</a>
      <p style="color:#666;font-size:14px">Need help? Reply to this email or visit <a href="${WEB_URL}/docs/license-activation">our docs</a>.</p>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'Your ARIA license key is here', html });
  },

  async sendPasswordReset(email: string, resetUrl: string) {
    const html = emailLayout('Reset Your Password', `
      <h2>Reset your ARIA password</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password</a>
      <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'Reset your ARIA password', html });
  },

  async sendPaymentReceipt(email: string, amountUsd: number, receiptUrl?: string) {
    const amount = (amountUsd / 100).toFixed(2);
    const html = emailLayout('Payment Receipt', `
      <h2>Payment confirmed</h2>
      <p>Thank you for your payment of <strong>$${amount} USD</strong>.</p>
      ${receiptUrl ? `<a href="${receiptUrl}" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">View Receipt</a>` : ''}
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'ARIA payment confirmed', html });
  },

  async sendPaymentFailed(email: string) {
    const html = emailLayout('Payment Failed', `
      <h2 style="color:#e53e3e">Payment failed</h2>
      <p>We couldn't process your payment. Please update your payment method to keep ARIA active.</p>
      <a href="${WEB_URL}/dashboard/billing" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Update Payment Method</a>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'ARIA payment failed — action required', html });
  },

  async sendTrialEnding(email: string, name: string, daysLeft: number) {
    const html = emailLayout('Your trial is ending soon', `
      <h2>Your ARIA trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}</h2>
      <p>Keep access to ARIA and upgrade today. Use code <strong>TRIAL20</strong> for 20% off your first month.</p>
      <a href="${WEB_URL}/pricing" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Choose a Plan</a>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: `Your ARIA trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, html });
  },

  async sendWinback(email: string) {
    const html = emailLayout('We miss you', `
      <h2>Come back to ARIA</h2>
      <p>We noticed you cancelled your subscription. We'd love to have you back.</p>
      <p>Use code <strong>BACK50</strong> for 50% off your first month when you resubscribe.</p>
      <a href="${WEB_URL}/pricing" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Resubscribe</a>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: '50% off to come back to ARIA', html });
  },

  async sendEmailVerification(email: string, verificationLink: string) {
    const html = emailLayout('Verify your ARIA email', `
      <h2>Verify your email address</h2>
      <p>Click the button below to verify your email and activate your 14-day free trial.</p>
      <a href="${verificationLink}" style="display:inline-block;background:#1F6FEB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Verify Email</a>
      <p style="color:#666;font-size:14px">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'Verify your ARIA email address', html });
  },

  async sendDeviceActivated(email: string, hostname: string, os: string) {
    const html = emailLayout('New device activated', `
      <h2>New device activated on your ARIA account</h2>
      <p><strong>${hostname}</strong> (${os}) was just activated with your license.</p>
      <p>If this wasn't you, <a href="${WEB_URL}/dashboard/devices">revoke this device immediately</a>.</p>
    `);
    await resend.emails.send({ from: FROM, to: email, subject: 'New ARIA device activated', html });
  },
};
