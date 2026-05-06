import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  const extraOrigins = (process.env['EXTRA_ORIGINS'] ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean);

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // server-to-server / curl
      const allowed = [
        'https://www.ariainterview.com',
        'https://ariainterview.com',
        ...extraOrigins,
        ...(process.env['NODE_ENV'] !== 'production' ? ['http://localhost:3000', 'http://localhost:3001'] : []),
      ];
      if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });
});
