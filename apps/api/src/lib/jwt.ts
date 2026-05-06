import jwt from 'jsonwebtoken';
import type { Plan } from '@aria/shared';
import type { UserJwtPayload, DeviceJwtPayload } from '@aria/shared';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production';
// Supabase JWT secret — found in Supabase Dashboard → Project Settings → API → JWT Secret
const SUPABASE_JWT_SECRET = process.env['SUPABASE_JWT_SECRET'] ?? '';

export function signUserJwt(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email } satisfies Omit<UserJwtPayload, 'iat' | 'exp'>,
    JWT_SECRET,
    { expiresIn: parseInt(process.env['JWT_EXPIRY_USER'] ?? '86400', 10) },
  );
}

export function signDeviceJwt(
  userId: string,
  deviceId: string,
  licenseId: string,
  plan: Plan,
  hwFingerprint: string,
): string {
  return jwt.sign(
    { sub: userId, deviceId, licenseId, plan, hwFingerprint } satisfies Omit<DeviceJwtPayload, 'iat' | 'exp'>,
    JWT_SECRET,
    { expiresIn: parseInt(process.env['JWT_EXPIRY_DEVICE'] ?? '604800', 10) },
  );
}

export function verifyUserJwt(token: string): UserJwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch {
    // Fall back to Supabase JWT (used by the web dashboard)
    if (SUPABASE_JWT_SECRET) {
      const payload = jwt.verify(token, SUPABASE_JWT_SECRET) as Record<string, unknown>;
      return {
        sub: payload['sub'] as string,
        email: (payload['email'] as string) ?? '',
        iat: payload['iat'] as number,
        exp: payload['exp'] as number,
      };
    }
    throw new Error('Invalid JWT');
  }
}

export function verifyDeviceJwt(token: string): DeviceJwtPayload {
  return jwt.verify(token, JWT_SECRET) as DeviceJwtPayload;
}

export function decodeJwt(token: string): DeviceJwtPayload | UserJwtPayload | null {
  try {
    return jwt.decode(token) as DeviceJwtPayload | UserJwtPayload;
  } catch {
    return null;
  }
}
