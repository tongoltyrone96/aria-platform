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
  await requireAdmin();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath('/admin/users');
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
