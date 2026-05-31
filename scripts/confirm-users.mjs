// Run: node scripts/confirm-users.mjs
// Confirms all unverified Supabase users so they can sign in immediately.

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env from apps/api/.env
const envPath = resolve(process.cwd(), 'apps/api/.env');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=').map((v, i) => i === 0 ? v.trim() : v.trim()))
    .filter(([k]) => k)
);

const SUPABASE_URL = env['SUPABASE_URL'];
const SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/api/.env');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

async function listUnconfirmedUsers() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, { headers });
  const data = await res.json();
  return data.users.filter(u => !u.email_confirmed_at);
}

async function confirmUser(userId, email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ email_confirm: true }),
  });
  return res.ok;
}

const users = await listUnconfirmedUsers();
console.log(`Found ${users.length} unconfirmed user(s):`);

for (const user of users) {
  const ok = await confirmUser(user.id, user.email);
  console.log(`  ${ok ? '✓' : '✗'} ${user.email}`);
}

console.log('Done.');
