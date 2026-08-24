import { getPrivacyBody, getPrivacyStyles } from '@/lib/templates';

export const revalidate = 86400;

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Studio Yuki handles your information. Plain language, no surprises.',
  alternates: { canonical: 'https://studioyukiarts.com/privacy' },
};

export default async function PrivacyPage() {
  const [body, styles] = await Promise.all([getPrivacyBody(), getPrivacyStyles()]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
