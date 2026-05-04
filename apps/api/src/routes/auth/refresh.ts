import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../lib/errors.js';
import { signUserJwt } from '../../lib/jwt.js';

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function refreshRoute(fastify: FastifyInstance) {
  fastify.post('/refresh', async (req, reply) => {
    const body = RefreshSchema.safeParse(req.body);
    if (!body.success) throw Errors.validation(body.error.message);

    const { refreshToken } = body.data;
    const supabaseUrl = process.env['SUPABASE_URL']!;
    const anonKey = process.env['SUPABASE_ANON_KEY']!;

    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw Errors.authExpired();

    const data = await res.json() as { user: { id: string; email: string } };
    const accessToken = signUserJwt(data.user.id, data.user.email);

    return reply.send({ accessToken });
  });
}
