import type { FastifyInstance } from 'fastify';
import { eq, and, gte, lt, sql } from 'drizzle-orm';
import { usageLog } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';
import { Errors } from '../lib/errors.js';
import { verifyUserJwt, verifyDeviceJwt } from '../lib/jwt.js';

export async function usageRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/usage', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let userId: string;
    let plan: Plan = 'trial';

    try {
      const payload = verifyUserJwt(auth.replace('Bearer ', ''));
      userId = payload.sub;
    } catch {
      try {
        const devicePayload = verifyDeviceJwt(auth.replace('Bearer ', ''));
        userId = devicePayload.sub;
        plan = devicePayload.plan;
      } catch {
        throw Errors.authExpired();
      }
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalResult] = await fastify.db
      .select({ count: sql<number>`count(*)` })
      .from(usageLog)
      .where(and(eq(usageLog.userId, userId), gte(usageLog.ts, periodStart)));

    const used = Number(totalResult?.count ?? 0);

    // Build by-day for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyRows = await fastify.db
      .select({
        date: sql<string>`date_trunc('day', ${usageLog.ts})::date`,
        count: sql<number>`count(*)`,
      })
      .from(usageLog)
      .where(and(eq(usageLog.userId, userId), gte(usageLog.ts, thirtyDaysAgo)))
      .groupBy(sql`date_trunc('day', ${usageLog.ts})::date`);

    return reply.send({
      period: {
        start: periodStart.toISOString().split('T')[0],
        end: periodEnd.toISOString().split('T')[0],
      },
      used,
      limit: PLAN_LIMITS[plan].perMonth,
      byDay: dailyRows.map((r) => ({ date: r.date, count: Number(r.count) })),
    });
  });
}
