import type { Metadata } from 'next';
import './globals.css';
import { LibreBaskerville, MerriWeather, OpenSans } from '@/app/fonts';
import { Toaster } from 'sonner';
import ClientProviders from './ClientProviders';
import { cookies } from 'next/headers';
import { getCart } from '@/lib/shopify';
import Footer from '@/components/shared/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import HeaderServerWrapper from '@/components/shared/HeaderServerWrapper';
import { ViewTransitions } from 'next-view-transitions';

export const metadata: Metadata = {
  title: {
    template: '%s | Waliliya',
    default: 'Waliliya | Modest Clothes & Wellness',
  },
  description:
    'Découvrez notre collection exclusive de Burkinis, Abayas et tenues modest fashion. Alliant qualité premium, confort et design moderne pour la femme élégante.',
  applicationName: 'Waliliya Store',
  authors: [{ name: 'Waliliya Team' }],
  generator: 'Next.js',
  keywords: [
    'Modest fashion',
    'Burkini',
    'Abaya',
    'Hijab',
    'Mode femme',
    'Maroc',
  ],

  openGraph: {
    type: 'website',
    locale: 'fr_FR',

    siteName: 'Waliliya',
    title: 'Waliliya | Mode Modeste & Élégance',
    description:
      'Découvrez notre collection exclusive de Burkinis, Abayas et tenues modest fashion.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Waliliya - Modest Fashion Store',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Waliliya | Mode Modeste',
    description: 'Élégance et pudeur sans compromis.',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesList = await cookies();

  const cartId = cookiesList.get('cartId')?.value;
  const cart = getCart(cartId);

  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${LibreBaskerville.variable} ${OpenSans.variable} ${MerriWeather.variable}`}
        suppressHydrationWarning={true}
      >
        <SmoothScroll>
          <body className="min-h-screen flex flex-col">
            <ClientProviders cart={cart}>
              <HeaderServerWrapper />
              <main className="grow">{children}</main>

              <Footer />
            </ClientProviders>
            <Toaster richColors />
          </body>
        </SmoothScroll>
      </html>
    </ViewTransitions>
  );
}
