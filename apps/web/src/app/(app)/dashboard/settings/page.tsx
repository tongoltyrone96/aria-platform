'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '');
    });
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) { setPwMsg(`Error: ${error.message}`); return; }
    setPwMsg('Password updated successfully.');
    setNewPassword('');
  }

  async function handleDeleteAccount() {
    const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.aria-ai.com';
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`${API_URL}/v1/account/data-delete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Email */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold">Email address</h2>
        <p className="text-sm text-muted-foreground">{email || '—'}</p>
      </div>

      {/* Password */}
      <form onSubmit={handlePasswordChange} className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold">Change password</h2>
        <div className="space-y-1">
          <label htmlFor="pw" className="text-sm text-muted-foreground">New password</label>
          <input
            id="pw" type="password" required minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            placeholder="At least 8 characters"
          />
        </div>
        {pwMsg && <p className={cn('text-sm', pwMsg.startsWith('Error') ? 'text-destructive' : 'text-green-600 dark:text-green-400')}>{pwMsg}</p>}
        <button type="submit" disabled={pwLoading}
          className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {pwLoading ? 'Updating…' : 'Update password'}
        </button>
      </form>

      {/* Data export */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold">Export your data</h2>
        <p className="text-sm text-muted-foreground">Download a copy of all your ARIA data (GDPR).</p>
        <button
          onClick={async () => {
            const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.aria-ai.com';
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${API_URL}/v1/account/data-export`, { method: 'POST', headers: { Authorization: `Bearer ${session?.access_token}` } });
            alert('Export request submitted. You will receive an email within 24 hours.');
          }}
          className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors"
        >
          Request data export
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/30 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">Delete your account and all data. This cannot be undone (30-day grace period).</p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 border border-destructive/50 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/10 transition-colors"
          >
            Delete account
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleDeleteAccount}
              className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg"
            >
              Confirm delete
            </button>
            <button onClick={() => setDeleteConfirm(false)}
              className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
