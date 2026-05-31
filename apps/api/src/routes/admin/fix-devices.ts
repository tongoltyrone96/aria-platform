import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { subscriptions, licenses } from '@aria/db';
import { PLAN_LIMITS } from '@aria/shared';
import type { Plan } from '@aria/shared';

/**
 * TEMPORARY ADMIN ENDPOINT
 * Fix maxDevices for existing licenses
 *
 * DELETE THIS FILE AFTER RUNNING ONCE
 */
export async function fixDevicesRoute(fastify: FastifyInstance) {
  fastify.post('/admin/fix-devices', async (req, reply) => {
    // Simple password protection
    const { password } = req.body as { password?: string };
    const adminPassword = process.env['ADMIN_PASSWORD'] ?? 'aria-fix-2026';

    if (password !== adminPassword) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    try {
      const results = {
        checked: 0,
        updated: 0,
        skipped: 0,
        details: [] as Array<{ userId: string; plan: string; oldMax: number; newMax: number }>,
      };

      // Get all subscriptions
      const allSubs = await fastify.db.select().from(subscriptions);

      for (const sub of allSubs) {
        const plan = sub.plan as Plan;
        const correctMaxDevices = PLAN_LIMITS[plan]?.maxDevices ?? 1;

        // Get user's licenses
        const userLicenses = await fastify.db
          .select()
          .from(licenses)
          .where(eq(licenses.userId, sub.userId));

        for (const license of userLicenses) {
          results.checked++;

          if (license.maxDevices !== correctMaxDevices) {
            // Update license
            await fastify.db
              .update(licenses)
              .set({ maxDevices: correctMaxDevices })
              .where(eq(licenses.id, license.id));

            results.updated++;
            results.details.push({
              userId: sub.userId,
              plan,
              oldMax: license.maxDevices,
              newMax: correctMaxDevices,
            });

            fastify.log.info({
              userId: sub.userId,
              plan,
              oldMaxDevices: license.maxDevices,
              newMaxDevices: correctMaxDevices,
            }, 'Fixed license maxDevices');
          } else {
            results.skipped++;
          }
        }
      }

      return reply.send({
        success: true,
        message: 'Migration completed successfully',
        results,
      });

    } catch (error) {
      fastify.log.error(error, 'Failed to fix devices');
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
