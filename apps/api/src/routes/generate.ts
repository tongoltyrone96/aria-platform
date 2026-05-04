import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, gte, sql } from 'drizzle-orm';
import { usageLog, licenses, subscriptions } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';
import { Errors } from '../lib/errors.js';
import { verifyDeviceJwt } from '../lib/jwt.js';
import { maskPII } from '../services/pii.js';
import { streamDeepseek, callDeepseek } from '../services/deepseek.js';

const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

const GenerateSchema = z.object({
  messages: z.array(MessageSchema).min(1),
  max_tokens: z.number().int().min(1).max(4096).optional().default(400),
  temperature: z.number().min(0).max(2).optional().default(0.5),
  stream: z.boolean().optional().default(true),
});

export async function generateRoute(fastify: FastifyInstance) {
  fastify.post('/v1/generate', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    const body = GenerateSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { messages, max_tokens, temperature, stream } = body.data;

    // Check plan limits
    const [license] = await fastify.db.select().from(licenses).where(eq(licenses.id, payload.licenseId)).limit(1);
    if (!license || license.revokedAt) throw Errors.licenseRevoked();

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
    if (used >= limits.perMonth) {
      const nextMonth = new Date(periodStart);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      throw Errors.usageExceeded(nextMonth.toISOString());
    }

    // Mask PII in user messages (not system prompt)
    const maskedMessages = messages.map((m) => ({
      ...m,
      content: m.role === 'user' ? maskPII(m.content) : m.content,
    }));

    // Insert placeholder usage row
    const [usageRow] = await fastify.db.insert(usageLog).values({
      userId: payload.sub,
      deviceId: payload.deviceId,
      kind: 'generate',
      model: 'deepseek-chat',
    }).returning();

    const startMs = Date.now();

    if (stream) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      let inputTokens = 0;
      let outputTokens = 0;

      try {
        const result = await streamDeepseek(maskedMessages, max_tokens, temperature, (chunk) => {
          reply.raw.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
        });
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } finally {
        reply.raw.write('data: [DONE]\n\n');
        reply.raw.end();
      }

      const durationMs = Date.now() - startMs;
      if (usageRow) {
        await fastify.db.update(usageLog).set({ inputTokens, outputTokens, durationMs }).where(eq(usageLog.id, usageRow.id));
      }

      fastify.posthog?.capture({
        distinctId: payload.sub,
        event: 'answer_generated',
        properties: { plan, inputTokens, outputTokens, latency_ms: durationMs },
      });

      return;
    }

    // Non-streaming
    const { content, inputTokens, outputTokens } = await callDeepseek(maskedMessages, max_tokens, temperature);
    const durationMs = Date.now() - startMs;

    if (usageRow) {
      await fastify.db.update(usageLog).set({ inputTokens, outputTokens, durationMs }).where(eq(usageLog.id, usageRow.id));
    }

    fastify.posthog?.capture({
      distinctId: payload.sub,
      event: 'answer_generated',
      properties: { plan, inputTokens, outputTokens, latency_ms: durationMs },
    });

    return reply.send({ choices: [{ message: { role: 'assistant', content } }], usage: { inputTokens, outputTokens } });
  });
}
