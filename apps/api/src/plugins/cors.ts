import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: [
      'https://www.ariainterview.com',
      ...(process.env['NODE_ENV'] !== 'production' ? ['http://localhost:3000'] : []),
    ],
    credentials: true,
  });
});
