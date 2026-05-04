import { createClient } from '@/lib/supabase/server';
import { DeviceList } from '@/components/dashboard/DeviceList';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.aria-ai.com';

export default async function DevicesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? '';

  let licenses: unknown[] = [];
  try {
    const res = await fetch(`${API_URL}/v1/account`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      licenses = data.licenses ?? [];
    }
  } catch { /* ignore */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Devices</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage devices where ARIA is activated</p>
      </div>
      <DeviceList licenses={licenses} token={token} />
    </div>
  );
}
