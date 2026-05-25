import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { profiles, subscriptions, licenses } from '@aria/db';
import { generateReferralCode, generateLicenseKey } from '../../lib/crypto.js';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  country: z.string().max(10).optional(),
  marketingOptIn: z.boolean().optional().default(false),
});

export async function signupRoute(fastify: FastifyInstance) {
  fastify.post('/signup', async (req, reply) => {
    const body = SignupSchema.safeParse(req.body);
    if (!body.success) return reply.status(400).send({ code: 'ERR_VALIDATION', details: body.error.message });

    const { email, password, country, marketingOptIn } = body.data;

    const supabaseUrl = process.env['SUPABASE_URL']!;
    const anonKey = process.env['SUPABASE_ANON_KEY']!;
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;

    // Create user via signup API - uses anon key to trigger confirmation email
    const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.json() as { message?: string; msg?: string; error_description?: string };
      return reply.status(400).send({ code: 'ERR_VALIDATION', details: err.error_description ?? err.message ?? err.msg ?? 'Signup failed' });
    }

    const signupData = await res.json() as { user?: { id: string } };
    const userId = signupData.user?.id;
    if (!userId) {
      return reply.status(500).send({ code: 'ERR_SIGNUP', details: 'User ID not returned from signup' });
    }

    try {
      await fastify.db.insert(profiles).values({
        id: userId,
        email,
        country: country ?? null,
        marketingOptIn: marketingOptIn ?? false,
        referralCode: generateReferralCode(),
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return reply.status(500).send({ code: 'ERR_PROFILES_INSERT', details: msg });
    }

    let subId: string;
    try {
      const [inserted] = await fastify.db.insert(subscriptions).values({
        userId,
        plan: 'starter',
        status: 'active',
      }).returning();
      subId = inserted!.id;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return reply.status(500).send({ code: 'ERR_SUBSCRIPTIONS_INSERT', details: msg });
    }

    const licenseKey = generateLicenseKey();
    try {
      await fastify.db.insert(licenses).values({
        userId,
        subscriptionId: subId,
        key: licenseKey,
        maxDevices: 1,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return reply.status(500).send({ code: 'ERR_LICENSES_INSERT', details: msg });
    }

    fastify.posthog?.capture({ distinctId: userId, event: 'signup_completed', properties: { country } });

    return reply.status(201).send({ userId, requiresEmailVerification: true });
  });
}
 