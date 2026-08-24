import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const saved = await saveContent(body);
    revalidatePath('/');
    return NextResponse.json({ ok: true, content: saved });
  } catch (err) {
    console.error('save content failed', err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
