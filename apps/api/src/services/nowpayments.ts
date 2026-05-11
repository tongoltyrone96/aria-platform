import crypto from 'crypto';

const API_BASE = 'https://api.nowpayments.io/v1';

interface InvoiceOptions {
  priceAmount: number;
  priceCurrency: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}

interface InvoiceResult {
  invoiceUrl: string;
  id: string;
}

export async function createNowPaymentsInvoice(opts: InvoiceOptions): Promise<InvoiceResult> {
  const apiKey = process.env['NOWPAYMENTS_API_KEY'];
  if (!apiKey) throw new Error('NOWPAYMENTS_API_KEY is not configured');

  const res = await fetch(`${API_BASE}/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      price_amount: opts.priceAmount,
      price_currency: opts.priceCurrency,
      order_id: opts.orderId,
      order_description: opts.orderDescription,
      ipn_callback_url: opts.ipnCallbackUrl,
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NOWPayments API error ${res.status}: ${text}`);
  }

  const data = await res.json() as { invoice_url: string; id: string };
  if (!data.invoice_url) throw new Error('NOWPayments returned no invoice_url');

  return { invoiceUrl: data.invoice_url, id: data.id };
}

export function verifyNowPaymentsIpn(
  payload: Record<string, unknown>,
  signature: string,
): boolean {
  const secret = process.env['NOWPAYMENTS_IPN_SECRET'];
  if (!secret) return false;

  const sorted = JSON.stringify(
    Object.keys(payload)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = payload[k];
        return acc;
      }, {}),
  );

  const expected = crypto.createHmac('sha512', secret).update(sorted).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
