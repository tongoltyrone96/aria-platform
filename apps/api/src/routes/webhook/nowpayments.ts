import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { subscriptions, licenses, cryptoPayments } from '@aria/db';
import type { Plan } from '@aria/shared';
import { generateLicenseKey } from '../../lib/crypto.js';
import { Errors } from '../../lib/errors.js';
import { verifyNowPaymentsIpn } from '../../services/nowpayments.js';

const TERMINAL_STATUSES = new Set(['finished', 'confirmed']);

const DAYS_MS = 24 * 60 * 60 * 1000;

function resolvePlan(plan: string): { dbPlan: Plan; expiresAt: Date } {
  const now = Date.now();
  switch (plan) {
    case 'pro_yearly':    return { dbPlan: 'pro_annual',    expiresAt: new Date(now + 365 * DAYS_MS) };
    case 'elite_monthly': return { dbPlan: 'elite',         expiresAt: new Date(now + 30  * DAYS_MS) };
    case 'elite_yearly':  return { dbPlan: 'elite_annual',  expiresAt: new Date(now + 365 * DAYS_MS) };
    default:              return { dbPlan: 'pro',           expiresAt: new Date(now + 30  * DAYS_MS) };
  }
}

export async function nowpaymentsWebhookRoute(fastify: FastifyInstance) {
  // Handle GET requests with a friendly message
  fastify.get('/webhook/nowpayments', async (_req, reply) => {
    return reply.status(200).send({
      message: 'NOWPayments Webhook Endpoint',
      method: 'POST only',
      status: 'operational',
      documentation: 'https://documenter.getpostman.com/view/7907941/S1a32n38',
    });
  });

  fastify.post('/webhook/nowpayments', async (req, reply) => {
    const body = req.body as Record<string, unknown>;
    const sig = req.headers['x-nowpayments-sig'] as string | undefined;

    if (sig) {
      if (!verifyNowPaymentsIpn(body, sig)) {
        fastify.log.warn('NOWPayments IPN signature mismatch — rejecting');
        throw Errors.validation('Invalid IPN signature');
      }
    } else {
      fastify.log.warn('NOWPayments IPN received without signature header');
    }

    const paymentId = String(body['payment_id'] ?? '');
    const status = String(body['payment_status'] ?? '');
    const orderId = String(body['order_id'] ?? '');

    fastify.log.info({ paymentId, status, orderId }, 'NOWPayments IPN received');

    // Only act on terminal payment statuses
    if (!TERMINAL_STATUSES.has(status)) {
      fastify.log.info({ paymentId, status }, 'NOWPayments IPN — non-terminal status, skipping');
      return reply.send({ ok: true });
    }

    if (!paymentId) {
      fastify.log.error({ body }, 'NOWPayments IPN missing payment_id');
      return reply.send({ ok: true });
    }

    // Prevent duplicate processing — check if already handled
    const [existing] = await fastify.db
      .select({ id: cryptoPayments.id, status: cryptoPayments.status })
      .from(cryptoPayments)
      .where(eq(cryptoPayments.nowpaymentsId, paymentId))
      .limit(1);

    if (existing && TERMINAL_STATUSES.has(existing.status)) {
      fastify.log.info({ paymentId }, 'NOWPayments IPN duplicate — already processed');
      return reply.send({ ok: true });
    }

    // orderId format: {userId}__{plan}__{timestamp}
    const [userId, plan] = orderId.split('__');
    if (!userId || !plan) {
      fastify.log.error({ orderId }, 'NOWPayments IPN — cannot parse userId/plan from order_id');
      return reply.send({ ok: true });
    }

    const { dbPlan, expiresAt } = resolvePlan(plan);
    const amountUsd = Math.round(parseFloat(String(body['price_amount'] ?? '0')));

    // Upsert payment record
    await fastify.db
      .insert(cryptoPayments)
      .values({ userId, nowpaymentsId: paymentId, plan, status, amountUsd, raw: body })
      .onConflictDoUpdate({
        target: cryptoPayments.nowpaymentsId,
        set: { status, raw: body, updatedAt: new Date() },
      });

    // Update or create subscription
    const [existingSub] = await fastify.db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSub) {
      await fastify.db
        .update(subscriptions)
        .set({ plan: dbPlan, status: 'active', currentPeriodEnd: expiresAt, cancelAtPeriodEnd: false, updatedAt: new Date() })
        .where(eq(subscriptions.userId, userId));
    } else {
      await fastify.db
        .insert(subscriptions)
        .values({ userId, plan: dbPlan, status: 'active', currentPeriodEnd: expiresAt });
    }

    // Update existing license expiry, or create a new one
    const userLicenses = await fastify.db
      .select({ id: licenses.id })
      .from(licenses)
      .where(eq(licenses.userId, userId));

    if (userLicenses.length > 0) {
      for (const lic of userLicenses) {
        await fastify.db
          .update(licenses)
          .set({ expiresAt, revokedAt: null })
          .where(eq(licenses.id, lic.id));
      }
    } else {
      const [sub] = await fastify.db
        .select({ id: subscriptions.id })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      await fastify.db.insert(licenses).values({
        userId,
        subscriptionId: sub?.id ?? null,
        key: generateLicenseKey(),
        maxDevices: 1,
        expiresAt,
      });
    }

    fastify.log.info({ userId, dbPlan, expiresAt, paymentId }, 'NOWPayments subscription activated');
    fastify.posthog?.capture({
      distinctId: userId,
      event: 'crypto_payment_completed',
      properties: { plan, dbPlan, paymentId },
    });

    return reply.send({ ok: true });
  });
}
