'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface UsageChartProps {
  data: Array<{ date: string; count: number }>;
  limit?: number;
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: 12,
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#1F6FEB"
          strokeWidth={2}
          dot={false}
          name="Answers"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
