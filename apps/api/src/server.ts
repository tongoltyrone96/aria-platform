import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';

import dbPlugin from './plugins/db.js';
import corsPlugin from './plugins/cors.js';
import rateLimitPlugin from './plugins/ratelimit.js';
import sentryPlugin from './plugins/sentry.js';
import posthogPlugin from './plugins/posthog.js';
import { ApiError } from './lib/errors.js';

import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth/index.js';
import { licenseRoutes } from './routes/license/index.js';
import { generateRoute } from './routes/generate.js';
import { usageRoutes } from './routes/usage.js';
import { accountRoutes } from './routes/account.js';
import { billingRoutes } from './routes/billing.js';
import { paddleWebhookRoute } from './routes/webhook/paddle.js';
import { sessionRoutes } from './routes/session.js';

const devLogger =
  process.env['NODE_ENV'] !== 'production'
    ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
    : {};

const fastify = Fastify({
  logger: { level: process.env['LOG_LEVEL'] ?? 'info', ...devLogger },
  trustProxy: true,
});

async function buildServer() {
  fastify.setErrorHandler((error, _req, reply) => {
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        details: error.details,
      });
    }
    fastify.log.error(error);
    const msg = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ code: 'ERR_INTERNAL', details: msg });
  });

  await fastify.register(fp(helmet));
  await fastify.register(corsPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(sentryPlugin);
  await fastify.register(posthogPlugin);
  await fastify.register(dbPlugin);

  await fastify.register(healthRoutes);
  await fastify.register(authRoutes);
  await fastify.register(licenseRoutes);
  await fastify.register(generateRoute);
  await fastify.register(usageRoutes);
  await fastify.register(accountRoutes);
  await fastify.register(billingRoutes);
  await fastify.register(paddleWebhookRoute);
  await fastify.register(sessionRoutes);

  return fastify;
}

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

buildServer()
  .then((app) => app.listen({ port: PORT, host: '0.0.0.0' }))
  .then(() => {
    console.log(`API server running on port ${PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
