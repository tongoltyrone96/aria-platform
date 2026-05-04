import fp from 'fastify-plugin';
import { PostHog } from 'posthog-node';

declare module 'fastify' {
  interface FastifyInstance {
    posthog: PostHog | null;
  }
}

export default fp(async (fastify) => {
  const posthog = process.env['POSTHOG_API_KEY']
    ? new PostHog(process.env['POSTHOG_API_KEY'], {
        host: process.env['POSTHOG_HOST'] ?? 'https://app.posthog.com',
      })
    : null;

  fastify.decorate('posthog', posthog);

  fastify.addHook('onClose', async () => {
    await posthog?.shutdown();
  });
});
