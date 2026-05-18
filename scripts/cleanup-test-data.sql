-- ============================================
-- ARIA Platform - Test Data Cleanup Script
-- ============================================
-- ⚠️ WARNING: This will delete user data!
-- Run this in Supabase SQL Editor ONLY in development/staging
-- ============================================

-- Option 1: Delete specific users by email pattern
-- (Useful for deleting test accounts)
-- ============================================
-- DELETE FROM profiles
-- WHERE email LIKE '%test%'
--    OR email LIKE '%example%'
--    OR email LIKE '%demo%';
-- -- CASCADE will automatically delete:
-- -- - subscriptions
-- -- - licenses
-- -- - devices
-- -- - usage_log
-- -- - sessions
-- -- - invoices
-- -- - crypto_payments
-- -- - referrals

-- Option 2: Delete specific user by email
-- ============================================
-- DELETE FROM profiles WHERE email = 'user@example.com';

-- Option 3: Keep only specific users (delete all others)
-- ============================================
-- DELETE FROM profiles
-- WHERE email NOT IN (
--   'admin@ariainterview.com',
--   'tyronejhertongol@gmail.com'
-- );

-- Option 4: Delete all users created after a certain date
-- ============================================
-- DELETE FROM profiles WHERE created_at > '2026-05-01';

-- Option 5: Delete users with no subscriptions (free users only)
-- ============================================
-- DELETE FROM profiles
-- WHERE id NOT IN (
--   SELECT DISTINCT user_id FROM subscriptions
--   WHERE status = 'active' AND plan != 'starter'
-- );

-- Option 6: NUCLEAR OPTION - Delete ALL user data
-- ============================================
-- ⚠️⚠️⚠️ EXTREMELY DANGEROUS - Only use in development! ⚠️⚠️⚠️
-- TRUNCATE TABLE crypto_payments CASCADE;
-- TRUNCATE TABLE referrals CASCADE;
-- TRUNCATE TABLE invoices CASCADE;
-- TRUNCATE TABLE sessions CASCADE;
-- TRUNCATE TABLE usage_log CASCADE;
-- TRUNCATE TABLE devices CASCADE;
-- TRUNCATE TABLE licenses CASCADE;
-- TRUNCATE TABLE subscriptions CASCADE;
-- TRUNCATE TABLE profiles CASCADE;

-- ============================================
-- Verification Queries (Run BEFORE deletion)
-- ============================================

-- Count users by plan
SELECT
  COALESCE(s.plan, 'no_subscription') as plan,
  COUNT(p.id) as user_count
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
GROUP BY COALESCE(s.plan, 'no_subscription')
ORDER BY user_count DESC;

-- List test/demo accounts
SELECT
  p.id,
  p.email,
  p.created_at,
  s.plan,
  s.status
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email LIKE '%test%'
   OR p.email LIKE '%example%'
   OR p.email LIKE '%demo%'
ORDER BY p.created_at DESC;

-- Count related records per user
SELECT
  p.email,
  COUNT(DISTINCT s.id) as subscriptions,
  COUNT(DISTINCT l.id) as licenses,
  COUNT(DISTINCT d.id) as devices,
  COUNT(DISTINCT u.id) as usage_logs
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN licenses l ON p.id = l.user_id
LEFT JOIN devices d ON l.id = d.license_id
LEFT JOIN usage_log u ON p.id = u.user_id
GROUP BY p.email
ORDER BY usage_logs DESC;

-- ============================================
-- After Deletion - Verify Cleanup
-- ============================================
-- SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
-- UNION ALL
-- SELECT 'subscriptions', COUNT(*) FROM subscriptions
-- UNION ALL
-- SELECT 'licenses', COUNT(*) FROM licenses
-- UNION ALL
-- SELECT 'devices', COUNT(*) FROM devices
-- UNION ALL
-- SELECT 'usage_log', COUNT(*) FROM usage_log
-- UNION ALL
-- SELECT 'sessions', COUNT(*) FROM sessions
-- UNION ALL
-- SELECT 'invoices', COUNT(*) FROM invoices
-- UNION ALL
-- SELECT 'crypto_payments', COUNT(*) FROM crypto_payments;
