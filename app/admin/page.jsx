import { getContent } from '@/lib/content';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: 'Admin · Studio Yuki',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const content = await getContent();
  return <AdminClient initialContent={content} />;
}
