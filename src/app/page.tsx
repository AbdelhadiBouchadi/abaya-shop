import AtmosphereSection from '@/components/shared/Home/AtmosphereSection';
import CollectionsProducts from '@/components/shared/Home/CollectionsSection';
import HeroSection from '@/components/shared/Home/HeroSection';
import { getCollections } from '@/lib/shopify';

export default async function Home() {
  const collections = await getCollections();
  const filteredCollections = collections.filter((c) => c.handle !== '');

  return (
    <section className="w-full">
      <HeroSection />
      <CollectionsProducts collections={filteredCollections} />
      <AtmosphereSection />
    </section>
  );
}
