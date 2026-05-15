'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCallback } from 'react';

interface FilterOption { label: string; value: string }

interface TableFiltersProps {
  searchPlaceholder?: string;
  filters?: { key: string; placeholder: string; options: FilterOption[] }[];
}

export function TableFilters({ searchPlaceholder = 'Search...', filters = [] }: TableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 w-56"
          style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
        />
      </div>
      {filters.map((f) => (
        <select
          key={f.key}
          defaultValue={searchParams.get(f.key) ?? ''}
          onChange={(e) => updateParam(f.key, e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-600"
          style={{ '--tw-ring-color': '#F05A28' } as React.CSSProperties}
        >
          <option value="">{f.placeholder}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
