import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, gte, sql } from 'drizzle-orm';
import { sessions, licenses, subscriptions } from '@aria/db';
import { PLAN_LIMITS, normalizePlan } from '@aria/shared';
import { Errors } from '../lib/errors.js';
import { verifyDeviceJwt } from '../lib/jwt.js';

const StartSchema = z.object({
  type: z.enum(['interview', 'coding']).default('interview'),
});

const EndSchema = z.object({
  sessionId: z.string().uuid(),
});

export async function sessionRoutes(fastify: FastifyInstance) {
  // POST /v1/session/start — called when user presses Start in the desktop app
  fastify.post('/v1/session/start', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    const body = StartSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { type } = body.data;

    // Resolve plan
    const [license] = await fastify.db.select().from(licenses).where(eq(licenses.id, payload.licenseId)).limit(1);
    if (!license || license.revokedAt) throw Errors.licenseRevoked();

    const sub = license.subscriptionId
      ? await fastify.db.select().from(subscriptions).where(eq(subscriptions.id, license.subscriptionId)).limit(1).then((r) => r[0])
      : null;
    const plan = normalizePlan(sub?.plan);
    const limits = PLAN_LIMITS[plan];

    // Count sessions this month
    const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nextPeriodStart = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    if (type === 'interview' && limits.callsPerMonth !== -1) {
      const [result] = await fastify.db
        .select({ count: sql<number>`count(*)` })
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, payload.sub),
            eq(sessions.type, 'interview'),
            gte(sessions.startedAt, periodStart),
          ),
        );
      const used = Number(result?.count ?? 0);
      if (used >= limits.callsPerMonth) {
        throw Errors.callLimitExceeded(nextPeriodStart.toISOString());
      }
    }

    if (type === 'coding' && limits.codingSessionsPerMonth !== -1) {
      const [result] = await fastify.db
        .select({ count: sql<number>`count(*)` })
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, payload.sub),
            eq(sessions.type, 'coding'),
            gte(sessions.startedAt, periodStart),
          ),
        );
      const used = Number(result?.count ?? 0);
      if (used >= limits.codingSessionsPerMonth) {
        throw Errors.callLimitExceeded(nextPeriodStart.toISOString());
      }
    }

    const [session] = await fastify.db.insert(sessions).values({
      userId: payload.sub,
      deviceId: payload.deviceId,
      type,
    }).returning();

    if (!session) throw Errors.internal('Failed to create session');

    return reply.status(201).send({
      sessionId: session.id,
      plan,
      limits,
    });
  });

  // POST /v1/session/end — called when user presses End in the desktop app
  fastify.post('/v1/session/end', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    const body = EndSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const [session] = await fastify.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, body.data.sessionId), eq(sessions.userId, payload.sub)))
      .limit(1);

    if (!session) throw Errors.notFound('Session not found');

    await fastify.db
      .update(sessions)
      .set({ endedAt: new Date() })
      .where(eq(sessions.id, session.id));

    return reply.send({ ok: true, answerCount: session.answerCount });
  });
}
