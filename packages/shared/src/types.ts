import type { Plan, SubStatus, DeviceStatus, UsageKind } from './enums.js';

// Auth
export interface SignupRequest {
  email: string;
  password: string;
  country?: string;
  marketingOptIn?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  country: string | null;
  createdAt: string;
}

// License
export interface ActivateRequest {
  licenseKey: string;
  hwFingerprint: string;
  hostname?: string;
  os?: string;
  appVersion?: string;
}

export interface ActivateResponse {
  jwt: string;
  plan: Plan;
  limits: { perMonth: number };
  expiresAt: string | null;
}

export interface HeartbeatRequest {
  appVersion?: string;
}

export interface HeartbeatResponse {
  jwt?: string;
  plan: Plan;
  status: 'active' | 'revoked';
}

// Generate
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateRequest {
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

// Usage
export interface UsageDay {
  date: string;
  count: number;
}

export interface UsageResponse {
  period: { start: string; end: string };
  used: number;
  limit: number;
  byDay: UsageDay[];
}

// Device
export interface DeviceInfo {
  id: string;
  hostname: string | null;
  os: string | null;
  appVersion: string | null;
  status: DeviceStatus;
  activatedAt: string;
  lastSeenAt: string;
}

// Subscription
export interface SubscriptionInfo {
  id: string;
  plan: Plan;
  status: SubStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

// Account
export interface AccountResponse {
  profile: UserProfile;
  subscription: SubscriptionInfo | null;
  licenses: LicenseInfo[];
}

export interface LicenseInfo {
  id: string;
  key: string;
  maxDevices: number;
  expiresAt: string | null;
  devices: DeviceInfo[];
}

// Billing
export interface CheckoutRequest {
  plan: 'starter' | 'pro' | 'pro_annual' | 'lifetime';
  provider?: 'paddle' | 'stripe';
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

// Error
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// JWT Claims
export interface UserJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface DeviceJwtPayload {
  sub: string;
  deviceId: string;
  licenseId: string;
  plan: Plan;
  hwFingerprint: string;
  iat: number;
  exp: number;
}

export type { Plan, SubStatus, DeviceStatus, UsageKind };
