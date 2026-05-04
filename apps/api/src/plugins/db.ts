import fp from 'fastify-plugin';
import { createDb, type Db } from '@aria/db';

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
  }
}

export default fp(async (fastify) => {
  const db = createDb(process.env['DATABASE_URL']!);
  fastify.decorate('db', db);
});
