import type { Plan } from '@aria/shared';
import { PLAN_LIMITS } from '@aria/shared';

/**
 * Get maxDevices limit for a given plan
 */
export function getMaxDevicesForPlan(plan: Plan): number {
  return PLAN_LIMITS[plan]?.maxDevices ?? 1;
}
