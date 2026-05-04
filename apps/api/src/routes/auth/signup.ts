import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { profiles, subscriptions } from '@aria/db';
import { generateReferralCode } from '../../lib/crypto.js';
import { Errors } from '../../lib/errors.js';
import { emailService } from '../../services/email.js';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  country: z.string().length(2).optional(),
  marketingOptIn: z.boolean().optional().default(false),
});

export async function signupRoute(fastify: FastifyInstance) {
  fastify.post('/signup', async (req, reply) => {
    const body = SignupSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { email, password, country, marketingOptIn } = body.data;

    const supabaseUrl = process.env['SUPABASE_URL']!;
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;

    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ email, password, email_confirm: false }),
    });

    if (!res.ok) {
      const err = await res.json() as { message?: string };
      throw Errors.validation(err.message ?? 'Signup failed');
    }

    const supabaseUser = await res.json() as { id: string };

    await fastify.db.insert(profiles).values({
      id: supabaseUser.id,
      email,
      country: country ?? null,
      marketingOptIn: marketingOptIn ?? false,
      referralCode: generateReferralCode(),
    });

    await fastify.db.insert(subscriptions).values({
      userId: supabaseUser.id,
      plan: 'trial',
      status: 'trialing',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    fastify.posthog?.capture({ distinctId: supabaseUser.id, event: 'signup_completed', properties: { country } });

    await emailService.sendWelcome(supabaseUser.id, email).catch(() => {});

    return reply.status(201).send({ userId: supabaseUser.id, requiresEmailVerification: true });
  });
}
