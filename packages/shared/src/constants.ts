import type { Plan } from './enums.js';

// ── Free plan limits ─────────────────────────────────────────────────────────
// Edit these to change free-tier constraints across the entire platform.
export const FREE_PLAN = {
  CALLS_PER_MONTH: 10,          // interview calls per calendar month
  ANSWERS_PER_CALL: 6,          // AI answers within one call (Start→End)
  CODING_SESSIONS_PER_MONTH: 2, // live coding sessions per calendar month
} as const;

// ── Plan limits interface ────────────────────────────────────────────────────
export interface PlanLimits {
  callsPerMonth: number;          // -1 = unlimited
  answersPerCall: number;         // -1 = unlimited
  codingSessionsPerMonth: number; // -1 = unlimited
  maxDevices: number;
}

// ── Per-plan limits ──────────────────────────────────────────────────────────
// 'trial' kept for DB backward compatibility — treated identically to 'free'.
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  trial: {
    callsPerMonth: FREE_PLAN.CALLS_PER_MONTH,
    answersPerCall: FREE_PLAN.ANSWERS_PER_CALL,
    codingSessionsPerMonth: FREE_PLAN.CODING_SESSIONS_PER_MONTH,
    maxDevices: 1,
  },
  free: {
    callsPerMonth: FREE_PLAN.CALLS_PER_MONTH,
    answersPerCall: FREE_PLAN.ANSWERS_PER_CALL,
    codingSessionsPerMonth: FREE_PLAN.CODING_SESSIONS_PER_MONTH,
    maxDevices: 1,
  },
  starter: { callsPerMonth: 200, answersPerCall: -1, codingSessionsPerMonth: 20,  maxDevices: 1 },
  pro:     { callsPerMonth: -1,  answersPerCall: -1, codingSessionsPerMonth: -1,  maxDevices: 2 },
  pro_annual: { callsPerMonth: -1, answersPerCall: -1, codingSessionsPerMonth: -1, maxDevices: 2 },
  lifetime:   { callsPerMonth: -1, answersPerCall: -1, codingSessionsPerMonth: -1, maxDevices: 3 },
};

export const JWT_EXPIRY = {
  USER: 86400,    // 24h
  DEVICE: 604800, // 7d
} as const;

export const OFFLINE_GRACE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const HEARTBEAT_INTERVAL_HOURS = 4;

export const PRICES = {
  STARTER_MONTHLY: 1900,
  PRO_MONTHLY: 2900,
  PRO_ANNUAL: 29000,
  LIFETIME: 24900,
} as const;
