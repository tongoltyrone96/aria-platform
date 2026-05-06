import { createDb, profiles, subscriptions, licenses } from './client.js';
import crypto from 'crypto';

const db = createDb(process.env['DATABASE_URL']!);

async function seed() {
  console.log('Seeding database...');

  const adminId = crypto.randomUUID();
  await db.insert(profiles).values({
    id: adminId,
    email: 'admin@ariainterview.com',
    fullName: 'ARIA Admin',
    country: 'US',
    referralCode: 'ADMIN001',
  }).onConflictDoNothing();

  const testUsers = [
    { id: crypto.randomUUID(), email: 'pro@test.com', fullName: 'Pro User', country: 'US' },
    { id: crypto.randomUUID(), email: 'starter@test.com', fullName: 'Starter User', country: 'GB' },
    { id: crypto.randomUUID(), email: 'trial@test.com', fullName: 'Trial User', country: 'KR' },
  ];

  for (const user of testUsers) {
    await db.insert(profiles).values({ ...user, referralCode: crypto.randomBytes(4).toString('hex') }).onConflictDoNothing();

    const [sub] = await db.insert(subscriptions).values({
      userId: user.id,
      plan: user.email.startsWith('pro') ? 'pro' : user.email.startsWith('starter') ? 'starter' : 'trial',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).returning();

    if (sub) {
      await db.insert(licenses).values({
        userId: user.id,
        subscriptionId: sub.id,
        key: `sk_live_${crypto.randomBytes(16).toString('hex')}`,
        maxDevices: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).onConflictDoNothing();
    }
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
