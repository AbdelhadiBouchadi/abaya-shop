import FeaturesProducts from '@/components/shared/FeaturedProducts';
import HeroSection from '@/components/shared/Home/HeroSection';
import LogoTicker from '@/components/shared/LogoTicker';
import { getProducts } from '@/lib/shopify';

export default async function Home() {
  const featuredProducts = await getProducts({ query: 'tag:featured' });

  console.log(featuredProducts.length);

  return (
    <section className="w-full py-10">
      <HeroSection />
      <LogoTicker />
      <FeaturesProducts products={featuredProducts} />
    </section>
  );
}
