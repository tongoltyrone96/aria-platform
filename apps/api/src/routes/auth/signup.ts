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
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!;
    const resendApiKey = process.env['RESEND_API_KEY']!;

    // Create user via Admin API
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: false,
      }),
    });

    if (!res.ok) {
      const err = await res.json() as { message?: string; msg?: string };
      return reply.status(400).send({ code: 'ERR_VALIDATION', details: err.message ?? err.msg ?? 'Signup failed' });
    }

    const userData = await res.json() as { id: string };
    const userId = userData.id;

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

    // Generate email confirmation link via Supabase Admin API
    const linkRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        type: 'signup',
        email,
      }),
    });

    if (linkRes.ok) {
      const linkData = await linkRes.json() as { action_link?: string };
      const confirmationLink = linkData.action_link;

      if (confirmationLink) {
        // Send confirmation email via Resend
        try {
          const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'ARIA <onboarding@resend.dev>',
              to: email,
              subject: 'Confirm Your ARIA Account',
              html: `
                <h2>Welcome to ARIA!</h2>
                <p>Please confirm your email address by clicking the link below:</p>
                <p><a href="${confirmationLink}" style="background-color: #F05A28; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirm Email</a></p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
              `,
            }),
          });

          const emailData = await emailRes.json();

          if (emailRes.ok) {
            fastify.log.info({ userId, email, resendResponse: emailData }, 'Confirmation email sent via Resend - SUCCESS');
          } else {
            fastify.log.error({ userId, email, resendResponse: emailData, status: emailRes.status }, 'Resend API returned error');
          }
        } catch (emailErr) {
          fastify.log.error({ userId, email, err: emailErr }, 'Failed to send confirmation email - EXCEPTION');
        }
      }
    }

    return reply.status(201).send({ userId, requiresEmailVerification: true });
  });
}
 