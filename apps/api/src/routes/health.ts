import type { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'ok', service: 'aria-api' };
  });

  fastify.get('/v1/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            version: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return { ok: true, version: '1.0.0' };
  });
}
