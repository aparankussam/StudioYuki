import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await getContent();
  return new NextResponse(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=10, s-maxage=10, stale-while-revalidate=60',
    },
  });
}
