import crypto from 'crypto';

export function generateLicenseKey(): string {
  return `sk_live_${crypto.randomBytes(16).toString('hex')}`;
}

export function generateReferralCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}
