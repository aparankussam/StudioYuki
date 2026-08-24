import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function blobAuth() {
  const opts = {};
  if (process.env.BLOB_STORE_ID) opts.storeId = process.env.BLOB_STORE_ID;
  if (process.env.VERCEL_OIDC_TOKEN) opts.oidcToken = process.env.VERCEL_OIDC_TOKEN;
  if (process.env.BLOB_READ_WRITE_TOKEN) opts.token = process.env.BLOB_READ_WRITE_TOKEN;
  return opts;
}

// 25 MB cap per file (Vercel serverless function body limit is 4.5 MB by default
// for non-streaming; we use the streaming body so this is the practical cap)
const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slot = String(formData.get('slot') || 'misc').replace(/[^a-z0-9-_]/gi, '');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: 'File too large (max 25 MB)' }, { status: 413 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json({ ok: false, error: `Unsupported type: ${file.type}` }, { status: 415 });
    }

    const stamp = Date.now().toString(36);
    const pathname = `media/${slot}-${stamp}${ext}`;

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
      ...blobAuth(),
    });

    return NextResponse.json({ ok: true, url: blob.url, contentType: file.type, slot });
  } catch (err) {
    console.error('upload failed', err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
