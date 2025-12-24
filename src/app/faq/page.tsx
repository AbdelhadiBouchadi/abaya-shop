import { getFAQ } from '@/lib/shopify';
import { Bounded } from '@/components/shared/Bounded';
import FAQClient from './FAQClient';

export const metadata = {
  title: 'FAQ | Waliliya',
  description:
    'Questions fréquentes sur nos collections, livraisons et retours.',
};

export default async function FAQPage() {
  const faqData = await getFAQ();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Bounded className="px-0">
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-title text-5xl md:text-7xl text-[#3E2723]">
            Questions
          </h1>
          <p className="text-[#5D4037]/70 font-text max-w-xl mx-auto">
            Retrouvez ici toutes les réponses à vos questions concernant nos
            produits, votre commande ou la livraison.
          </p>
        </div>

        {/* Pass data to the client component */}
        <FAQClient data={faqData} />
      </Bounded>
    </div>
  );
}
