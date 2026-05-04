import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { devices, licenses, subscriptions } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';
import { Errors } from '../../lib/errors.js';
import { verifyDeviceJwt, signDeviceJwt } from '../../lib/jwt.js';

const HeartbeatSchema = z.object({
  appVersion: z.string().optional(),
});

export async function heartbeatRoute(fastify: FastifyInstance) {
  fastify.post('/heartbeat', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    const body = HeartbeatSchema.safeParse(req.body);

    const [device] = await fastify.db.select().from(devices).where(eq(devices.id, payload.deviceId)).limit(1);
    if (!device || device.status !== 'active') throw Errors.licenseRevoked();

    await fastify.db.update(devices).set({
      lastSeenAt: new Date(),
      ...(body.success && body.data.appVersion ? { appVersion: body.data.appVersion } : {}),
    }).where(eq(devices.id, device.id));

    const [license] = await fastify.db.select().from(licenses).where(eq(licenses.id, payload.licenseId)).limit(1);
    if (!license || license.revokedAt) throw Errors.licenseRevoked();

    const sub = license.subscriptionId
      ? await fastify.db.select().from(subscriptions).where(eq(subscriptions.id, license.subscriptionId)).limit(1).then((r) => r[0])
      : null;
    const plan = (sub?.plan ?? 'trial') as Plan;

    // Renew JWT if < 24h to expiry
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = payload.exp - now;
    const newJwt = timeLeft < 86400
      ? signDeviceJwt(payload.sub, payload.deviceId, payload.licenseId, plan, payload.hwFingerprint)
      : undefined;

    return reply.send({ jwt: newJwt, plan, status: 'active', limits: PLAN_LIMITS[plan] });
  });
}
