'use client';

import { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { deleteUser } from '../../actions';

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
      // Success - page will revalidate
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('[DeleteUserButton]', err);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {error && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-xs text-red-700">{error}</span>
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-slate-500 max-w-[120px] truncate">Delete {email}?</span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
          <button
            onClick={() => {
              setConfirming(false);
              setError(null);
            }}
            className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
