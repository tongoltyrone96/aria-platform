import { createHmac } from 'node:crypto';
import type { Plan } from '@aria/shared';

const PRICE_MAP: Record<string, string> = {
  starter: process.env['PADDLE_PRICE_STARTER'] ?? '',
  pro: process.env['PADDLE_PRICE_PRO'] ?? '',
  pro_annual: process.env['PADDLE_PRICE_PRO_ANNUAL'] ?? '',
  lifetime: process.env['PADDLE_PRICE_LIFETIME'] ?? '',
};

export function getPaddlePriceId(plan: string): string {
  const priceId = PRICE_MAP[plan];
  if (!priceId) throw new Error(`No price ID for plan: ${plan}`);
  return priceId;
}

export async function createPaddleCheckout(
  userId: string,
  userEmail: string,
  plan: string,
  successUrl: string,
): Promise<string> {
  const apiKey = process.env['PADDLE_API_KEY']!;
  const priceId = getPaddlePriceId(plan);

  const res = await fetch('https://api.paddle.com/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: { userId, plan },
      checkout: { url: successUrl },
    }),
  });

  if (!res.ok) throw new Error(`Paddle checkout failed: ${await res.text()}`);

  const data = await res.json() as { data: { checkout?: { url?: string } } };
  const url = data.data?.checkout?.url;
  if (!url) throw new Error('No checkout URL from Paddle');
  return url;
}

export async function createPaddlePortalUrl(paddleCustomerId: string): Promise<string> {
  const apiKey = process.env['PADDLE_API_KEY']!;

  const res = await fetch(`https://api.paddle.com/customers/${paddleCustomerId}/portal-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) throw new Error(`Paddle portal failed: ${await res.text()}`);

  const data = await res.json() as { data: { urls?: { general?: { overview?: string } } } };
  return data.data?.urls?.general?.overview ?? 'https://customer.paddle.com';
}

export function verifyPaddleWebhook(body: string, signature: string, secret: string): boolean {
  const [tsPart, h1Part] = signature.split(';');
  const ts = tsPart?.replace('ts=', '') ?? '';
  const h1 = h1Part?.replace('h1=', '') ?? '';

  const signed = `${ts}:${body}`;
  const expected = createHmac('sha256', secret).update(signed).digest('hex');
  return expected === h1;
}
