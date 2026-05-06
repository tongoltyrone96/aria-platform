import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { profiles, subscriptions, licenses } from '@aria/db';
import { generateReferralCode, generateLicenseKey } from '../../lib/crypto.js';
import { Errors } from '../../lib/errors.js';
import { emailService } from '../../services/email.js';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  country: z.string().max(10).optional(),
  marketingOptIn: z.boolean().optional().default(false),
});

export async function signupRoute(fastify: FastifyInstance) {
  fastify.post('/signup', async (req, reply) => {
    const body = SignupSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { email, password, country, marketingOptIn } = body.data;

    const supabaseUrl = process.env['SUPABASE_URL']!;
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
    const webUrl = process.env['NEXT_PUBLIC_WEB_URL'] ?? 'https://www.ariainterview.com';

    // generate_link creates the user AND returns a verification URL in one step
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        type: 'signup',
        email,
        password,
        options: { redirect_to: `${webUrl}/auth/callback` },
      }),
    });

    if (!res.ok) {
      const err = await res.json() as { message?: string; msg?: string };
      throw Errors.validation(err.message ?? err.msg ?? 'Signup failed');
    }

    const linkData = await res.json() as { action_link: string; user: { id: string } };
    const userId = linkData.user.id;
    const verificationLink = linkData.action_link;

    await fastify.db.insert(profiles).values({
      id: userId,
      email,
      country: country ?? null,
      marketingOptIn: marketingOptIn ?? false,
      referralCode: generateReferralCode(),
    });

    const [sub] = await fastify.db.insert(subscriptions).values({
      userId,
      plan: 'free',
      status: 'active',
    }).returning();

    const licenseKey = generateLicenseKey();
    await fastify.db.insert(licenses).values({
      userId,
      subscriptionId: sub!.id,
      key: licenseKey,
      maxDevices: 1,
    });

    fastify.posthog?.capture({ distinctId: userId, event: 'signup_completed', properties: { country } });

    await emailService.sendEmailVerification(email, verificationLink).catch(() => {});

    return reply.status(201).send({ userId, requiresEmailVerification: true });
  });
}
