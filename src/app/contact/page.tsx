import { getPage } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import { ContactSection } from './ContactSection';

export const metadata = {
  title: 'Contact | Waliliya',
  description: 'Contactez-nous pour toute question sur nos collections.',
};

export default async function ContactPage() {
  const page = await getPage('contact');

  if (!page) return notFound();

  const contactImage = page.portraitImage?.reference?.image;
  const subtitle = page.quote?.value as string;

  return (
    <div className="min-h-screen">
      <ContactSection
        title={page.title}
        subtitle={subtitle}
        body={page.body}
        image={contactImage}
      />
    </div>
  );
}
