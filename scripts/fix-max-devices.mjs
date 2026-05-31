#!/usr/bin/env node
/**
 * Fix maxDevices for existing licenses based on their subscription plan
 *
 * This script updates all licenses in the database to have the correct maxDevices
 * value according to their associated subscription plan.
 *
 * Run: node scripts/fix-max-devices.mjs
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { subscriptions, licenses } from '../packages/db/src/schema.ts';

const PLAN_LIMITS = {
  starter: { maxDevices: 1 },
  pro: { maxDevices: 2 },
  pro_annual: { maxDevices: 2 },
  elite: { maxDevices: 3 },
  elite_annual: { maxDevices: 3 },
  // legacy
  trial: { maxDevices: 1 },
  free: { maxDevices: 1 },
  lifetime: { maxDevices: 3 },
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🔧 Connecting to database...');
  const client = postgres(databaseUrl);
  const db = drizzle(client);

  try {
    // Get all subscriptions with their users
    console.log('📊 Fetching all subscriptions...');
    const allSubs = await db.select().from(subscriptions);
    console.log(`Found ${allSubs.length} subscriptions`);

    let updated = 0;
    let skipped = 0;

    for (const sub of allSubs) {
      const plan = sub.plan;
      const correctMaxDevices = PLAN_LIMITS[plan]?.maxDevices ?? 1;

      // Get user's licenses
      const userLicenses = await db
        .select()
        .from(licenses)
        .where(eq(licenses.userId, sub.userId));

      for (const license of userLicenses) {
        if (license.maxDevices !== correctMaxDevices) {
          console.log(`  Updating license ${license.key.substring(0, 20)}... for user ${sub.userId}`);
          console.log(`    Plan: ${plan} | Old maxDevices: ${license.maxDevices} → New: ${correctMaxDevices}`);

          await db
            .update(licenses)
            .set({ maxDevices: correctMaxDevices })
            .where(eq(licenses.id, license.id));

          updated++;
        } else {
          skipped++;
        }
      }
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Updated: ${updated} licenses`);
    console.log(`   Skipped: ${skipped} licenses (already correct)`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
