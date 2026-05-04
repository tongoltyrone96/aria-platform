import type { Plan } from './enums.js';

export const PLAN_LIMITS: Record<Plan, { perMonth: number; maxDevices: number }> = {
  trial: { perMonth: 50, maxDevices: 1 },
  free: { perMonth: 20, maxDevices: 1 },
  starter: { perMonth: 200, maxDevices: 1 },
  pro: { perMonth: 500, maxDevices: 2 },
  pro_annual: { perMonth: 500, maxDevices: 2 },
  lifetime: { perMonth: 1000, maxDevices: 3 },
};

export const JWT_EXPIRY = {
  USER: 86400,       // 24h
  DEVICE: 604800,    // 7d
} as const;

export const OFFLINE_GRACE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const HEARTBEAT_INTERVAL_HOURS = 4;

export const PRICES = {
  STARTER_MONTHLY: 1900,   // cents
  PRO_MONTHLY: 2900,
  PRO_ANNUAL: 29000,
  LIFETIME: 24900,
} as const;
