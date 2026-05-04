import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    keyGenerator: (req) => {
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        try {
          const payload = JSON.parse(
            Buffer.from(authHeader.replace('Bearer ', '').split('.')[1]!, 'base64').toString(),
          );
          if (payload.sub) return `user:${payload.sub}`;
        } catch {
          // fall through to IP
        }
      }
      return req.ip;
    },
    errorResponseBuilder: () => ({
      error: { code: 'ERR_RATE_LIMITED', message: 'Too many requests' },
    }),
  });
});
