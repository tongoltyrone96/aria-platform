import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env['CRON_SECRET']}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  console.log('[cron] winback fired');
  return NextResponse.json({ ok: true });
}
