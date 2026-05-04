import type { FastifyInstance } from 'fastify';
import { signupRoute } from './signup.js';
import { loginRoute } from './login.js';
import { refreshRoute } from './refresh.js';

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(signupRoute, { prefix: '/v1/auth' });
  await fastify.register(loginRoute, { prefix: '/v1/auth' });
  await fastify.register(refreshRoute, { prefix: '/v1/auth' });
}
