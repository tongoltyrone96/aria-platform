import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { profiles, subscriptions } from '@aria/db';
import { Errors } from '../lib/errors.js';
import { verifyUserJwt } from '../lib/jwt.js';
import { createPaddleCheckout, createPaddlePortalUrl } from '../services/paddle.js';

const CheckoutSchema = z.object({
  plan: z.enum(['starter', 'pro', 'pro_annual', 'lifetime']),
  provider: z.enum(['paddle', 'stripe']).optional().default('paddle'),
});

export async function billingRoutes(fastify: FastifyInstance) {
  fastify.post('/v1/billing/checkout', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let userId: string, email: string;
    try {
      const payload = verifyUserJwt(auth.replace('Bearer ', ''));
      userId = payload.sub;
      email = payload.email;
    } catch {
      throw Errors.authExpired();
    }

    const body = CheckoutSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { plan } = body.data;
    const successUrl = `${process.env['NEXT_PUBLIC_WEB_URL'] ?? 'https://www.aria-ai.com'}/dashboard?checkout=success`;

    try {
      const checkoutUrl = await createPaddleCheckout(userId, email, plan, successUrl);
      return reply.send({ checkoutUrl });
    } catch (e) {
      throw Errors.internal(String(e));
    }
  });

  fastify.post('/v1/billing/portal', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let userId: string;
    try {
      const payload = verifyUserJwt(auth.replace('Bearer ', ''));
      userId = payload.sub;
    } catch {
      throw Errors.authExpired();
    }

    const [sub] = await fastify.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!sub?.paddleSubscriptionId) {
      return reply.send({ portalUrl: 'https://customer.paddle.com' });
    }

    // Get customer ID from subscription
    const apiKey = process.env['PADDLE_API_KEY']!;
    const res = await fetch(`https://api.paddle.com/subscriptions/${sub.paddleSubscriptionId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) return reply.send({ portalUrl: 'https://customer.paddle.com' });

    const data = await res.json() as { data?: { customer_id?: string } };
    const customerId = data.data?.customer_id;

    if (!customerId) return reply.send({ portalUrl: 'https://customer.paddle.com' });

    const portalUrl = await createPaddlePortalUrl(customerId);
    return reply.send({ portalUrl });
  });
}
