import fp from 'fastify-plugin';
import * as Sentry from '@sentry/node';
import type { FastifyError } from 'fastify';
import { ApiError } from '../lib/errors.js';

export default fp(async (fastify) => {
  if (process.env['SENTRY_DSN']) {
    Sentry.init({
      dsn: process.env['SENTRY_DSN'],
      environment: process.env['NODE_ENV'] ?? 'development',
      tracesSampleRate: 0.1,
    });
  }

  fastify.setErrorHandler((err: FastifyError | ApiError, req, reply) => {
    if (err instanceof ApiError) {
      return reply.status(err.statusCode).send({
        error: { code: err.code, message: err.message, details: err.details },
      });
    }

    if (err.statusCode && err.statusCode < 500) {
      return reply.status(err.statusCode).send({
        error: { code: 'ERR_VALIDATION', message: err.message },
      });
    }

    fastify.log.error(err);
    if (process.env['SENTRY_DSN']) {
      Sentry.captureException(err, { tags: { route: req.routeOptions?.url ?? req.url } });
    }

    return reply.status(500).send({
      error: { code: 'ERR_INTERNAL', message: 'Internal server error' },
    });
  });
});
