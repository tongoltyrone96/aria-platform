import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { devices } from '@aria/db';
import { Errors } from '../../lib/errors.js';
import { verifyDeviceJwt } from '../../lib/jwt.js';

export async function deactivateRoute(fastify: FastifyInstance) {
  fastify.post('/deactivate', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw Errors.authRequired();

    let payload;
    try {
      payload = verifyDeviceJwt(auth.replace('Bearer ', ''));
    } catch {
      throw Errors.authExpired();
    }

    await fastify.db.update(devices).set({
      status: 'revoked',
      revokedAt: new Date(),
    }).where(eq(devices.id, payload.deviceId));

    return reply.send({ ok: true });
  });
}
