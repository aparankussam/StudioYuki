import { list, put } from '@vercel/blob';

const CONTENT_BLOB_KEY = 'content/site.json';

// Newer Vercel Blob stores use OIDC, not a static read-write token.
// We pass storeId + oidcToken explicitly so we work in both modes.
function blobAuth() {
  const opts = {};
  if (process.env.BLOB_STORE_ID) opts.storeId = process.env.BLOB_STORE_ID;
  if (process.env.VERCEL_OIDC_TOKEN) opts.oidcToken = process.env.VERCEL_OIDC_TOKEN;
  if (process.env.BLOB_READ_WRITE_TOKEN) opts.token = process.env.BLOB_READ_WRITE_TOKEN;
  return opts;
}

export const DEFAULT_CONTENT = {
  hero: {
    portraitUrl: null,        // when null, falls back to the SVG art
    videoUrl: null,           // when null, falls back to the SVG art
  },
  meet: {
    photoUrl: null,           // when null, falls back to the crest art
  },
  booking: {
    calUrl: null,             // Cal.com booking URL. When null, form falls back to SMS-to-Yuki.
  },
  testimonials: [
    {
      id: 'placeholder',
      quote: 'Our daughter actually asks when her next lesson is. She used to drag her feet for everything. Whatever Yuki is doing, it’s working.',
      author: 'Coming soon',
      authorNote: 'Your child could be the first review.',
    },
  ],
  availability: {
    label: 'Typical hours, flexible week to week.',
    sub: 'Yuki teaches mostly after school and on weekends. Text her for this week’s open slots.',
    days: [
      { name: 'Mon', period: 'Eve', slots: '4 to 7 PM', open: true },
      { name: 'Tue', period: 'Eve', slots: '4 to 7 PM', open: true },
      { name: 'Wed', period: 'Eve', slots: '4 to 7 PM', open: true },
      { name: 'Thu', period: 'Eve', slots: '4 to 7 PM', open: true },
      { name: 'Fri', period: 'Eve', slots: '4 to 6 PM', open: true },
      { name: 'Sat', period: 'AM',  slots: '10 AM to 1 PM', open: true },
      { name: 'Sun', period: 'PM',  slots: '1 to 4 PM', open: true },
    ],
  },
  updatedAt: null,
};

export async function getContent() {
  try {
    const { blobs } = await list({ prefix: 'content/', ...blobAuth() });
    const entry = blobs.find((b) => b.pathname === CONTENT_BLOB_KEY);
    if (!entry) return DEFAULT_CONTENT;
    const res = await fetch(entry.url, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_CONTENT;
    const data = await res.json();
    return mergeWithDefaults(data);
  } catch (err) {
    console.error('getContent error', err);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(next) {
  const merged = mergeWithDefaults(next);
  merged.updatedAt = new Date().toISOString();
  await put(CONTENT_BLOB_KEY, JSON.stringify(merged, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    ...blobAuth(),
  });
  return merged;
}

function mergeWithDefaults(data) {
  return {
    hero: {
      portraitUrl: data?.hero?.portraitUrl ?? null,
      videoUrl: data?.hero?.videoUrl ?? null,
    },
    meet: {
      photoUrl: data?.meet?.photoUrl ?? null,
    },
    booking: {
      calUrl: typeof data?.booking?.calUrl === 'string' && data.booking.calUrl.trim() ? data.booking.calUrl.trim() : null,
    },
    testimonials: Array.isArray(data?.testimonials) && data.testimonials.length
      ? data.testimonials.map((t, i) => ({
          id: t.id || `t_${i}_${Date.now()}`,
          quote: String(t.quote || '').slice(0, 1000),
          author: String(t.author || '').slice(0, 120),
          authorNote: String(t.authorNote || '').slice(0, 200),
        }))
      : DEFAULT_CONTENT.testimonials,
    availability: {
      label: data?.availability?.label || DEFAULT_CONTENT.availability.label,
      sub: data?.availability?.sub || DEFAULT_CONTENT.availability.sub,
      days: Array.isArray(data?.availability?.days) && data.availability.days.length === 7
        ? data.availability.days.map((d, i) => ({
            name: d.name || DEFAULT_CONTENT.availability.days[i].name,
            period: d.period || DEFAULT_CONTENT.availability.days[i].period,
            slots: d.slots || DEFAULT_CONTENT.availability.days[i].slots,
            open: typeof d.open === 'boolean' ? d.open : true,
          }))
        : DEFAULT_CONTENT.availability.days,
    },
    updatedAt: data?.updatedAt || null,
  };
}
