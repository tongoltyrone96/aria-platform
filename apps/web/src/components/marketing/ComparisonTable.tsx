'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComparisonRow {
  feature: string;
  aria: boolean | string;
  others: boolean | string;
  category?: string;
}

const rows: ComparisonRow[] = [
  // Platform
  { feature: 'Platform type', aria: 'Native Windows app', others: 'Browser extension', category: 'Platform' },
  { feature: 'Works without a browser', aria: true, others: false, category: 'Platform' },
  { feature: 'Offline / local AI option', aria: true, others: false, category: 'Platform' },
  { feature: 'Works with any audio app', aria: true, others: false, category: 'Platform' },

  // Audio
  { feature: 'Premium WASAPI system capture', aria: true, others: false, category: 'Audio' },
  { feature: 'Captures both speakers + mic', aria: true, others: false, category: 'Audio' },
  { feature: 'Works with VPNs & corporate networks', aria: true, others: false, category: 'Audio' },
  { feature: 'Phone call support (VoIP)', aria: true, others: false, category: 'Audio' },

  // Stealth
  { feature: 'Invisible to screen-share / OBS', aria: true, others: false, category: 'Stealth' },
  { feature: 'No visible browser extension', aria: true, others: false, category: 'Stealth' },
  { feature: 'Click-through transparent overlay', aria: true, others: false, category: 'Stealth' },
  { feature: 'Detectable via extension audit', aria: false, others: true, category: 'Stealth' },

  // AI
  { feature: 'Resume-grounded personalized answers', aria: true, others: true, category: 'AI & Answers' },
  { feature: 'Response latency < 1 second', aria: true, others: false, category: 'AI & Answers' },
  { feature: 'State-of-the-art AI models', aria: true, others: 'Varies', category: 'AI & Answers' },
  { feature: 'STAR-method coaching', aria: true, others: true, category: 'AI & Answers' },
  { feature: 'Live coding support', aria: true, others: 'Limited', category: 'AI & Answers' },

  // Privacy
  { feature: 'Data stays on your machine', aria: true, others: false, category: 'Privacy' },
  { feature: 'No audio sent to third parties', aria: true, others: false, category: 'Privacy' },

  // Pricing
  { feature: 'Free plan available', aria: true, others: false, category: 'Pricing' },
  { feature: 'Multi-user simultaneous access', aria: true, others: false, category: 'Pricing' },
  { feature: 'Lifetime deal available', aria: true, others: false, category: 'Pricing' },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm text-foreground font-medium">{value}</span>;
  }
  if (value === true) {
    return <span className="text-green-500 font-bold text-base">✓</span>;
  }
  return <span className="text-destructive/70 font-bold text-base">✕</span>;
}

function groupRows(rows: ComparisonRow[]) {
  const groups: Record<string, ComparisonRow[]> = {};
  for (const row of rows) {
    const cat = row.category ?? 'General';
    if (!groups[cat]) groups[cat] = [];
    groups[cat]!.push(row);
  }
  return groups;
}

export function ComparisonTable() {
  const groups = groupRows(rows);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-x-auto rounded-xl border border-border"
    >
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground w-1/2">
              Feature
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold w-1/4">
              <span className="text-brand-500">ARIA</span>
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold text-foreground/50 w-1/4">
              Other Assistants
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([category, catRows]) => (
            <React.Fragment key={`group-${category}`}>
              <tr className="border-b border-border bg-muted/30">
                <td colSpan={3} className="px-6 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </td>
              </tr>
              {catRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={cn(
                    'border-b border-border transition-colors hover:bg-muted/20',
                    i === catRows.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-6 py-3.5 text-sm text-foreground/80">{row.feature}</td>
                  <td className="px-6 py-3.5 text-center bg-brand-500/5">
                    <Cell value={row.aria} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell value={row.others} />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
