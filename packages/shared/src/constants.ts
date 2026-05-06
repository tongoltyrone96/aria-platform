import type { Plan } from './enums.js';

// ── Free plan limits ─────────────────────────────────────────────────────────
// Edit these to change free-tier constraints across the entire platform.
export const FREE_PLAN = {
  CALLS_PER_MONTH: 10,          // interview calls per calendar month
  ANSWERS_PER_CALL: 6,          // AI answers within one call (Start→End)
  CODING_SESSIONS_PER_MONTH: 1, // live coding sessions per calendar month
} as const;

// ── Plan limits interface ────────────────────────────────────────────────────
export interface PlanLimits {
  callsPerMonth: number;          // -1 = unlimited
  answersPerCall: number;         // -1 = unlimited
  codingSessionsPerMonth: number; // -1 = unlimited
  maxDevices: number;
}

// ── Per-plan limits ──────────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  starter:      { callsPerMonth: FREE_PLAN.CALLS_PER_MONTH, answersPerCall: FREE_PLAN.ANSWERS_PER_CALL, codingSessionsPerMonth: FREE_PLAN.CODING_SESSIONS_PER_MONTH, maxDevices: 1 },
  pro:          { callsPerMonth: 70,  answersPerCall: -1, codingSessionsPerMonth: 50,  maxDevices: 2 },
  pro_annual:   { callsPerMonth: 70,  answersPerCall: -1, codingSessionsPerMonth: 50,  maxDevices: 2 },
  elite:        { callsPerMonth: 150, answersPerCall: -1, codingSessionsPerMonth: 100, maxDevices: 3 },
  elite_annual: { callsPerMonth: 150, answersPerCall: -1, codingSessionsPerMonth: 100, maxDevices: 3 },
};

// Maps legacy DB plan values to the current Plan type.
// Run: UPDATE subscriptions SET plan='starter' WHERE plan IN ('trial','free');
//      UPDATE subscriptions SET plan='elite_annual' WHERE plan IN ('lifetime');
export function normalizePlan(plan: string | null | undefined): Plan {
  const legacyMap: Record<string, Plan> = {
    trial: 'starter', free: 'starter', lifetime: 'elite_annual',
  };
  if (!plan) return 'starter';
  return (legacyMap[plan] ?? plan) as Plan;
}

export const JWT_EXPIRY = {
  USER: 86400,    // 24h
  DEVICE: 604800, // 7d
} as const;

export const OFFLINE_GRACE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const HEARTBEAT_INTERVAL_HOURS = 4;

export const PRICES = {
  PRO_MONTHLY: 1799,
  PRO_ANNUAL: 19003,
  ELITE_ANNUAL: 29556,
} as const;
