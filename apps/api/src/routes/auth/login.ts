import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { profiles } from '@aria/db';
import { eq } from 'drizzle-orm';
import { Errors } from '../../lib/errors.js';
import { signUserJwt } from '../../lib/jwt.js';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginRoute(fastify: FastifyInstance) {
  fastify.post('/login', async (req, reply) => {
    const body = LoginSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { email, password } = body.data;

    const supabaseUrl = process.env['SUPABASE_URL']!;
    const anonKey = process.env['SUPABASE_ANON_KEY']!;

    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json() as { error_description?: string };
      throw new (await import('../../lib/errors.js')).ApiError(401, 'ERR_AUTH_REQUIRED', err.error_description ?? 'Invalid credentials');
    }

    const tokens = await res.json() as { user: { id: string }; refresh_token: string };
    const userId = tokens.user.id;

    const [profile] = await fastify.db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    if (!profile) throw Errors.notFound('Profile not found');

    const accessToken = signUserJwt(userId, email);

    return reply.send({
      accessToken,
      refreshToken: tokens.refresh_token,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        country: profile.country,
        createdAt: profile.createdAt.toISOString(),
      },
    });
  });
}
