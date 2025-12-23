import { getPage } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import { SectionOne } from './SectionOne';
import { SectionTwo } from './SectionTwo';
import { BottomQuote } from './BottomQuote';

export const metadata = {
  title: 'La Créatrice | Waliliya',
  description: "L'histoire derrière la marque Waliliya.",
};

export default async function CreatorPage() {
  const page = await getPage('la-creatrice');

  if (!page) return notFound();

  // Extract Data
  const section1Image = page.heroImage?.reference?.image;
  const section1Body = page.body;

  const section2Text = page.secondDescription?.value as string;
  const section2Image = page.portraitImage?.reference?.image;

  const quote = page.quote?.value as string;

  return (
    <div className="min-h-screen pt-32">
      {/* 1. SECTION ONE: Image Left / Text Right */}
      <SectionOne image={section1Image} htmlBody={section1Body} />

      {/* 2. SECTION TWO: Text Left / Image Right */}
      {section2Text && (
        <SectionTwo richTextJson={section2Text} image={section2Image} />
      )}

      {/* 3. BOTTOM DARK SECTION */}
      <BottomQuote richText={quote} />
    </div>
  );
}
