import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../lib/errors.js';
import { activateDevice } from '../../services/license.js';

const ActivateSchema = z.object({
  licenseKey: z.string().startsWith('sk_live_'),
  hwFingerprint: z.string().min(16),
  hostname: z.string().optional(),
  os: z.string().optional(),
  appVersion: z.string().optional(),
});

export async function activateRoute(fastify: FastifyInstance) {
  fastify.post('/activate', async (req, reply) => {
    const body = ActivateSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { licenseKey, hwFingerprint, hostname, os, appVersion } = body.data;

    const result = await activateDevice(fastify.db, licenseKey, hwFingerprint, hostname, os, appVersion);

    fastify.posthog?.capture({
      distinctId: result.jwt,
      event: 'license_activated',
      properties: { plan: result.plan, hostname, os },
    });

    return reply.send(result);
  });
}
