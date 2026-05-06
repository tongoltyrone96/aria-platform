import { eq, and, asc } from 'drizzle-orm';
import type { Db } from '@aria/db';
import { licenses, devices, subscriptions } from '@aria/db';
import { PLAN_LIMITS, normalizePlan } from '@aria/shared';
import { Errors } from '../lib/errors.js';
import { signDeviceJwt } from '../lib/jwt.js';

export async function activateDevice(
  db: Db,
  licenseKey: string,
  hwFingerprint: string,
  hostname?: string,
  os?: string,
  appVersion?: string,
) {
  const [license] = await db.select().from(licenses).where(eq(licenses.key, licenseKey)).limit(1);
  if (!license) throw Errors.notFound('License not found');
  if (license.revokedAt) throw Errors.licenseRevoked();
  if (license.expiresAt && license.expiresAt < new Date()) throw Errors.licenseExpired();

  const sub = license.subscriptionId
    ? await db.select().from(subscriptions).where(eq(subscriptions.id, license.subscriptionId)).limit(1).then((r) => r[0])
    : null;
  const plan = normalizePlan(sub?.plan);

  const activeDevices = await db
    .select()
    .from(devices)
    .where(and(eq(devices.licenseId, license.id), eq(devices.status, 'active')))
    .orderBy(asc(devices.lastSeenAt));

  // Same machine re-activating — just refresh
  const sameMachine = activeDevices.find((d) => d.hwFingerprint === hwFingerprint);
  if (sameMachine) {
    await db.update(devices)
      .set({ lastSeenAt: new Date(), appVersion: appVersion ?? null })
      .where(eq(devices.id, sameMachine.id));
    return {
      jwt: signDeviceJwt(license.userId, sameMachine.id, license.id, plan, hwFingerprint),
      plan,
      limits: PLAN_LIMITS[plan],
      expiresAt: license.expiresAt?.toISOString() ?? null,
    };
  }

  // At device limit — auto-revoke the least recently seen device to make room
  if (activeDevices.length >= license.maxDevices) {
    const oldest = activeDevices[0];
    if (oldest) {
      await db.update(devices)
        .set({ status: 'revoked', revokedAt: new Date() })
        .where(eq(devices.id, oldest.id));
    }
  }

  const [device] = await db.insert(devices).values({
    licenseId: license.id,
    hwFingerprint,
    hostname: hostname ?? null,
    os: os ?? null,
    appVersion: appVersion ?? null,
    status: 'active',
  }).returning();

  if (!device) throw Errors.internal('Failed to create device');

  return {
    jwt: signDeviceJwt(license.userId, device.id, license.id, plan, hwFingerprint),
    plan,
    limits: PLAN_LIMITS[plan],
    expiresAt: license.expiresAt?.toISOString() ?? null,
  };
}
