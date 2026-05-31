-- Fix maxDevices for existing licenses based on subscription plan
-- This SQL script does the same thing as fix-max-devices.mjs

-- Update Elite plans (should have 3 devices)
UPDATE licenses
SET "maxDevices" = 3
WHERE "userId" IN (
  SELECT "userId"
  FROM subscriptions
  WHERE plan IN ('elite', 'elite_annual')
)
AND "maxDevices" != 3;

-- Update Pro plans (should have 2 devices)
UPDATE licenses
SET "maxDevices" = 2
WHERE "userId" IN (
  SELECT "userId"
  FROM subscriptions
  WHERE plan IN ('pro', 'pro_annual')
)
AND "maxDevices" != 2;

-- Update Starter/Free plans (should have 1 device)
UPDATE licenses
SET "maxDevices" = 1
WHERE "userId" IN (
  SELECT "userId"
  FROM subscriptions
  WHERE plan IN ('starter', 'trial', 'free')
)
AND "maxDevices" != 1;

-- Show results
SELECT
  s.plan,
  COUNT(*) as license_count,
  l."maxDevices"
FROM licenses l
JOIN subscriptions s ON l."userId" = s."userId"
GROUP BY s.plan, l."maxDevices"
ORDER BY s.plan, l."maxDevices";
