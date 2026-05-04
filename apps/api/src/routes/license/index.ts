import type { FastifyInstance } from 'fastify';
import { activateRoute } from './activate.js';
import { heartbeatRoute } from './heartbeat.js';
import { deactivateRoute } from './deactivate.js';
import { statusRoute } from './status.js';

export async function licenseRoutes(fastify: FastifyInstance) {
  await fastify.register(activateRoute, { prefix: '/v1/license' });
  await fastify.register(heartbeatRoute, { prefix: '/v1/license' });
  await fastify.register(deactivateRoute, { prefix: '/v1/license' });
  await fastify.register(statusRoute, { prefix: '/v1/license' });
}
