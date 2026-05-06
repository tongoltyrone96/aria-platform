import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

export const sessionTypeEnum = pgEnum('session_type', ['interview', 'coding']);

export const planEnum = pgEnum('plan', [
  'trial',
  'free',
  'starter',
  'pro',
  'pro_annual',
  'lifetime',
]);

export const subStatusEnum = pgEnum('sub_status', [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'expired',
]);

export const deviceStatusEnum = pgEnum('device_status', ['active', 'revoked']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  country: text('country'),
  primaryLanguage: text('primary_language').default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  marketingOptIn: boolean('marketing_opt_in').default(false).notNull(),
  emailVerifiedAt: timestamp('email_verified_at'),
  referralCode: text('referral_code').unique(),
  referredBy: uuid('referred_by'),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  plan: planEnum('plan').notNull(),
  status: subStatusEnum('status').notNull(),
  paddleSubscriptionId: text('paddle_subscription_id').unique(),
  trialEndsAt: timestamp('trial_ends_at'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const licenses = pgTable('licenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  key: text('key').notNull().unique(),
  maxDevices: integer('max_devices').default(1).notNull(),
  expiresAt: timestamp('expires_at'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const devices = pgTable(
  'devices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    licenseId: uuid('license_id')
      .notNull()
      .references(() => licenses.id, { onDelete: 'cascade' }),
    hwFingerprint: text('hw_fingerprint').notNull(),
    hostname: text('hostname'),
    os: text('os'),
    appVersion: text('app_version'),
    status: deviceStatusEnum('status').default('active').notNull(),
    activatedAt: timestamp('activated_at').defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
    revokedAt: timestamp('revoked_at'),
  },
  (table) => [index('idx_device_fingerprint').on(table.hwFingerprint)],
);

export const usageLog = pgTable(
  'usage_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id').references(() => devices.id),
    ts: timestamp('ts').defaultNow().notNull(),
    kind: text('kind').notNull(),
    model: text('model'),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    durationMs: integer('duration_ms'),
    meta: jsonb('meta'),
  },
  (table) => [index('idx_usage_user_ts').on(table.userId, table.ts)],
);

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  paddleInvoiceId: text('paddle_invoice_id').unique(),
  amountUsd: integer('amount_usd').notNull(),
  status: text('status').notNull(),
  paidAt: timestamp('paid_at'),
  receiptUrl: text('receipt_url'),
  raw: jsonb('raw'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tracks each interview call (Start→End = 1 session) and live coding sessions.
// Used to enforce per-call answer limits and monthly call/coding-session counts.
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id').references(() => devices.id),
    type: sessionTypeEnum('type').notNull().default('interview'),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    endedAt: timestamp('ended_at'),
    answerCount: integer('answer_count').default(0).notNull(),
  },
  (table) => [index('idx_sessions_user_ts').on(table.userId, table.startedAt)],
);

export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id')
    .notNull()
    .references(() => profiles.id),
  referredId: uuid('referred_id')
    .notNull()
    .references(() => profiles.id),
  rewardGranted: boolean('reward_granted').default(false).notNull(),
  rewardType: text('reward_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
