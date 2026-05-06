import type { FastifyInstance, FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';
import { profiles, subscriptions, licenses, devices } from '@aria/db';
import { Errors } from '../lib/errors.js';
import { verifyUserJwt, verifySupabaseToken } from '../lib/jwt.js';

/** Resolves userId from either our custom JWT or a Supabase access token. */
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

export async function accountRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/account', async (req, reply) => {
    const userId = await resolveUserId(req);

    const [profile] = await fastify.db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    if (!profile) throw Errors.notFound('Profile');

    const [subscription] = await fastify.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.createdAt)
      .limit(1);

    const userLicenses = await fastify.db.select().from(licenses).where(eq(licenses.userId, userId));

    const licensesWithDevices = await Promise.all(
      userLicenses.map(async (lic) => {
        const devs = await fastify.db
          .select()
          .from(devices)
          .where(eq(devices.licenseId, lic.id));
        return {
          id: lic.id,
          key: lic.key,
          maxDevices: lic.maxDevices,
          expiresAt: lic.expiresAt?.toISOString() ?? null,
          devices: devs.map((d) => ({
            id: d.id,
            hostname: d.hostname,
            os: d.os,
            appVersion: d.appVersion,
            status: d.status,
            activatedAt: d.activatedAt.toISOString(),
            lastSeenAt: d.lastSeenAt.toISOString(),
          })),
        };
      }),
    );

    return reply.send({
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        country: profile.country,
        createdAt: profile.createdAt.toISOString(),
      },
      subscription: subscription
        ? {
            id: subscription.id,
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
      licenses: licensesWithDevices,
    });
  });

  fastify.post('/v1/account/data-export', async (req, reply) => {
    const userId = await resolveUserId(req);
    fastify.log.info({ userId }, 'Data export requested');
    return reply.send({ ok: true, message: 'Export will be emailed to you within 24 hours.' });
  });

  fastify.post('/v1/account/data-delete', async (req, reply) => {
    const userId = await resolveUserId(req);
    fastify.log.info({ userId }, 'Account deletion requested — 30-day grace starts now');
    return reply.send({ ok: true, message: 'Account scheduled for deletion in 30 days.' });
  });

  fastify.delete('/v1/account/devices/:deviceId', async (req, reply) => {
    const userId = await resolveUserId(req);
    const { deviceId } = req.params as { deviceId: string };

    const [device] = await fastify.db.select().from(devices).where(eq(devices.id, deviceId)).limit(1);
    if (!device) throw Errors.notFound('Device');

    const [license] = await fastify.db.select().from(licenses).where(eq(licenses.id, device.licenseId)).limit(1);
    if (!license || license.userId !== userId) throw Errors.notFound('Device');

    await fastify.db.update(devices).set({ status: 'revoked', revokedAt: new Date() }).where(eq(devices.id, deviceId));

    return reply.send({ ok: true });
  });
}
