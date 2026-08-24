import { getTermsBody, getTermsStyles } from '@/lib/templates';

export const revalidate = 86400;

export const metadata = {
  title: 'Terms',
  description: 'The simple rules for taking piano lessons at Studio Yuki.',
  alternates: { canonical: 'https://studioyukiarts.com/terms' },
};

export default async function TermsPage() {
  const [body, styles] = await Promise.all([getTermsBody(), getTermsStyles()]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
