import type { FastifyInstance } from 'fastify';
import { eq, and, gte, sql } from 'drizzle-orm';
import { devices, licenses, subscriptions, usageLog } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';
import { Errors } from '../../lib/errors.js';
import { verifyDeviceJwt } from '../../lib/jwt.js';

export async function statusRoute(fastify: FastifyInstance) {
  fastify.get('/status', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    const [device] = await fastify.db.select().from(devices).where(eq(devices.id, payload.deviceId)).limit(1);
    if (!device || device.status !== 'active') throw Errors.licenseRevoked();

    const [license] = await fastify.db.select().from(licenses).where(eq(licenses.id, payload.licenseId)).limit(1);
    if (!license) throw Errors.notFound('License');

    const sub = license.subscriptionId
      ? await fastify.db.select().from(subscriptions).where(eq(subscriptions.id, license.subscriptionId)).limit(1).then((r) => r[0])
      : null;
    const plan = (sub?.plan ?? 'trial') as Plan;
    const limits = PLAN_LIMITS[plan];

    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const [usageResult] = await fastify.db
      .select({ count: sql<number>`count(*)` })
      .from(usageLog)
      .where(and(eq(usageLog.userId, payload.sub), gte(usageLog.ts, periodStart)));

    const used = Number(usageResult?.count ?? 0);

    return reply.send({ plan, limits, used, expiresAt: license.expiresAt?.toISOString() ?? null });
  });
}
