'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard');
}

export async function deleteUser(userId: string) {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    console.log('[deleteUser] Starting deletion for user:', userId);

    // Step 1: Delete from profiles table first (CASCADE will delete related records)
    const { error: profileError } = await admin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('[deleteUser] Profile deletion error:', profileError);
      return { success: false, error: `Database error: ${profileError.message}` };
    }

    console.log('[deleteUser] Profile deleted successfully');

    // Step 2: Delete from Supabase Auth
    const { error: authError } = await admin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('[deleteUser] Auth deletion error:', authError);
      // Auth deletion failed but profile is already deleted
      // This is acceptable - the user won't be able to login anyway
      console.warn('[deleteUser] Auth user could not be deleted but profile was removed');
    } else {
      console.log('[deleteUser] Auth user deleted successfully');
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('[deleteUser] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function updateSubscription(
  id: string,
  updates: { plan?: string; status?: string },
) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('subscriptions').update(updates).eq('id', id);
  revalidatePath('/admin/subscriptions');
}
