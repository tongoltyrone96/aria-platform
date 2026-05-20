import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../lib/errors.js';
import { verifyUserJwt, verifySupabaseToken } from '../../lib/jwt.js';
import { createNowPaymentsInvoice } from '../../services/nowpayments.js';

const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
  pro_monthly:   { amount: 17.99,  label: 'ARIA Pro — Monthly' },
  pro_yearly:    { amount: 190.03, label: 'ARIA Pro — Annual' },
  elite_monthly: { amount: 1,      label: 'ARIA Elite — Monthly' }, // TEMP: Testing - Original: 27.99
  elite_yearly:  { amount: 12,     label: 'ARIA Elite — Annual' },  // TEMP: Testing - Original: 295.56
};

const CreateCryptoSchema = z.object({
  plan: z.enum(['pro_monthly', 'pro_yearly', 'elite_monthly', 'elite_yearly']),
});

async function resolveUserId(req: FastifyRequest): Promise<string> {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();
  const token = auth.replace('Bearer ', '');
  try {
    return verifyUserJwt(token).sub;
  } catch {
    const id = await verifySupabaseToken(token);
    if (!id) throw Errors.authExpired();
    return id;
  }
}

export async function cryptoPaymentRoutes(fastify: FastifyInstance) {
  fastify.post('/api/payments/crypto/create', async (req, reply) => {
    const userId = await resolveUserId(req);

    const body = CreateCryptoSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { plan } = body.data;
    const price = PLAN_PRICES[plan]!;

    const webUrl = process.env['NEXT_PUBLIC_WEB_URL'] ?? 'https://www.ariainterview.com';
    const apiUrl = process.env['API_URL'] ?? 'https://api.ariainterview.com';

    // orderId encodes userId and plan; parsed by the IPN webhook
    const orderId = `${userId}__${plan}__${Date.now()}`;

    fastify.log.info({ userId, plan, amount: price.amount }, 'Creating NOWPayments invoice');

    try {
      const invoice = await createNowPaymentsInvoice({
        priceAmount: price.amount,
        priceCurrency: 'usd',
        orderId,
        orderDescription: price.label,
        ipnCallbackUrl: `${apiUrl}/webhook/nowpayments`,
        successUrl: `${webUrl}/dashboard?checkout=success&provider=crypto`,
        cancelUrl: `${webUrl}/pricing`,
      });

      fastify.log.info({ userId, invoiceId: invoice.id, plan }, 'NOWPayments invoice created');

      return reply.status(201).send({ paymentUrl: invoice.invoiceUrl });
    } catch (e) {
      fastify.log.error({ userId, plan, err: String(e) }, 'Failed to create NOWPayments invoice');
      throw Errors.internal('Failed to create crypto payment');
    }
  });
}
