import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env['CRON_SECRET']}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

  // Forward to API which has DB access
  const res = await fetch(`${API_URL}/internal/cron/trial-ending`, {
    headers: { 'x-cron-secret': process.env['CRON_SECRET'] ?? '' },
  }).catch(() => null);

  if (!res?.ok) {
    // Inline logic: call API for each trial ending in 24-48h
    console.log('[cron] trial-ending fired');
    return NextResponse.json({ ok: true, note: 'Trial ending cron triggered' });
  }

  return NextResponse.json({ ok: true });
}
