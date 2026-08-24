import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  metadataBase: new URL('https://studioyukiarts.com'),
  title: { default: 'Piano Lessons in Troy, MI for Kids 5 to 13 · Studio Yuki', template: '%s · Studio Yuki' },
  description: "Warm, patient piano lessons for kids ages 5 to 13 in Troy, Michigan and online. Taught by Yuki. First lesson is $10. Love it or it's free.",
  authors: [{ name: 'Studio Yuki' }],
  alternates: { canonical: 'https://studioyukiarts.com/' },
  formatDetection: { telephone: false, email: true, address: false },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    siteName: 'Studio Yuki',
    locale: 'en_US',
    url: 'https://studioyukiarts.com/',
    title: 'Studio Yuki · Piano Lessons in Troy, MI',
    description: 'Warm, patient piano lessons for kids ages 5 to 13 in Troy, Michigan and online. First lesson $10. Love it or it’s free.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Studio Yuki · Piano lessons in Troy, MI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Yuki · Piano Lessons in Troy, MI',
    description: 'Warm, patient piano lessons for kids ages 5 to 13. First lesson $10. Love it or it’s free.',
    images: ['/og.jpg'],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%233d1f3d'/%3E%3Cg fill='%23c89849'%3E%3Cpath d='M50 16 Q43 33 50 48 Q57 33 50 16Z'/%3E%3Cpath d='M30 22 Q30 40 47 48 Q44 32 30 22Z'/%3E%3Cpath d='M70 22 Q70 40 53 48 Q56 32 70 22Z'/%3E%3Cpath d='M16 38 Q23 52 43 50 Q30 42 16 38Z'/%3E%3Cpath d='M84 38 Q77 52 57 50 Q70 42 84 38Z'/%3E%3C/g%3E%3Cpath d='M34 52 L40 52 L50 66 L60 52 L66 52 L54 70 L54 86 L46 86 L46 70 Z' fill='%23f5dca0'/%3E%3C/svg%3E",
    apple: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%233d1f3d'/%3E%3Cg fill='%23c89849'%3E%3Cpath d='M50 18 Q44 33 50 46 Q56 33 50 18Z'/%3E%3Cpath d='M32 24 Q32 40 48 48 Q45 33 32 24Z'/%3E%3Cpath d='M68 24 Q68 40 52 48 Q55 33 68 24Z'/%3E%3C/g%3E%3Cpath d='M34 52 L40 52 L50 66 L60 52 L66 52 L54 70 L54 86 L46 86 L46 70 Z' fill='%23f5dca0'/%3E%3C/svg%3E",
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Studio Yuki' },
  other: {
    'geo.region': 'US-MI',
    'geo.placename': 'Troy, Michigan',
    'geo.position': '42.6064;-83.1498',
    'ICBM': '42.6064, -83.1498',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3d1f3d' },
    { media: '(prefers-color-scheme: dark)', color: '#2a142a' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicSchool',
  name: 'Studio Yuki',
  url: 'https://studioyukiarts.com/',
  description: 'Warm, patient piano lessons for kids ages 5 to 13 in Troy, Michigan and online.',
  image: 'https://studioyukiarts.com/og.jpg',
  address: { '@type': 'PostalAddress', addressLocality: 'Troy', addressRegion: 'MI', postalCode: '48084', addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 42.6064, longitude: -83.1498 },
  telephone: '+1-248-990-4210',
  email: 'yukistudiomichigan@gmail.com',
  contactPoint: { '@type': 'ContactPoint', telephone: '+1-248-990-4210', email: 'yukistudiomichigan@gmail.com', contactType: 'customer service' },
  areaServed: [{ '@type': 'City', name: 'Troy' }, { '@type': 'State', name: 'Michigan' }],
  priceRange: '$10-$20',
  sameAs: [
    'https://www.instagram.com/yukistudioartsmi',
    'https://www.tiktok.com/@yukistudioarts',
    'https://www.facebook.com/profile.php?id=61593448844007',
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '10:00', closes: '15:00' },
  ],
  offers: [
    { '@type': 'Offer', name: 'Trial Lesson', price: '10.00', priceCurrency: 'USD', description: '30-minute trial lesson. Free if your child does not love it.' },
    { '@type': 'Offer', name: 'Weekly Lesson', price: '20.00', priceCurrency: 'USD', description: '30-minute weekly in-person piano lesson.' },
    { '@type': 'Offer', name: 'Online Lesson', price: '15.00', priceCurrency: 'USD', description: '30-minute weekly online piano lesson via Zoom.' },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How young is too young to start piano?', acceptedAnswer: { '@type': 'Answer', text: 'Five is a great age to start. Younger kids can do shorter, playful sessions. Message Yuki and she will help find the right fit.' } },
    { '@type': 'Question', name: 'Do we need a piano at home?', acceptedAnswer: { '@type': 'Answer', text: 'A keyboard is fine to start. 61 weighted keys is ideal. After a few months, a digital piano or acoustic is worth considering.' } },
    { '@type': 'Question', name: 'Where are lessons held?', acceptedAnswer: { '@type': 'Answer', text: "In Troy, Michigan from Yuki's home studio, or online over Zoom for families outside the area." } },
    { '@type': 'Question', name: 'What if my child loses interest?', acceptedAnswer: { '@type': 'Answer', text: 'No contracts, no annual commitments. Pay lesson by lesson. Pause anytime. Restart anytime.' } },
    { '@type': 'Question', name: "What does love it or it's free mean?", acceptedAnswer: { '@type': 'Answer', text: 'If your child finishes the first trial and doesn’t want to come back, the $10 is refunded. No questions asked.' } },
  ],
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yuki',
  jobTitle: 'Piano Teacher',
  worksFor: { '@type': 'MusicSchool', name: 'Studio Yuki' },
  knowsLanguage: 'English',
  alumniOf: { '@type': 'EducationalOrganization', name: 'International Academy, Bloomfield Hills' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
