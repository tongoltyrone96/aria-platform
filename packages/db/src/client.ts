import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export function createDb(connectionString: string) {
  const client = postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    max_lifetime: 1800,
    prepare: false,
  });
  const db = drizzle(client, { schema });
  return { db, client };
}

export type Db = ReturnType<typeof createDb>['db'];
export * from './schema.js';
