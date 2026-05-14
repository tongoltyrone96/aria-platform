'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '../../actions';

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteUser(userId);
    setLoading(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-slate-500 max-w-[120px] truncate">{email} 삭제?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? '삭제 중...' : '확인'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          취소
        </button>
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
