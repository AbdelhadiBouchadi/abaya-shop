import localFont from 'next/font/local';
import { Libre_Baskerville, Open_Sans, Merriweather } from 'next/font/google';

export const LibreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-title',
});

export const OpenSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-subtitle',
});

export const MerriWeather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-text',
});

export const Gotham = localFont({
  src: [
    { path: './Gotham-Thin.woff2', weight: '100', style: 'normal' },
    { path: './Gotham-ThinItalic.woff2', weight: '100', style: 'italic' },
    { path: './Gotham-Book.woff2', weight: '400', style: 'normal' },
    { path: './Gotham-BookItalic.woff2', weight: '300', style: 'italic' },
    { path: './Gotham-Light.woff2', weight: '300', style: 'normal' },
    { path: './Gotham-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: './Gotham-Medium.woff2', weight: '500', style: 'normal' },
    { path: './Gotham-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: './Gotham-Bold.woff2', weight: '700', style: 'normal' },
    { path: './Gotham-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: './Gotham-Black.woff2', weight: '900', style: 'normal' },
    { path: './Gotham-BlackItalic.woff2', weight: '900', style: 'italic' },
    { path: './Gotham-Ultra.woff2', weight: '950', style: 'normal' },
    { path: './Gotham-UltraItalic.woff2', weight: '950', style: 'italic' },
    { path: './Gotham-XLight.woff2', weight: '200', style: 'normal' },
    { path: './Gotham-XLightItalic.woff2', weight: '200', style: 'italic' },
  ],
  variable: '--font-gotham',
  display: 'swap',
});
