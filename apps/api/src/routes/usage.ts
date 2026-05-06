import type { FastifyInstance } from 'fastify';
import { eq, and, gte, sql } from 'drizzle-orm';
import { usageLog, sessions } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';
import { Errors } from '../lib/errors.js';
import { verifyUserJwt, verifyDeviceJwt } from '../lib/jwt.js';

export async function usageRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/usage', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let userId: string;
    let plan: Plan = 'free';

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

    // Total answers this month
    const [totalResult] = await fastify.db
      .select({ count: sql<number>`count(*)` })
      .from(usageLog)
      .where(and(eq(usageLog.userId, userId), gte(usageLog.ts, periodStart)));

    // Calls (interview sessions) this month
    const [callsResult] = await fastify.db
      .select({ count: sql<number>`count(*)` })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.type, 'interview'),
          gte(sessions.startedAt, periodStart),
        ),
      );

    // Coding sessions this month
    const [codingResult] = await fastify.db
      .select({ count: sql<number>`count(*)` })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.type, 'coding'),
          gte(sessions.startedAt, periodStart),
        ),
      );

    const usedAnswers = Number(totalResult?.count ?? 0);
    const usedCalls = Number(callsResult?.count ?? 0);
    const usedCodingSessions = Number(codingResult?.count ?? 0);
    const limits = PLAN_LIMITS[plan];

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
      answers: {
        used: usedAnswers,
      },
      calls: {
        used: usedCalls,
        limit: limits.callsPerMonth,
      },
      codingSessions: {
        used: usedCodingSessions,
        limit: limits.codingSessionsPerMonth,
      },
      answersPerCall: limits.answersPerCall,
      byDay: dailyRows.map((r) => ({ date: r.date, count: Number(r.count) })),
    });
  });
}
