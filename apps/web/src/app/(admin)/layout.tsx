import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from './_components/AdminSidebar';

const ADMIN_EMAILS = ['tongoltyrone84@gmail.com'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar adminEmail={user.email ?? ''} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
