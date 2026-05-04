import type { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { subscriptions, licenses, invoices, profiles } from '@aria/db';
import { generateLicenseKey } from '../../lib/crypto.js';
import { emailService } from '../../services/email.js';
import { Errors } from '../../lib/errors.js';

function verifyPaddleSignature(body: string, signature: string, secret: string): boolean {
  const parts = signature.split(';');
  const tsPart = parts.find((p) => p.startsWith('ts='))?.replace('ts=', '') ?? '';
  const h1 = parts.find((p) => p.startsWith('h1='))?.replace('h1=', '') ?? '';
  const signed = `${tsPart}:${body}`;
  const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
}

export async function paddleWebhookRoute(fastify: FastifyInstance) {
  fastify.post('/v1/webhook/paddle', {
    config: { rawBody: true },
  }, async (req, reply) => {
    const sig = req.headers['paddle-signature'] as string | undefined;
    const secret = process.env['PADDLE_WEBHOOK_SECRET'];

    if (sig && secret) {
      const rawBody = (req as unknown as { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
      if (!verifyPaddleSignature(rawBody, sig, secret)) {
        throw Errors.validation('Invalid Paddle signature');
      }
    }

    const event = req.body as {
      event_type: string;
      data: Record<string, unknown>;
    };

    fastify.log.info({ eventType: event.event_type }, 'Paddle webhook received');

    switch (event.event_type) {
      case 'subscription.created':
        await handleSubCreated(fastify, event.data);
        break;
      case 'subscription.updated':
        await handleSubUpdated(fastify, event.data);
        break;
      case 'subscription.canceled':
        await handleSubCanceled(fastify, event.data);
        break;
      case 'transaction.completed':
        await handleTransactionCompleted(fastify, event.data);
        break;
      case 'transaction.refunded':
        await handleRefund(fastify, event.data);
        break;
    }

    return reply.send({ ok: true });
  });
}

async function handleSubCreated(fastify: FastifyInstance, data: Record<string, unknown>) {
  const customData = data['custom_data'] as { userId?: string; plan?: string } | undefined;
  const userId = customData?.userId;
  const plan = customData?.plan ?? 'starter';

  if (!userId) return;

  const periodEnd = new Date((data['current_billing_period'] as { ends_at: string })?.ends_at ?? Date.now() + 30 * 86400000);

  const [sub] = await fastify.db.insert(subscriptions).values({
    userId,
    plan: plan as 'starter' | 'pro' | 'pro_annual',
    status: 'active',
    paddleSubscriptionId: data['id'] as string,
    currentPeriodEnd: periodEnd,
  }).returning();

  const licenseKey = generateLicenseKey();
  await fastify.db.insert(licenses).values({
    userId,
    subscriptionId: sub?.id ?? null,
    key: licenseKey,
    maxDevices: 1,
    expiresAt: periodEnd,
  });

  await emailService.sendLicenseDelivery(userId, licenseKey).catch((e) => fastify.log.error(e));

  fastify.posthog?.capture({ distinctId: userId, event: 'paid_subscription_started', properties: { plan } });
}

async function handleSubUpdated(fastify: FastifyInstance, data: Record<string, unknown>) {
  const paddleId = data['id'] as string;
  const periodEnd = new Date((data['current_billing_period'] as { ends_at: string })?.ends_at ?? 0);
  const status = data['status'] as string;

  await fastify.db.update(subscriptions).set({
    currentPeriodEnd: periodEnd,
    status: status as 'active' | 'past_due' | 'canceled',
    updatedAt: new Date(),
  }).where(eq(subscriptions.paddleSubscriptionId, paddleId));
}

async function handleSubCanceled(fastify: FastifyInstance, data: Record<string, unknown>) {
  const paddleId = data['id'] as string;
  await fastify.db.update(subscriptions).set({
    cancelAtPeriodEnd: true,
    status: 'canceled',
    updatedAt: new Date(),
  }).where(eq(subscriptions.paddleSubscriptionId, paddleId));

  fastify.posthog?.capture({ distinctId: paddleId, event: 'subscription_canceled' });
}

async function handleTransactionCompleted(fastify: FastifyInstance, data: Record<string, unknown>) {
  const customData = data['custom_data'] as { userId?: string } | undefined;
  const userId = customData?.userId;
  if (!userId) return;

  const amountCents = Math.round(parseFloat((data['details'] as { totals: { total: string } })?.totals?.total ?? '0') * 100);

  await fastify.db.insert(invoices).values({
    userId,
    paddleInvoiceId: data['id'] as string,
    amountUsd: amountCents,
    status: 'paid',
    paidAt: new Date(),
    raw: data,
  }).onConflictDoNothing();
}

async function handleRefund(fastify: FastifyInstance, data: Record<string, unknown>) {
  const paddleId = data['id'] as string;

  await fastify.db.update(invoices).set({ status: 'refunded' }).where(eq(invoices.paddleInvoiceId, paddleId));

  const customData = data['custom_data'] as { userId?: string } | undefined;
  const userId = customData?.userId;
  if (!userId) return;

  const userLicenses = await fastify.db.select().from(licenses).where(eq(licenses.userId, userId));
  for (const lic of userLicenses) {
    await fastify.db.update(licenses).set({ revokedAt: new Date() }).where(eq(licenses.id, lic.id));
  }

  fastify.posthog?.capture({ distinctId: userId, event: 'refund_processed' });
}
